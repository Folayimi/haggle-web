"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Camera,
  ChevronRight,
  Download,
  Flame,
  Hand,
  ImagePlus,
  MicOff,
  MonitorPlay,
  PauseCircle,
  Play,
  Search,
  Send,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Square,
  Ticket,
  Timer,
  VideoOff,
} from "lucide-react";
import { saveImageFromUrl, saveAudioBlob } from "@/lib/indexeddb";
import { startTransition, useDeferredValue, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import {
  GhostButton,
  LiveSessionCard,
  MetricCard,
  PageIntro,
  PrimaryButton,
  ProductCard,
  RecordingButton,
  ReminderChip,
  SectionTitle,
  SellerIdentity,
  ServiceCard,
} from "@/components/haggle-ui";
import OfferArea from "@/components/product-offers";
import BundleSuggestions from "@/components/product-bundles";
import { useHaggleStore } from "@/lib/app-store";
import {
  allLiveSessions,
  conversations,
  currentUser,
  featuredProduct,
  featuredSeller,
  featuredService,
  getProductById,
  getServiceById,
  marketCategories,
  marketServices,
  negotiationParticipants,
  roomPresets,
  searchResults,
  searchSuggestions,
  sellerProducts,
  sellerProfiles,
} from "@/lib/mock-data";
import type { ChatMessage, NegotiationParticipant } from "@/lib/types";
import { cn } from "@/lib/utils";

let mockIdSequence = 0;

function nextMockId(prefix: string) {
  mockIdSequence += 1;
  return `${prefix}-${mockIdSequence}`;
}

function WorkspaceFrame({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

function ContentSection({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("px-4 py-6 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium",
        active
          ? "bg-primary text-white"
          : "border border-border bg-background-elevated text-muted",
      )}
    >
      {children}
    </button>
  );
}

function MessageThread({
  thread,
  draft,
  onDraftChange,
  onSend,
  onSendVoice,
}: {
  thread: (typeof conversations)[number];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onSendVoice?: (payload: { audioId: string; audioUrl: string }) => void;
}) {
  return (
    <div className="panel flex h-full min-h-[640px] flex-col rounded-[34px]">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={thread.sellerAvatar}
            alt={thread.sellerName}
            className="h-12 w-12 rounded-2xl object-cover"
          />
          <div>
            <p className="font-semibold">{thread.sellerName}</p>
            <p className="text-sm text-muted">
              {thread.isOnline ? "Online now" : "Replies later today"} •{" "}
              {thread.sellerTagline}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Chip>Record note</Chip>
          <Chip>Share item</Chip>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {thread.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[86%] rounded-[28px] px-4 py-3 text-sm leading-7",
              message.sender === "buyer"
                ? "ml-auto bg-primary text-white"
                : message.sender === "system"
                  ? "mx-auto bg-surface text-center text-muted"
                  : "bg-surface text-foreground",
            )}
          >
            {message.type === "voice" ? (
              <div className="flex items-center gap-3">
                <button className="rounded-full bg-white/15 p-2">
                  <Play className="h-4 w-4" />
                </button>
                <div className="wave-bars flex items-end gap-1 text-current">
                  {(message.waveform ?? [6, 12, 16, 10, 20]).map(
                    (value, index) => (
                      <span
                        key={`${message.id}-${index}`}
                        style={{ height: value }}
                      />
                    ),
                  )}
                </div>
                {message.audioUrl ? (
                  <audio className="ml-3" controls src={message.audioUrl} />
                ) : null}
              </div>
            ) : message.type === "product" && message.productId ? (
              <div className="rounded-[20px] bg-background-elevated p-3 text-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Shared product
                </p>
                <p className="mt-2 font-semibold">
                  {getProductById(message.productId).name}
                </p>
                <p className="text-sm text-muted">
                  {getProductById(message.productId).price}
                </p>
              </div>
            ) : message.type === "screenshot" ? (
              <div>
                <p className="font-semibold">Screenshot captured</p>
                <p className="text-sm opacity-80">{message.screenshotLabel}</p>
              </div>
            ) : (
              <p>{message.text}</p>
            )}
            <p
              className={cn(
                "mt-2 text-xs",
                message.sender === "buyer" ? "text-white/70" : "text-muted",
              )}
            >
              {message.createdAt}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          <Chip>Record note</Chip>
          <Chip>Share item</Chip>
          <Chip>Ask about bundles</Chip>
        </div>
        <div className="flex items-end gap-3">
          <RecordingButton
            onSave={async ({ id, objectUrl }) => {
              if (onSendVoice) {
                onSendVoice({ audioId: id, audioUrl: objectUrl });
              }
            }}
          />
          <button
            type="button"
            className="rounded-full border border-border bg-background-elevated p-3"
          >
            <ImagePlus className="h-4 w-4" />
          </button>
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            rows={2}
            placeholder="Ask about price, delivery, or live room perks..."
            className="min-h-[56px] flex-1 rounded-[22px] border border-border bg-background-elevated px-4 py-3 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--ring)]"
          />
          <button
            type="button"
            onClick={onSend}
            className="rounded-full bg-primary p-3 text-white"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FormBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel rounded-[30px] p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
      <div className="mt-6 grid gap-5">{children}</div>
    </div>
  );
}

function TextField({
  label,
  placeholder,
  multiline = false,
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          className="w-full rounded-[22px] border border-border bg-background-elevated px-4 py-3 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--ring)]"
        />
      ) : (
        <input
          placeholder={placeholder}
          className="w-full rounded-[22px] border border-border bg-background-elevated px-4 py-3 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--ring)]"
        />
      )}
    </label>
  );
}

function MarketplaceMessages({ compact = false }: { compact?: boolean }) {
  const activeConversationId = useHaggleStore(
    (state) => state.activeConversationId,
  );
  const setActiveConversationId = useHaggleStore(
    (state) => state.setActiveConversationId,
  );
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredConversations = useMemo(() => {
    if (!deferredQuery.trim()) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      `${conversation.sellerName} ${conversation.sellerTagline}`
        .toLowerCase()
        .includes(deferredQuery.toLowerCase()),
    );
  }, [deferredQuery]);

  const activeConversation =
    filteredConversations.find(
      (conversation) => conversation.id === activeConversationId,
    ) ?? filteredConversations[0];

  const [localMessages, setLocalMessages] = useState<
    Record<string, ChatMessage[]>
  >(Object.fromEntries(conversations.map((item) => [item.id, item.messages])));

  const thread = activeConversation
    ? {
        ...activeConversation,
        messages:
          localMessages[activeConversation.id] ?? activeConversation.messages,
      }
    : {
        ...conversations[0],
        messages:
          localMessages[conversations[0].id] ?? conversations[0].messages,
      };

  function sendDraft() {
    const trimmed = draft.trim();
    if (!trimmed || !thread) {
      return;
    }

    startTransition(() => {
      setLocalMessages((state) => ({
        ...state,
        [thread.id]: [
          ...(state[thread.id] ?? []),
          {
            id: nextMockId(thread.id),
            sender: "buyer",
            type: "text",
            text: trimmed,
            createdAt: "Now",
          },
        ],
      }));
      setDraft("");
    });
  }

  async function sendVoice({
    audioId,
    audioUrl,
  }: {
    audioId: string;
    audioUrl: string;
  }) {
    const threadId = thread.id;
    startTransition(() => {
      setLocalMessages((state) => ({
        ...state,
        [threadId]: [
          ...(state[threadId] ?? []),
          {
            id: nextMockId(threadId),
            sender: "buyer",
            type: "voice",
            audioId,
            audioUrl,
            createdAt: "Now",
          },
        ],
      }));
    });
  }

  return (
    <div
      className={cn(
        "grid gap-5",
        compact ? "lg:grid-cols-1" : "lg:grid-cols-[0.38fr_0.62fr]",
      )}
    >
      <div className="panel rounded-[34px] p-4">
        <div className="mb-4 rounded-[22px] border border-border bg-background-elevated px-4 py-3">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search messages"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
          {conversations
            .filter((conversation) => conversation.isOnline)
            .map((conversation) => (
              <button
                type="button"
                key={conversation.id}
                onClick={() => setActiveConversationId(conversation.id)}
                className="flex min-w-[110px] flex-col items-center rounded-[24px] bg-surface px-4 py-3 text-center"
              >
                <img
                  src={conversation.sellerAvatar}
                  alt={conversation.sellerName}
                  className="h-12 w-12 rounded-2xl object-cover"
                />
                <p className="mt-2 text-sm font-semibold">
                  {conversation.sellerName}
                </p>
                <p className="text-xs text-success">Online</p>
              </button>
            ))}
        </div>
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <button
              type="button"
              key={conversation.id}
              onClick={() => setActiveConversationId(conversation.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[24px] px-3 py-3 text-left",
                conversation.id === thread.id
                  ? "bg-primary/8"
                  : "bg-background-elevated hover:bg-surface",
              )}
            >
              <img
                src={conversation.sellerAvatar}
                alt={conversation.sellerName}
                className="h-12 w-12 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-semibold">
                    {conversation.sellerName}
                  </p>
                  <span className="text-xs text-muted">
                    {conversation.updatedAt}
                  </span>
                </div>
                <p className="truncate text-sm text-muted">
                  {conversation.messages.at(-1)?.text ?? "Voice note shared"}
                </p>
              </div>
              {conversation.unreadCount > 0 ? (
                <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white">
                  {conversation.unreadCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <MessageThread
        thread={thread}
        draft={draft}
        onDraftChange={setDraft}
        onSend={sendDraft}
        onSendVoice={sendVoice}
      />
    </div>
  );
}

const ProfilePage = () => {
  const savedIds = useHaggleStore((state) => state.savedItemIds);
  const reservedIds = useHaggleStore((state) => state.reservedLiveIds);
  const [tab, setTab] = useState<"Products" | "Negotiations" | "Saved">(
    "Products",
  );
  const [copied, setCopied] = useState(false);

  return (
    <WorkspaceFrame>
      <ContentSection className="pt-6">
        <div className="panel overflow-hidden rounded-[38px]">
          <div className="relative h-72 bg-[radial-gradient(circle_at_top_left,_rgba(244,77,36,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(107,78,255,0.24),_transparent_28%),linear-gradient(135deg,#1d1718,#2a1e22)]" />
          <div className="relative -mt-28 grid gap-6 px-6 pb-6 xl:grid-cols-[0.65fr_0.35fr]">
            <div className="flex items-end gap-4">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="h-28 w-28 rounded-[30px] border border-white/20 object-cover"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Seller workspace profile
                </p>
                <h1 className="mt-2 text-4xl font-semibold">
                  {currentUser.fullName}
                </h1>
                <p className="text-sm text-muted">
                  {currentUser.businessName} • {currentUser.username}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-start gap-3 xl:justify-end">
              <GhostButton href="/edit-profile" label="Edit profile" />
              <button
                type="button"
                onClick={() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                }}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
              >
                {copied ? "Copied seller URL" : "Share profile"}
              </button>
            </div>
          </div>
          <div className="grid gap-5 px-6 pb-6 sm:grid-cols-3">
            <MetricCard
              label="Saved deals"
              value={savedIds.length.toString()}
              detail="Items and rooms you want to revisit."
            />
            <MetricCard
              label="Upcoming lives"
              value={reservedIds.length.toString()}
              detail="Reserved sessions and reminder-ready tickets."
            />
            <MetricCard
              label="Rooms joined"
              value={currentUser.metrics.roomsJoined.toString()}
              detail="Buyer and seller room activity this month."
            />
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <div className="mb-5 flex flex-wrap gap-2">
          {(["Products", "Negotiations", "Saved"] as const).map((item) => (
            <Chip key={item} active={tab === item} onClick={() => setTab(item)}>
              {item}
            </Chip>
          ))}
        </div>

        {tab === "Products" ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {sellerProducts.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : tab === "Negotiations" ? (
          <div className="grid gap-5 xl:grid-cols-[0.58fr_0.42fr]">
            <div className="panel rounded-[34px] p-6">
              <SectionTitle
                title="Negotiation workspace"
                description="Start a room, review performance, and keep upcoming sessions in view."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard
                  label="Upcoming lives"
                  value="3"
                  detail="Sessions ready for promo and reminders."
                />
                <MetricCard
                  label="Offer rate"
                  value="47%"
                  detail="Buyers are making strong bids in your active rooms."
                />
                <MetricCard
                  label="Recent rooms"
                  value="8"
                  detail="Buyer and seller rooms from the last 14 days."
                />
                <MetricCard
                  label="Start live"
                  value="Ready"
                  detail="Room styling and title are already prepared."
                />
              </div>
            </div>
            <div className="panel rounded-[34px] p-6">
              <h3 className="text-xl font-semibold">Recent rooms</h3>
              <div className="mt-5 space-y-3">
                {allLiveSessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="rounded-[24px] bg-surface p-4"
                  >
                    <p className="font-semibold">{session.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {session.schedule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {sellerProducts
              .filter((item) => savedIds.includes(item.id))
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        )}
      </ContentSection>
    </WorkspaceFrame>
  );
}

export default ProfilePage