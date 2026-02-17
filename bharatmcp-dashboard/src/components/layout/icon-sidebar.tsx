"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Link2,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Bot,
    label: "Agents",
    href: "/agents",
  },
  {
    icon: Link2,
    label: "Integrations",
    href: "/integrations",
  },
  {
    icon: MessageSquare,
    label: "Chat Logs",
    href: "/chat-logs",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/analytics",
  },
];

const bottomItems = [
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];

export function IconSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/agents") {
      return pathname.startsWith("/agents");
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[var(--sidebar-width)] flex-col items-center border-r border-surface-200 bg-white py-3">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 transition-transform hover:scale-105"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </Link>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("sidebar-icon group relative", active && "active")}
              title={item.label}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-surface-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <nav className="flex flex-col items-center gap-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("sidebar-icon group relative", active && "active")}
              title={item.label}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-surface-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
