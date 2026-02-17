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
    primaryColor: "#6C5CE7",
    position: "bottom-right",
    showBranding: true,
  },
  bubbleConfig: {
    icon: "chat",
    size: "md",
    animation: "none",
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
