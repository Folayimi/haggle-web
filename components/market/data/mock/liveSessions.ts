// data/mock/live.ts

import { SellerLiveSession } from "@/types";

export const liveSessions: SellerLiveSession[] = [
  {
    id: "live-1",
    sellerId: "seller-1",
    title: "Weekend Electronics Flash Sale",
    preview:
      "Join us live for exclusive discounts on smartphones, laptops, and gaming accessories.",
    coverImageUrl: "/images/mock/live/electronics.jpg",
    status: "Live now",
    schedule: "Today • 7:00 PM",
    participantCount: 1248,
    offerCount: 387,
    saveCount: 842,
    buyerBenefits: [
      "Exclusive live-only discounts",
      "Real-time negotiation",
      "Free nationwide delivery on selected items",
      "Limited giveaway",
    ],
    featuredProductIds: ["product-1", "product-3", "product-6"],
  },

  {
    id: "live-2",
    sellerId: "seller-2",
    title: "Fashion Mega Live",
    preview:
      "Discover the latest fashion arrivals with live styling sessions and exclusive offers.",
    coverImageUrl: "/images/mock/live/fashion.jpg",
    status: "Upcoming",
    schedule: "Tomorrow • 5:30 PM",
    participantCount: 628,
    offerCount: 0,
    saveCount: 420,
    buyerBenefits: [
      "Early bird discounts",
      "Free styling consultation",
      "Bundle offers",
    ],
    featuredProductIds: ["product-8", "product-9"],
  },

  {
    id: "live-3",
    sellerId: "seller-3",
    title: "Furniture Clearance Auction",
    preview: "Premium home furniture at unbeatable prices with live bidding.",
    coverImageUrl: "/images/mock/live/furniture.jpg",
    status: "Upcoming",
    schedule: "Saturday • 2:00 PM",
    participantCount: 385,
    offerCount: 0,
    saveCount: 217,
    buyerBenefits: [
      "Auction pricing",
      "Bulk purchase discounts",
      "Free installation",
    ],
    featuredProductIds: ["product-12", "product-15", "product-16"],
  },

  {
    id: "live-4",
    sellerId: "seller-4",
    title: "Fresh Farm Produce Live",
    preview: "Buy directly from farmers with same-day delivery available.",
    coverImageUrl: "/images/mock/live/farm.jpg",
    status: "Live now",
    schedule: "Live Now",
    participantCount: 943,
    offerCount: 511,
    saveCount: 694,
    buyerBenefits: [
      "Farm fresh produce",
      "Wholesale pricing",
      "Same-day delivery",
    ],
    featuredProductIds: ["product-20", "product-21"],
  },

  {
    id: "live-5",
    sellerId: "seller-5",
    title: "Automobile Accessories Live",
    preview:
      "Live demonstrations of premium car accessories with special offers.",
    coverImageUrl: "/images/mock/live/automobile.jpg",
    status: "Upcoming",
    schedule: "Sunday • 6:00 PM",
    participantCount: 271,
    offerCount: 0,
    saveCount: 153,
    buyerBenefits: [
      "Live product demos",
      "Installation tips",
      "Exclusive bundle deals",
    ],
    featuredProductIds: ["product-24", "product-25"],
  },
];
