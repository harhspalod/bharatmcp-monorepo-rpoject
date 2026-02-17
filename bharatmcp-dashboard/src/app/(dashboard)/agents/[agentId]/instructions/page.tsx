"use client";

import { PageHeader } from "@/components/shared/page-header";
import { InstructionsForm } from "@/components/agent/instructions-form";

export default function InstructionsPage() {
  return (
    <>
      <PageHeader
        title="Instructions"
        description="Define how your agent behaves and responds"
      />
      <InstructionsForm />
    </>
  );
}
