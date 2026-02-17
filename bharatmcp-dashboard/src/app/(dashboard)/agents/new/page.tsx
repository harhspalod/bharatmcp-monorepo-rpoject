"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAgentPage() {
  const router = useRouter();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/agents/agent_demo/identity");
  };

  return (
    <div className="mx-auto max-w-xl px-8 py-10">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-surface-900">
          Create New Agent
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          Set up an AI chatbot for your website.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-6">
        <div className="form-section space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-surface-900">
              Agent Name
            </label>
            <input
              type="text"
              placeholder="e.g., Support Assistant"
              required
              className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-surface-900">
              Website Domain
            </label>
            <input
              type="text"
              placeholder="e.g., invoiceapp.com"
              className="w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-surface-900">
              Description
            </label>
            <textarea
              placeholder="What does this agent help with?"
              rows={3}
              className="w-full resize-none rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg border border-surface-200 px-5 py-2.5 text-sm font-semibold text-surface-700 transition-colors hover:bg-surface-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md active:scale-[0.98]"
          >
            Create Agent
          </button>
        </div>
      </form>
    </div>
  );
}
