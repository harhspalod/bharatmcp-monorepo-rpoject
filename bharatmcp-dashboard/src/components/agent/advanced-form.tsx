"use client";

import { useState } from "react";

export function AdvancedForm() {
  const [allowedDomains, setAllowedDomains] = useState("invoiceapp.com");
  const [rateLimit, setRateLimit] = useState("60");
  const [maxTokens, setMaxTokens] = useState("2048");
  const [requireAuth, setRequireAuth] = useState(false);

  return (
    <div className="space-y-6">
      {/* Allowed Domains */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Allowed Domains
        </label>
        <textarea
          value={allowedDomains}
          onChange={(e) => setAllowedDomains(e.target.value)}
          placeholder="example.com&#10;app.example.com"
          rows={3}
          className="w-full resize-none rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 font-mono text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-2 text-xs text-surface-500">
          Only allow the widget to load on these domains. One per line.
        </p>
      </div>

      {/* Rate Limit */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Rate Limit
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={rateLimit}
            onChange={(e) => setRateLimit(e.target.value)}
            className="w-24 rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <span className="text-sm text-surface-500">
            messages per minute per user
          </span>
        </div>
      </div>

      {/* Max Tokens */}
      <div className="form-section">
        <label className="mb-2 block text-sm font-semibold text-surface-900">
          Max Response Tokens
        </label>
        <input
          type="number"
          value={maxTokens}
          onChange={(e) => setMaxTokens(e.target.value)}
          className="w-32 rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-2 text-xs text-surface-500">
          Maximum tokens the AI can use per response.
        </p>
      </div>

      {/* Require User Auth */}
      <div className="form-section">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-surface-900">
              Require User Authentication
            </label>
            <p className="mt-0.5 text-xs text-surface-500">
              Only authenticated users on your site can use the widget
            </p>
          </div>
          <button
            onClick={() => setRequireAuth(!requireAuth)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              requireAuth ? "bg-brand-500" : "bg-surface-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                requireAuth ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
          Save Changes
        </button>
      </div>
    </div>
  );
}
