"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Handshake,
  ImageOff,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  X,
  History,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useHaggleStore } from "@/lib/app-store";
import {
  deleteMessage,
  editMessage,
  listConversations,
  listMessages,
  markMessageReceipt,
  sendMessage,
} from "@/services/conversations";
import {
  acceptOffer,
  counterOffer,
  createNegotiation,
  getDeal,
  getNegotiation,
  listOffers,
  rejectOffer,
  submitOffer,
  withdrawOffer,
} from "@/services/negotiations";
import { getListing, getAllListings } from "@/services/request";
import { getUserById } from "@/services/users";
import { formatPrice } from "@/lib/formatters";
import {
  resolveListingMediaUrl,
  type BackendListing,
} from "@/services/mappers";
import type {
  Conversation,
  Message,
  Offer,
  NegotiationThread,
  Deal,
} from "@/types";
import type { BackendUser } from "@/services/mappers";
import { cn } from "@/lib/utils";

type Filter = "all" | "buying" | "selling" | "unread";

function ContentSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-full w-full overflow-hidden">{children}</section>
  );
}

function mergeMessages(current: Message[], incoming: Message[]): Message[] {
  const byId = new Map<string, Message>(current.map((m) => [m.id, m]));
  incoming.forEach((msg) => {
    const existing = byId.get(msg.id);
    const incomingListing = (msg as any).listing;
    const existingListing = existing ? (existing as any).listing : undefined;
    if (!incomingListing && existingListing) {
      byId.set(msg.id, { ...(msg as any), listing: existingListing });
    } else {
      byId.set(msg.id, msg);
    }
  });
  return [...byId.values()].sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
}

function relativeTime(value?: string) {
  if (!value) return "";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "";
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function dateLabel(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

function messageTime(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function listingThumbnail(listing: BackendListing | null | undefined) {
  if (!listing) return "";
  const path =
    listing.thumbnail_url ||
    listing.medias?.[0]?.thumbnail_url ||
    listing.medias?.[0]?.url ||
    listing.media?.[0]?.thumbnail_url ||
    listing.media?.[0]?.url;
  if (!path) return "";
  try {
    return resolveListingMediaUrl(path);
  } catch {
    return path;
  }
}

function listingHasMedia(listing: BackendListing | null | undefined): boolean {
  return Boolean(listingThumbnail(listing));
}

/**
 * Pick the first candidate that has a resolvable thumbnail. Message payloads
 * sometimes embed a trimmed listing (no media), while the full listing lives
 * in page state or negotiation meta.
 */
function pickListingWithMedia(
  ...candidates: (BackendListing | null | undefined)[]
): BackendListing | null {
  let fallback: BackendListing | null = null;
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (listingHasMedia(candidate)) return candidate;
    if (!fallback) fallback = candidate;
  }
  return fallback;
}

function getListingAttributes(listing: BackendListing | null): string[] {
  if (!listing || !listing.tags || typeof listing.tags !== "string") return [];
  return listing.tags
    .split("|")
    .map((tag) => tag.trim())
    .filter((tag) => tag.includes(":"))
    .slice(0, 2)
    .map((tag) => tag.replace(":", ": "));
}

function sameEvent(left: Message, right: Message) {
  return (
    left.messageType === right.messageType &&
    left.textBody === right.textBody &&
    JSON.stringify(left.metadataJson ?? {}) ===
      JSON.stringify(right.metadataJson ?? {})
  );
}

function isTimelineEvent(message: Message) {
  return (
    message.messageType === "system" ||
    message.messageType === "negotiation_event" ||
    message.messageType === "deal_event"
  );
}

function messageNegotiationId(message: any): string | null {
  if (!message) return null;
  const rootCandidates = [
    message.negotiationThreadId,
    message.negotiation_thread_id,
    message.negotiationId,
    message.negotiation_id,
  ];
  for (const v of rootCandidates) {
    if (typeof v === "string" && v.length > 0) return v;
  }
  const msgType = message.messageType ?? message.message_type;
  if (msgType === "negotiation_event") {
    const containers = [message.metadataJson, message.metadata_json];
    for (let c of containers) {
      if (!c) continue;
      if (typeof c === "string") {
        try {
          c = JSON.parse(c);
        } catch {
          continue;
        }
      }
      if (typeof c !== "object") continue;
      const metaCandidates = [
        c.negotiation_thread_id,
        c.negotiationThreadId,
        c.negotiation_id,
        c.negotiationId,
      ];
      for (const v of metaCandidates) {
        if (typeof v === "string" && v.length > 0) return v;
      }
    }
  }
  return null;
}

/**
 * Bulletproof sender extraction. Tries every plausible field name AND handles
 * nested object shapes like `{ sender: { id } }`.
 */
function getOfferSenderId(offer: any): string | null {
  if (!offer) return null;
  const candidates = [
    offer.senderId,
    offer.sender_id,
    offer.sender_user_id,
    offer.senderUserId,
    offer.offer_sender_id,
    offer.offered_by,
    offer.offered_by_user_id,
    offer.userId,
    offer.user_id,
    offer.sender?.id,
    offer.user?.id,
  ];
  for (const v of candidates) {
    if (typeof v === "string" && v.length > 0) return v;
    if (v && typeof v === "object" && typeof (v as any).id === "string") {
      return (v as any).id;
    }
  }
  return null;
}

function normalizeStatus(status: any): string {
  return String(status ?? "").toLowerCase();
}

/**
 * Determine the effective sender of the pending offer. First tries the offer's
 * own sender field. If that fails, infers from the offer history position —
 * in a two-party negotiation, offers alternate buyer → seller → buyer → ...
 */
function resolvePendingOfferSender(
  offer: Offer | null | undefined,
  negotiation: NegotiationThread | null | undefined,
  offerHistory: Offer[] | undefined,
): string | null {
  if (!offer) return null;

  const direct = getOfferSenderId(offer);
  if (direct) return direct;

  // Fallback: infer from position in history
  if (negotiation && offerHistory && offerHistory.length > 0) {
    const idx = offerHistory.findIndex((o) => o.id === offer.id);
    if (idx >= 0) {
      // In a two-party flow, buyer makes the first move
      return idx % 2 === 0 ? negotiation.buyerId : negotiation.sellerId;
    }
  }

  return null;
}

function getStatusStyle(status: string) {
  switch (normalizeStatus(status)) {
    case "pending":
      return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    case "accepted":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "rejected":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "withdrawn":
      return "bg-neutral-500/15 text-neutral-400 border-neutral-500/30";
    case "countered":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    default:
      return "bg-white/10 text-neutral-300 border-transparent";
  }
}

type NegotiationMeta = {
  negotiation: NegotiationThread;
  offers: Offer[];
  latestOffer: Offer | null;
  pendingOffer: Offer | null;
  deal: Deal | null;
  listing: BackendListing | null;
};

export function MessagesPage({
  initialConversationId,
}: {
  compact?: boolean;
  initialConversationId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryConversationId = searchParams.get("conversationId") ?? undefined;
  const queryListingId = searchParams.get("listingId") ?? undefined;
  const queryNegotiationId = searchParams.get("negotiationId") ?? undefined;
  const currentUserId = useHaggleStore((state) => state.userData?.id);
  const setActivateAuth = useHaggleStore((state) => state.setActivateAuth);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(
    initialConversationId ?? null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loadingList, setLoadingList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [offerAmount, setOfferAmount] = useState("");
  const [offerCurrency, setOfferCurrency] = useState("NGN");
  const [negotiation, setNegotiation] = useState<NegotiationThread | null>(
    null,
  );
  const [offers, setOffers] = useState<Offer[]>([]);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [negotiationError, setNegotiationError] = useState("");
  const [listing, setListing] = useState<BackendListing | null>(null);
  const [participant, setParticipant] = useState<BackendUser | null>(null);

  const [counteringOfferId, setCounteringOfferId] = useState<string | null>(
    null,
  );
  const [counterAmount, setCounterAmount] = useState("");
  const [counterSubmitting, setCounterSubmitting] = useState(false);
  const [counterError, setCounterError] = useState("");
  const [actionPending, setActionPending] = useState<string | null>(null);

  const [negotiationMeta, setNegotiationMeta] = useState<
    Record<string, NegotiationMeta>
  >({});
  const fetchingMetaRef = useRef<Set<string>>(new Set());

  const [menuOpen, setMenuOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalListings, setModalListings] = useState<BackendListing[]>([]);
  const [fetchingListings, setFetchingListings] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null,
  );

  const [historyNegotiationId, setHistoryNegotiationId] = useState<
    string | null
  >(null);

  const activeConversation = conversations.find((item) => item.id === activeId);
  const participantId = activeConversation
    ? activeConversation.participants.find(
        (item) => item.userId !== currentUserId,
      )?.userId
    : undefined;
  const participantAvatar = participant?.profile?.avatar_url || "";

  const displayMessages = useMemo(
    () =>
      messages.filter(
        (message, index) =>
          !isTimelineEvent(message) ||
          index === 0 ||
          !sameEvent(message, messages[index - 1]),
      ),
    [messages],
  );

  const sortedOffers = useMemo(
    () =>
      [...offers].sort(
        (left, right) =>
          new Date(left.createdAt).getTime() -
          new Date(right.createdAt).getTime(),
      ),
    [offers],
  );

  // IMPORTANT: take the LATEST pending offer, not the first.
  // When the seller counters, the buyer's original offer often stays marked
  // "pending" in the backend while a new seller counteroffer is also pending.
  // Preferring the newest one reflects what the user actually needs to act on.
  const pendingOffer = useMemo(() => {
    for (let i = sortedOffers.length - 1; i >= 0; i--) {
      if (normalizeStatus(sortedOffers[i].status) === "pending") {
        return sortedOffers[i];
      }
    }
    return undefined;
  }, [sortedOffers]);

  const latestOffer = sortedOffers[sortedOffers.length - 1];
  const timelineRef = useRef<HTMLDivElement>(null);
  const negotiationRequestRef = useRef(0);
  const threadLoadingRef = useRef(false);
  const olderScrollPosition = useRef<{ height: number; top: number } | null>(
    null,
  );

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (filter === "unread" && conversation.unreadCount === 0) return false;
      if (filter === "buying" && conversation.sellerId === currentUserId)
        return false;
      if (filter === "selling" && conversation.sellerId !== currentUserId)
        return false;
      if (!query) return true;
      return [
        conversation.sellerName,
        conversation.lastMessagePreview,
        conversation.listingId,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [conversations, currentUserId, filter, search]);

  useEffect(() => {
    setNegotiationMeta({});
    fetchingMetaRef.current.clear();
  }, [activeId]);

  useEffect(() => {
    if (!messages.length) return;

    const uniqueNegIds = new Set<string>();
    messages.forEach((m) => {
      const id = messageNegotiationId(m);
      if (id) uniqueNegIds.add(id);
    });

    uniqueNegIds.forEach((negId) => {
      if (fetchingMetaRef.current.has(negId)) return;
      if (negotiationMeta[negId]) return;
      if (negId === negotiation?.id) return;

      fetchingMetaRef.current.add(negId);

      (async () => {
        try {
          const [neg, offs] = await Promise.all([
            getNegotiation(negId),
            listOffers(negId),
          ]);
          offs.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

          let nd = null;
          if (normalizeStatus(neg.status) === "accepted") {
            try {
              nd = await getDeal(negId);
            } catch {}
          }

          let list = null;
          const listId = (neg as any).listing_id ?? (neg as any).listingId;
          if (listId) {
            try {
              list = await getListing(listId);
            } catch {}
          }

          // Latest pending offer
          let latestPending: Offer | null = null;
          for (let i = offs.length - 1; i >= 0; i--) {
            if (normalizeStatus(offs[i].status) === "pending") {
              latestPending = offs[i];
              break;
            }
          }

          setNegotiationMeta((prev) => ({
            ...prev,
            [negId]: {
              negotiation: neg,
              offers: offs,
              latestOffer: offs[offs.length - 1] ?? null,
              pendingOffer: latestPending,
              deal: nd,
              listing: list,
            },
          }));
        } catch (e) {
          console.warn(`[MessagesPage] Meta fetch failed for ${negId}`, e);
        } finally {
          fetchingMetaRef.current.delete(negId);
        }
      })();
    });
  }, [messages, negotiation?.id, negotiationMeta]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    let active = true;
    void listConversations()
      .then((data) => {
        if (!active) return;
        setConversations(data);
        if (!initialConversationId && queryConversationId) {
          setActiveId(queryConversationId);
        } else if (
          !initialConversationId &&
          data[0] &&
          !window.matchMedia("(max-width: 1023px)").matches
        ) {
          setActiveId(data[0].id);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoadingList(false);
      });
    return () => {
      active = false;
    };
  }, [initialConversationId, queryConversationId, isMobile]);

  useEffect(() => {
    negotiationRequestRef.current += 1;
    if (queryNegotiationId) void loadNegotiation(queryNegotiationId);
  }, [queryNegotiationId]);

  useEffect(() => {
    if (!activeId) return;
    let active = true;
    threadLoadingRef.current = true;
    queueMicrotask(() => {
      if (active) setLoadingThread(true);
    });
    void listMessages(activeId)
      .then((loaded) => {
        if (!active) return;
        setNegotiation(null);
        setOffers([]);
        setDeal(null);
        if (!queryListingId) setListing(null);
        setMessages(loaded);
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === activeId
              ? { ...conversation, unreadCount: 0 }
              : conversation,
          ),
        );
        if (currentUserId) {
          void Promise.allSettled(
            loaded
              .filter(
                (message) =>
                  message.senderUserId !== currentUserId &&
                  !message.receipts.some(
                    (receipt) =>
                      receipt.userId === currentUserId &&
                      receipt.status === "read",
                  ),
              )
              .map((message) =>
                markMessageReceipt(activeId, message.id, "read"),
              ),
          );
        }

        if (!queryListingId) {
          const offerMsg = [...loaded]
            .reverse()
            .find((m) => m.messageType === "offer");
          const offerNegId = messageNegotiationId(offerMsg);

          if (offerNegId) {
            void loadNegotiation(offerNegId, loaded);
          } else {
            const event = [...loaded]
              .reverse()
              .find((message) => message.messageType === "negotiation_event");
            const eventNegId = messageNegotiationId(event);
            if (eventNegId) void loadNegotiation(eventNegId, loaded);
          }
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          threadLoadingRef.current = false;
          setLoadingThread(false);
        }
      });
    return () => {
      active = false;
    };
  }, [activeId, currentUserId, queryListingId]);

  async function loadNegotiation(
    negotiationId: string,
    sourceMessages?: Message[],
  ) {
    const requestId = negotiationRequestRef.current + 1;
    negotiationRequestRef.current = requestId;
    setNegotiation(null);
    setOffers([]);
    setDeal(null);
    setNegotiationError("");
    try {
      const nextNegotiation = await getNegotiation(negotiationId);
      if (requestId !== negotiationRequestRef.current) return;

      const nextOffers = await listOffers(negotiationId);
      if (requestId !== negotiationRequestRef.current) return;

      setNegotiation(nextNegotiation);
      setOffers(nextOffers);

      const pool = sourceMessages ?? messages;
      const sourceMsg = pool.find(
        (m) => messageNegotiationId(m) === negotiationId,
      );
      const msgListing = (sourceMsg as any)?.listing as
        | BackendListing
        | undefined;

      const targetListingId =
        msgListing?.id ??
        (nextNegotiation as any).listing_id ??
        (nextNegotiation as any).listingId ??
        queryListingId;

      const existingMatches =
        !!targetListingId && listing?.id === targetListingId;

      if (existingMatches && listingHasMedia(listing)) {
        // Already have a richer listing in state for this target; keep it.
      } else if (msgListing && listingHasMedia(msgListing)) {
        setListing(msgListing);
      } else if (targetListingId) {
        try {
          const nextListing = await getListing(targetListingId);
          if (requestId !== negotiationRequestRef.current) return;
          setListing(nextListing);
        } catch {
          if (requestId !== negotiationRequestRef.current) return;
          setListing(msgListing ?? (existingMatches ? listing : null));
        }
      } else if (msgListing) {
        setListing(msgListing);
      }

      if (normalizeStatus(nextNegotiation.status) === "accepted") {
        try {
          const nextDeal = await getDeal(negotiationId);
          if (requestId !== negotiationRequestRef.current) return;
          setDeal(nextDeal);
        } catch {
          if (requestId === negotiationRequestRef.current) setDeal(null);
        }
      }
    } catch {
      if (requestId !== negotiationRequestRef.current) return;
      setNegotiationError(
        "This negotiation could not be loaded. Check your connection and try again.",
      );
    }
  }

  async function refreshNegotiation(targetNegId: string) {
    try {
      if (targetNegId === negotiation?.id) {
        await loadNegotiation(targetNegId);
        return;
      }
      const [neg, offs] = await Promise.all([
        getNegotiation(targetNegId),
        listOffers(targetNegId),
      ]);
      offs.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      let nd = null;
      if (normalizeStatus(neg.status) === "accepted") {
        try {
          nd = await getDeal(targetNegId);
        } catch {}
      }

      let latestPending: Offer | null = null;
      for (let i = offs.length - 1; i >= 0; i--) {
        if (normalizeStatus(offs[i].status) === "pending") {
          latestPending = offs[i];
          break;
        }
      }

      setNegotiationMeta((prev) => ({
        ...prev,
        [targetNegId]: {
          negotiation: neg,
          offers: offs,
          latestOffer: offs[offs.length - 1] ?? null,
          pendingOffer: latestPending,
          deal: nd,
          listing: prev[targetNegId]?.listing ?? null,
        },
      }));
    } catch {
      // Ignore refresh errors
    }
  }

  useEffect(() => {
    if (!isProductModalOpen) return;
    let active = true;
    setFetchingListings(true);
    void getAllListings("product")
      .then((data) => {
        if (active) setModalListings(data);
      })
      .catch(() => {
        if (active) setModalListings([]);
      })
      .finally(() => {
        if (active) setFetchingListings(false);
      });
    return () => {
      active = false;
    };
  }, [isProductModalOpen]);

  useEffect(() => {
    if (!participantId) return;
    let active = true;
    void getUserById(participantId)
      .then((user) => {
        if (active) setParticipant(user);
      })
      .catch(() => {
        if (active) setParticipant(null);
      });
    return () => {
      active = false;
    };
  }, [participantId]);

  useEffect(() => {
    if (!queryListingId) return;
    if (listing?.id === queryListingId) return;

    let active = true;
    void getListing(queryListingId)
      .then((loadedListing) => {
        if (active) setListing(loadedListing);
      })
      .catch(() => {
        if (active) setListing(null);
      });
    return () => {
      active = false;
    };
  }, [queryListingId, listing?.id]);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (olderScrollPosition.current) {
      const { height, top } = olderScrollPosition.current;
      timeline.scrollTop = top + (timeline.scrollHeight - height);
      olderScrollPosition.current = null;
      return;
    }
    const distanceFromBottom =
      timeline.scrollHeight - timeline.scrollTop - timeline.clientHeight;
    if (messages.length <= 1 || distanceFromBottom < 180) {
      timeline.scrollTo({ top: timeline.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length, negotiation?.id, offers.length]);

  // Determine buyer vs. seller.
  //
  // We prefer `activeConversation.sellerId` because it is always present once
  // the conversation is loaded, whereas `negotiation` may briefly be null or
  // arrive with a trimmed payload. The final fallback is `false` (i.e. treat
  // as "not the buyer") so a seller landing from a cold page load never sees
  // the offer affordances flash before their role is known. Every buyer
  // action path already requires `activeId` + `conversations` to be resolved,
  // so the fallback branch is only reachable during initial load, where the
  // buttons shouldn't be shown anyway.
  const isSeller =
    activeConversation?.sellerId === currentUserId ||
    (!!negotiation && negotiation.sellerId === currentUserId);

  const isBuyer = activeConversation
    ? activeConversation.sellerId !== currentUserId
    : negotiation
      ? negotiation.sellerId !== currentUserId
      : false;

  // After the deal is accepted we still keep the plain text composer so the
  // two parties can keep chatting. Only the offer-making affordances (the
  // product/offer strip below the textarea) get hidden.
  const isDealAcceptedInComposer =
    normalizeStatus(negotiation?.status) === "accepted";

  const canSendOfferOnly =
    !!listing &&
    isBuyer &&
    !pendingOffer &&
    !!offerAmount.trim() &&
    !isDealAcceptedInComposer &&
    (!negotiation || normalizeStatus(negotiation.status) === "active");

  async function handleSend() {
    if (!activeId || (!draft.trim() && !canSendOfferOnly) || sending) return;

    setSending(true);
    setNegotiationError("");

    try {
      const isSubmittingOffer =
        !editingId &&
        !!listing &&
        isBuyer &&
        !pendingOffer &&
        !!offerAmount.trim() &&
        !isDealAcceptedInComposer &&
        (!negotiation || normalizeStatus(negotiation.status) === "active");

      let currentNeg = negotiation;

      // Validate before creating a negotiation thread.
      const amount = isSubmittingOffer ? Number(offerAmount) : null;

      if (
        isSubmittingOffer &&
        (amount === null || !Number.isFinite(amount) || amount <= 0)
      ) {
        setNegotiationError("Enter a valid offer amount.");
        return;
      }

      // Create a negotiation thread if one does not already exist.
      if (isSubmittingOffer && !currentNeg && listing) {
        currentNeg = await createNegotiation({
          conversation_id: activeId,
          listing_id: listing.id,
          quantity: 1,
        });

        setNegotiation(currentNeg);
        setOffers(await listOffers(currentNeg.id));

        router.replace(
          `/messages?conversationId=${encodeURIComponent(activeId)}&listingId=${encodeURIComponent(listing.id)}&negotiationId=${encodeURIComponent(currentNeg.id)}`,
        );
      }

      // Submit the structured offer.
      if (isSubmittingOffer && currentNeg && amount !== null) {
        await submitOffer(currentNeg.id, {
          amount,
          currency: offerCurrency,
        });

        setOfferAmount("");

        const nextOffers = await listOffers(currentNeg.id);
        setOffers(nextOffers);
      }

      if (editingId) {
        // Edit an existing message.
        const updated = await editMessage(activeId, editingId, draft.trim());

        if (updated) {
          setMessages((current) => mergeMessages(current, [updated]));
        }
      } else if (isSubmittingOffer && currentNeg) {
        // The backend creates the actual offer timeline event.
        // Only send a separate text message if the buyer included a note.
        if (draft.trim()) {
          const message = await sendMessage(activeId, {
            message_type: "text",
            text_body: draft.trim(),
            negotiation_thread_id: currentNeg.id,
          });

          if (message) {
            setMessages((current) => mergeMessages(current, [message]));
          }
        }

        // Reload messages so backend-generated negotiation events appear.
        const refreshedMessages = await listMessages(activeId);
        setMessages(refreshedMessages);

        // Keep the conversation list preview and timestamp in sync.
        const latestMessage = refreshedMessages[refreshedMessages.length - 1];

        if (latestMessage) {
          setConversations((current) =>
            current.map((conversation) =>
              conversation.id === activeId
                ? {
                    ...conversation,
                    lastMessagePreview:
                      latestMessage.textBody ?? "Negotiation update",
                    lastMessageAt: latestMessage.createdAt,
                  }
                : conversation,
            ),
          );
        }
      } else if (draft.trim()) {
        // Send a normal text message.
        const message = await sendMessage(activeId, {
          message_type: "text",
          text_body: draft.trim(),
        });

        if (message) {
          setMessages((current) => mergeMessages(current, [message]));

          setConversations((current) =>
            current.map((conversation) =>
              conversation.id === activeId
                ? {
                    ...conversation,
                    lastMessagePreview: message.textBody ?? "text",
                    lastMessageAt: message.createdAt,
                  }
                : conversation,
            ),
          );
        }
      }

      setDraft("");
      setEditingId(null);
      setMenuOpen(false);
    } catch (err) {
      console.error("Message/offer submission failed:", err);
      setNegotiationError("Something went wrong while sending the message.");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(message: Message) {
    if (!activeId) return;
    try {
      await deleteMessage(activeId, message.id);
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, deletedAt: new Date().toISOString(), textBody: null }
            : item,
        ),
      );
    } catch {
      // Error handled by service
    }
  }

  function handleSelectProduct(item: BackendListing) {
    setIsProductModalOpen(false);
    setExpandedProductId(null);
    setListing(item);
    setNegotiation(null);
    setOffers([]);
    setOfferAmount("");
    if (activeId) {
      router.replace(
        `/messages?conversationId=${encodeURIComponent(
          activeId,
        )}&listingId=${encodeURIComponent(item.id)}`,
      );
    }
  }

  function handleCancelDraft() {
    if (!activeId) return;

    router.replace(`/messages?conversationId=${encodeURIComponent(activeId)}`);

    setNegotiation(null);
    setOffers([]);
    setListing(null);
    setOfferAmount("");

    let latestId: string | null = null;
    const event = [...messages]
      .reverse()
      .find((m) => m.messageType === "negotiation_event");
    latestId = messageNegotiationId(event);
    if (!latestId) {
      const offerMsg = [...messages]
        .reverse()
        .find((m) => m.messageType === "offer");
      latestId = messageNegotiationId(offerMsg);
    }
    if (latestId) void loadNegotiation(latestId, messages);
  }

  async function handleOfferAction(
    action: "accept" | "reject" | "withdraw",
    offer: Offer,
    targetNegId: string,
  ) {
    const senderId = getOfferSenderId(offer);

    if (offer.status !== "pending") return;

    if (action === "withdraw" && senderId !== currentUserId) return;

    if (
      (action === "accept" || action === "reject") &&
      senderId === currentUserId
    ) {
      return;
    }

    setActionPending(offer.id);
    setNegotiationError("");

    try {
      if (action === "accept") {
        await acceptOffer(offer.id);
      } else if (action === "reject") {
        await rejectOffer(offer.id);
      } else {
        await withdrawOffer(offer.id);
      }

      await refreshNegotiation(targetNegId);

      if (activeId) {
        setMessages(await listMessages(activeId));
      }
    } catch (err) {
      console.error(`Offer ${action} failed:`, err);

      setNegotiationError(
        `Could not ${action} the offer. It may no longer be available.`,
      );
    } finally {
      setActionPending(null);
    }
  }

  function startCounter(offer: Offer) {
    setCounteringOfferId(offer.id);
    setCounterAmount(String(offer.amount));
    setCounterError("");
  }

  async function submitCounter(offer: Offer, targetNegId: string) {
    const amount = Number(counterAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setCounterError("Enter a valid amount.");
      return;
    }
    setCounterSubmitting(true);
    setCounterError("");
    try {
      await counterOffer(offer.id, { amount, currency: offer.currency });
      setCounteringOfferId(null);
      await refreshNegotiation(targetNegId);
      if (activeId) {
        setMessages(await listMessages(activeId));
      }
    } catch {
      setCounterError("Failed to submit counteroffer.");
    } finally {
      setCounterSubmitting(false);
    }
  }

  async function loadOlder() {
    if (!activeId || !messages[0] || loadingOlder) return;
    setLoadingOlder(true);
    const timeline = timelineRef.current;
    olderScrollPosition.current = {
      height: timeline?.scrollHeight ?? 0,
      top: timeline?.scrollTop ?? 0,
    };
    try {
      const older = await listMessages(activeId, {
        limit: 50,
        before: messages[0].createdAt,
      });
      if (older.length === 0) olderScrollPosition.current = null;
      setMessages((current) => mergeMessages(current, older));
    } finally {
      setLoadingOlder(false);
    }
  }

  const historyData = historyNegotiationId
    ? negotiationMeta[historyNegotiationId]
    : null;
  const historyListing = pickListingWithMedia(
    historyData?.listing,
    historyNegotiationId === negotiation?.id ? listing : null,
  );
  const historyDeal =
    historyData?.deal ||
    (historyNegotiationId === negotiation?.id ? deal : null);
  const historyOffers =
    historyData?.offers ||
    (historyNegotiationId === negotiation?.id ? sortedOffers : []);

  return (
    <AppShell>
      <ContentSection>
        <div className="flex h-[calc(100dvh-8rem)] max-h-full w-full min-h-0 overflow-hidden bg-transparent lg:h-screen">
          <aside
            className={cn(
              "min-h-0 w-full flex-col overflow-hidden bg-transparent px-3 py-3 lg:flex lg:w-[350px] lg:shrink-0 lg:border-r lg:border-[#333] lg:px-4 lg:py-4",
              activeId ? "hidden" : "flex",
            )}
          >
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-[#2A2A2A] px-3 py-2">
              <Search className="h-4 w-4 text-neutral-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations"
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-neutral-500"
              />
            </div>
            <div className="mb-3 flex gap-1 overflow-x-auto border-b border-[#2A2A2A] pb-3">
              {(["all", "buying", "selling", "unread"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize",
                    filter === item
                      ? "bg-[#F44D24] text-white"
                      : "bg-[#2A2A2A] text-neutral-400",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            {loadingList ? (
              <div className="space-y-2 px-1">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center gap-3 border-b border-[#2A2A2A] px-3 py-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-[#2A2A2A]" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-[#2A2A2A]" />
                      <div className="h-2.5 w-full rounded bg-[#2A2A2A]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <p className="px-3 py-4 text-sm text-neutral-400">
                No conversations found.
              </p>
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    type="button"
                    key={conversation.id}
                    onClick={() => {
                      setActiveId(conversation.id);
                      router.replace(
                        `/messages?conversationId=${encodeURIComponent(
                          conversation.id,
                        )}`,
                      );
                    }}
                    className={cn(
                      "w-full border-b border-[#2A2A2A] px-3 py-3 text-left transition",
                      conversation.id === activeId
                        ? "rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
                        : "hover:bg-[#1E1E1E]",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2A2A2A] text-xs font-bold text-[#F44D24]">
                        {(
                          conversation.id === activeId
                            ? participantAvatar
                            : conversation.participantAvatarUrl
                        ) ? (
                          <img
                            src={
                              conversation.id === activeId
                                ? participantAvatar
                                : conversation.participantAvatarUrl
                            }
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (conversation.id === activeId
                            ? (participant?.profile?.full_name ?? "")
                            : conversation.sellerName || "?"
                          )
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("")
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {conversation.id === activeId
                              ? (participant?.profile?.full_name ?? "")
                              : conversation.sellerName || "Unknown contact"}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="rounded-full bg-[#F44D24] px-2 py-0.5 text-[10px] font-bold text-white">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-[11px] text-neutral-400">
                          {conversation.lastMessagePreview ||
                            (conversation.listingId
                              ? "Negotiation started"
                              : "Start a conversation")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2 pl-12 text-[10px] text-neutral-500">
                      {conversation.listingId ? (
                        <span className="truncate text-[#F44D24]/80">
                          Product discussion
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="shrink-0">
                        {relativeTime(
                          conversation.lastMessageAt ?? conversation.createdAt,
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <main
            className={cn(
              "relative min-h-0 w-full flex-col overflow-hidden bg-transparent lg:flex",
              activeId ? "flex" : "hidden",
            )}
          >
            {!activeId ? (
              <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
                Select a conversation to start messaging.
              </div>
            ) : (
              <>
                <header className="shrink-0 border-b border-[#333] bg-transparent px-4 py-3 lg:px-8 lg:py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2A2A2A] font-semibold text-[#F44D24]">
                        {participantAvatar ? (
                          <img
                            src={participantAvatar}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          participant?.profile?.full_name
                            ?.split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("") || "?"
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {participant?.profile?.full_name ?? ""}
                        </p>
                        <p className="truncate text-xs text-neutral-400">
                          {activeConversation?.conversationType === "direct"
                            ? participantId === activeConversation.sellerId
                              ? "Seller"
                              : "Buyer"
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveId(null)}
                        className="rounded-md p-2 text-neutral-400 hover:bg-[#2A2A2A] lg:hidden"
                        aria-label="Back to conversations"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </header>

                <div
                  ref={timelineRef}
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-transparent px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8"
                >
                  {messages.length > 0 && (
                    <div className="flex justify-center mb-6">
                      <button
                        type="button"
                        onClick={() => void loadOlder()}
                        disabled={loadingOlder}
                        className="flex items-center gap-1 rounded-full bg-[#2A2A2A] px-3 py-1.5 text-[11px] font-medium text-neutral-400 transition hover:text-white"
                      >
                        <ChevronDown className="h-3 w-3" />
                        {loadingOlder
                          ? "Loading older messages..."
                          : "Load older messages"}
                      </button>
                    </div>
                  )}
                  {loadingThread ? (
                    <p className="text-center text-sm text-neutral-400">
                      Loading messages...
                    </p>
                  ) : messages.length === 0 ? (
                    <div className="mx-auto max-w-sm border border-dashed border-[#333] px-5 py-8 text-center">
                      <p className="text-sm font-semibold text-white">
                        Start the conversation
                      </p>
                      <p className="mt-1 text-xs leading-5 text-neutral-400">
                        {listing?.title
                          ? `You are discussing ${listing.title}.`
                          : "Send a message to begin this conversation."}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {displayMessages.map((message, index) => {
                        const previousMessage = displayMessages[index - 1];
                        const isMine = message.senderUserId === currentUserId;
                        const isEvent = isTimelineEvent(message);
                        const isOffer =
                          message.messageType === "offer" && !message.deletedAt;

                        const groupedWithPrevious =
                          index > 0 &&
                          !isEvent &&
                          previousMessage?.senderUserId ===
                            message.senderUserId &&
                          !isTimelineEvent(previousMessage) &&
                          dateLabel(previousMessage.createdAt) ===
                            dateLabel(message.createdAt);

                        const showDateSeparator =
                          index === 0 ||
                          dateLabel(message.createdAt) !==
                            dateLabel(displayMessages[index - 1].createdAt);

                        const msgNegId = messageNegotiationId(message);
                        const isActive = msgNegId === negotiation?.id;

                        const messagesForThisNeg = displayMessages.filter(
                          (m) => messageNegotiationId(m) === msgNegId,
                        );

                        // Only consider other *offer* messages when deciding
                        // "latest", so backend-inserted negotiation/deal events
                        // after the offer don't hide the card.
                        const offerMessagesForThisNeg =
                          messagesForThisNeg.filter(
                            (m) => m.messageType === "offer" && !m.deletedAt,
                          );
                        const isLatestOfferForNeg =
                          isOffer &&
                          !!msgNegId &&
                          offerMessagesForThisNeg[
                            offerMessagesForThisNeg.length - 1
                          ]?.id === message.id;

                        const embeddedListing = (message as any).listing as
                          | BackendListing
                          | null
                          | undefined;
                        const scopedListing = isActive
                          ? listing
                          : ((msgNegId
                              ? negotiationMeta[msgNegId]?.listing
                              : null) ?? null);
                        const renderListing = pickListingWithMedia(
                          scopedListing,
                          embeddedListing,
                        );

                        const metaLookup = msgNegId
                          ? negotiationMeta[msgNegId]
                          : undefined;

                        const renderNegotiation = isActive
                          ? negotiation
                          : (metaLookup?.negotiation ?? null);

                        const renderLatestOffer = isActive
                          ? latestOffer
                          : (metaLookup?.latestOffer ?? null);

                        const activePendingOffer = isActive
                          ? pendingOffer
                          : (metaLookup?.pendingOffer ?? null);

                        const dealForThisNeg = isActive
                          ? deal
                          : (metaLookup?.deal ?? null);

                        const targetNegId = renderNegotiation?.id ?? msgNegId;

                        // History — used for offer-actions fallback inference
                        const negOfferHistory =
                          metaLookup?.offers || (isActive ? sortedOffers : []);

                        // Effective pending-offer sender (robust + inferred)
                        const pendingSenderId = resolvePendingOfferSender(
                          activePendingOffer,
                          renderNegotiation,
                          negOfferHistory,
                        );

                        const isMyPendingOffer =
                          !!pendingSenderId &&
                          pendingSenderId === currentUserId;
                        const isTheirPendingOffer =
                          !!pendingSenderId &&
                          pendingSenderId !== currentUserId;

                        // Whether the negotiation allows actions
                        const negStatus = normalizeStatus(
                          renderNegotiation?.status,
                        );
                        const isNegActive =
                          negStatus === "active" ||
                          negStatus === "pending" ||
                          negStatus === "countered";
                        const isDealAccepted =
                          negStatus === "accepted" && !!dealForThisNeg;

                        const fallbackText = renderListing
                          ? `${renderListing.title} :Negotiation`
                          : "Negotiation";
                        const hasVisibleText =
                          message.textBody &&
                          message.textBody.trim() !== "" &&
                          message.textBody !== fallbackText;

                        const spacingClass = showDateSeparator
                          ? "mt-4"
                          : isEvent
                            ? "mt-4"
                            : groupedWithPrevious
                              ? "mt-0.5"
                              : "mt-4";

                        const attributes = getListingAttributes(renderListing);

                        return (
                          <div
                            key={message.id}
                            className={cn("flex flex-col", spacingClass)}
                          >
                            {showDateSeparator && (
                              <div className="mb-4 mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                                {dateLabel(message.createdAt)}
                              </div>
                            )}

                            {isEvent ? (
                              <div className="mx-auto flex max-w-md items-center justify-center gap-2 py-1 text-center text-[11px] text-neutral-500">
                                <span>
                                  {message.textBody || "Negotiation updated"}
                                </span>
                                {renderListing && ` · ${renderListing.title}`}
                                <span className="text-[10px] text-neutral-600">
                                  ·
                                </span>
                                <span className="text-[10px] text-neutral-600">
                                  {messageTime(message.createdAt)}
                                </span>
                              </div>
                            ) : isOffer ? (
                              isLatestOfferForNeg ? (
                                <div
                                  className={cn(
                                    "group relative flex w-fit min-w-[240px] max-w-[320px] sm:max-w-[340px] flex-col overflow-hidden rounded-2xl border shadow-sm",
                                    isMine
                                      ? "ml-auto border-[#F44D24]/30 bg-[#F44D24]/10 text-white rounded-tr-sm"
                                      : "mr-auto border-[#333] bg-[#2A2A2A] text-white rounded-tl-sm",
                                  )}
                                >
                                  <div className="flex items-center gap-2.5 p-2.5 border-b border-white/5">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/20">
                                      {listingThumbnail(renderListing) ? (
                                        <img
                                          src={listingThumbnail(renderListing)}
                                          alt=""
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <ImageOff className="h-4 w-4 opacity-50" />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-xs font-semibold">
                                        {renderListing?.title || "Product"}
                                      </p>
                                      <p
                                        className={cn(
                                          "truncate text-[10px]",
                                          isMine
                                            ? "text-white/70"
                                            : "text-neutral-400",
                                        )}
                                      >
                                        Qty: {renderNegotiation?.quantity || 1}
                                      </p>
                                      {attributes.length > 0 && (
                                        <p
                                          className={cn(
                                            "truncate text-[9px]",
                                            isMine
                                              ? "text-white/50"
                                              : "text-neutral-500",
                                          )}
                                        >
                                          {attributes.join(" · ")}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between gap-2 p-2.5 border-b border-white/5">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-bold tracking-tight">
                                        {renderLatestOffer
                                          ? formatPrice(
                                              renderLatestOffer.amount,
                                              renderLatestOffer.currency,
                                            )
                                          : "---"}
                                      </span>
                                      {renderListing?.starting_amount && (
                                        <span className="text-[9px] line-through opacity-50">
                                          {formatPrice(
                                            Number(
                                              renderListing.starting_amount,
                                            ),
                                            renderListing.price_currency ??
                                              "NGN",
                                          )}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                      <span
                                        className={cn(
                                          "inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                                          getStatusStyle(
                                            renderNegotiation?.status ||
                                              "pending",
                                          ),
                                        )}
                                      >
                                        {renderNegotiation?.status || "Pending"}
                                      </span>
                                      <span
                                        className={cn(
                                          "text-[9px]",
                                          isMine
                                            ? "text-white/50"
                                            : "text-neutral-500",
                                        )}
                                      >
                                        {messageTime(message.createdAt)}
                                      </span>
                                    </div>
                                  </div>

                                  {isDealAccepted && (
                                    <div className="border-t border-emerald-500/20 bg-emerald-500/10 px-2.5 py-2">
                                      <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Deal Accepted
                                      </div>
                                      <div className="mt-0.5 flex items-baseline justify-between gap-2">
                                        <p className="text-sm font-bold text-white">
                                          {formatPrice(
                                            dealForThisNeg!.agreedAmount,
                                            dealForThisNeg!.currency,
                                          )}
                                        </p>
                                        <p className="text-[10px] text-emerald-400/80">
                                          {dealForThisNeg!.quantity} item(s)
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {activePendingOffer &&
                                  targetNegId &&
                                  isNegActive ? (
                                    counteringOfferId ===
                                    activePendingOffer.id ? (
                                      <div className="p-2.5 bg-black/20 flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                          <input
                                            autoFocus
                                            type="number"
                                            min="1"
                                            value={counterAmount}
                                            onChange={(e) =>
                                              setCounterAmount(e.target.value)
                                            }
                                            placeholder="Amount"
                                            className="min-w-0 flex-1 rounded bg-[#1A1A1A] px-2 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#F44D24]"
                                          />
                                          <button
                                            onClick={() =>
                                              submitCounter(
                                                activePendingOffer,
                                                targetNegId,
                                              )
                                            }
                                            disabled={counterSubmitting}
                                            className="shrink-0 rounded bg-[#F44D24] px-2.5 py-1.5 text-[10px] font-semibold text-white disabled:opacity-50"
                                          >
                                            {counterSubmitting ? (
                                              <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                              "Submit"
                                            )}
                                          </button>
                                          <button
                                            onClick={() =>
                                              setCounteringOfferId(null)
                                            }
                                            disabled={counterSubmitting}
                                            className="shrink-0 rounded border border-white/20 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-white/10"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                        {counterError && (
                                          <p className="text-[9px] text-red-400">
                                            {counterError}
                                          </p>
                                        )}
                                      </div>
                                    ) : isMyPendingOffer ? (
                                      <div className="flex w-full items-center justify-center p-2 bg-black/10">
                                        <button
                                          type="button"
                                          disabled={
                                            actionPending ===
                                            activePendingOffer.id
                                          }
                                          onClick={() =>
                                            handleOfferAction(
                                              "withdraw",
                                              activePendingOffer,
                                              targetNegId,
                                            )
                                          }
                                          className="w-full flex justify-center items-center gap-1 rounded-md border border-red-400/30 px-2 py-1.5 text-[10px] font-semibold text-red-300 hover:bg-red-400/20 transition disabled:opacity-50"
                                        >
                                          {actionPending ===
                                            activePendingOffer.id && (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                          )}
                                          Withdraw Offer
                                        </button>
                                      </div>
                                    ) : isTheirPendingOffer ? (
                                      <div className="flex w-full items-center gap-1.5 p-2 bg-black/10">
                                        <button
                                          type="button"
                                          disabled={
                                            actionPending ===
                                            activePendingOffer.id
                                          }
                                          onClick={() =>
                                            handleOfferAction(
                                              "accept",
                                              activePendingOffer,
                                              targetNegId,
                                            )
                                          }
                                          className="flex-1 flex justify-center items-center gap-1 rounded-md bg-emerald-600 px-1 py-1.5 text-[10px] font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50"
                                        >
                                          {actionPending ===
                                            activePendingOffer.id && (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                          )}
                                          Accept
                                        </button>
                                        <button
                                          type="button"
                                          disabled={
                                            actionPending ===
                                              activePendingOffer.id ||
                                            counterSubmitting
                                          }
                                          onClick={() =>
                                            startCounter(activePendingOffer)
                                          }
                                          className="flex-1 rounded-md border border-white/20 px-1 py-1.5 text-[10px] font-semibold text-white hover:bg-white/10 transition disabled:opacity-50"
                                        >
                                          Counter
                                        </button>
                                        <button
                                          type="button"
                                          disabled={
                                            actionPending ===
                                            activePendingOffer.id
                                          }
                                          onClick={() =>
                                            handleOfferAction(
                                              "reject",
                                              activePendingOffer,
                                              targetNegId,
                                            )
                                          }
                                          className="flex-1 flex justify-center items-center gap-1 rounded-md border border-red-400/30 px-1 py-1.5 text-[10px] font-semibold text-red-300 hover:bg-red-400/20 transition disabled:opacity-50"
                                        >
                                          {actionPending ===
                                            activePendingOffer.id && (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                          )}
                                          Reject
                                        </button>
                                      </div>
                                    ) : (
                                      // Absolute fallback: sender unknown → show the
                                      // recipient actions (accept/counter/reject) which
                                      // is what users most commonly need.
                                      <div className="flex w-full items-center gap-1.5 p-2 bg-black/10">
                                        <button
                                          type="button"
                                          disabled={
                                            actionPending ===
                                            activePendingOffer.id
                                          }
                                          onClick={() =>
                                            handleOfferAction(
                                              "accept",
                                              activePendingOffer,
                                              targetNegId,
                                            )
                                          }
                                          className="flex-1 flex justify-center items-center gap-1 rounded-md bg-emerald-600 px-1 py-1.5 text-[10px] font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50"
                                        >
                                          Accept
                                        </button>
                                        <button
                                          type="button"
                                          disabled={
                                            actionPending ===
                                              activePendingOffer.id ||
                                            counterSubmitting
                                          }
                                          onClick={() =>
                                            startCounter(activePendingOffer)
                                          }
                                          className="flex-1 rounded-md border border-white/20 px-1 py-1.5 text-[10px] font-semibold text-white hover:bg-white/10 transition disabled:opacity-50"
                                        >
                                          Counter
                                        </button>
                                        <button
                                          type="button"
                                          disabled={
                                            actionPending ===
                                            activePendingOffer.id
                                          }
                                          onClick={() =>
                                            handleOfferAction(
                                              "reject",
                                              activePendingOffer,
                                              targetNegId,
                                            )
                                          }
                                          className="flex-1 flex justify-center items-center gap-1 rounded-md border border-red-400/30 px-1 py-1.5 text-[10px] font-semibold text-red-300 hover:bg-red-400/20 transition disabled:opacity-50"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    )
                                  ) : null}

                                  {hasVisibleText && (
                                    <div className="px-2.5 py-2 text-[12px] leading-4 bg-black/5">
                                      {message.textBody}
                                    </div>
                                  )}

                                  <div className="border-t border-white/5 bg-black/10 px-2.5 py-1.5 flex items-center justify-end">
                                    <button
                                      onClick={() =>
                                        setHistoryNegotiationId(msgNegId)
                                      }
                                      className="flex items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-white transition"
                                    >
                                      <History className="h-3 w-3" /> View
                                      History
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-1 py-1 text-center text-[11px] text-neutral-500">
                                  <span>
                                    Offer updated{" "}
                                    {hasVisibleText &&
                                      `: "${message.textBody}"`}
                                  </span>
                                  <span className="text-[10px] text-neutral-600">
                                    {messageTime(message.createdAt)}
                                  </span>
                                </div>
                              )
                            ) : (
                              <div
                                className={cn(
                                  "group relative flex w-fit max-w-[75%] flex-col px-3.5 py-2 text-[13.5px] leading-5 shadow-sm",
                                  isMine
                                    ? "ml-auto bg-[#F44D24]/15 text-white border border-[#F44D24]/30"
                                    : "mr-auto bg-[#2A2A2A] text-white border border-transparent",
                                  groupedWithPrevious
                                    ? isMine
                                      ? "rounded-2xl rounded-tr-sm"
                                      : "rounded-2xl rounded-tl-sm"
                                    : "rounded-2xl",
                                )}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {message.deletedAt
                                    ? "This message was deleted."
                                    : message.textBody}
                                </p>

                                <div
                                  className={cn(
                                    "mt-1 flex items-center justify-end gap-2 text-[10px]",
                                    isMine
                                      ? "text-white/50"
                                      : "text-neutral-500",
                                  )}
                                >
                                  <span>{messageTime(message.createdAt)}</span>

                                  {isMine && !message.deletedAt && (
                                    <span className="hidden gap-1 group-hover:flex">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingId(message.id);
                                          setDraft(message.textBody ?? "");
                                        }}
                                        aria-label="Edit message"
                                        className="hover:text-white"
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void handleDelete(message)
                                        }
                                        aria-label="Delete message"
                                        className="hover:text-white"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {negotiationError && (
                    <div className="mx-auto mt-4 flex max-w-2xl items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                      <span>{negotiationError}</span>
                      {negotiation && (
                        <button
                          type="button"
                          onClick={() => void loadNegotiation(negotiation.id)}
                          className="shrink-0 font-semibold text-red-400 underline hover:text-red-300"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="shrink-0 px-3 py-3 sm:px-6 sm:py-4 lg:px-8 border-t border-[#333] bg-[#1A1A1A]">
                  <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
                    {isBuyer && (
                      <div className="relative mb-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setMenuOpen(!menuOpen)}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 hover:bg-[#2A2A2A] hover:text-white"
                          aria-label="More options"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                        {menuOpen && (
                          <div className="absolute bottom-12 left-0 z-10 w-48 overflow-hidden rounded-lg border border-[#333] bg-[#2A2A2A] shadow-xl">
                            <button
                              type="button"
                              onClick={() => {
                                setMenuOpen(false);
                                setIsProductModalOpen(true);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-white hover:bg-[#1E1E1E]"
                            >
                              <Handshake className="h-4 w-4 text-[#F44D24]" />
                              Make an offer
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      {isBuyer &&
                        listing &&
                        !pendingOffer &&
                        !isDealAcceptedInComposer && (
                          <div className="flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg border border-white/10 border-l-[3px] border-l-[#F44D24] bg-[#1E1E1E] px-3 py-2 shadow-sm">
                            {listing && (
                              <div className="flex min-w-0 flex-1 items-center gap-2">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#2A2A2A]">
                                  {listingThumbnail(listing) ? (
                                    <img
                                      src={listingThumbnail(listing)}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <ImageOff className="h-4 w-4 text-neutral-500" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold text-white">
                                    {listing.title}
                                  </p>
                                  <p className="truncate text-[10px] text-neutral-400">
                                    {listing.starting_amount
                                      ? formatPrice(
                                          Number(listing.starting_amount),
                                          listing.price_currency ?? "NGN",
                                        )
                                      : "Price not listed"}
                                    {" · "}Qty {negotiation?.quantity || 1}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="hidden h-8 w-px shrink-0 bg-white/10 sm:block" />

                            {isBuyer &&
                            (!negotiation ||
                              normalizeStatus(negotiation.status) ===
                                "active") ? (
                              <div className="flex flex-1 items-center gap-2">
                                <Handshake className="h-4 w-4 shrink-0 text-[#F44D24]" />
                                <input
                                  value={offerAmount}
                                  onChange={(event) =>
                                    setOfferAmount(event.target.value)
                                  }
                                  type="number"
                                  min="1"
                                  placeholder="Offer amount"
                                  className="min-w-0 flex-1 rounded bg-[#2A2A2A] px-2 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#F44D24]"
                                />
                                <input
                                  value={offerCurrency}
                                  onChange={(event) =>
                                    setOfferCurrency(
                                      event.target.value.toUpperCase(),
                                    )
                                  }
                                  className="w-14 shrink-0 rounded bg-[#2A2A2A] px-2 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#F44D24]"
                                  aria-label="Currency"
                                />
                              </div>
                            ) : null}

                            <button
                              type="button"
                              onClick={handleCancelDraft}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-white/10 hover:text-white transition"
                              title="Cancel negotiation"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                      <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            void handleSend();
                          }
                        }}
                        rows={1}
                        placeholder={
                          editingId ? "Edit message..." : "Type a message..."
                        }
                        className="min-h-[44px] max-h-32 w-full flex-1 resize-none overflow-y-auto rounded-lg bg-[#2A2A2A] px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:ring-1 focus:ring-[#F44D24]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleSend()}
                      disabled={sending || (!draft.trim() && !canSendOfferOnly)}
                      className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F44D24] text-white transition hover:bg-[#d83e18] disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Send message"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {historyNegotiationId && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#333] bg-[#1A1A1A] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#333] px-5 py-4">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <History className="h-4 w-4 text-[#F44D24]" /> Negotiation
                      History
                    </h3>
                    <button
                      type="button"
                      onClick={() => setHistoryNegotiationId(null)}
                      className="rounded-full p-2 text-neutral-400 hover:bg-[#2A2A2A] hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5">
                    {historyListing && (
                      <div className="flex items-center gap-3 border-b border-[#333] pb-4 mb-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#2A2A2A]">
                          {listingThumbnail(historyListing) ? (
                            <img
                              src={listingThumbnail(historyListing)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageOff className="h-5 w-5 text-neutral-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {historyListing.title}
                          </p>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            Listed at{" "}
                            {historyListing.starting_amount
                              ? formatPrice(
                                  Number(historyListing.starting_amount),
                                  historyListing.price_currency ?? "NGN",
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    )}

                    {historyDeal ? (
                      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 mb-6">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <p className="font-semibold text-sm">Deal Accepted</p>
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">
                          {formatPrice(
                            historyDeal.agreedAmount,
                            historyDeal.currency,
                          )}
                        </p>
                        <p className="text-xs text-emerald-500/80">
                          Agreement reached for {historyDeal.quantity} item(s).
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-[#2A2A2A] border border-[#333] p-3 mb-6 flex items-center gap-2 text-neutral-300">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <p className="text-xs">
                          Status:{" "}
                          <span className="capitalize font-semibold">
                            {historyData?.negotiation.status || "Active"}
                          </span>
                        </p>
                      </div>
                    )}

                    <h4 className="text-xs font-semibold text-neutral-400 mb-3 uppercase tracking-wider">
                      Offer Progression
                    </h4>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#333] before:to-transparent">
                      {historyOffers.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic pl-6">
                          No offers made yet.
                        </p>
                      ) : (
                        historyOffers.map((offer, idx) => {
                          const resolvedSender = resolvePendingOfferSender(
                            offer,
                            historyData?.negotiation || negotiation,
                            historyOffers,
                          );
                          const isMineOffer =
                            !!resolvedSender &&
                            resolvedSender === currentUserId;
                          return (
                            <div
                              key={offer.id}
                              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                            >
                              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#1A1A1A] bg-[#333] text-neutral-400 shrink-0 z-10 shadow">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F44D24]"></span>
                              </div>
                              <div className="w-[calc(100%-2.5rem)] ml-3 p-3 rounded-lg border border-[#333] bg-[#222]">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-[11px] font-semibold text-neutral-300">
                                    {isMineOffer ? "You" : "Them"}
                                  </span>
                                  <span className="text-[10px] text-neutral-500">
                                    {messageTime(offer.createdAt)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <strong className="text-base text-white">
                                    {formatPrice(offer.amount, offer.currency)}
                                  </strong>
                                  <span
                                    className={cn(
                                      "text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border",
                                      getStatusStyle(offer.status),
                                    )}
                                  >
                                    {offer.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="p-4 border-t border-[#333]">
                    <button
                      onClick={() => setHistoryNegotiationId(null)}
                      className="w-full rounded-lg bg-[#2A2A2A] py-2.5 text-sm font-semibold text-white hover:bg-[#333]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isProductModalOpen && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                <div className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#333] bg-[#1A1A1A] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#333] px-5 py-4">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Select a Product
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Choose an item to start a new negotiation.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="rounded-full p-2 text-neutral-400 hover:bg-[#2A2A2A] hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3">
                    {fetchingListings ? (
                      <div className="flex h-40 items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F44D24] border-t-transparent" />
                      </div>
                    ) : modalListings.length === 0 ? (
                      <div className="flex h-40 flex-col items-center justify-center text-center">
                        <ImageOff className="mb-2 h-8 w-8 text-neutral-500" />
                        <p className="text-sm font-medium text-white">
                          No listings found
                        </p>
                        <p className="text-xs text-neutral-400">
                          There are no active products right now.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {modalListings.map((item) => {
                          const isExpanded = expandedProductId === item.id;
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "overflow-hidden rounded-xl border transition-colors",
                                isExpanded
                                  ? "border-[#F44D24]/50 bg-[#222]"
                                  : "border-[#333] bg-[#1E1E1E] hover:border-[#444]",
                              )}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedProductId(
                                    isExpanded ? null : item.id,
                                  )
                                }
                                className="flex w-full items-center gap-3 p-3 text-left"
                              >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#2A2A2A]">
                                  {listingThumbnail(item) ? (
                                    <img
                                      src={listingThumbnail(item)}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <ImageOff className="h-5 w-5 text-neutral-500" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-white">
                                    {item.title}
                                  </p>
                                  <p className="truncate text-xs text-[#F44D24] font-medium mt-0.5">
                                    {item.starting_amount
                                      ? formatPrice(
                                          Number(item.starting_amount),
                                          item.price_currency ?? "NGN",
                                        )
                                      : "Price not listed"}
                                  </p>
                                </div>
                                <div
                                  className={cn(
                                    "text-neutral-400 transition-transform duration-200",
                                    isExpanded && "rotate-180 text-white",
                                  )}
                                >
                                  <ChevronDown className="h-5 w-5" />
                                </div>
                              </button>

                              {isExpanded && (
                                <div className="border-t border-[#333] px-3 pb-3 pt-2">
                                  <p className="text-xs leading-relaxed text-neutral-400 mb-3">
                                    {item.description ||
                                      "No description provided."}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5 mb-3">
                                    {getListingAttributes(item).map(
                                      (attr, i) => (
                                        <span
                                          key={i}
                                          className="inline-flex items-center rounded border border-[#444] bg-[#2A2A2A] px-1.5 py-0.5 text-[9px] text-neutral-300"
                                        >
                                          {attr}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectProduct(item)}
                                    className="w-full rounded-lg bg-[#F44D24] py-2 text-xs font-semibold text-white hover:bg-[#d83e18] transition"
                                  >
                                    Select Product
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </ContentSection>
    </AppShell>
  );
}
