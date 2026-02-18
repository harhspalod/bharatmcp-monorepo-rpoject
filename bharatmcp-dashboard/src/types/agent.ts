export interface Agent {
  id: string;
  name: string;
  description?: string;
  domain?: string;
  welcomeMessage: string;
  instructions: string;
  tone?: "Professional" | "Friendly" | "Concise";
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

  /* COLORS */
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  messagesBackground?: string;

  /* TYPOGRAPHY */
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  headerSize?: number;
  lineHeight?: number;
  letterSpacing?: number;

  /* DIMENSIONS */
  width?: number;
  maxHeight?: number;
  messagesMaxHeight?: number;
  borderRadius?: number;
  padding?: number;

  /* SHADOW */
  shadow?: "none" | "soft" | "medium" | "strong";

}


export interface BubbleConfig {
  icon: "chat" | "bot" | "custom";
  size: "sm" | "md" | "lg";
  animation: "bounce" | "pulse" | "none";

  /* COLORS */
  backgroundColor?: string;
  borderColor?: string;
  iconColor?: string;

  /* SIZE */
  buttonSize?: number;
  iconSize?: number;

  /* POSITION */
  right?: number;
  bottom?: number;
}


export interface AgentFormData {
  name: string;
  welcomeMessage: string;
  instructions?: string;
  widgetConfig?: Partial<WidgetConfig>;
  bubbleConfig?: Partial<BubbleConfig>;
}
