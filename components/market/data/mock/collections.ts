// data/mock/featuredCollections.ts

import { FeaturedCollection } from "@/types";

export const featuredCollections: FeaturedCollection[] = [
  {
    id: "collection-1",
    title: "Tech Deals",
    emoji: "💻",
    description:
      "Top gadgets, laptops, phones, and accessories with unbeatable prices.",
    coverImage: "/images/mock/collections/tech.jpg",
    productIds: [
      "product-1",
      "product-2",
      "product-3",
      "product-4",
    ],
  },

  {
    id: "collection-2",
    title: "Fashion Picks",
    emoji: "👗",
    description:
      "Trending fashion, footwear, and accessories from verified sellers.",
    coverImage: "/images/mock/collections/fashion.jpg",
    productIds: [
      "product-5",
      "product-6",
      "product-7",
      "product-8",
    ],
  },

  {
    id: "collection-3",
    title: "Home Essentials",
    emoji: "🏡",
    description:
      "Everything you need to furnish and upgrade your home.",
    coverImage: "/images/mock/collections/home.jpg",
    productIds: [
      "product-9",
      "product-10",
      "product-11",
      "product-12",
    ],
  },

  {
    id: "collection-4",
    title: "Fresh Market",
    emoji: "🥬",
    description:
      "Fresh groceries and farm produce delivered directly from trusted sellers.",
    coverImage: "/images/mock/collections/fresh-market.jpg",
    productIds: [
      "product-13",
      "product-14",
      "product-15",
      "product-16",
    ],
  },

  {
    id: "collection-5",
    title: "Luxury Collection",
    emoji: "✨",
    description:
      "Premium products curated for buyers looking for the very best.",
    coverImage: "/images/mock/collections/luxury.jpg",
    productIds: [
      "product-17",
      "product-18",
      "product-19",
      "product-20",
    ],
  },

  {
    id: "collection-6",
    title: "Made in Nigeria",
    emoji: "🇳🇬",
    description:
      "Support local businesses with handcrafted and locally manufactured products.",
    coverImage: "/images/mock/collections/nigeria.jpg",
    productIds: [
      "product-21",
      "product-22",
      "product-23",
      "product-24",
    ],
  },
];