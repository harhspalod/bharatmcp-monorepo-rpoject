"use client";

import { useAgentStore } from "@/stores/agent-store";
import { useState } from "react";
import { MessageSquare, Bot, Sparkles } from "lucide-react";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">
          {title}
        </span>
        <span className="text-surface-400">{open ? "−" : "+"}</span>
      </button>

      {open && <div className="space-y-4">{children}</div>}
    </div>
  );
}

export function ChatBubbleForm() {
  const agent = useAgentStore((s) => s.agent);
  const updateBubbleConfig = useAgentStore((s) => s.updateBubbleConfig);
  const isDirty = useAgentStore((s) => s.isDirty);
  const resetDirty = useAgentStore((s) => s.resetDirty);

  const handleSave = () => {
    resetDirty();
  };

  const handleReset = () => {
    updateBubbleConfig({
      backgroundColor: "#FFFFFF",
      borderColor: "#E5E7EB",
      iconColor: "#111827",
      buttonSize: 48,
      iconSize: 24,
      right: 16,
      bottom: 16,
      animation: "none",
      size: "md",
      icon: "chat",
    });
  };

  const Icon =
    agent?.bubbleConfig.icon === "bot"
      ? Bot
      : agent?.bubbleConfig.icon === "custom"
      ? Sparkles
      : MessageSquare;

  return (
    <div className="space-y-8">

      {/* COLORS */}
      <Section title="Colors">
        {[
          { label: "Background", key: "backgroundColor" },
          { label: "Border", key: "borderColor" },
          { label: "Icon", key: "iconColor" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm text-surface-800">
              {item.label}
            </span>

            <input
              type="color"
              value={(agent?.bubbleConfig as any)?.[item.key] || "#ffffff"}
              onChange={(e) =>
                updateBubbleConfig({
                  [item.key]: e.target.value,
                })
              }
              className="h-7 w-7 rounded-md border"
            />
          </div>
        ))}
      </Section>

      {/* SIZE */}
      <Section title="Size">
        {[
          { label: "Button Size", key: "buttonSize" },
          { label: "Icon Size", key: "iconSize" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm text-surface-800">
              {item.label}
            </span>

            <div className="flex items-center gap-1">
              <input
                type="number"
                value={(agent?.bubbleConfig as any)?.[item.key] || 0}
                onChange={(e) =>
                  updateBubbleConfig({
                    [item.key]: Number(e.target.value),
                  })
                }
                className="w-16 rounded-md border border-surface-200 px-2 py-1 text-sm"
              />
              <span className="text-xs text-surface-500">px</span>
            </div>
          </div>
        ))}
      </Section>

      {/* POSITION */}
      <Section title="Position">
        {[
          { label: "Right", key: "right" },
          { label: "Bottom", key: "bottom" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm text-surface-800">
              {item.label}
            </span>

            <div className="flex items-center gap-1">
              <input
                type="number"
                value={(agent?.bubbleConfig as any)?.[item.key] || 0}
                onChange={(e) =>
                  updateBubbleConfig({
                    [item.key]: Number(e.target.value),
                  })
                }
                className="w-16 rounded-md border border-surface-200 px-2 py-1 text-sm"
              />
              <span className="text-xs text-surface-500">px</span>
            </div>
          </div>
        ))}
      </Section>

      {/* ICON + ANIMATION */}
      <Section title="Behavior">
        <div className="flex items-center justify-between">
          <span className="text-sm text-surface-800">
            Icon
          </span>
          <select
            value={agent?.bubbleConfig.icon}
            onChange={(e) =>
              updateBubbleConfig({
                icon: e.target.value as any,
              })
            }
            className="rounded-md border border-surface-200 px-3 py-1 text-sm"
          >
            <option value="chat">Chat</option>
            <option value="bot">Bot</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-surface-800">
            Animation
          </span>
          <select
            value={agent?.bubbleConfig.animation}
            onChange={(e) =>
              updateBubbleConfig({
                animation: e.target.value as any,
              })
            }
            className="rounded-md border border-surface-200 px-3 py-1 text-sm"
          >
            <option value="none">None</option>
            <option value="bounce">Bounce</option>
            <option value="pulse">Pulse</option>
          </select>
        </div>
      </Section>

      {/* RESET + SAVE */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={handleReset}
          className="rounded-md border border-surface-300 bg-white px-5 py-2 text-sm font-medium text-surface-700 hover:border-black hover:text-black"
        >
          Reset
        </button>

        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
}
