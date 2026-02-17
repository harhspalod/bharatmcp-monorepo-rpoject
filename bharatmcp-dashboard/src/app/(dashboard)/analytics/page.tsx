"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-surface-900">Analytics</h1>
        <p className="mt-1 text-sm text-surface-500">
          Track usage, performance, and engagement metrics.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 bg-white py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-surface-400">
          <BarChart3 size={24} />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-surface-900">
          Analytics coming soon
        </h3>
        <p className="mt-1 text-sm text-surface-500">
          Usage data will appear here once your agent is live.
        </p>
      </div>
    </div>
  );
}
