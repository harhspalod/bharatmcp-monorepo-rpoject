"use client";

import { PageHeader } from "@/components/shared/page-header";
import { WidgetConfigForm } from "@/components/agent/widget-config-form";

export default function WidgetPage() {
  return (
    <>
      <PageHeader
        title="Widget"
        description="Customize the appearance of your chat widget"
      />
      <WidgetConfigForm />
    </>
  );
}
