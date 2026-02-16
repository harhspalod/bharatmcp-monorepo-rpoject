// ============================================================================
//  @bharatmcp/types (Enterprise Grade)
//  Strong typing + Retry + Permission model + Safer IDs + Better extensibility
// ============================================================================

/**
 * Branded types prevent accidentally mixing IDs.
 * (Compile-time safety only; runtime remains string.)
 */
export type Brand<K, T extends string> = K & { readonly __brand: T };

export type SiteId = Brand<string, 'SiteId'>;
export type UserId = Brand<string, 'UserId'>;
export type SessionId = Brand<string, 'SessionId'>;
export type ToolId = Brand<string, 'ToolId'>;
export type TaskPlanId = Brand<string, 'TaskPlanId'>;
export type APIKeyId = Brand<string, 'APIKeyId'>;

export type ISODateString = string;
export type UnixMs = number;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Permission model (tool-level + api-key-level) */
export type Permission = 'read' | 'write' | 'admin';

/** When tool calls should be confirmed */
export type ConfirmationMode = 'never' | 'always' | 'high_risk';

/** General purpose JSON type */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

/** Stronger operator typing */
export type StepOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'exists';

export type ParamType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'enum'
  | 'date'
  | 'file';

/** Retry strategy */
export interface RetryPolicy {
  /** Total attempts including the first try (e.g., 3 = try + 2 retries) */
  maxAttempts: number;
  /** Base delay before retry, in ms */
  baseDelayMs: number;
  /** Max delay cap, in ms */
  maxDelayMs?: number;
  /** Backoff strategy */
  strategy: 'fixed' | 'exponential';
  /** Jitter to avoid thundering herd */
  jitter?: 'none' | 'full';
  /** Retry only for these error codes (if set). If omitted, use error.retryable. */
  retryOnCodes?: ExecutionErrorCode[];
}

/** Idempotency strategy for safe retries */
export interface IdempotencyPolicy {
  /** If true, caller should send an idempotency key (recommended for POST/charge) */
  enabled: boolean;
  /** Where to send the idempotency key */
  in?: 'header' | 'body';
  /** Header name (if in=header) */
  headerName?: string; // e.g., "Idempotency-Key"
  /** Body field name (if in=body) */
  bodyFieldName?: string;
}

/** Rate limit config */
export interface RateLimitPolicy {
  maxCalls: number;
  windowSeconds: number;
}

/** Webhook config for async tools */
export interface ToolWebhook {
  url: string;
  events: string[];
  secret?: string;
}

/** Endpoint definition */
export interface ToolEndpoint {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  timeoutMs?: number; // renamed for clarity
  webhook?: ToolWebhook;
}

/** Validation rules */
export interface ParamValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;

  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  requiredIf?: { field: string; value: Json }[];
  forbiddenIf?: { field: string; value: Json }[];
}

export interface EnumValue {
  value: string;
  label: string;
}

export interface PaginationHint {
  pageParam: string;
  limitParam: string;
  totalField?: string;
}

/** Parameter schema (recursive) */
export interface ToolParameter {
  name: string;
  label: string;
  description: string;
  type: ParamType;
  required: boolean;

  defaultValue?: Json;

  in: 'body' | 'query' | 'path' | 'header';

  validation?: ParamValidation;

  properties?: ToolParameter[]; // object fields
  items?: ToolParameter; // array item schema
  enumValues?: EnumValue[]; // for enum
  pagination?: PaginationHint;
}

/** Tool response schema */
export interface ToolResponseSchemaField {
  name: string;
  description: string;
  type: ParamType;
}

export interface ToolResponse {
  description: string;
  fields?: ToolResponseSchemaField[];
  example?: Json;
}

/** Tool lifecycle */
export interface ToolLifecycle {
  version?: string;
  deprecated?: boolean;
  sunsetDate?: UnixMs;
  migrationHint?: string;
}

/** Tool security model */
export interface ToolSecurity {
  /** Required permission to execute this tool */
  requiredPermission: Permission;

  /**
   * Confirmation mode.
   * - never: never ask
   * - always: always ask
   * - high_risk: ask when tool is marked "high risk" or has side effects
   */
  confirmation: ConfirmationMode;

  /** Whether this tool has side-effects (write operations, payments, deletions) */
  sideEffect: boolean;

  /** Optional: mark payment/deletion/high sensitivity */
  riskLevel?: 'low' | 'medium' | 'high';
}

/** Enterprise MCP Tool with generic typing for input/output */
export interface MCPTool<TInput extends Json = Json, TOutput extends Json = Json> {
  id: ToolId;
  name: string;
  description: string;

  endpoint: ToolEndpoint;

  /** Strong schema for AI + UI + validation */
  parameters: ToolParameter[];

  response?: ToolResponse;

  category?: string;
  active: boolean;

  /** Dependencies (must execute before this tool) */
  dependsOn?: ToolId[];

  /** Security / permissions / confirmation */
  security: ToolSecurity;

  /** Retry policy (tool-level default) */
  retry?: RetryPolicy;

  /** Idempotency for safe retries */
  idempotency?: IdempotencyPolicy;

  /** Rate limiting */
  rateLimit?: RateLimitPolicy;

  /** Lifecycle / versioning */
  lifecycle?: ToolLifecycle;

  /**
   * Typed hints (optional): used by SDK / internal compile-time checks.
   * Runtime still uses schema/JSON.
   */
  typed?: {
    inputExample?: TInput;
    outputExample?: TOutput;
  };
}

// ============================================================================
// SECTION 2: TASK & WORKFLOW (Enterprise)
// ============================================================================

export type TaskStatus =
  | 'planning'
  | 'confirming'
  | 'executing'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface StepCondition {
  stepOrder: number;
  field: string;
  operator: StepOperator;
  value: Json;
}

/** Execution status for a step */
export type StepStatus = 'pending' | 'skipped' | 'running' | 'succeeded' | 'failed';

export interface StepResult<TData extends Json = Json> {
  success: boolean;
  status: StepStatus;

  data?: TData;
  error?: string;

  executedAt: UnixMs;
  durationMs: number;

  /** attempt number used (1..maxAttempts) */
  attempts?: number;

  /** Trace ID for enterprise observability */
  traceId?: string;
}

export interface StepRetryOverride {
  retry?: RetryPolicy;
  idempotency?: IdempotencyPolicy;
}

/**
 * Parameter mapping using $stepN... syntax.
 * Enterprise addition: allow explicit JSONPath-like syntax hint.
 */
export type StepOutputRef = string; // e.g. "$step1.data[0].id"

/** A single step in a plan */
export interface TaskStep {
  order: number;
  toolId: ToolId;

  /** Parameters (raw); usually JSON */
  parameters: Record<string, Json>;

  /** Mapping from param -> previous step output reference */
  parameterMapping?: Record<string, StepOutputRef>;

  description: string;

  /**
   * Requires confirmation for this step (overrides tool default).
   * Use when the step is risky even if the tool isn't.
   */
  requiresConfirmation?: boolean;

  condition?: StepCondition;

  /** Override retry/idempotency for this specific step */
  execution?: StepRetryOverride;

  result?: StepResult;
}

export interface TaskPlan {
  id: TaskPlanId;
  userIntent: string;
  steps: TaskStep[];
  status: TaskStatus;
  createdAt: UnixMs;
  completedAt?: UnixMs;

  /** Plan-level defaults (used if step/tool missing settings) */
  defaults?: {
    retry?: RetryPolicy;
    permission?: Permission; // minimal permission needed for entire plan
  };
}

// ============================================================================
// SECTION 3: EXECUTION (Enterprise)
// ============================================================================

export type ExecutionErrorCode =
  | 'TIMEOUT'
  | 'AUTH_FAILED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'VALIDATION_FAILED'
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'IDEMPOTENCY_CONFLICT'
  | 'UNKNOWN';

export interface ExecutionError {
  code: ExecutionErrorCode;
  message: string;
  details?: Json;
  retryable: boolean;
}

export interface ToolExecutionContext {
  sessionId: SessionId;
  siteId: SiteId;
  userId?: UserId;

  taskPlanId?: TaskPlanId;
  stepOrder?: number;

  /** Permission granted by API key + session */
  grantedPermissions: Permission[];

  /** Idempotency key for this call (if enabled) */
  idempotencyKey?: string;

  /** Correlation ID for tracing across services */
  traceId?: string;
}

export interface ToolExecutionRequest<TParams extends Json = Json> {
  toolId: ToolId;
  parameters: Record<string, TParams>;
  context: ToolExecutionContext;
}

export interface ToolExecutionResult<TData extends Json = Json> {
  success: boolean;
  data?: TData;
  statusCode?: number;
  error?: ExecutionError;

  durationMs: number;
  executedAt: UnixMs;

  userMessage?: string;
  suggestedAction?: string;
  helpLink?: string;

  traceId?: string;
  attempts?: number;
}

// ============================================================================
// SECTION 4: MESSAGES & CHAT (Enterprise)
// ============================================================================

export type MessageRole = 'user' | 'agent' | 'system';

export type MessageType =
  | 'text'
  | 'task_plan'
  | 'task_progress'
  | 'task_result'
  | 'confirmation'
  | 'error'
  | 'input_request';

export interface ConfirmationOption {
  text: string;
  value: string;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface InputFieldOption {
  value: string;
  label: string;
}

export interface InputField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  required: boolean;
  options?: InputFieldOption[];
}

export interface Message {
  id: Brand<string, 'MessageId'>;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: UnixMs;

  taskPlanId?: TaskPlanId;

  confirmationOptions?: ConfirmationOption[];
  inputFields?: InputField[];

  metadata?: Record<string, Json>;
}

export interface PageContext {
  url: string;
  title: string;
  description: string;
  textSummary: string;
  pageType?:
    | 'home'
    | 'product'
    | 'cart'
    | 'checkout'
    | 'dashboard'
    | 'form'
    | 'listing'
    | 'other';

  /** Enterprise additions */
  schemaType?: string; // e.g., "product", "order", "user"
  entityId?: string; // e.g., "prod_123"

  visibleData?: Record<string, Json>;
  capturedAt: UnixMs;
}

export interface ChatSession {
  id: SessionId;
  siteId: SiteId;

  /** For large sessions, paginate at storage level; type stays as array for SDK usage */
  messages: Message[];

  activeTasks: TaskPlan[];

  startedAt: UnixMs;
  lastActiveAt: UnixMs;

  context?: PageContext;
}

// ============================================================================
// SECTION 6: SDK CONFIGURATION (Enterprise)
// ============================================================================

export interface WidgetConfig {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  offsetX?: number;
  offsetY?: number;
  defaultOpen?: boolean;
  placeholder?: string;
  welcomeMessage?: string;
  avatarUrl?: string;
  title?: string;
  subtitle?: string;
  zIndex?: number;
}

export interface ThemeConfig {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  borderRadius?: number;
  mode?: 'light' | 'dark' | 'auto';
}

export interface SDKConfig {
  apiKey: string;
  siteId: string;
  platformUrl?: string;
  widget?: WidgetConfig;
  theme?: ThemeConfig;
  locale?: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent';

  /** Enterprise: strict mode blocks tool calls when permissions insufficient */
  strictPermissions?: boolean;
}

// ============================================================================
// SECTION 7: PLATFORM & AUTH (Enterprise)
// ============================================================================

export interface Site {
  id: SiteId;
  name: string;
  domain: string;
  ownerId: UserId;

  tools: MCPTool[];
  sdkConfig: Partial<SDKConfig>;

  active: boolean;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';

  createdAt: UnixMs;
  updatedAt: UnixMs;
}

export interface APIKey {
  id: APIKeyId;
  siteId: SiteId;
  key: string;
  label: string;

  /** Key-level permissions */
  permissions: Permission[];

  active: boolean;
  createdAt: UnixMs;
  lastUsedAt?: UnixMs;
}

export interface AuthResponse {
  valid: boolean;
  site?: {
    id: SiteId;
    name: string;
    domain: string;
    plan: string;
  };
  permissions?: Permission[];
  error?: string;
}

// ============================================================================
// SECTION 8: PLUGINS (Enterprise)
// ============================================================================

export interface BharatMCPPlugin {
  name: string;
  version: string;

  onInit?(context: PluginContext): void;

  /** Return false to block the tool execution */
  onBeforeToolExecution?(
    request: ToolExecutionRequest
  ): boolean | Promise<boolean>;

  onAfterToolExecution?(result: ToolExecutionResult): void;

  onMessage?(message: Message): void;

  onWidgetToggle?(isOpen: boolean): void;

  onDestroy?(): void;
}

export interface PluginContext {
  config: SDKConfig;

  sendMessage(text: string): Promise<Message>;
  getPageContext(): PageContext;

  on(event: string, callback: (...args: unknown[]) => void): void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const BHARATMCP_VERSION = '0.2.0';

export const DEFAULT_WIDGET_CONFIG: Required<WidgetConfig> = {
  position: 'bottom-right',
  offsetX: 20,
  offsetY: 20,
  defaultOpen: false,
  placeholder: 'Tell me what you need...',
  welcomeMessage: 'Hi! I can help you get things done here. What would you like to do?',
  avatarUrl: '',
  title: 'BharatMCP',
  subtitle: 'AI Assistant',
  zIndex: 999999,
};

export const DEFAULT_THEME: Required<ThemeConfig> = {
  primaryColor: '#FF6B35',
  backgroundColor: '#FFFFFF',
  textColor: '#1A1A1A',
  fontFamily: 'inherit',
  borderRadius: 16,
  mode: 'light',
};
