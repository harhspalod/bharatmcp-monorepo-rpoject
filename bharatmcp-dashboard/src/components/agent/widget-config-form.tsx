"use client";

import { useAgentStore } from "@/stores/agent-store";
import { useState } from "react";

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

type WidgetColorKey =
  | "backgroundColor"
  | "borderColor"
  | "textColor"
  | "messagesBackground";

const colorPresets = [
  "#374151", // Deep Gray
  "#000000", // Pure Black
];


const colorOptions: { label: string; key: WidgetColorKey }[] = [
  { label: "Background", key: "backgroundColor" },
  { label: "Border", key: "borderColor" },
  { label: "Text", key: "textColor" },
  { label: "Messages Background", key: "messagesBackground" },
];


export function WidgetConfigForm() {
  const agent = useAgentStore((s) => s.agent);
  const updateWidgetConfig = useAgentStore((s) => s.updateWidgetConfig);
  const isDirty = useAgentStore((s) => s.isDirty);
  const resetDirty = useAgentStore((s) => s.resetDirty);

  const handleSave = () => {
    resetDirty();
  };
const handleReset = () => {
  updateWidgetConfig({
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    textColor: "#111827",
    messagesBackground: "#F9FAFB",
    fontFamily: "System",
    fontWeight: "Normal",
    fontSize: 14,
    headerSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    width: 400,
    maxHeight: 600,
    messagesMaxHeight: 350,
    borderRadius: 24,
    padding: 20,
    shadow: "medium",
  });
};


  return (
  <div className="space-y-8">

   {/* COLORS */}
      <Section title="Colors">
  {colorOptions.map((item) => (
    <div key={item.key} className="flex items-center justify-between">
      <span className="text-sm text-surface-800">{item.label}</span>

      <div className="flex gap-2">
        {colorPresets.map((color) => (
          <button
            key={color}
            onClick={() =>
              updateWidgetConfig({ [item.key]: color })
            }
            className="h-6 w-6 rounded-md border transition-transform hover:scale-105"
            aria-label={`Select ${item.label} color ${color}`}
            style={{
              backgroundColor: color,
              borderColor:
                (agent?.widgetConfig as any)?.[item.key] === color
                  ? "#000"
                  : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  ))}
</Section>



    {/* AI AGENT MESSAGES */}
    <Section title="AI Agent Messages">
      <div className="flex items-center justify-between">
        <span className="text-sm text-surface-800">Bubble</span>
        <div className="h-7 w-7 rounded-md bg-black" />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-surface-800">Text</span>
        <div className="h-7 w-7 rounded-md bg-white border" />
      </div>
    </Section>

    {/* USER MESSAGES */}
    <Section title="User Messages">
      <div className="flex items-center justify-between">
        <span className="text-sm text-surface-800">Bubble</span>
        <div className="h-7 w-7 rounded-md bg-white border" />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-surface-800">Text</span>
        <div className="h-7 w-7 rounded-md bg-black" />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-surface-800">Border</span>
        <div className="h-7 w-7 rounded-md bg-black" />
      </div>
    </Section>

    {/* TYPOGRAPHY */}
<Section title="Typography">
  <div className="space-y-4">

    {/* Font Family */}
    <div className="flex items-center justify-between">
      <span className="text-sm text-surface-800">Font Family</span>
      <select
        value={agent?.widgetConfig.fontFamily || "System"}
        onChange={(e) =>
          updateWidgetConfig({ fontFamily: e.target.value })
        }
        className="rounded-md border border-surface-200 px-3 py-1 text-sm"
      >
        <option value="System">System</option>
        <option value="Inter">Inter</option>
        <option value="Roboto">Roboto</option>
      </select>
    </div>

    {/* Font Weight */}
    <div className="flex items-center justify-between">
      <span className="text-sm text-surface-800">Font Weight</span>
      <select
        value={agent?.widgetConfig.fontWeight || "Normal"}
        onChange={(e) =>
          updateWidgetConfig({ fontWeight: e.target.value })
        }
        className="rounded-md border border-surface-200 px-3 py-1 text-sm"
      >
        <option value="Normal">Normal</option>
        <option value="Medium">Medium</option>
        <option value="Bold">Bold</option>
      </select>
    </div>

    {/* Numeric Inputs */}
    {[
      { label: "Font Size", key: "fontSize" },
      { label: "Header Size", key: "headerSize" },
      { label: "Line Height", key: "lineHeight" },
      { label: "Letter Spacing", key: "letterSpacing" },
    ].map((item) => (
      <div key={item.key} className="flex items-center justify-between">
        <span className="text-sm text-surface-800">
          {item.label}
        </span>

        <div className="flex items-center gap-1">
          <input
            type="number"
            value={
              agent?.widgetConfig?.[item.key as keyof typeof agent.widgetConfig] as number
            }
            onChange={(e) =>
              updateWidgetConfig({
                [item.key]: Number(e.target.value),
              })
            }
            className="w-16 rounded-md border border-surface-200 px-2 py-1 text-sm"
          />
          <span className="text-xs text-surface-500">px</span>
        </div>
      </div>
    ))}

  </div>
</Section>


    {/* DIMENSIONS */}
<Section title="Dimensions">
  <div className="space-y-4">
    {[
      { label: "Width", key: "width" },
      { label: "Max Height", key: "maxHeight" },
      { label: "Messages Max Height", key: "messagesMaxHeight" },
      { label: "Border Radius", key: "borderRadius" },
      { label: "Padding", key: "padding" },
    ].map((item) => (
      <div key={item.key} className="flex items-center justify-between">
        <span className="text-sm text-surface-800">
          {item.label}
        </span>

        <div className="flex items-center gap-1">
          <input
            type="number"
            value={
              agent?.widgetConfig?.[item.key as keyof typeof agent.widgetConfig] as number
            }
            onChange={(e) =>
              updateWidgetConfig({
                [item.key]: Number(e.target.value),
              })
            }
            className="w-16 rounded-md border border-surface-200 px-2 py-1 text-sm"
          />
          <span className="text-xs text-surface-500">px</span>
        </div>
      </div>
    ))}
  </div>
</Section>


   {/* SHADOW */}
  <Section title="Shadow">
    <div className="flex items-center justify-between">
      <span className="text-sm text-surface-800">
        Widget Shadow
      </span>

      <select
        value={agent?.widgetConfig.shadow || "medium"}
        onChange={(e) =>
          updateWidgetConfig({
            shadow: e.target.value as
              | "none"
              | "soft"
              | "medium"
              | "strong",
          })
        }
        className="w-32 rounded-md border border-surface-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-black"
      >
        <option value="none">None</option>
        <option value="soft">Soft</option>
        <option value="medium">Medium</option>
        <option value="strong">Strong</option>
      </select>
    </div>
  </Section>

   <div className="flex items-center justify-between pt-6">
  {/* Reset Button (Secondary Style) */}
  <button
    onClick={handleReset}
    className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
  >
    Reset
  </button>

  {/* Save Button (Primary Style) */}
  <button
    onClick={handleSave}
    disabled={!isDirty}
    className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
  >
    Save Changes
  </button>
</div>



    
  </div>
);

}
