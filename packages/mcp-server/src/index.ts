// ================================================================
//  @bharatmcp/mcp-server — Public API
//
//  Everything exported here is available to other packages:
//
//    import { MCPServer } from '@bharatmcp/mcp-server';
//    import { ToolRegistry } from '@bharatmcp/mcp-server';
//    import { ToolExecutor } from '@bharatmcp/mcp-server';
//    import { ParameterValidator } from '@bharatmcp/mcp-server';
// ================================================================

// Main entry point — most users just need this
export { MCPServer } from './server';

// Individual components (for advanced usage)
export { ToolRegistry, RegistryError } from './registry';
export type { AIToolDefinition, AIParameter } from './registry';

export { ParameterValidator } from './validator';
export type { ValidationResult, ValidationError, ValidationErrorCode } from './validator';

export { ToolExecutor } from './executor';