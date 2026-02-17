"use client";

import { useAgentStore } from "@/stores/agent-store";

export function IdentityForm() {
  const agent = useAgentStore((s) => s.agent);
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const updateWidgetConfig = useAgentStore((s) => s.updateWidgetConfig);
  const isDirty = useAgentStore((s) => s.isDirty);
  const resetDirty = useAgentStore((s) => s.resetDirty);

  const handleSave = () => {
    // TODO: API call to save
    resetDirty();
  };

  return (
    <div className="space-y-6">
      {/* Agent Name */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Agent Name
        </label>
        <input
          type="text"
          value={agent?.name || ""}
          onChange={(e) => {
            updateAgent({ name: e.target.value });
            updateWidgetConfig({
              title: e.target.value || "Assistant",
            });
          }}
          placeholder="e.g., Support Assistant"
          className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-2 text-xs text-surface-500">
          This name appears in the widget header
        </p>
      </div>

      {/* Welcome Message */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Welcome Message
        </label>
        <textarea
          value={agent?.welcomeMessage || ""}
          onChange={(e) => updateAgent({ welcomeMessage: e.target.value })}
          placeholder="Hi! How can I help you today?"
          rows={3}
          className="w-full resize-none rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-2 text-xs text-surface-500">
          The first message users see when they open the chat widget. Leave empty
          to use the default message.
        </p>
      </div>

      {/* Save button */}
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
