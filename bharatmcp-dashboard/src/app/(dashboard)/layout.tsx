"use client";

import { IconSidebar } from "@/components/layout/icon-sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-50">
      <IconSidebar />
      <Topbar />
      <main
        className="pt-[var(--topbar-height)]"
        style={{ paddingLeft: "var(--sidebar-width)" }}
      >
        {children}
      </main>
    </div>
  );
}
