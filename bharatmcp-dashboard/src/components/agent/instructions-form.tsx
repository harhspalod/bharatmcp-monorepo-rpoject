"use client";

import { useAgentStore } from "@/stores/agent-store";

export function InstructionsForm() {
  const agent = useAgentStore((s) => s.agent);
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const isDirty = useAgentStore((s) => s.isDirty);
  const resetDirty = useAgentStore((s) => s.resetDirty);

  const handleSave = () => {
    resetDirty();
  };

  return (
    <div className="space-y-6">
      {/* System Instructions */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          System Instructions
        </label>
        <textarea
          value={agent?.instructions || ""}
          onChange={(e) => updateAgent({ instructions: e.target.value })}
          placeholder="You are a helpful assistant for our invoice management app. You can create, delete, and manage invoices. Always confirm before deleting anything..."
          rows={10}
          className="w-full resize-y rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 font-mono text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-2 text-xs text-surface-500">
          These instructions define how your agent behaves. Be specific about
          what it can do, its tone, and any rules it should follow.
        </p>
      </div>

      {/* Tone selector */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Response Tone
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["Professional", "Friendly", "Concise"].map((tone) => (
            <button
              key={tone}
              className="rounded-lg border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              {tone}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-surface-500">
          Choose a default tone for your agent&apos;s responses.
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
