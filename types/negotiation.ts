export interface Negotiation {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  currentOffer: number;
  askingPrice: number;
  status: "pending" | "countered" | "accepted" | "rejected";
  unreadCount: number;
  latestMessage: string;
  updatedAt: string;
}