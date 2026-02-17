"use client";

import { PageHeader } from "@/components/shared/page-header";
import { IdentityForm } from "@/components/agent/identity-form";

export default function IdentityPage() {
  return (
    <>
      <PageHeader
        title="Identity"
        description="Define your agent's identity"
      />
      <IdentityForm />
    </>
  );
}
