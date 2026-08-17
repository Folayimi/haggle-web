"use client";

// components/pages/ConversationPage.tsx
// Thin wrapper around MessagesPage's compact mode, opened directly on one
// conversation (e.g. from ProductDetailPage's "Message owner" button).

import { useSearchParams } from "next/navigation";
import { MessagesPage } from "./MessagesPage";

export function ConversationPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id") ?? undefined;

  return <MessagesPage compact initialConversationId={conversationId} />;
}
