// data/mock/negotiations.ts

import { Negotiation } from "@/types";

export const negotiations: Negotiation[] = [
  {
    id: "neg-1",
    productId: "product-1",
    sellerId: "seller-1",
    buyerId: "buyer-1",
    askingPrice: 350000,
    currentOffer: 320000,
    status: "countered",
    unreadCount: 2,
    latestMessage: "I can do ₦335,000 if payment is made today.",
    updatedAt: "5 mins ago",
  },

  {
    id: "neg-2",
    productId: "product-3",
    sellerId: "seller-2",
    buyerId: "buyer-2",
    askingPrice: 180000,
    currentOffer: 180000,
    status: "accepted",
    unreadCount: 0,
    latestMessage: "Deal accepted 🎉",
    updatedAt: "1 hour ago",
  },

  {
    id: "neg-3",
    productId: "product-5",
    sellerId: "seller-3",
    buyerId: "buyer-3",
    askingPrice: 85000,
    currentOffer: 70000,
    status: "pending",
    unreadCount: 1,
    latestMessage: "Can you make it ₦70,000?",
    updatedAt: "Yesterday",
  },

  {
    id: "neg-4",
    productId: "product-7",
    sellerId: "seller-4",
    buyerId: "buyer-4",
    askingPrice: 120000,
    currentOffer: 95000,
    status: "rejected",
    unreadCount: 0,
    latestMessage: "Sorry, that's too low.",
    updatedAt: "2 days ago",
  },

  {
    id: "neg-5",
    productId: "product-9",
    sellerId: "seller-5",
    buyerId: "buyer-5",
    askingPrice: 560000,
    currentOffer: 540000,
    status: "countered",
    unreadCount: 3,
    latestMessage: "Meet me at ₦550,000 and it's yours.",
    updatedAt: "Just now",
  },
];