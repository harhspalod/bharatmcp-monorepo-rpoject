"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Plus, Copy, Eye, EyeOff, Trash2, Check } from "lucide-react";

const demoKeys = [
  {
    id: "1",
    label: "Production",
    key: "bm_live_abc123xyz789def456",
    permissions: ["read", "write"],
    active: true,
    createdAt: "2025-12-15",
    lastUsed: "2 hours ago",
  },
  {
    id: "2",
    label: "Development",
    key: "bm_test_dev987uvw654rst321",
    permissions: ["read", "write"],
    active: true,
    createdAt: "2026-01-03",
    lastUsed: "5 days ago",
  },
];

export default function ApiKeysPage() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    return key.slice(0, 10) + "•".repeat(16) + key.slice(-4);
  };

  return (
    <>
      <PageHeader
        title="API Keys"
        description="Manage embed keys for your chat widget"
      />

      <div className="mb-6">
        <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md active:scale-[0.98]">
          <Plus size={16} />
          Generate Key
        </button>
      </div>

      {/* Embed code snippet */}
      <div className="mb-6 rounded-xl border border-surface-200 bg-surface-900 p-4">
        <p className="mb-2 text-xs font-medium text-surface-400">
          Embed on your website
        </p>
        <code className="block text-sm text-emerald-400">
          {`<script src="https://cdn.bharatmcp.dev/widget.js"`}
          <br />
          {`        data-api-key="YOUR_API_KEY" />`}
        </code>
      </div>

      {/* Keys list */}
      <div className="space-y-3">
        {demoKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="rounded-xl border border-surface-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-surface-900">
                    {apiKey.label}
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-medium text-emerald-700">
                    Active
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <code className="rounded bg-surface-100 px-2.5 py-1 text-xs font-mono text-surface-700">
                    {visibleKeys.has(apiKey.id)
                      ? apiKey.key
                      : maskKey(apiKey.key)}
                  </code>
                  <button
                    onClick={() => toggleVisibility(apiKey.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => copyKey(apiKey.id, apiKey.key)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
                  >
                    {copiedKey === apiKey.id ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-surface-500">
                  Created {apiKey.createdAt} · Last used {apiKey.lastUsed}
                </p>
              </div>

              <button className="flex h-8 w-8 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
