"use client";

import { useAgentStore } from "@/stores/agent-store";
import { MessageSquare, Bot, Sparkles } from "lucide-react";

const iconOptions = [
  { value: "chat" as const, label: "Chat", icon: MessageSquare },
  { value: "bot" as const, label: "Bot", icon: Bot },
  { value: "custom" as const, label: "Custom", icon: Sparkles },
];

const sizeOptions = [
  { value: "sm" as const, label: "Small" },
  { value: "md" as const, label: "Medium" },
  { value: "lg" as const, label: "Large" },
];

const animationOptions = [
  { value: "none" as const, label: "None" },
  { value: "bounce" as const, label: "Bounce" },
  { value: "pulse" as const, label: "Pulse" },
];

export function ChatBubbleForm() {
  const agent = useAgentStore((s) => s.agent);
  const updateBubbleConfig = useAgentStore((s) => s.updateBubbleConfig);
  const isDirty = useAgentStore((s) => s.isDirty);
  const resetDirty = useAgentStore((s) => s.resetDirty);

  const handleSave = () => {
    resetDirty();
  };

  return (
    <div className="space-y-6">
      {/* Bubble Icon */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Bubble Icon
        </label>
        <div className="grid grid-cols-3 gap-3">
          {iconOptions.map((opt) => {
            const Icon = opt.icon;
            const active = agent?.bubbleConfig.icon === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateBubbleConfig({ icon: opt.value })}
                className={`flex flex-col items-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition-all ${
                  active
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-surface-200 text-surface-700 hover:border-brand-300"
                }`}
              >
                <Icon size={20} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bubble Size */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Bubble Size
        </label>
        <div className="grid grid-cols-3 gap-3">
          {sizeOptions.map((opt) => {
            const active = agent?.bubbleConfig.size === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateBubbleConfig({ size: opt.value })}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-surface-200 text-surface-700 hover:border-brand-300"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Animation
        </label>
        <div className="grid grid-cols-3 gap-3">
          {animationOptions.map((opt) => {
            const active = agent?.bubbleConfig.animation === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateBubbleConfig({ animation: opt.value })}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-surface-200 text-surface-700 hover:border-brand-300"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-surface-500">
          Animation applied to the floating chat bubble.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
