"use client";

import { useAgentStore } from "@/stores/agent-store";

const colorPresets = [
  "#6C5CE7",
  "#0984E3",
  "#00B894",
  "#E17055",
  "#D63031",
  "#2D3436",
  "#6C5B7B",
  "#F39C12",
];

export function WidgetConfigForm() {
  const agent = useAgentStore((s) => s.agent);
  const updateWidgetConfig = useAgentStore((s) => s.updateWidgetConfig);
  const isDirty = useAgentStore((s) => s.isDirty);
  const resetDirty = useAgentStore((s) => s.resetDirty);

  const handleSave = () => {
    resetDirty();
  };

  return (
    <div className="space-y-6">
      {/* Widget Title */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Widget Title
        </label>
        <input
          type="text"
          value={agent?.widgetConfig.title || ""}
          onChange={(e) => updateWidgetConfig({ title: e.target.value })}
          placeholder="Assistant"
          className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-2 text-xs text-surface-500">
          Displayed at the top of the chat widget.
        </p>
      </div>

      {/* Primary Color */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Primary Color
        </label>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {colorPresets.map((color) => (
              <button
                key={color}
                onClick={() => updateWidgetConfig({ primaryColor: color })}
                className="relative h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor:
                    agent?.widgetConfig.primaryColor === color
                      ? color
                      : "transparent",
                  boxShadow:
                    agent?.widgetConfig.primaryColor === color
                      ? `0 0 0 2px white, 0 0 0 4px ${color}`
                      : "none",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-surface-200 px-3 py-2">
            <div
              className="h-5 w-5 rounded-md"
              style={{
                backgroundColor:
                  agent?.widgetConfig.primaryColor || "#6C5CE7",
              }}
            />
            <input
              type="text"
              value={agent?.widgetConfig.primaryColor || "#6C5CE7"}
              onChange={(e) =>
                updateWidgetConfig({ primaryColor: e.target.value })
              }
              className="w-20 text-xs font-mono text-surface-700 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Position */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Widget Position
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["bottom-right", "bottom-left"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => updateWidgetConfig({ position: pos })}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                agent?.widgetConfig.position === pos
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-surface-200 text-surface-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {pos === "bottom-right" ? "Bottom Right" : "Bottom Left"}
            </button>
          ))}
        </div>
      </div>

      {/* Show Branding */}
      <div className="form-section">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-surface-900">
              Show Branding
            </label>
            <p className="mt-0.5 text-xs text-surface-500">
              Display &quot;Powered by BharatMCP&quot; in the widget
            </p>
          </div>
          <button
            onClick={() =>
              updateWidgetConfig({
                showBranding: !agent?.widgetConfig.showBranding,
              })
            }
            className={`relative h-6 w-11 rounded-full transition-colors ${
              agent?.widgetConfig.showBranding !== false
                ? "bg-brand-500"
                : "bg-surface-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                agent?.widgetConfig.showBranding !== false
                  ? "translate-x-[22px]"
                  : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
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
