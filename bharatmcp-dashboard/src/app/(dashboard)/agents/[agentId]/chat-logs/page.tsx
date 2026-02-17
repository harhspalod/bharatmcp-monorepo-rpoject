"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { MessageSquare, Clock, ExternalLink } from "lucide-react";

const demoSessions = [
  {
    id: "sess_001",
    preview: "Delete invoice INV-002 and create a new one for ₹5000",
    messageCount: 5,
    pageUrl: "https://invoiceapp.com/dashboard",
    startedAt: "2 hours ago",
    status: "completed" as const,
  },
  {
    id: "sess_002",
    preview: "Show me all pending invoices",
    messageCount: 3,
    pageUrl: "https://invoiceapp.com/invoices",
    startedAt: "5 hours ago",
    status: "completed" as const,
  },
  {
    id: "sess_003",
    preview: "How do I create a recurring invoice?",
    messageCount: 4,
    pageUrl: "https://invoiceapp.com/help",
    startedAt: "1 day ago",
    status: "completed" as const,
  },
  {
    id: "sess_004",
    preview: "Record payment of ₹15,000 against INV-005",
    messageCount: 6,
    pageUrl: "https://invoiceapp.com/payments",
    startedAt: "2 days ago",
    status: "completed" as const,
  },
];

export default function ChatLogsPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="Chat Logs"
        description="View conversations between users and your agent"
      />

      <div className="space-y-2">
        {demoSessions.map((session) => (
          <button
            key={session.id}
            onClick={() =>
              setSelectedSession(
                selectedSession === session.id ? null : session.id
              )
            }
            className={`w-full rounded-xl border bg-white p-4 text-left transition-all hover:shadow-sm ${
              selectedSession === session.id
                ? "border-brand-300 ring-2 ring-brand-100"
                : "border-surface-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">
                    {session.preview}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-surface-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {session.startedAt}
                    </span>
                    <span>{session.messageCount} messages</span>
                    <span className="flex items-center gap-1">
                      <ExternalLink size={12} />
                      {new URL(session.pageUrl).pathname}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded view */}
            {selectedSession === session.id && (
              <div className="mt-4 rounded-lg border border-surface-100 bg-surface-50 p-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="shrink-0 rounded bg-surface-200 px-2 py-0.5 text-2xs font-medium text-surface-600">
                      User
                    </span>
                    <p className="text-sm text-surface-700">
                      {session.preview}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="shrink-0 rounded bg-brand-100 px-2 py-0.5 text-2xs font-medium text-brand-700">
                      Agent
                    </span>
                    <p className="text-sm text-surface-700">
                      I&apos;ll help you with that. Let me process your
                      request...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </>
  );
}
