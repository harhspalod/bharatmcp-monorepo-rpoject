"use client";

import { create } from "zustand";
import type { Agent, WidgetConfig, BubbleConfig } from "@/types/agent";

interface AgentStore {
  // Current agent being edited
  agent: Agent | null;
  isDirty: boolean;

  // Actions
  setAgent: (agent: Agent) => void;
  updateAgent: (updates: Partial<Agent>) => void;
  updateWidgetConfig: (updates: Partial<WidgetConfig>) => void;
  updateBubbleConfig: (updates: Partial<BubbleConfig>) => void;
  resetDirty: () => void;
}

const defaultAgent: Agent = {
  id: "agent_demo",
  name: "",
  welcomeMessage: "Hi! How can I help you today?",
  instructions: "",
  widgetConfig: {
  title: "Assistant",
  primaryColor: "#000000",
  position: "bottom-right",
  showBranding: true,

  /* COLORS */
  backgroundColor: "#FFFFFF",
  borderColor: "#E5E7EB",
  textColor: "#111827",
  messagesBackground: "#F9FAFB",

  /* TYPOGRAPHY */
  fontFamily: "System",
  fontWeight: "Normal",
  fontSize: 14,
  headerSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,

  /* DIMENSIONS */
  width: 400,
  maxHeight: 600,
  messagesMaxHeight: 350,
  borderRadius: 24,
  padding: 20,

  /* SHADOW */
  shadow: "strong",
},

  bubbleConfig: {
  icon: "chat",
  size: "md",
  animation: "none",

  backgroundColor: "#FFFFFF",
  borderColor: "#E5E7EB",
  iconColor: "#111827",

  buttonSize: 48,
  iconSize: 24,

  right: 16,
  bottom: 16,
},

  plan: "free",
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useAgentStore = create<AgentStore>((set) => ({
  agent: defaultAgent,
  isDirty: false,

  setAgent: (agent) => set({ agent, isDirty: false }),

  updateAgent: (updates) =>
    set((state) => ({
      agent: state.agent ? { ...state.agent, ...updates } : null,
      isDirty: true,
    })),

  updateWidgetConfig: (updates) =>
    set((state) => ({
      agent: state.agent
        ? {
            ...state.agent,
            widgetConfig: { ...state.agent.widgetConfig, ...updates },
          }
        : null,
      isDirty: true,
    })),

  updateBubbleConfig: (updates) =>
    set((state) => ({
      agent: state.agent
        ? {
            ...state.agent,
            bubbleConfig: { ...state.agent.bubbleConfig, ...updates },
          }
        : null,
      isDirty: true,
    })),

  resetDirty: () => set({ isDirty: false }),
}));
