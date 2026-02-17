"use client";

import { useAgentStore } from "@/stores/agent-store";
import { Plus, History, Send } from "lucide-react";

export function WidgetPreview() {
  const agent = useAgentStore((s) => s.agent);

  const title = agent?.widgetConfig.title || "Assistant";
  const welcomeMessage =
    agent?.welcomeMessage || "Hi! How can I help you today?";
  const primaryColor = agent?.widgetConfig.primaryColor || "#6C5CE7";

  return (
    <div className="flex h-full items-center justify-center bg-[var(--preview-bg)] p-8">
      {/* Chat widget card */}
      <div className="w-[360px] animate-fade-in">
        <div className="overflow-hidden rounded-2xl bg-white shadow-widget">
          {/* Widget header */}
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="text-base font-semibold text-surface-900">
              {title}
            </h3>
            <div className="flex items-center gap-1">
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600">
                <Plus size={16} />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600">
                <History size={16} />
              </button>
            </div>
          </div>

          {/* Chat body */}
          <div className="flex min-h-[320px] flex-col px-5 pb-3">
            {/* Welcome message bubble */}
            <div className="mb-auto">
              <div
                className="inline-block max-w-[85%] rounded-2xl rounded-tl-md px-4 py-2.5 text-sm text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {welcomeMessage}
              </div>
            </div>

            {/* Branding */}
            {agent?.widgetConfig.showBranding !== false && (
              <div className="flex items-center justify-center gap-1.5 py-2 text-xs text-surface-400">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Powered by BharatMCP
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-surface-100 px-4 py-3">
            <div className="flex items-end gap-2 rounded-xl bg-surface-50 px-4 py-3">
              <span className="flex-1 text-sm text-surface-400">
                Type your message...
              </span>
              <button
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-surface-300 transition-colors hover:text-surface-500"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
