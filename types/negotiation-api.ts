export type NegotiationStatus =
  | "active"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "expired"
  | "completed";

export type OfferStatus =
  | "pending"
  | "accepted"
  | "countered"
  | "rejected"
  | "withdrawn"
  | "expired"
  | "superseded";

export interface NegotiationThread {
  id: string;
  conversationId: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  variantSnapshot?: Record<string, string> | null;
  status: NegotiationStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
  listing?: {
    id: string;
    title?: string;
    startingAmount?: number | string | null;
    priceCurrency?: string;
    thumbnailUrl?: string | null;
  } | null;
}

export interface Offer {
  id: string;
  negotiationId: string;
  senderId: string;
  amount: number;
  currency: string;
  status: OfferStatus;
  parentOfferId?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}

export interface Deal {
  id: string;
  negotiationId: string;
  acceptedOfferId: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  agreedAmount: number;
  currency: string;
  quantity: number;
  variantSnapshot?: Record<string, string> | null;
  status: string;
  acceptedAt: string;
}
