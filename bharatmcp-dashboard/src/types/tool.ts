export interface Tool {
  id: string;
  siteId: string;
  toolId: string;
  name: string;
  description: string;
  endpoint: ToolEndpoint;
  parameters: ToolParameter[];
  security: ToolSecurity;
  active: boolean;
  category: string;
  createdAt: string;
}

export interface ToolEndpoint {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export interface ToolParameter {
  name: string;
  label: string;
  description: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  location: "path" | "query" | "body" | "header";
  defaultValue?: string;
}

export interface ToolSecurity {
  requiredPermission: "read" | "write" | "admin";
  confirmation: "always" | "high_risk" | "never";
  sideEffect: boolean;
  riskLevel: "low" | "medium" | "high";
}
