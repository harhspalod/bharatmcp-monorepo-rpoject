"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  Palette,
  Circle,
  SlidersHorizontal,
  Wrench,
  Key,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";

const configSections = [
  {
    label: "CONFIGURATION",
    items: [
      { icon: User, label: "Identity", segment: "identity" },
      { icon: FileText, label: "Instructions", segment: "instructions" },
      { icon: Palette, label: "Widget", segment: "widget" },
      { icon: Circle, label: "Chat Bubble", segment: "chat-bubble" },
      { icon: SlidersHorizontal, label: "Advanced", segment: "advanced" },
    ],
  },
  {
    label: "TOOLS & KEYS",
    items: [
      { icon: Wrench, label: "API Tools", segment: "tools" },
      { icon: Key, label: "API Keys", segment: "api-keys" },
    ],
  },
  {
    label: "ACTIVITY",
    items: [
      { icon: MessageSquare, label: "Chat Logs", segment: "chat-logs" },
    ],
  },
];

export function SecondarySidebar() {
  const pathname = usePathname();
  const params = useParams();
  const agentId = params.agentId as string;
  const basePath = `/agents/${agentId}`;

  return (
    <aside
      className="fixed top-[var(--topbar-height)] z-20 flex h-[calc(100vh-var(--topbar-height))] w-[var(--secondary-sidebar-width)] flex-col border-r border-surface-200 bg-white"
      style={{ left: "var(--sidebar-width)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-surface-200 px-4 py-3">
        <Link
          href="/agents"
          className="flex h-7 w-7 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-700"
        >
          <ChevronLeft size={16} />
        </Link>
        <div>
          <h2 className="text-sm font-semibold text-surface-900">Agent</h2>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {configSections.map((section, idx) => (
          <div key={section.label} className={cn(idx > 0 && "mt-5")}>
            <p className="mb-1.5 px-3 text-2xs font-semibold uppercase tracking-wider text-surface-400">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const href = `${basePath}/${item.segment}`;
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={item.segment}
                    href={href}
                    className={cn("secondary-link", active && "active")}
                  >
                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
