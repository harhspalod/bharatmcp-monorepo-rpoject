"use client";

import Link from "next/link";
import {
  FileText,
  MessageCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

export function Topbar() {
  return (
    <header className="fixed right-0 top-0 z-30 flex h-[var(--topbar-height)] items-center justify-end gap-1 border-b border-surface-200 bg-white/80 px-4 backdrop-blur-sm"
      style={{ left: "var(--sidebar-width)" }}
    >
      {/* Right side items */}
      <div className="flex items-center gap-1">
        <Link
          href="#"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
        >
          <FileText size={16} />
          Docs
        </Link>

        <Link
          href="#"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
        >
          <MessageCircle size={16} />
          Discord
        </Link>

        <Link
          href="#"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
        >
          <HelpCircle size={16} />
          Get Help
        </Link>

        {/* Plan badge */}
        <span className="ml-1 rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-surface-600">
          Free
        </span>

        {/* Avatar */}
        <button className="ml-2 flex items-center gap-1.5 rounded-lg p-1 transition-colors hover:bg-surface-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
            H
          </div>
          <ChevronDown size={14} className="text-surface-400" />
        </button>
      </div>
    </header>
  );
}
