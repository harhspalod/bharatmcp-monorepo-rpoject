export interface Agent {
  id: string;
  name: string;
  description?: string;
  domain?: string;
  welcomeMessage: string;
  instructions: string;
  widgetConfig: WidgetConfig;
  bubbleConfig: BubbleConfig;
  plan: "free" | "pro" | "enterprise";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WidgetConfig {
  title: string;
  primaryColor: string;
  position: "bottom-right" | "bottom-left";
  showBranding: boolean;
}

export interface BubbleConfig {
  icon: "chat" | "bot" | "custom";
  size: "sm" | "md" | "lg";
  animation: "bounce" | "pulse" | "none";
}

export interface AgentFormData {
  name: string;
  welcomeMessage: string;
  instructions?: string;
  widgetConfig?: Partial<WidgetConfig>;
  bubbleConfig?: Partial<BubbleConfig>;
}
