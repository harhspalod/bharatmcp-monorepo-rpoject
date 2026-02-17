"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Pencil,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";

const demoTools = [
  {
    id: "1",
    toolId: "create_invoice",
    name: "Create Invoice",
    description: "Creates a new invoice with the given amount and details",
    method: "POST" as const,
    url: "https://api.invoiceapp.com/invoices",
    riskLevel: "medium" as const,
    active: true,
  },
  {
    id: "2",
    toolId: "delete_invoice",
    name: "Delete Invoice",
    description: "Permanently deletes an invoice by ID",
    method: "DELETE" as const,
    url: "https://api.invoiceapp.com/invoices/:id",
    riskLevel: "high" as const,
    active: true,
  },
  {
    id: "3",
    toolId: "list_invoices",
    name: "List Invoices",
    description: "Returns all invoices for the current user",
    method: "GET" as const,
    url: "https://api.invoiceapp.com/invoices",
    riskLevel: "low" as const,
    active: true,
  },
  {
    id: "4",
    toolId: "record_payment",
    name: "Record Payment",
    description: "Records a payment against an invoice",
    method: "POST" as const,
    url: "https://api.invoiceapp.com/payments",
    riskLevel: "medium" as const,
    active: false,
  },
];

const methodColors = {
  GET: "bg-emerald-50 text-emerald-700 border-emerald-200",
  POST: "bg-blue-50 text-blue-700 border-blue-200",
  PUT: "bg-amber-50 text-amber-700 border-amber-200",
  DELETE: "bg-red-50 text-red-700 border-red-200",
  PATCH: "bg-violet-50 text-violet-700 border-violet-200",
};

const riskColors = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

export default function ToolsPage() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="API Tools"
        description="Register the APIs your agent can call"
      />

      {/* Add tool button */}
      <div className="mb-6">
        <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md active:scale-[0.98]">
          <Plus size={16} />
          Add Tool
        </button>
      </div>

      {/* Tools list */}
      <div className="space-y-3">
        {demoTools.map((tool) => (
          <div
            key={tool.id}
            className={`group rounded-xl border bg-white p-4 transition-all hover:shadow-sm ${
              tool.active
                ? "border-surface-200"
                : "border-surface-200 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-flex rounded-md border px-2 py-0.5 text-2xs font-bold tracking-wider ${
                    methodColors[tool.method]
                  }`}
                >
                  {tool.method}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900">
                    {tool.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-surface-500">
                    {tool.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="rounded bg-surface-100 px-2 py-0.5 text-2xs font-mono text-surface-600">
                      {tool.url}
                    </code>
                    <span
                      className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
                        riskColors[tool.riskLevel]
                      }`}
                    >
                      {tool.riskLevel} risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === tool.id ? null : tool.id)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md text-surface-400 opacity-0 transition-all hover:bg-surface-100 hover:text-surface-600 group-hover:opacity-100"
                >
                  <MoreHorizontal size={16} />
                </button>
                {openMenu === tool.id && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border border-surface-200 bg-white py-1 shadow-lg">
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50">
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50">
                      <ExternalLink size={14} />
                      Test
                    </button>
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
