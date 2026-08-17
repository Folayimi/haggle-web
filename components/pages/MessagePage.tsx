"use client";

// components/pages/MessagesPage.tsx

import { useEffect, useState } from "react";
import { Search, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { listConversations, listMessages, sendMessage } from "@/services/conversations";
import { useHaggleStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import type { Conversation, Message } from "@/types";

function ContentSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function MessagesPage({
  compact = false,
  initialConversationId,
}: {
  compact?: boolean;
  initialConversationId?: string;
}) {
  const currentUserId = useHaggleStore((state) => state.userData?.id);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initialConversationId ?? null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    listConversations()
      .then((data) => {
        setConversations(data);
        if (!initialConversationId && data.length > 0) setActiveId(data[0].id);
      })
      .finally(() => setLoadingList(false));
  }, [initialConversationId]);

  useEffect(() => {
    if (!activeId) return;
    setLoadingThread(true);
    listMessages(activeId)
      .then(setMessages)
      .finally(() => setLoadingThread(false));
  }, [activeId]);

  async function handleSend() {
    if (!activeId || !currentUserId || !draft.trim()) return;
    setSending(true);
    try {
      const message = await sendMessage(activeId, {
        sender_user_id: currentUserId,
        message_type: "text",
        text_body: draft.trim(),
      });
      if (message) {
        setMessages((prev) => [...prev, message]);
        setDraft("");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell>
      <ContentSection>
        <div className={cn("grid gap-5", compact ? "lg:grid-cols-1" : "lg:grid-cols-[0.38fr_0.62fr]")}>
          {!compact && (
            <div className="panel rounded-[34px] p-4">
              <div className="mb-4 rounded-[22px] border border-border bg-background-elevated px-4 py-3">
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-muted" />
                  <input
                    placeholder="Search conversations"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                  />
                </div>
              </div>
              {loadingList ? (
                <p className="p-4 text-sm text-muted">Loading…</p>
              ) : conversations.length === 0 ? (
                <p className="p-4 text-sm text-muted">No conversations yet.</p>
              ) : (
                <div className="space-y-3">
                  {conversations.map((conversation) => (
                    <button
                      type="button"
                      key={conversation.id}
                      onClick={() => setActiveId(conversation.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[24px] px-3 py-3 text-left",
                        conversation.id === activeId
                          ? "bg-primary/8"
                          : "bg-background-elevated hover:bg-surface",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {conversation.lastMessagePreview || "New conversation"}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {conversation.lastMessageAt ?? conversation.createdAt}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="panel flex h-full min-h-[560px] flex-col rounded-[34px]">
            {!activeId ? (
              <div className="flex flex-1 items-center justify-center text-sm text-muted">
                Select a conversation.
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                  {loadingThread ? (
                    <p className="text-sm text-muted">Loading messages…</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "max-w-[86%] rounded-[28px] px-4 py-3 text-sm leading-7",
                          message.senderUserId === currentUserId
                            ? "ml-auto bg-primary text-white"
                            : "bg-surface text-foreground",
                        )}
                      >
                        <p>{message.textBody}</p>
                        <p
                          className={cn(
                            "mt-2 text-xs",
                            message.senderUserId === currentUserId ? "text-white/70" : "text-muted",
                          )}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-border px-5 py-4">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={2}
                      placeholder="Type a message…"
                      className="min-h-[56px] flex-1 rounded-[22px] border border-border bg-background-elevated px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={sending || !draft.trim()}
                      className="rounded-full bg-primary p-3 text-white disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </ContentSection>
    </AppShell>
  );
}
