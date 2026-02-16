import type {
  MCPTool,
  ToolExecutionRequest,
  ToolExecutionResult,
  ToolParameter,
  SiteId,
  ToolId,
  Json,
  ExecutionErrorCode,
  Permission,
} from '@bharatmcp/types';

import { ToolRegistry, type AIToolDefinition } from './registry';
import { ParameterValidator, type ValidationResult } from './validator';
import { ToolExecutor } from './executor';

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function hasPermission(granted: Permission[], required: Permission): boolean {
  if (granted.includes('admin')) return true;
  if (required === 'read') return granted.includes('read') || granted.includes('write');
  if (required === 'write') return granted.includes('write');
  return false;
}

export class MCPServer {
  private registry: ToolRegistry;
  private validator: ParameterValidator;
  private executor: ToolExecutor;

  constructor() {
    this.registry = new ToolRegistry();
    this.validator = new ParameterValidator();
    this.executor = new ToolExecutor(this.registry);
  }

  // =======================
  // Tool registration
  // =======================

  registerTool(siteId: SiteId, tool: MCPTool): void {
    this.registry.register(siteId, tool);
  }

  registerTools(siteId: SiteId, tools: MCPTool[]): void {
    this.registry.registerBulk(siteId, tools);
  }

  updateTool(siteId: SiteId, toolId: ToolId, updates: DeepPartial<MCPTool>): boolean {
    return this.registry.updateTool(siteId, toolId, updates);
  }

  setToolActive(siteId: SiteId, toolId: ToolId, active: boolean): boolean {
    return this.registry.setActive(siteId, toolId, active);
  }

  removeTool(siteId: SiteId, toolId: ToolId): boolean {
    return this.registry.removeTool(siteId, toolId);
  }

  clearSiteTools(siteId: SiteId): void {
    this.registry.clearSite(siteId);
  }

  // =======================
  // Tool retrieval
  // =======================

  getTool(siteId: SiteId, toolId: ToolId): MCPTool | undefined {
    return this.registry.getTool(siteId, toolId);
  }

  getTools(siteId: SiteId): MCPTool[] {
    return this.registry.getTools(siteId);
  }

  searchTools(siteId: SiteId, query: string): MCPTool[] {
    return this.registry.searchTools(siteId, query);
  }

  getToolCount(siteId: SiteId): number {
    return this.registry.getToolCount(siteId);
  }

  getCategories(siteId: SiteId): string[] {
    return this.registry.getCategories(siteId);
  }

  getToolsForAI(siteId: SiteId): AIToolDefinition[] {
    return this.registry.toAIToolList(siteId);
  }

  // =======================
  // Validation
  // =======================

  validateParams(siteId: SiteId, toolId: ToolId, params: Record<string, Json>): ValidationResult {
    const tool = this.registry.getTool(siteId, toolId);
    if (!tool) {
      return {
        valid: false,
        errors: [{ parameter: 'toolId', message: `Tool "${toolId}" not found`, code: 'REQUIRED' }],
      };
    }
    return this.validator.validate(tool.parameters, params);
  }

  getMissingParams(siteId: SiteId, toolId: ToolId, params: Record<string, Json>): ToolParameter[] {
    const tool = this.registry.getTool(siteId, toolId);
    if (!tool) return [];
    return this.validator.getMissingRequired(tool.parameters, params);
  }

  // =======================
  // Execution (enterprise)
  // =======================

  async executeTool(siteId: SiteId, request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    const tool = this.registry.getTool(siteId, request.toolId as ToolId);

    // Tool exists?
    if (!tool) {
      return this.fail('NOT_FOUND', `Tool "${request.toolId}" not found`, request);
    }

    // Active?
    if (!tool.active) {
      return this.fail('FORBIDDEN', `Tool "${tool.name}" is disabled`, request, {
        userMessage: 'This action is currently disabled by the site owner.',
      });
    }

    // Lifecycle: sunset
    const sunset = tool.lifecycle?.sunsetDate;
    if (typeof sunset === 'number' && sunset <= Date.now()) {
      return this.fail(
        'FORBIDDEN',
        `Tool "${tool.name}" has been sunset`,
        request,
        { userMessage: 'This tool is no longer available.' }
      );
    }

    // Permission check
    const required = tool.security?.requiredPermission ?? 'read';
    const granted = request.context?.grantedPermissions ?? [];

    if (!hasPermission(granted, required)) {
      return this.fail(
        'FORBIDDEN',
        `Missing permission "${required}" for tool "${tool.name}"`,
        request,
        {
          userMessage: 'You do not have permission to perform this action.',
          suggestedAction: 'Ask the site owner to grant the required permission.',
        }
      );
    }

    // Validate params before executing
    const validation = this.validator.validate(tool.parameters, request.parameters as Record<string, Json>);
    if (!validation.valid) {
      return {
        success: false,
        executedAt: Date.now(),
        durationMs: 0,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Validation failed',
          details: validation.errors as unknown as Json,
          retryable: false,
        },
        userMessage: 'Some required information is missing or invalid.',
        suggestedAction: 'Please provide the missing fields and try again.',
        traceId: request.context?.traceId,
      };
    }

    // Delegate to executor (which should implement retry + idempotency)
    return this.executor.execute(siteId, request);
  }

  private fail(
    code: ExecutionErrorCode,
    message: string,
    request: ToolExecutionRequest,
    extra?: Partial<ToolExecutionResult>
  ): ToolExecutionResult {
    return {
      success: false,
      executedAt: Date.now(),
      durationMs: 0,
      error: {
        code,
        message,
        retryable: code === 'TIMEOUT' || code === 'NETWORK_ERROR' || code === 'RATE_LIMITED',
      },
      traceId: request.context?.traceId,
      ...extra,
    };
  }
}
