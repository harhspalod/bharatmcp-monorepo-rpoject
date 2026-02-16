import type {
  MCPTool,
  ToolParameter,
  SiteId,
  ToolId,
} from '@bharatmcp/types';

export interface AIToolDefinition {
  id: ToolId;
  name: string;
  description: string;
  category?: string;
  parameters: AIParameter[];
  confirmationMode: 'never' | 'always' | 'high_risk';
  requiredPermission: string;
  dependsOn: ToolId[];
  deprecated?: boolean;
}

export interface AIParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  enumValues?: string[];
}

export class ToolRegistry {

  private stores: Map<SiteId, Map<ToolId, MCPTool>> = new Map();

  // =========================
  // REGISTER
  // =========================

  register(siteId: SiteId, tool: MCPTool): void {
    this.validateTool(tool);

    if (!this.stores.has(siteId)) {
      this.stores.set(siteId, new Map());
    }

    // Deep clone to prevent mutation
    const cloned: MCPTool = structuredClone(tool);
    this.stores.get(siteId)!.set(tool.id, cloned);
  }

  registerBulk(siteId: SiteId, tools: MCPTool[]): void {
    for (const tool of tools) {
      this.register(siteId, tool);
    }
  }

  // =========================
  // RETRIEVE
  // =========================

  getTool(siteId: SiteId, toolId: ToolId): MCPTool | undefined {
    return this.stores.get(siteId)?.get(toolId);
  }

  getActiveTools(siteId: SiteId): MCPTool[] {
    const siteTools = this.stores.get(siteId);
    if (!siteTools) return [];

    return Array.from(siteTools.values()).filter((tool) => {
      if (!tool.active) return false;

      const sunset = tool.lifecycle?.sunsetDate;
      if (typeof sunset === 'number' && sunset <= Date.now()) {
        return false;
      }

      return true;
    });
  }

  searchTools(siteId: SiteId, query: string): MCPTool[] {
    const lower = query.toLowerCase();
    return this.getActiveTools(siteId).filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower)
    );
  }

  getCategories(siteId: SiteId): string[] {
    const categories = new Set<string>();
    for (const tool of this.getActiveTools(siteId)) {
      if (tool.category) categories.add(tool.category);
    }
    return Array.from(categories);
  }

  getToolCount(siteId: SiteId): number {
    return this.getActiveTools(siteId).length;
  }

  // =========================
  // UPDATE
  // =========================

  updateTool(siteId: SiteId, toolId: ToolId, updates: Partial<MCPTool>): boolean {
    const tool = this.stores.get(siteId)?.get(toolId);
    if (!tool) return false;

    const { id, ...safeUpdates } = updates;

    const updated = { ...tool, ...safeUpdates };

    // Revalidate after update
    this.validateTool(updated);

    this.stores.get(siteId)!.set(toolId, updated);
    return true;
  }

  setActive(siteId: SiteId, toolId: ToolId, active: boolean): boolean {
    const tool = this.stores.get(siteId)?.get(toolId);
    if (!tool) return false;
    tool.active = active;
    return true;
  }

  removeTool(siteId: SiteId, toolId: ToolId): boolean {
    return this.stores.get(siteId)?.delete(toolId) ?? false;
  }

  clearSite(siteId: SiteId): void {
    this.stores.delete(siteId);
  }

  // =========================
  // AI FORMAT
  // =========================

  toAIToolList(siteId: SiteId): AIToolDefinition[] {
    return this.getActiveTools(siteId).map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      parameters: this.flattenParams(tool.parameters),
      confirmationMode: tool.security?.confirmation ?? 'never',
      requiredPermission: tool.security?.requiredPermission ?? 'read',
      dependsOn: tool.dependsOn ?? [],
      deprecated: tool.lifecycle?.deprecated,
    }));
  }

  // =========================
  // VALIDATION
  // =========================

  private validateTool(tool: MCPTool): void {
    if (!tool.id) throw new RegistryError('Tool must have an id');
    if (!tool.name) throw new RegistryError(`Tool "${tool.id}" missing name`);
    if (!tool.description) throw new RegistryError(`Tool "${tool.id}" missing description`);

    if (!tool.endpoint?.url || !tool.endpoint?.method) {
      throw new RegistryError(`Tool "${tool.id}" missing endpoint`);
    }

    if (!tool.security?.requiredPermission) {
      throw new RegistryError(`Tool "${tool.id}" missing security.requiredPermission`);
    }

    if (!Array.isArray(tool.parameters)) {
      throw new RegistryError(`Tool "${tool.id}" parameters must be array`);
    }

    for (const param of tool.parameters) {
      this.validateParam(tool.id, param);
    }
  }

  private validateParam(toolId: ToolId, param: ToolParameter): void {
    if (!param.name) throw new RegistryError(`Tool "${toolId}" param missing name`);
    if (!param.type) throw new RegistryError(`Tool "${toolId}" param "${param.name}" missing type`);
    if (!param.in) throw new RegistryError(`Tool "${toolId}" param "${param.name}" missing in`);

    if (param.type === 'object' && param.properties) {
      for (const nested of param.properties) {
        this.validateParam(toolId, nested);
      }
    }

    if (param.type === 'array' && param.items) {
      this.validateParam(toolId, param.items);
    }
  }

  private flattenParams(params: ToolParameter[], prefix = ''): AIParameter[] {
    const result: AIParameter[] = [];

    for (const param of params) {
      const fullName = prefix ? `${prefix}.${param.name}` : param.name;

      result.push({
        name: fullName,
        type: param.type,
        description: param.description,
        required: param.required,
        enumValues: param.enumValues?.map((e) => e.value),
      });

      if (param.type === 'object' && param.properties) {
        result.push(...this.flattenParams(param.properties, fullName));
      }

      if (param.type === 'array' && param.items) {
        result.push(...this.flattenParams([param.items], `${fullName}[]`));
      }
    }

    return result;
  }
}

export class RegistryError extends Error {
  constructor(message: string) {
    super(`[BharatMCP Registry] ${message}`);
    this.name = 'RegistryError';
  }
}
