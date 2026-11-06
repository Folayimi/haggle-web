import apiClient from "./client";
import { notifyApiError } from "./toastify";
import type { Deal, NegotiationThread, Offer } from "@/types";

type JsonRecord = Record<string, unknown>;
const record = (value: unknown): JsonRecord =>
  value && typeof value === "object" ? (value as JsonRecord) : {};
const value = (response: { data?: unknown }) =>
  record(response.data).data ?? response.data;

function errorMessage(error: unknown, fallback: string) {
  const item = record(error);
  const response = record(item.response);
  const data = record(response.data);
  const status = Number(response.status);
  const detail = data.error ?? data.message;
  if (
    typeof detail === "string" &&
    detail.trim() &&
    !/failed query|select .* from|params:/i.test(detail)
  ) {
    return detail;
  }
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403)
    return "You do not have permission to change this negotiation.";
  if (status === 404) return "This negotiation is no longer available.";
  if (status === 422)
    return "The negotiation request was not accepted. Check the amount and listing details.";
  return fallback;
}

async function request<T>(
  operation: () => Promise<{ data?: unknown }>,
  fallback: string,
  normalize: (data: unknown) => T,
): Promise<T> {
  try {
    return normalize(value(await operation()));
  } catch (error) {
    notifyApiError(error, errorMessage(error, fallback));
    throw error;
  }
}

const normalizeNegotiation = (input: unknown): NegotiationThread => {
  const item = record(input);
  const listing = record(item.listing);
  return {
    id: String(item.id ?? ""),
    conversationId: String(item.conversation_id ?? item.conversationId ?? ""),
    listingId: String(item.listing_id ?? item.listingId ?? ""),
    buyerId: String(item.buyer_id ?? item.buyerId ?? ""),
    sellerId: String(item.seller_id ?? item.sellerId ?? ""),
    quantity: Number(item.quantity ?? 1),
    variantSnapshot:
      item.variant_snapshot && typeof item.variant_snapshot === "object"
        ? (item.variant_snapshot as Record<string, string>)
        : null,
    status: String(item.status ?? "active") as NegotiationThread["status"],
    createdAt: String(item.created_at ?? item.createdAt ?? ""),
    updatedAt: String(item.updated_at ?? item.updatedAt ?? ""),
    expiresAt: (item.expires_at as string | null) ?? null,
    listing: item.listing
      ? {
          id: String(listing.id ?? ""),
          title: typeof listing.title === "string" ? listing.title : undefined,
          startingAmount: (listing.starting_amount ??
            listing.startingAmount) as number | string | null | undefined,
          priceCurrency:
            typeof listing.price_currency === "string"
              ? listing.price_currency
              : undefined,
          thumbnailUrl: (listing.thumbnail_url ?? listing.thumbnailUrl) as
            | string
            | null
            | undefined,
        }
      : null,
  };
};

const normalizeOffer = (input: unknown): Offer => {
  const item = record(input);

  return {
    id: String(item.id ?? ""),
    negotiationId: String(
      item.thread_id ?? item.negotiation_id ?? item.negotiationId ?? "",
    ),
    senderId: String(
      item.sender_user_id ?? item.sender_id ?? item.senderId ?? "",
    ),
    amount: Number(item.amount ?? 0),
    currency: String(item.currency ?? "NGN"),
    status: String(item.status ?? "pending") as Offer["status"],
    parentOfferId: (item.parent_offer_id ?? item.parentOfferId) as
      | string
      | null
      | undefined,
    expiresAt: (item.expires_at ?? item.expiresAt) as string | null | undefined,
    createdAt: String(item.created_at ?? item.createdAt ?? ""),
  };
};

const normalizeDeal = (input: unknown): Deal => {
  const item = record(input);
  return {
    id: String(item.id ?? ""),
    negotiationId: String(item.negotiation_id ?? item.negotiationId ?? ""),
    acceptedOfferId: String(
      item.accepted_offer_id ?? item.acceptedOfferId ?? "",
    ),
    buyerId: String(item.buyer_id ?? item.buyerId ?? ""),
    sellerId: String(item.seller_id ?? item.sellerId ?? ""),
    listingId: String(item.listing_id ?? item.listingId ?? ""),
    agreedAmount: Number(
      item.amount ?? item.agreed_amount ?? item.agreedAmount ?? 0,
    ),
    currency: String(item.currency ?? "NGN"),
    quantity: Number(item.quantity ?? 1),
    variantSnapshot:
      item.variant_snapshot && typeof item.variant_snapshot === "object"
        ? (item.variant_snapshot as Record<string, string>)
        : null,
    status: String(item.status ?? "agreed"),
    acceptedAt: String(item.accepted_at ?? item.acceptedAt ?? ""),
  };
};

export const createNegotiation = (input: {
  conversation_id: string;
  listing_id: string;
  quantity: number;
  variant_selection?: Record<string, string>;
}) =>
  request(
    () => apiClient.post("/negotiations", input),
    "Failed to start negotiation",
    normalizeNegotiation,
  );

export const getNegotiation = (negotiationId: string) =>
  request(
    () => apiClient.get(`/negotiations/${encodeURIComponent(negotiationId)}`),
    "Failed to load negotiation",
    normalizeNegotiation,
  );

export const listOffers = (negotiationId: string) =>
  request(
    () =>
      apiClient.get(
        `/negotiations/${encodeURIComponent(negotiationId)}/offers`,
      ),
    "Failed to load offers",
    (data) => {
      const offers = Array.isArray(data) ? data : record(data).offers;
      return Array.isArray(offers) ? offers.map(normalizeOffer) : [];
    },
  );

export const submitOffer = (
  negotiationId: string,
  input: { amount: number; currency: string },
) =>
  request(
    () =>
      apiClient.post(
        `/negotiations/${encodeURIComponent(negotiationId)}/offers`,
        input,
      ),
    "Failed to submit offer",
    normalizeOffer,
  );

const offerAction = (action: string, offerId: string, fallback: string) =>
  request(
    () => apiClient.post(`/offers/${encodeURIComponent(offerId)}/${action}`),
    fallback,
    normalizeOffer,
  );

export const counterOffer = (
  offerId: string,
  input: { amount: number; currency: string },
) =>
  request(
    () =>
      apiClient.post(`/offers/${encodeURIComponent(offerId)}/counter`, input),
    "Failed to submit counteroffer",
    normalizeOffer,
  );

export const acceptOffer = (offerId: string) =>
  request(
    () => apiClient.post(`/offers/${encodeURIComponent(offerId)}/accept`),
    "Failed to accept offer",
    normalizeDeal,
  );
export const rejectOffer = (offerId: string) =>
  offerAction("reject", offerId, "Failed to reject offer");
export const withdrawOffer = (offerId: string) =>
  offerAction("withdraw", offerId, "Failed to withdraw offer");

export const getDeal = (negotiationId: string) =>
  request(
    () =>
      apiClient.get(`/negotiations/${encodeURIComponent(negotiationId)}/deal`),
    "Failed to load agreed deal",
    normalizeDeal,
  );
