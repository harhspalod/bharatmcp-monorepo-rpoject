"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ChatBubbleForm } from "@/components/agent/chat-bubble-form";

export default function ChatBubblePage() {
  return (
    <>
      <PageHeader
        title="Chat Bubble"
        description="Configure the floating chat bubble on your website"
      />
      <ChatBubbleForm />
    </>
  );
}
