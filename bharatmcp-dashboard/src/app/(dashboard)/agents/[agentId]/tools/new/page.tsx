"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NewToolPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [params_list, setParamsList] = useState([
    { name: "", type: "string", location: "body", required: true, description: "" },
  ]);

  const addParam = () => {
    setParamsList([
      ...params_list,
      { name: "", type: "string", location: "body", required: false, description: "" },
    ]);
  };

  const removeParam = (index: number) => {
    setParamsList(params_list.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/agents/${agentId}/tools`}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700"
        >
          <ArrowLeft size={14} />
          Back to tools
        </Link>
        <PageHeader
          title="Register New Tool"
          description="Register an API endpoint your agent can call"
        />
      </div>

      <div className="space-y-6">
        {/* Tool name and description */}
        <div className="form-section space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-surface-900">
              Tool Name
            </label>
            <input
              type="text"
              placeholder="e.g., Create Invoice"
              className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-surface-900">
              Description
            </label>
            <textarea
              placeholder="Describe what this tool does so the AI understands when to use it"
              rows={2}
              className="w-full resize-none rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {/* Endpoint config */}
        <div className="form-section space-y-4">
          <h3 className="text-sm font-semibold text-surface-900">Endpoint</h3>
          <div className="flex gap-3">
            <select className="w-28 rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-sm font-semibold text-surface-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
            </select>
            <input
              type="text"
              placeholder="https://api.yourapp.com/endpoint"
              className="flex-1 rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 font-mono text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {/* Parameters */}
        <div className="form-section space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-900">
              Parameters
            </h3>
            <button
              onClick={addParam}
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          {params_list.map((param, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-lg border border-surface-100 bg-surface-50 p-3"
            >
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Parameter name"
                    className="flex-1 rounded-md border border-surface-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400"
                  />
                  <select className="w-24 rounded-md border border-surface-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-brand-400">
                    <option>string</option>
                    <option>number</option>
                    <option>boolean</option>
                    <option>object</option>
                  </select>
                  <select className="w-20 rounded-md border border-surface-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-brand-400">
                    <option>body</option>
                    <option>path</option>
                    <option>query</option>
                    <option>header</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full rounded-md border border-surface-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400"
                />
              </div>
              <button
                onClick={() => removeParam(idx)}
                className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-surface-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="form-section space-y-4">
          <h3 className="text-sm font-semibold text-surface-900">Security</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-600">
                Risk Level
              </label>
              <select className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-600">
                Confirmation
              </label>
              <select className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400">
                <option value="always">Always confirm</option>
                <option value="high_risk">High risk only</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href={`/agents/${agentId}/tools`}
            className="rounded-lg border border-surface-200 px-5 py-2.5 text-sm font-semibold text-surface-700 transition-colors hover:bg-surface-50"
          >
            Cancel
          </Link>
          <button className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md active:scale-[0.98]">
            Register Tool
          </button>
        </div>
      </div>
    </>
  );
}
