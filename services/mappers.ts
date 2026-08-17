// services/mappers.ts
// Anti-corruption layer: converts raw backend (snake_case, negotiation-native)
// responses into the existing frontend types every card/component already expects.
// Keep ALL backend-shape knowledge in this file. Components never see raw API data.

import { SellerProduct } from "@/types/product";
import { Negotiation } from "@/types/negotiation";
import { Media } from "@/types/common";

// --- Backend shapes (only what we read) -----------------------------------

interface BackendListing {
  id: string;
  seller_id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  starting_amount: string | null;
  lowest_amount: string | null;
  status: string;
  negotiation_style: string;
  tags: string | string[];
  save_count?: number;
  created_at: string;
  media?: { id: string; url: string; media_type: "image" | "video" }[];
}

interface BackendOffer {
  id: string;
  thread_id: string;
  sender_user_id: string;
  offer_kind: "offer" | "counter" | "accept" | "reject" | "instant_buy";
  amount: string;
  currency: string;
  created_at: string;
}

interface BackendNegotiationThread {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  status: "active" | "accepted" | "rejected" | "expired" | "cancelled";
  current_offer_amount: string;
  last_offer_at: string;
  // Only present if the caller also fetched/joined the listing.
  listing?: BackendListing;
  latest_offer?: BackendOffer;
}

// --- Mappers ----------------------------------------------------------------

export function mapListingToProduct(listing: BackendListing): SellerProduct {
  const images: Media[] = (listing.media ?? []).map((m) => ({
    id: m.id,
    url: m.url,
    type: m.media_type,
  }));

  return {
    id: listing.id,
    sellerId: listing.seller_id,
    slug: listing.slug,
    name: listing.title,
    description: listing.description,
    category: listing.category_id,
    images,
    // starting_amount is the seller's asking price; lowest_amount is never
    // sent to the client (it's the seller's private floor).
    price: listing.starting_amount ? Number(listing.starting_amount) : 0,
    negotiable: listing.negotiation_style !== "fixed",
    stockStatus: "In Stock", // listing_inventory not wired yet — hardcode until it is
    features: [],
    tags: Array.isArray(listing.tags) ? listing.tags : (listing.tags ?? "").split(",").filter(Boolean),
    saveCount: listing.save_count ?? 0,
    negotiationCount: 0, // requires a count query we haven't built yet — see note below
    createdAt: listing.created_at,
  };
}

const THREAD_STATUS_MAP: Record<BackendNegotiationThread["status"], Negotiation["status"]> = {
  active: "pending",
  accepted: "accepted",
  rejected: "rejected",
  expired: "rejected",
  cancelled: "rejected",
};

export function mapThreadToNegotiation(thread: BackendNegotiationThread): Negotiation {
  const askingPrice = thread.listing?.starting_amount
    ? Number(thread.listing.starting_amount)
    : Number(thread.current_offer_amount);

  const latestKind = thread.latest_offer?.offer_kind;

  return {
    id: thread.id,
    productId: thread.listing_id,
    sellerId: thread.seller_id,
    buyerId: thread.buyer_id,
    currentOffer: Number(thread.current_offer_amount),
    askingPrice,
    status:
      latestKind === "counter" && thread.status === "active"
        ? "countered"
        : THREAD_STATUS_MAP[thread.status],
    unreadCount: 0, // not tracked by negotiation_threads — comes from conversation_participants if/when threads are linked to a conversation
    latestMessage: "",
    updatedAt: thread.last_offer_at,
  };
}

// --- Seller / user mapper ----------------------------------------------

interface BackendUser {
  id: string;
  full_name?: string;
  username?: string;
  business_name?: string;
  avatar_url?: string;
  is_verified?: boolean;
}

export function mapUserToSeller(user: BackendUser) {
  // NOTE: followers, rating, response_time, and trust pills aren't modeled
  // on the backend yet (Section 22/23 territory, deferred post-MVP).
  // Honest placeholders here -- never invent numbers.
  return {
    id: user.id,
    name: user.full_name ?? user.username ?? "Seller",
    businessName: user.business_name ?? "",
    avatarUrl: user.avatar_url ?? "/placeholder-avatar.jpg",
    badge: user.is_verified ? "Verified seller" : "New seller",
    trustPills: user.is_verified ? ["Phone verified"] : [],
    followers: "—",
    rating: "—",
    responseTime: "—",
  };
}
