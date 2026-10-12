// services/mappers.ts
// Anti-corruption layer: converts raw backend (snake_case, negotiation-native)
// responses into the existing frontend types every card/component already expects.
// Keep ALL backend-shape knowledge in this file. Components never see raw API data.

import { SellerProduct } from "@/types/product";
import { MarketService } from "@/types/service";
import { Negotiation } from "@/types/negotiation";
import { Media } from "@/types/common";

// --- Backend shapes (only what we read) -----------------------------------

export interface BackendListing {
  id: string;
  seller_id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  listing_type?: string;
  starting_amount: string | null;
  inventory_count?: number | null;
  target_audience?: string | null;
  delivery_duration?: string | null;
  work_place?: string | null;
  work_address?: string | null;
  lowest_amount?: string | null;
  auto_decline_amount?: string | null;
  price_currency?: string;
  status?: string;
  negotiation_style: string;
  negotiation_note?: string | null;
  tags: string | string[] | null;
  save_count?: number;
  created_at: string;
  thumbnail_url?: string | null;
  cover_media_id?: string | null;
  medias?: BackendListingMedia[];
  media?: BackendListingMedia[];
}

export interface BackendCategory {
  id: string;
  parent_id?: string | null;
  name: string;
  slug: string;
  kind: string;
  status?: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendListingMedia {
  id: string;
  url: string;
  thumbnail_url?: string | null;
  media_type: "IMAGE" | "VIDEO" | "image" | "video";
  sort_order?: number;
  is_cover?: boolean;
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
  listing?: BackendListing;
  latest_offer?: BackendOffer;
}

function resolveListingMediaUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;

  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!r2PublicUrl) {
    throw new Error(
      "NEXT_PUBLIC_R2_PUBLIC_URL is required to display uploaded listing media",
    );
  }

  const publicUrl = new URL(r2PublicUrl);
  if (publicUrl.protocol !== "http:" && publicUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL must use HTTP or HTTPS");
  }

  return new URL(
    path.replace(/^\/+/, ""),
    `${publicUrl.toString().replace(/\/+$/, "")}/`,
  ).toString();
}

// --- Mappers ----------------------------------------------------------------

export function mapListingToProduct(listing: BackendListing): SellerProduct {
  const inventoryCount = Math.max(0, listing.inventory_count ?? 0);
  const thumbnailUrl = listing.thumbnail_url?.trim();
  const listingMedia = [...(listing.medias ?? listing.media ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  const images: Media[] = listingMedia.map((media, index) => ({
    id: media.id,
    url: resolveListingMediaUrl(media.url),
    type: media.media_type.toLowerCase() === "video" ? "video" : "image",
    isCover:
      media.is_cover === true ||
      (thumbnailUrl ? media.url === thumbnailUrl : index === 0),
  }));
  const rawTags = Array.isArray(listing.tags)
    ? listing.tags
    : (listing.tags ?? "").split("|");
  const tags = rawTags
    .map((tag) => {
      const separator = tag.indexOf(":");
      return (separator >= 0 ? tag.slice(separator + 1) : tag).trim();
    })
    .filter(Boolean);

  return {
    id: listing.id,
    sellerId: listing.seller_id,
    slug: listing.slug,
    name: listing.title,
    description: listing.description,
    category: listing.category_id,
    imageUrl: thumbnailUrl
      ? resolveListingMediaUrl(thumbnailUrl)
      : images.find((image) => image.isCover)?.url ?? images[0]?.url,
    images,
    // starting_amount is the seller's asking price; lowest_amount is never
    // sent to the client (it's the seller's private floor).
    price:
      listing.starting_amount === null
        ? ""
        : Number(listing.starting_amount),
    priceCurrency: listing.price_currency ?? "NGN",
    negotiable: listing.negotiation_style !== "fixed",
    inventoryCount,
    stockStatus:
      inventoryCount === 0
        ? "Out of stock"
        : inventoryCount <= 10
          ? `Only ${inventoryCount} left in stock`
          : "In stock",
    features: tags,
    negotiationNote: listing.negotiation_note ?? "",
    tags,
    saveCount: listing.save_count ?? 0,
    negotiationCount: 0,
    createdAt: listing.created_at,
  };
}

export function mapListingToService(
  listing: BackendListing,
  categoryName = listing.category_id,
): MarketService {
  const thumbnailUrl = listing.thumbnail_url?.trim();
  const listingMedia = [...(listing.medias ?? listing.media ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  const coverMedia =
    listingMedia.find((media) => media.is_cover) ?? listingMedia[0];
  const rawTags = Array.isArray(listing.tags)
    ? listing.tags
    : (listing.tags ?? "").split("|");
  const includes = rawTags
    .map((tag) => {
      const separator = tag.indexOf(":");
      return (separator >= 0 ? tag.slice(separator + 1) : tag).trim();
    })
    .filter(Boolean);
  const workPlace = listing.work_place?.toUpperCase();
  const negotiationStyle = listing.negotiation_style.toUpperCase();

  return {
    id: listing.id,
    sellerId: listing.seller_id,
    name: listing.title,
    description: listing.description,
    category: categoryName,
    imageUrl: thumbnailUrl
      ? resolveListingMediaUrl(thumbnailUrl)
      : coverMedia
        ? resolveListingMediaUrl(coverMedia.url)
        : "/placeholder-product.jpg",
    price: listing.starting_amount ?? "",
    deliveryTime: listing.delivery_duration ?? "",
    audience: listing.target_audience ?? "",
    includes,
    priceCurrency: listing.price_currency ?? "NGN",
    negotiable: negotiationStyle === "NEGOTIABLE" || negotiationStyle === "COUNTER",
    workPlace:
      workPlace === "REMOTE"
        ? "Remote"
        : workPlace === "ON_SITE"
          ? "On-site"
          : workPlace ?? "",
    workAddress: listing.work_address ?? "",
    negotiationNote: listing.negotiation_note ?? "",
    gallery: listingMedia
      .map((media) => resolveListingMediaUrl(media.url))
      .filter((url) => url !== (thumbnailUrl ? resolveListingMediaUrl(thumbnailUrl) : "")),
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
