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
import {
  startTransition,
  useDeferredValue,
  useMemo,
  useState,
} from "react";

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
                  {(message.waveform ?? [6, 12, 16, 10, 20]).map((value, index) => (
                    <span key={`${message.id}-${index}`} style={{ height: value }} />
                  ))}
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
                <p className="mt-2 font-semibold">{getProductById(message.productId).name}</p>
                <p className="text-sm text-muted">{getProductById(message.productId).price}</p>
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

function MarketplaceMessages({
  compact = false,
}: {
  compact?: boolean;
}) {
  const activeConversationId = useHaggleStore((state) => state.activeConversationId);
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

  const [localMessages, setLocalMessages] = useState<Record<string, ChatMessage[]>>(
    Object.fromEntries(conversations.map((item) => [item.id, item.messages])),
  );

  const thread = activeConversation
    ? {
        ...activeConversation,
        messages: localMessages[activeConversation.id] ?? activeConversation.messages,
      }
    : {
        ...conversations[0],
        messages: localMessages[conversations[0].id] ?? conversations[0].messages,
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

  async function sendVoice({ audioId, audioUrl }: { audioId: string; audioUrl: string }) {
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
    <div className={cn("grid gap-5", compact ? "lg:grid-cols-1" : "lg:grid-cols-[0.38fr_0.62fr]")}>
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
                <p className="mt-2 text-sm font-semibold">{conversation.sellerName}</p>
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
                  <p className="truncate font-semibold">{conversation.sellerName}</p>
                  <span className="text-xs text-muted">{conversation.updatedAt}</span>
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

export function DashboardPage() {
  const liveNow = allLiveSessions.filter((item) => item.status === "Live now");
  const upcoming = allLiveSessions.filter((item) => item.status !== "Live now");

  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Home live feed"
        title="Tap into the rooms buyers are already crowding."
        description="A desktop-friendly live feed that keeps the product front and center, with seller trust and room energy never more than one click away."
        actions={
          <>
            <PrimaryButton href="/market" label="Browse market" icon={<Search className="h-4 w-4" />} />
            <GhostButton href="/negotiation-room" label="Open negotiation room" />
          </>
        }
      />

      <ContentSection>
        <div className="grid gap-5 xl:grid-cols-[0.66fr_0.34fr]">
          <div className="panel overflow-hidden rounded-[34px] bg-[#191214] p-5 text-white">
            <div className="grid gap-5 xl:grid-cols-[0.62fr_0.38fr]">
              <div className="relative overflow-hidden rounded-[28px]">
                <img
                  src={liveNow[0].coverImageUrl}
                  alt={liveNow[0].title}
                  className="h-full min-h-[420px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/18 to-transparent" />
                <div className="absolute left-5 top-5 flex gap-2">
                  <span className="rounded-full bg-danger px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    Live now
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    {liveNow[0].category}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                    Featured room
                  </p>
                  <h2 className="mt-3 max-w-xl text-3xl font-semibold">
                    {liveNow[0].title}
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-white/75">
                    {liveNow[0].preview}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <SellerIdentity seller={featuredSeller} compact />
                <div className="rounded-[28px] bg-white/7 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    Room stats
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-white/8 px-3 py-3">
                      <p className="text-xl font-semibold">{liveNow[0].participantCount}</p>
                      <p className="text-xs text-white/60">Watching</p>
                    </div>
                    <div className="rounded-2xl bg-white/8 px-3 py-3">
                      <p className="text-xl font-semibold">{liveNow[0].offerCount}</p>
                      <p className="text-xs text-white/60">Offers</p>
                    </div>
                    <div className="rounded-2xl bg-white/8 px-3 py-3">
                      <p className="text-xl font-semibold">{liveNow[0].saveCount}</p>
                      <p className="text-xs text-white/60">Saves</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[28px] bg-white/7 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    Quick actions
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/negotiation-room"
                      className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-foreground"
                    >
                      Join live room
                    </Link>
                    <Link
                      href="/conversation"
                      className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Message seller
                    </Link>
                    <Link
                      href="/product-detail"
                      className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white"
                    >
                      View item
                    </Link>
                  </div>
                </div>
                <div className="rounded-[28px] bg-white/7 p-5">
                  <ReminderChip text={liveNow[0].reminderMessage} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 xl:grid-cols-1">
            <MetricCard label="Rooms live" value="12" detail="Across beauty, decor, fashion, and tech tonight." />
            <MetricCard label="Reserved drops" value="4" detail="Your tickets are locked in and waiting." />
            <MetricCard label="Offer win rate" value="68%" detail="Compared with your last 10 active room bids." />
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <SectionTitle
          title="Live now"
          description="Rich discovery cards keep the live feed immersive without losing seller context."
          action={<PrimaryButton href="/market" label="See full market" icon={<ChevronRight className="h-4 w-4" />} />}
        />
        <div className="grid gap-5 xl:grid-cols-2">
          {liveNow.map((session) => (
            <LiveSessionCard key={session.id} session={session} />
          ))}
        </div>
      </ContentSection>

      <ContentSection className="pt-0">
        <SectionTitle
          title="Up next"
          description="Reserve spots, keep your reminders, and plan your next negotiation before the room opens."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {upcoming.map((session) => (
            <LiveSessionCard key={session.id} session={session} compact />
          ))}
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function MarketPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredProducts = useMemo(
    () =>
      sellerProducts.filter((product) => {
        const inCategory =
          activeCategory === "All" || product.category === activeCategory;
        const inQuery =
          !deferredSearch.trim() ||
          `${product.name} ${product.description}`
            .toLowerCase()
            .includes(deferredSearch.toLowerCase());
        return inCategory && inQuery;
      }),
    [activeCategory, deferredSearch],
  );

  const filteredServices = useMemo(
    () =>
      marketServices.filter((service) => {
        const inCategory =
          activeCategory === "All" || service.category === activeCategory;
        const inQuery =
          !deferredSearch.trim() ||
          `${service.name} ${service.description}`
            .toLowerCase()
            .includes(deferredSearch.toLowerCase());
        return inCategory && inQuery;
      }),
    [activeCategory, deferredSearch],
  );

  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Market"
        title="Products, services, ongoing rooms, and scheduled lives in one warm discovery loop."
        description="Search fast, switch categories, reserve reminders, and keep the app feeling like a premium consumer product instead of a dull catalog."
        actions={
          <>
            <PrimaryButton href="/market-search" label="Open dedicated search" icon={<Search className="h-4 w-4" />} />
            <GhostButton href="/reminders" label="View my tickets" />
          </>
        }
      />

      <ContentSection>
        <div className="panel rounded-[32px] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-[22px] border border-border bg-background-elevated px-4 py-3">
              <Search className="h-4 w-4 text-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, services, and live sessions"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip active>
                <SlidersHorizontal className="mr-1 inline h-4 w-4" />
                Filters
              </Chip>
              <Chip>
                <Flame className="mr-1 inline h-4 w-4" />
                Trending
              </Chip>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {marketCategories.map((category) => (
              <Chip
                key={category}
                active={category === activeCategory}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Chip>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <SectionTitle title="Products" description="Editorial-feeling product cards that keep seller identity close." />
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </ContentSection>

      <ContentSection className="pt-0">
        <SectionTitle title="Services" description="Skilled trades, beauty sessions, and creative work live alongside physical products." />
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </ContentSection>

      <ContentSection className="pt-0">
        <SectionTitle title="Ongoing and scheduled lives" description="Buyers can jump into current rooms or reserve upcoming ones without leaving the market." />
        <div className="grid gap-5 lg:grid-cols-3">
          {allLiveSessions.map((session) => (
            <LiveSessionCard key={session.id} session={session} compact />
          ))}
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function MarketSearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const recentSearches = useHaggleStore((state) => state.recentSearches);
  const addRecentSearch = useHaggleStore((state) => state.addRecentSearch);
  const removeRecentSearch = useHaggleStore((state) => state.removeRecentSearch);

  const filteredResults = useMemo(() => {
    if (!deferredQuery.trim()) {
      return searchResults;
    }

    return searchResults.filter((result) =>
      `${result.title} ${result.subtitle}`
        .toLowerCase()
        .includes(deferredQuery.toLowerCase()),
    );
  }, [deferredQuery]);

  function submitSearch(value: string) {
    addRecentSearch(value);
    setQuery(value);
  }

  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Market search"
        title="Search the whole marketplace without losing your momentum."
        description="Dedicated search keeps recent queries, suggestion shortcuts, and keyboard-friendly results all in one responsive page."
      />
      <ContentSection>
        <div className="panel rounded-[32px] p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(query);
            }}
            className="flex flex-col gap-4 lg:flex-row"
          >
            <div className="flex flex-1 items-center gap-3 rounded-[24px] border border-border bg-background-elevated px-4 py-4">
              <Search className="h-5 w-5 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, services, sellers, or live sessions"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            <button className="rounded-full bg-primary px-6 py-4 text-sm font-semibold text-white">
              Search now
            </button>
          </form>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">Recent searches</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => submitSearch(item)}
                      className="rounded-full border border-border bg-background-elevated px-4 py-2 text-sm font-medium"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => recentSearches.at(-1) && removeRecentSearch(recentSearches.at(-1)!)}
                  className="mt-3 text-sm font-semibold text-primary"
                >
                  Clear latest
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Suggestions</h3>
                <div className="mt-3 space-y-2">
                  {searchSuggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => submitSearch(suggestion)}
                      className="flex w-full items-center justify-between rounded-[22px] bg-surface px-4 py-3 text-left text-sm"
                    >
                      {suggestion}
                      <ChevronRight className="h-4 w-4 text-muted" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Results</h3>
              <div className="mt-3 grid gap-3">
                {filteredResults.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    className="panel flex items-center gap-4 rounded-[26px] p-4"
                  >
                    <img
                      src={result.imageUrl}
                      alt={result.title}
                      className="h-20 w-20 rounded-[22px] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {result.type}
                      </p>
                      <h4 className="mt-2 truncate text-lg font-semibold">{result.title}</h4>
                      <p className="truncate text-sm text-muted">{result.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-surface px-3 py-2 text-xs font-semibold text-muted">
                      {result.pill}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function ProductDetailPage({ productId }: { productId?: string }) {
  const product = productId ? getProductById(productId) : featuredProduct;
  const seller = sellerProfiles.find((s) => s.id === product.sellerId) ?? featuredSeller;
  const relatedLives = allLiveSessions.filter((session) => session.sellerId === seller.id);

  return (
    <WorkspaceFrame>
      <ContentSection className="pt-6">
        <div className="grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">
          <div className="panel overflow-hidden rounded-[36px]">
            <div className="relative h-[420px]">
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              <div className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {product.category}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="panel rounded-[34px] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Product detail
              </p>
              <h1 className="mt-4 text-4xl font-semibold">{product.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">{product.price}</span>
                <span className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-muted">{product.stockStatus}</span>
              </div>
              <p className="mt-5 text-sm leading-8 text-muted">{product.description} {product.negotiationNote}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {product.features.map((feature) => (
                  <span key={feature} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">{feature}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton href="/conversation" label="Message owner" icon={<Send className="h-4 w-4" />} />
                <GhostButton href="/seller-profile" label="Open seller profile" />
              </div>
            </div>
            <SellerIdentity seller={seller} />

            <OfferArea product={product} />
            <BundleSuggestions product={product} />
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <SectionTitle
          title="Related live sessions"
          description="Scheduled and current rooms connected to this seller stay visible from the detail page."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {relatedLives.map((session) => (
            <LiveSessionCard key={session.id} session={session} compact />
          ))}
        </div>
      </ContentSection>
      
    </WorkspaceFrame>
  );
}

export function ServiceDetailPage({ serviceId }: { serviceId?: string }) {
  const service = serviceId ? getServiceById(serviceId) : featuredService;
  const seller = sellerProfiles.find((profile) => profile.id === service.sellerId) ?? sellerProfiles[0];
  const relatedLives = allLiveSessions.filter((session) => session.sellerId === seller.id);

  return (
    <WorkspaceFrame>
      <ContentSection className="pt-6">
        <div className="grid gap-6 xl:grid-cols-[0.55fr_0.45fr]">
          <div className="panel overflow-hidden rounded-[36px]">
            <img src={service.imageUrl} alt={service.name} className="h-full min-h-[430px] w-full object-cover" />
          </div>
          <div className="space-y-5">
            <div className="panel rounded-[34px] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
                Service detail
              </p>
              <h1 className="mt-4 text-4xl font-semibold">{service.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white">{service.price}</span>
                <span className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-muted">{service.deliveryTime}</span>
              </div>
              <p className="mt-5 text-sm leading-8 text-muted">{service.description}</p>
              <div className="mt-5 rounded-[24px] bg-surface p-4">
                <p className="font-semibold">What is included</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.includes.map((item) => (
                    <span key={item} className="rounded-full bg-background-elevated px-3 py-1 text-xs font-medium text-muted">{item}</span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton href="/conversation" label="Request service" icon={<Send className="h-4 w-4" />} />
                <GhostButton href="/seller-profile" label="View seller profile" />
              </div>
            </div>
            <SellerIdentity seller={seller} />
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <SectionTitle title="Scheduled lives from this seller" description="Keep the service page connected to live sessions and reminder bookings." />
        <div className="grid gap-5 lg:grid-cols-2">
          {relatedLives.map((session) => (
            <LiveSessionCard key={session.id} session={session} compact />
          ))}
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function MessagesPage() {
  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Messages"
        title="Stay close to the sellers you’re negotiating with."
        description="Desktop gets the two-pane inbox, mobile keeps a stacked conversation flow, and voice-note style UI stays front and center."
      />
      <ContentSection>
        <MarketplaceMessages />
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function ConversationPage() {
  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Conversation"
        title="A focused thread for quick follow-up before the next offer round."
        description="The dedicated conversation route keeps seller context, shared product cards, and quick chips close by."
      />
      <ContentSection>
        <MarketplaceMessages compact />
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function SellerProfilePage() {
  const seller = featuredSeller;
  const [tab, setTab] = useState<"Products" | "Ongoing" | "Scheduled">(
    "Products",
  );
  const [following, setFollowing] = useState(true);

  return (
    <WorkspaceFrame>
      <ContentSection className="pt-6">
        <div className="panel overflow-hidden rounded-[38px]">
          <div className="relative h-72">
            <img
              src={seller.coverImageUrl}
              alt={seller.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex items-end gap-4">
                <img
                  src={seller.avatarUrl}
                  alt={seller.name}
                  className="h-24 w-24 rounded-[28px] border border-white/25 object-cover"
                />
                <div className="text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                    {seller.tradeMark}
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold">{seller.name}</h1>
                  <p className="mt-1 text-sm text-white/75">
                    {seller.businessName} • {seller.username}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setFollowing((value) => !value)}
                  className={cn(
                    "rounded-full px-5 py-3 text-sm font-semibold",
                    following ? "bg-white text-foreground" : "bg-primary text-white",
                  )}
                >
                  {following ? "Following" : "Follow seller"}
                </button>
                <GhostButton href="/conversation" label="Message seller" />
              </div>
            </div>
          </div>
          <div className="grid gap-6 px-6 py-6 xl:grid-cols-[0.62fr_0.38fr]">
            <div>
              <div className="flex flex-wrap gap-2">
                {seller.trustPills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-muted">
                {seller.bio}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MetricCard label="Followers" value={seller.followers} detail="People tracking drops and rooms." />
                <MetricCard label="Rating" value={seller.rating} detail="Based on negotiation and delivery feedback." />
                <MetricCard label="Response" value={seller.responseTime} detail="Average seller reply time." />
              </div>
            </div>
            <div className="rounded-[30px] bg-surface p-5">
              <p className="text-sm font-semibold">What this seller offers</p>
              <div className="mt-4 space-y-3">
                {seller.whatTheyOffer.map((offer) => (
                  <div key={offer} className="rounded-[20px] bg-background-elevated px-4 py-4 text-sm text-muted">
                    {offer}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <div className="mb-5 flex flex-wrap gap-2">
          {(["Products", "Ongoing", "Scheduled"] as const).map((item) => (
            <Chip key={item} active={tab === item} onClick={() => setTab(item)}>
              {item}
            </Chip>
          ))}
        </div>

        {tab === "Products" ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {seller.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : tab === "Ongoing" ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {seller.ongoingLives.map((session) => (
              <LiveSessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {seller.upcomingLives.map((session) => (
              <LiveSessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function ProfilePage() {
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
                <h1 className="mt-2 text-4xl font-semibold">{currentUser.fullName}</h1>
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
            <MetricCard label="Saved deals" value={savedIds.length.toString()} detail="Items and rooms you want to revisit." />
            <MetricCard label="Upcoming lives" value={reservedIds.length.toString()} detail="Reserved sessions and reminder-ready tickets." />
            <MetricCard label="Rooms joined" value={currentUser.metrics.roomsJoined.toString()} detail="Buyer and seller room activity this month." />
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
                <MetricCard label="Upcoming lives" value="3" detail="Sessions ready for promo and reminders." />
                <MetricCard label="Offer rate" value="47%" detail="Buyers are making strong bids in your active rooms." />
                <MetricCard label="Recent rooms" value="8" detail="Buyer and seller rooms from the last 14 days." />
                <MetricCard label="Start live" value="Ready" detail="Room styling and title are already prepared." />
              </div>
            </div>
            <div className="panel rounded-[34px] p-6">
              <h3 className="text-xl font-semibold">Recent rooms</h3>
              <div className="mt-5 space-y-3">
                {allLiveSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="rounded-[24px] bg-surface p-4">
                    <p className="font-semibold">{session.title}</p>
                    <p className="mt-1 text-sm text-muted">{session.schedule}</p>
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

export function RemindersPage() {
  const reservedIds = useHaggleStore((state) => state.reservedLiveIds);
  const reservedLives = allLiveSessions.filter((session) =>
    reservedIds.includes(session.id),
  );

  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="My tickets"
        title="Reserved live sessions, all in one place."
        description="This page keeps reminder-ready sessions visible, with empty-state warmth when the buyer hasn’t locked in anything yet."
      />
      <ContentSection>
        {reservedLives.length === 0 ? (
          <div className="panel rounded-[36px] p-10 text-center">
            <Ticket className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold">No reserved lives yet</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Explore scheduled rooms, reserve your seat, and your tickets will
              land here with seller previews and reminder messaging.
            </p>
            <div className="mt-6">
              <PrimaryButton href="/market" label="Browse live sessions" icon={<Search className="h-4 w-4" />} />
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {reservedLives.map((session) => (
              <LiveSessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function AnalyticsPage() {
  const chartBars = [42, 55, 51, 74, 68, 82, 77];

  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Analytics"
        title="Seller performance that feels polished, not spreadsheet-heavy."
        description="A quick overview of session performance, offer conversion, trust, and export-ready reporting."
        actions={<PrimaryButton href="/analytics" label="Export insights" icon={<Download className="h-4 w-4" />} />}
      />
      <ContentSection>
        <div className="grid gap-5 lg:grid-cols-4">
          <MetricCard label="Sessions run" value="18" detail="Lives hosted in the current performance window." />
          <MetricCard label="Offer rate" value="47%" detail="Share of viewers who entered at least one offer." />
          <MetricCard label="Return buyers" value="31%" detail="People coming back into multiple rooms." />
          <MetricCard label="Trust score" value="96" detail="Identity, moderation, and fulfillment metrics combined." />
        </div>
      </ContentSection>
      <ContentSection className="pt-0">
        <div className="grid gap-5 xl:grid-cols-[0.66fr_0.34fr]">
          <div className="panel rounded-[34px] p-6">
            <SectionTitle title="Session momentum" description="Mock chart area ready for a future analytics data pipeline." />
            <div className="mt-8 flex h-72 items-end gap-4 rounded-[28px] bg-surface p-6">
              {chartBars.map((bar, index) => (
                <div key={bar + index} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full rounded-t-[20px] bg-[linear-gradient(180deg,#ff8b4c,#f44d24)]"
                    style={{ height: `${bar * 2.2}px` }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    W{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel rounded-[34px] p-6">
            <SectionTitle title="Trust and safety" description="Metrics buyers care about before entering a room." />
            <div className="space-y-3">
              {[
                ["Verified identity", "Complete"],
                ["Fast dispute resolution", "Healthy"],
                ["Muted participant incidents", "Low"],
                ["Fulfillment reliability", "Excellent"],
              ].map(([label, status]) => (
                <div key={label} className="rounded-[24px] bg-surface px-4 py-4">
                  <p className="font-semibold">{label}</p>
                  <p className="mt-1 text-sm text-muted">{status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function CreateHubPage() {
  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Create hub"
        title="The seller studio for products, services, live schedules, and room atmosphere."
        description="This hub keeps creation flows premium and warm, with quick actions, workflow guidance, and a room preview before you go live."
        actions={
          <>
            <PrimaryButton href="/post-product" label="Post product" icon={<Sparkles className="h-4 w-4" />} />
            <GhostButton href="/schedule-live" label="Schedule live" />
          </>
        }
      />
      <ContentSection>
        <div className="grid gap-5 xl:grid-cols-[0.64fr_0.36fr]">
          <div className="panel rounded-[34px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em]">
              Seller studio card
            </p>
            <h2 className="mt-4 text-4xl font-semibold">Build a room buyers want to stay in.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7">
              From listing copy to atmosphere presets, the create hub is designed
              to make live commerce feel intentional and premium rather than rushed.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["/post-product", "Post product"],
                ["/add-service", "Add service"],
                ["/schedule-live", "Schedule live"],
                ["/room-styling", "Room styling"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-[26px] px-5 py-5 text-lg font-semibold backdrop-blur"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="panel rounded-[34px] p-6">
              <h3 className="text-xl font-semibold">Listing workflow</h3>
              <div className="mt-4 space-y-3">
                {[
                  "Describe the offer clearly",
                  "Set the negotiation angle",
                  "Attach room-ready visuals",
                  "Schedule buyer reminders",
                ].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-[22px] bg-surface px-4 py-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel rounded-[34px] p-6">
              <h3 className="text-xl font-semibold">Buyer-view room preview</h3>
              <div className="mt-4 rounded-[28px] bg-[#21181a] p-5 text-white">
                <p className="text-sm text-white/65">Warm social preset</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-[22px] bg-white/8 p-4">Stage</div>
                  <div className="rounded-[22px] bg-white/8 p-4">Chat</div>
                  <div className="rounded-[22px] bg-white/8 p-4">Offer rail</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function PostProductPage() {
  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Post product"
        title="Draft a listing that looks premium before the first negotiation even starts."
        description="Every field matches the README requirements: product name, category, pricing, condition, features, notes, and gallery-ready upload sections."
      />
      <ContentSection>
        <div className="grid gap-5 xl:grid-cols-[0.62fr_0.38fr]">
          <FormBlock title="Product info" description="Set the core details buyers should trust at a glance.">
            <TextField label="Product name" placeholder="Vintage Ceramic Story Vase" />
            <TextField label="Category" placeholder="Home Decor" />
            <TextField label="Price range" placeholder="$140 - $170" />
            <TextField label="Condition or stock status" placeholder="Limited studio stock" />
            <TextField label="Short description" placeholder="Describe the product in warm, buyer-friendly language." multiline />
          </FormBlock>
          <FormBlock title="Offer shaping" description="Add the details that make a negotiation room feel intentional.">
            <TextField label="Top features" placeholder="Hand-thrown finish, signed base, gift-ready packaging" multiline />
            <TextField label="Bundle or negotiation note" placeholder="Open to bundle pricing for two or more pieces." multiline />
            <TextField label="Cover image and gallery" placeholder="Upload entrypoint ready for future media APIs" multiline />
            <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
              Save product draft
            </button>
          </FormBlock>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function AddServicePage() {
  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Add service"
        title="Package a service so it feels just as premium as a product listing."
        description="Capture expertise, base price, delivery time, what’s included, target buyer, add-ons, and a visual preview."
      />
      <ContentSection>
        <div className="grid gap-5 xl:grid-cols-[0.62fr_0.38fr]">
          <FormBlock title="Service setup" description="Frame the offer clearly and keep the tone warm.">
            <TextField label="Service name" placeholder="Launch-ready Creator Branding" />
            <TextField label="Category or expertise" placeholder="Creative Services" />
            <TextField label="Base price" placeholder="From $420" />
            <TextField label="Delivery time" placeholder="4 days" />
            <TextField label="What is included" placeholder="Moodboard, story templates, mini brand guide" multiline />
          </FormBlock>
          <FormBlock title="Audience and upgrades" description="Tell buyers who this service is for and what extras they can unlock.">
            <TextField label="Who the service is for" placeholder="New sellers preparing for launch week" multiline />
            <TextField label="Add-ons or upgrades" placeholder="Express delivery, extra launch assets, room visuals" multiline />
            <TextField label="Portfolio image or preview" placeholder="Attach visuals or mock media notes" multiline />
            <button className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white">
              Save service draft
            </button>
          </FormBlock>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function ScheduleLivePage() {
  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Schedule live"
        title="Plan the live room buyers will actually reserve."
        description="This flow covers timing, duration, offer angle, focus item, and reminder copy so a seller can move from idea to ticket-ready room."
      />
      <ContentSection>
        <div className="grid gap-5 xl:grid-cols-[0.62fr_0.38fr]">
          <FormBlock title="Session planning" description="Name the live, set the timing, and shape the buyer promise.">
            <TextField label="Live title" placeholder="Soft Glam Friday With Live Shade Matching" />
            <TextField label="Date" placeholder="Saturday, May 16" />
            <TextField label="Time" placeholder="5:00 PM" />
            <TextField label="Expected duration" placeholder="45 minutes" />
            <TextField label="Product or service focus" placeholder="Glow Session Makeup Kit" />
          </FormBlock>
          <FormBlock title="Negotiation angle" description="Tell buyers why they should reserve before the room opens.">
            <TextField label="What buyers will see explained live" placeholder="Shade matching, routine flow, brush selection, finish options" multiline />
            <TextField label="Special offer or negotiation angle" placeholder="Brush upgrade for the first 10 buyers and live-only bundles" multiline />
            <TextField label="Reminder message" placeholder="Bring your skin tone reference in chat for the best shade match." multiline />
            <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
              Save live schedule
            </button>
          </FormBlock>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function RoomStylingPage() {
  const [selectedPreset, setSelectedPreset] = useState(roomPresets[0].id);

  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Room styling"
        title="Choose the atmosphere before you go live."
        description="Boutique calm, Studio focus, and Warm social each give sellers a distinct visual direction before the room opens."
      />
      <ContentSection>
        <div className="grid gap-5 xl:grid-cols-[0.58fr_0.42fr]">
          <div className="grid gap-5">
            {roomPresets.map((preset) => (
              <button
                type="button"
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                className={cn(
                  "panel rounded-[32px] p-6 text-left",
                  selectedPreset === preset.id && "ring-2 ring-primary",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                      {preset.name}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold">{preset.headline}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{preset.mood}</p>
                  </div>
                  <div className="flex gap-2">
                    {preset.previewColors.map((color) => (
                      <span
                        key={color}
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="panel rounded-[34px] bg-[#1d1718] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Buyer preview
            </p>
            <div className="mt-5 rounded-[30px] border border-white/10 bg-white/6 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold">
                  {roomPresets.find((preset) => preset.id === selectedPreset)?.name}
                </p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                  cinematic
                </span>
              </div>
              <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
                <div className="rounded-[24px] bg-black/30 p-4">Stage</div>
                <div className="space-y-3">
                  <div className="rounded-[20px] bg-black/30 p-4">Chat</div>
                  <div className="rounded-[20px] bg-black/30 p-4">Accepted buyers</div>
                </div>
              </div>
            </div>
            <button className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground">
              Apply room preset
            </button>
          </div>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function EditProfilePage() {
  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Edit profile"
        title="Update the public identity buyers and followers see."
        description="This page covers full name, username, business name, bio, visibility, and a save action for the seller workspace profile."
      />
      <ContentSection>
        <div className="grid gap-5 xl:grid-cols-[0.62fr_0.38fr]">
          <FormBlock title="Profile details" description="Keep the public seller identity polished and clear.">
            <TextField label="Full name" placeholder={currentUser.fullName} />
            <TextField label="Username" placeholder={currentUser.username} />
            <TextField label="Business name" placeholder={currentUser.businessName} />
            <TextField label="Bio" placeholder={currentUser.bio} multiline />
          </FormBlock>
          <FormBlock title="Visibility and sharing" description="Control how the public profile appears across the app.">
            <TextField label="Public profile visibility" placeholder="Visible to all marketplace buyers" />
            <TextField label="Share URL pattern" placeholder={`haggle.app/seller/${currentUser.username.replace("@", "")}`} />
            <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
              Save changes
            </button>
          </FormBlock>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function SavedPage() {
  const savedIds = useHaggleStore((state) => state.savedItemIds);
  const savedProducts = sellerProducts.filter((product) => savedIds.includes(product.id));
  const savedLives = allLiveSessions.filter((live) => savedIds.includes(live.id));

  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Saved deals"
        title="Everything worth revisiting, without the scroll hunt."
        description="Saved products and live rooms persist in client state so the buyer can return without losing momentum."
      />
      <ContentSection>
        <SectionTitle title="Saved products" />
        <div className="grid gap-5 lg:grid-cols-2">
          {savedProducts.length > 0 ? (
            savedProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="panel rounded-[30px] p-6 text-sm text-muted">
              No saved products yet.
            </div>
          )}
        </div>
      </ContentSection>
      <ContentSection className="pt-0">
        <SectionTitle title="Saved live rooms" />
        <div className="grid gap-5 lg:grid-cols-2">
          {savedLives.length > 0 ? (
            savedLives.map((session) => <LiveSessionCard key={session.id} session={session} compact />)
          ) : (
            <div className="panel rounded-[30px] p-6 text-sm text-muted">
              No saved live rooms yet.
            </div>
          )}
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function SettingsPage() {
  const theme = useHaggleStore((state) => state.theme);
  const toggleTheme = useHaggleStore((state) => state.toggleTheme);
  const [notifications, setNotifications] = useState(true);
  const [ticketAlerts, setTicketAlerts] = useState(true);
  const [cameraWarmth, setCameraWarmth] = useState(true);

  return (
    <WorkspaceFrame>
      <PageIntro
        eyebrow="Settings"
        title="Small controls that keep the marketplace feeling right."
        description="Theme persistence, ticket reminders, and interface preferences all stay easy to reach from the app shell."
      />
      <ContentSection>
        <div className="grid gap-5 xl:grid-cols-[0.5fr_0.5fr]">
          <div className="panel rounded-[34px] p-6">
            <SectionTitle title="Theme and interface" />
            <div className="space-y-3">
              {[
                {
                  label: "Theme mode",
                  value: theme === "dark" ? "Dark" : "Light",
                  action: (
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                      Toggle
                    </button>
                  ),
                },
                {
                  label: "Room warmth overlay",
                  value: cameraWarmth ? "On" : "Off",
                  action: (
                    <button
                      type="button"
                      onClick={() => setCameraWarmth((value) => !value)}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                    >
                      Switch
                    </button>
                  ),
                },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] bg-surface px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-muted">{item.value}</p>
                    </div>
                    {item.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel rounded-[34px] p-6">
            <SectionTitle title="Notifications and reminders" />
            <div className="space-y-3">
              {[
                {
                  label: "Marketplace notifications",
                  enabled: notifications,
                  toggle: () => setNotifications((value) => !value),
                },
                {
                  label: "Reserved ticket alerts",
                  enabled: ticketAlerts,
                  toggle: () => setTicketAlerts((value) => !value),
                },
              ].map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={item.toggle}
                  className="flex w-full items-center justify-between rounded-[24px] bg-surface px-4 py-4 text-left"
                >
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted">
                      {item.enabled ? "Enabled" : "Paused"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                      item.enabled
                        ? "bg-success/12 text-success"
                        : "bg-border text-muted",
                    )}
                  >
                    {item.enabled ? "On" : "Off"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}

export function NegotiationRoomPage() {
  const [mode, setMode] = useState<"buyer" | "seller">("buyer");
  const [offer, setOffer] = useState(138);
  const [participants, setParticipants] =
    useState<NegotiationParticipant[]>(negotiationParticipants);
  const [acceptedBuyerIds, setAcceptedBuyerIds] = useState<string[]>(["buyer-4"]);
  const [raisedHand, setRaisedHand] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "room-1",
      sender: "system",
      type: "system",
      text: "Maria pinned the current asking lane at $145.",
      createdAt: "Now",
    },
    {
      id: "room-2",
      sender: "seller",
      type: "text",
      text: "Bundle buyers, drop your counter now and I’ll open shipping perks in two minutes.",
      createdAt: "Now",
    },
  ]);

  function addRoomMessage(message: ChatMessage) {
    setChatMessages((state) => [...state, message]);
  }

  function toggleMute(id: string) {
    setParticipants((state) =>
      state.map((participant) =>
        participant.id === id
          ? { ...participant, isMuted: !participant.isMuted }
          : participant,
      ),
    );
  }

  function acceptOffer(id: string) {
    setAcceptedBuyerIds((state) =>
      state.includes(id) ? state : [...state, id],
    );
    addRoomMessage({
      id: nextMockId(`accept-${id}`),
      sender: "system",
      type: "system",
      text: `${participants.find((participant) => participant.id === id)?.name} moved into the accepted buyers list.`,
      createdAt: "Now",
    });
  }

  function counterOffer(id: string) {
    const participant = participants.find((entry) => entry.id === id);
    if (!participant) {
      return;
    }

    addRoomMessage({
      id: nextMockId(`counter-${id}`),
      sender: "system",
      type: "system",
      text: `Counter offer sent to ${participant.name} at $${participant.offer + 8}.`,
      createdAt: "Now",
    });
  }

  return (
    <WorkspaceFrame>
      <ContentSection className="pt-6">
        <div className="overflow-hidden rounded-[38px] border border-white/10 bg-[#120d10] text-white shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
          <div className="grid gap-0 xl:grid-cols-[1fr_360px]">
            <div className="p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-danger px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    Live room
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    00:19:08
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    {participants.length + 142} participants
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Chip active={mode === "buyer"} onClick={() => setMode("buyer")}>
                    Buyer mode
                  </Chip>
                  <Chip active={mode === "seller"} onClick={() => setMode("seller")}>
                    Seller mode
                  </Chip>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
                <div className="space-y-5">
                  <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#201518]">
                    <img
                      src={allLiveSessions[0].coverImageUrl}
                      alt={allLiveSessions[0].title}
                      className={cn(
                        "h-[440px] w-full object-cover transition duration-300",
                        frozen && "scale-[1.02] saturate-[0.8]",
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute left-5 top-5 flex gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                        {frozen ? "Feed frozen" : "Seller stage"}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                        {allLiveSessions[0].featuredItem}
                      </p>
                      <h1 className="mt-3 text-3xl font-semibold">
                        {allLiveSessions[0].title}
                      </h1>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                        {mode === "buyer"
                          ? "Use freeze and screenshot to capture details, then send those references into the room chat while the offer lane moves."
                          : "Seller mode keeps the stage large while your participant utilities and accepted buyer list stay one panel away."}
                      </p>
                    </div>
                  </div>

                  {mode === "buyer" ? (
                    <div className="panel rounded-[34px] bg-white/8 p-5 text-white">
                      <div className="grid gap-5 lg:grid-cols-[0.55fr_0.45fr]">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                            Make offer
                          </p>
                          <div className="mt-4 flex items-center gap-3">
                            <div className="rounded-[24px] bg-black/20 px-4 py-4 text-3xl font-semibold">
                              ${offer}
                            </div>
                            <input
                              type="range"
                              min={110}
                              max={180}
                              value={offer}
                              onChange={(event) => setOffer(Number(event.target.value))}
                              className="w-full accent-[var(--primary)]"
                            />
                          </div>
                          <div className="mt-5 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                addRoomMessage({
                                  id: nextMockId("offer"),
                                  sender: "buyer",
                                  type: "text",
                                  text: `Buyer counter sent at $${offer}.`,
                                  createdAt: "Now",
                                })
                              }
                              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
                            >
                              Send counter offer
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                addRoomMessage({
                                  id: nextMockId("buyer-accept"),
                                  sender: "buyer",
                                  type: "text",
                                  text: "Buyer accepted the seller offer.",
                                  createdAt: "Now",
                                })
                              }
                              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold"
                            >
                              Accept seller offer
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                            Controls
                          </p>
                          <div className="mt-4 grid grid-cols-3 gap-3">
                            {[
                              {
                                icon: raisedHand ? PauseCircle : Hand,
                                label: raisedHand ? "Lower hand" : "Raise hand",
                                action: () => setRaisedHand((value) => !value),
                              },
                              {
                                icon: frozen ? MonitorPlay : Square,
                                label: frozen ? "Unfreeze" : "Freeze",
                                action: () => setFrozen((value) => !value),
                              },
                                              {
                                                  icon: Camera,
                                                  label: "Screenshot",
                                                  action: async () => {
                                                    try {
                                                      const { id, objectUrl } = await saveImageFromUrl(allLiveSessions[0].coverImageUrl);
                                                      addRoomMessage({
                                                        id: nextMockId("screenshot"),
                                                        sender: "buyer",
                                                        type: "screenshot",
                                                        screenshotLabel: "Frame captured and attached to chat.",
                                                        screenshotId: id,
                                                        screenshotUrl: objectUrl,
                                                        createdAt: "Now",
                                                      });
                                                    } catch (err) {
                                                      addRoomMessage({
                                                        id: nextMockId("screenshot-fail"),
                                                        sender: "system",
                                                        type: "system",
                                                        text: "Screenshot failed to capture.",
                                                        createdAt: "Now",
                                                      });
                                                    }
                                                  },
                                                },
                              {
                                icon: MicOff,
                                label: "Mute",
                                action: () => undefined,
                              },
                              {
                                icon: VideoOff,
                                label: "Video",
                                action: () => undefined,
                              },
                              {
                                icon: Share2,
                                label: "Share room",
                                action: () =>
                                  addRoomMessage({
                                    id: nextMockId("share"),
                                    sender: "system",
                                    type: "system",
                                    text: "Room link copied for a buyer invite.",
                                    createdAt: "Now",
                                  }),
                              },
                            ].map((control) => {
                              const Icon = control.icon;

                              return (
                                <button
                                  type="button"
                                  key={control.label}
                                  onClick={control.action}
                                  className="rounded-[24px] bg-black/20 px-3 py-4 text-center"
                                >
                                  <Icon className="mx-auto h-5 w-5" />
                                  <p className="mt-2 text-xs font-medium text-white/80">
                                    {control.label}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="panel rounded-[34px] bg-white/8 p-5 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                        Participant grid
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {participants.map((participant) => (
                          <div key={participant.id} className="rounded-[28px] bg-black/22 p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={participant.imageUrl}
                                alt={participant.name}
                                className="h-14 w-14 rounded-2xl object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-semibold">{participant.name}</p>
                                <p className="text-sm text-white/65">
                                  Offer ${participant.offer}
                                </p>
                              </div>
                              {participant.isHandRaised ? (
                                <span className="rounded-full bg-warning/20 px-3 py-1 text-xs font-semibold text-warning">
                                  Hand up
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => acceptOffer(participant.id)}
                                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold"
                              >
                                Accept offer
                              </button>
                              <button
                                type="button"
                                onClick={() => counterOffer(participant.id)}
                                className="rounded-full border border-white/12 px-4 py-2 text-xs font-semibold"
                              >
                                Counter offer
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleMute(participant.id)}
                                className="rounded-full border border-white/12 px-4 py-2 text-xs font-semibold"
                              >
                                {participant.isMuted ? "Unmute buyer" : "Mute buyer"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="rounded-[34px] border border-white/10 bg-white/6 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Room chat</p>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/65">
                        live
                      </span>
                    </div>
                    <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "rounded-[24px] px-4 py-3 text-sm leading-7",
                            message.sender === "buyer"
                              ? "bg-primary text-white"
                              : message.sender === "system"
                                ? "bg-white/8 text-white/75"
                                : "bg-black/18 text-white",
                          )}
                        >
                          {message.type === "screenshot" ? (
                            <div>
                              <p className="font-semibold">Screenshot attachment</p>
                              <p className="text-sm opacity-80">{message.screenshotLabel}</p>
                            </div>
                          ) : message.type === "voice" ? (
                            <div>
                              <p className="font-semibold">Voice note</p>
                              {message.audioUrl ? (
                                <audio controls src={message.audioUrl} className="mt-2 w-full" />
                              ) : (
                                <p className="text-sm opacity-80">Audio saved ({message.audioId})</p>
                              )}
                            </div>
                          ) : (
                            message.text
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-2 text-xs font-medium text-secondary">Record note</div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-2 text-xs font-medium text-secondary">Share item</div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-2 text-xs font-medium text-secondary">Ask about bundles</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <RecordingButton
                          onSave={async ({ id, objectUrl }) => {
                            addRoomMessage({
                              id: nextMockId("chat"),
                              sender: "buyer",
                              type: "voice",
                              audioId: id,
                              audioUrl: objectUrl,
                              createdAt: "Now",
                            });
                          }}
                        />
                        <button
                          type="button"
                          className="rounded-full border border-border bg-background-elevated p-3"
                          onClick={async () => {
                            const screenshot = await saveImageFromUrl(window.location.href + "?capture=room");
                            addRoomMessage({
                              id: nextMockId("chat"),
                              sender: "buyer",
                              type: "screenshot",
                              screenshotId: screenshot.id,
                              screenshotUrl: screenshot.objectUrl,
                              screenshotLabel: "Room snapshot",
                              createdAt: "Now",
                            });
                          }}
                        >
                          <ImagePlus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addRoomMessage({
                          id: nextMockId("chat"),
                          sender: "buyer",
                          type: "text",
                          text: "Can you show the texture up close before the next offer round?",
                          createdAt: "Now",
                        })
                      }
                      className="mt-4 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-foreground"
                    >
                      Send quick chat prompt
                    </button>
                  </div>

                  <div className="rounded-[34px] border border-white/10 bg-white/6 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Accepted buyers</p>
                      <Timer className="h-4 w-4 text-white/65" />
                    </div>
                    <div className="mt-4 space-y-3">
                      {acceptedBuyerIds.map((buyerId) => {
                        const buyer = participants.find((item) => item.id === buyerId);
                        if (!buyer) {
                          return null;
                        }

                        return (
                          <div key={buyerId} className="rounded-[22px] bg-black/20 px-4 py-3">
                            <p className="font-semibold">{buyer.name}</p>
                            <p className="text-sm text-white/65">Accepted at ${buyer.offer}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </WorkspaceFrame>
  );
}
