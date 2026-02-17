"use client";

import { usePathname } from "next/navigation";
import { SecondarySidebar } from "@/components/layout/secondary-sidebar";
import { WidgetPreview } from "@/components/preview/widget-preview";

// Pages that should show the widget preview on the right
const pagesWithPreview = [
  "identity",
  "instructions",
  "widget",
  "chat-bubble",
];

export default function AgentDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop() || "";
  const showPreview = pagesWithPreview.includes(lastSegment);

  return (
    <div className="flex h-[calc(100vh-var(--topbar-height))]">
      <SecondarySidebar />

      {/* Content area */}
      <div
        className="flex flex-1"
        style={{ marginLeft: "var(--secondary-sidebar-width)" }}
      >
        {/* Form content */}
        <div
          className={`flex-1 overflow-y-auto ${
            showPreview ? "max-w-[560px]" : ""
          }`}
        >
          <div className="px-8 py-8">{children}</div>
        </div>

        {/* Widget preview */}
        {showPreview && (
          <div className="flex-1 border-l border-surface-200">
            <WidgetPreview />
          </div>
        )}
      </div>
    </div>
  );
}
