import type {
  MCPTool,
  ToolExecutionRequest,
  ToolExecutionResult,
  ExecutionError,
  ExecutionErrorCode,
  RetryPolicy,
  IdempotencyPolicy,
  ToolParameter,
  SiteId,
  ToolId,
  Json,
} from '@bharatmcp/types';

import { ToolRegistry } from './registry';
import { ParameterValidator } from './validator';

const DEFAULT_TIMEOUT_MS = 30_000;

const DEFAULT_RETRY: RetryPolicy = {
  maxAttempts: 1,
  baseDelayMs: 300,
  maxDelayMs: 3_000,
  strategy: 'exponential',
  jitter: 'full',
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function computeDelayMs(policy: RetryPolicy, attemptIndex: number): number {
  // attemptIndex: 1 for first retry, 2 for second retry, ...
  const base = policy.baseDelayMs;
  const max = policy.maxDelayMs ?? base;

  let delay =
    policy.strategy === 'fixed'
      ? base
      : Math.min(max, base * Math.pow(2, attemptIndex - 1));

  if (policy.jitter === 'full') {
    delay = Math.floor(Math.random() * delay);
  }

  return Math.max(0, delay);
}

function toExecutionError(
  code: ExecutionErrorCode,
  message: string,
  retryable: boolean,
  details?: Json
): ExecutionError {
  return { code, message, retryable, details };
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function safeJson(value: unknown): Json {
  // Best effort to keep values JSON-safe
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) return value;
  if (Array.isArray(value)) return value.map(safeJson);
  if (isObject(value)) {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(value)) out[k] = safeJson(v);
    return out;
  }
  return String(value);
}

/**
 * Enterprise idempotency key generator.
 * - If platform provides request.context.idempotencyKey, use it.
 * - Else generate deterministic-ish key per (sessionId + toolId + payload hash) if desired.
 * Here we use a simple random key; in production, use crypto.randomUUID().
 */
function generateIdempotencyKey(): string {
  // Node 18+ has crypto.randomUUID; fallback:
  const rand = Math.random().toString(16).slice(2);
  return `bm_idem_${Date.now()}_${rand}`;
}

/**
 * Flattens ToolParameter definitions so we can iterate over ALL params including nested ones,
 * but for request building we only need top-level fields because nested objects live inside the body object.
 * For path/query/header we need only those params explicitly marked with in='path'|'query'|'header'
 * (usually top-level).
 */
function flattenParams(params: ToolParameter[]): ToolParameter[] {
  const out: ToolParameter[] = [];

  const walk = (p: ToolParameter) => {
    out.push(p);
    if (p.type === 'object' && p.properties) {
      for (const child of p.properties) walk(child);
    }
    if (p.type === 'array' && p.items) walk(p.items);
  };

  for (const p of params) walk(p);
  return out;
}

export class ToolExecutor {
  private registry: ToolRegistry;
  private validator: ParameterValidator;

  constructor(registry: ToolRegistry) {
    this.registry = registry;
    this.validator = new ParameterValidator();
  }

  async execute(siteId: SiteId, request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    const start = Date.now();

    // ---- Step 1: tool lookup (do NOT hide disabled here; registry should return raw if you want) ----
    const tool = this.registry.getTool(siteId, request.toolId as ToolId);
    if (!tool) {
      return this.fail(start, request, toExecutionError('NOT_FOUND', `Tool not found`, false, {
        toolId: safeJson(request.toolId),
      }));
    }

    // ---- Step 2: apply defaults + validate ----
    const params = this.validator.applyDefaults(
      tool.parameters,
      request.parameters as Record<string, Json>
    );

    const validation = this.validator.validate(tool.parameters, params);
    if (!validation.valid) {
      return this.fail(start, request, toExecutionError(
        'VALIDATION_FAILED',
        'Invalid parameters',
        false,
        safeJson({ errors: validation.errors })
      ), {
        userMessage: 'Some required information is missing or invalid.',
        suggestedAction: 'Please provide the missing fields and try again.',
      });
    }

    // ---- Step 3: resolve retry + idempotency + timeout ----
    const retryPolicy: RetryPolicy = tool.retry ?? DEFAULT_RETRY;
    const idempotencyPolicy: IdempotencyPolicy | undefined = tool.idempotency;

    const timeoutMs = tool.endpoint.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    // If idempotency is enabled, choose a key ONCE and reuse for all retries.
    const idemKey =
      idempotencyPolicy?.enabled
        ? (request.context?.idempotencyKey ?? generateIdempotencyKey())
        : undefined;

    // ---- Step 4: attempt loop (retry + backoff + jitter) ----
    const maxAttempts = Math.max(1, retryPolicy.maxAttempts);

    let lastError: ExecutionError | undefined;
    let lastStatus: number | undefined;
    let lastData: Json | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const attemptStart = Date.now();

      try {
        const { url, fetchOptions } = this.buildRequest(tool, params, idemKey, idempotencyPolicy);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        let response: Response;
        try {
          response = await fetch(url, { ...fetchOptions, signal: controller.signal });
        } finally {
          clearTimeout(timer);
        }

        lastStatus = response.status;
        const parsed = await this.parseResponse(response);
        lastData = parsed;

        if (!response.ok) {
          // Map common statuses to enterprise codes
          const code: ExecutionErrorCode =
            response.status === 401 ? 'AUTH_FAILED' :
            response.status === 403 ? 'FORBIDDEN' :
            response.status === 404 ? 'NOT_FOUND' :
            response.status === 429 ? 'RATE_LIMITED' :
            response.status >= 500 ? 'API_ERROR' :
            'API_ERROR';

          const retryable =
            response.status === 429 || response.status >= 500;

          lastError = toExecutionError(
            code,
            `API returned ${response.status}: ${response.statusText}`,
            retryable,
            safeJson(parsed)
          );

          // stop if not retryable
          if (!retryable || attempt === maxAttempts) break;

          // wait then retry
          const delay = computeDelayMs(retryPolicy, attempt);
          await sleep(delay);
          continue;
        }

        // Success
        return {
          success: true,
          data: parsed,
          statusCode: response.status,
          durationMs: Date.now() - start,
          executedAt: Date.now(),
          traceId: request.context?.traceId,
          attempts: attempt,
        };

      } catch (err: unknown) {
        // timeout
        if (err instanceof DOMException && err.name === 'AbortError') {
          lastError = toExecutionError('TIMEOUT', 'API call timed out', true);
        } else if (err instanceof TypeError) {
          // fetch network error in Node typically throws TypeError
          lastError = toExecutionError('NETWORK_ERROR', 'Network error while calling API', true);
        } else {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          lastError = toExecutionError('UNKNOWN', msg, false);
        }

        // stop if not retryable
        if (!lastError.retryable || attempt === maxAttempts) break;

        const delay = computeDelayMs(retryPolicy, attempt);
        await sleep(delay);
        continue;
      } finally {
        void attemptStart;
      }
    }

    // Failed after attempts
    return this.fail(start, request, lastError ?? toExecutionError('UNKNOWN', 'Unknown failure', false), {
      statusCode: lastStatus,
      data: lastData,
      attempts: retryPolicy.maxAttempts,
      userMessage: this.userMessageForError(lastError),
      suggestedAction: this.suggestedActionForError(lastError),
    });
  }

  // =========================
  // Request building
  // =========================

  private buildRequest(
    tool: MCPTool,
    params: Record<string, Json>,
    idempotencyKey?: string,
    idempotencyPolicy?: IdempotencyPolicy
  ): { url: string; fetchOptions: RequestInit } {
    let url = tool.endpoint.url;

    const queryParts: string[] = [];
    const bodyParams: Record<string, Json> = {};
    const headerParams: Record<string, string> = {};

    // Base headers from tool endpoint
    const headers: Record<string, string> = {
      ...(tool.endpoint.headers ?? {}),
    };

    // Collect params by location using the tool's top-level schema
    // (Nested fields are expected to be inside body objects.)
    for (const paramDef of tool.parameters) {
      const value = params[paramDef.name];
      if (value === undefined) continue;

      switch (paramDef.in) {
        case 'path':
          url = url.replaceAll(`:${paramDef.name}`, encodeURIComponent(String(value)));
          break;

        case 'query':
          queryParts.push(`${encodeURIComponent(paramDef.name)}=${encodeURIComponent(String(value))}`);
          break;

        case 'header':
          headerParams[paramDef.name] = String(value);
          break;

        case 'body':
        default:
          bodyParams[paramDef.name] = value;
          break;
      }
    }

    // Apply idempotency key if enabled
    if (idempotencyPolicy?.enabled && idempotencyKey) {
      if (idempotencyPolicy.in === 'body') {
        const field = idempotencyPolicy.bodyFieldName ?? 'idempotencyKey';
        bodyParams[field] = idempotencyKey;
      } else {
        const headerName = idempotencyPolicy.headerName ?? 'Idempotency-Key';
        headers[headerName] = idempotencyKey;
      }
    }

    // Merge headers (param headers override base headers)
    Object.assign(headers, headerParams);

    // Content-Type only if body exists or method implies JSON body
    const method = tool.endpoint.method;
    const hasBody = method !== 'GET' && Object.keys(bodyParams).length > 0;

    if (hasBody && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Append query
    if (queryParts.length > 0) {
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}${queryParts.join('&')}`;
    }

    const fetchOptions: RequestInit = { method, headers };

    if (hasBody) {
      fetchOptions.body = JSON.stringify(bodyParams);
    }

    return { url, fetchOptions };
  }

  private async parseResponse(response: Response): Promise<Json> {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      try {
        const data = await response.json();
        return safeJson(data);
      } catch {
        const text = await response.text();
        return safeJson(text);
      }
    }

    const text = await response.text();
    return safeJson(text);
  }

  // =========================
  // Error / Result helpers
  // =========================

  private fail(
    startTime: number,
    request: ToolExecutionRequest,
    error: ExecutionError,
    extra?: Partial<ToolExecutionResult>
  ): ToolExecutionResult {
    return {
      success: false,
      error,
      durationMs: Date.now() - startTime,
      executedAt: Date.now(),
      traceId: request.context?.traceId,
      ...extra,
    };
  }

  private userMessageForError(err?: ExecutionError): string | undefined {
    if (!err) return undefined;
    switch (err.code) {
      case 'TIMEOUT':
        return 'The request took too long. Please try again.';
      case 'NETWORK_ERROR':
        return 'Unable to reach the service. Please check connectivity and try again.';
      case 'AUTH_FAILED':
        return 'Authentication failed while calling the API.';
      case 'FORBIDDEN':
        return 'You are not allowed to perform this action.';
      case 'RATE_LIMITED':
        return 'Too many requests. Please try again shortly.';
      case 'VALIDATION_FAILED':
        return 'Some required information is missing or invalid.';
      default:
        return 'Something went wrong while processing your request.';
    }
  }

  private suggestedActionForError(err?: ExecutionError): string | undefined {
    if (!err) return undefined;
    switch (err.code) {
      case 'AUTH_FAILED':
        return 'Verify the API key or authentication headers configured for this tool.';
      case 'RATE_LIMITED':
        return 'Wait a few seconds and try again.';
      case 'TIMEOUT':
        return 'Try again, or increase the tool timeout if the endpoint is slow.';
      case 'NETWORK_ERROR':
        return 'Check the endpoint URL and network access from the server.';
      default:
        return 'Try again later or review tool configuration.';
    }
  }
}
