"use client";

import Link from "next/link";
import { Bot, Plus, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-surface-900">Dashboard</h1>
        <p className="mt-1 text-sm text-surface-500">
          Manage your AI agents and monitor their performance.
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: "Active Agents", value: "1", color: "text-brand-600" },
          { label: "Chat Sessions", value: "24", color: "text-emerald-600" },
          { label: "API Calls Today", value: "156", color: "text-amber-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-surface-200 bg-white p-5"
          >
            <p className="text-sm text-surface-500">{stat.label}</p>
            <p className={`mt-1 text-2xl font-semibold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Agents list */}
      <div className="rounded-xl border border-surface-200 bg-white">
        <div className="flex items-center justify-between border-b border-surface-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-surface-900">
            Your Agents
          </h2>
          <Link
            href="/agents/new"
            className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
          >
            <Plus size={14} />
            New Agent
          </Link>
        </div>
        <div className="divide-y divide-surface-100">
          <Link
            href="/agents/agent_demo/identity"
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Bot size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-900">
                InvoiceApp Assistant
              </p>
              <p className="text-xs text-surface-500">
                invoiceapp.com · 4 tools · Active
              </p>
            </div>
            <ArrowRight size={16} className="text-surface-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
