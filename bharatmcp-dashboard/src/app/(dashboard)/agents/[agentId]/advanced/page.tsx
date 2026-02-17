"use client";

import { PageHeader } from "@/components/shared/page-header";
import { AdvancedForm } from "@/components/agent/advanced-form";

export default function AdvancedPage() {
  return (
    <>
      <PageHeader
        title="Advanced"
        description="Advanced configuration and security settings"
      />
      <AdvancedForm />
    </>
  );
}
