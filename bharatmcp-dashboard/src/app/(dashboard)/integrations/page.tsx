"use client";

import { Link2, Plus } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-surface-900">
          Integrations
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          Connect third-party services to extend your agent&apos;s capabilities.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 bg-white py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-surface-400">
          <Link2 size={24} />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-surface-900">
          No integrations yet
        </h3>
        <p className="mt-1 text-sm text-surface-500">
          Connect Slack, Zapier, or other services.
        </p>
        <button className="mt-4 flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
          <Plus size={16} />
          Add Integration
        </button>
      </div>
    </div>
  );
}
