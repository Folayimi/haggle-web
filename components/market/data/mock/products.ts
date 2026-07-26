import { SellerProduct } from "@/types";

export const products: SellerProduct[] = [
  {
    id: "product-iphone16-pro",
    sellerId: "seller-novatech",
    slug: "apple-iphone-16-pro-max",

    name: "Apple iPhone 16 Pro Max",

    description:
      "Brand-new Apple flagship smartphone with Titanium finish, 48MP camera system and all-day battery life.",

    category: "Smartphones",

    images: [
      {
        id: "iphone16-1",
        url: "/mock/products/novatech/iphone16-front.jpg",
        type: "image",
        isCover: true,
      },
      {
        id: "iphone16-2",
        url: "/mock/products/novatech/iphone16-back.jpg",
        type: "image",
      },
      {
        id: "iphone16-3",
        url: "/mock/products/novatech/iphone16-side.jpg",
        type: "image",
      },
    ],

    price: 1850000,

    negotiable: true,

    stockStatus: "In Stock",

    features: ["256GB", "Titanium", "Dual SIM", "1 Year Warranty"],

    tags: ["Apple", "iPhone", "Smartphone", "Flagship"],

    saveCount: 612,

    negotiationCount: 203,

    createdAt: "2026-07-15",
  },

  {
    id: "product-macbook-air",
    sellerId: "seller-novatech",
    slug: "macbook-air-m4",

    name: "MacBook Air M4",

    description:
      "Ultra-light laptop powered by Apple's latest M4 chip for creators, professionals and students.",

    category: "Laptops",

    images: [
      {
        id: "mba-1",
        url: "/mock/products/novatech/macbook-air-front.jpg",
        type: "image",
        isCover: true,
      },
      {
        id: "mba-2",
        url: "/mock/products/novatech/macbook-air-open.jpg",
        type: "image",
      },
      {
        id: "mba-3",
        url: "/mock/products/novatech/macbook-air-side.jpg",
        type: "image",
      },
    ],

    price: 2380000,

    negotiable: true,

    stockStatus: "In Stock",

    features: ["16GB RAM", "512GB SSD", "M4 Chip", "AppleCare Eligible"],

    tags: ["MacBook", "Laptop", "Apple"],

    saveCount: 384,

    negotiationCount: 128,

    createdAt: "2026-07-10",
  },

  {
    id: "product-airpods-pro2",
    sellerId: "seller-novatech",
    slug: "airpods-pro-2-usbc",

    name: "AirPods Pro (USB-C)",

    description:
      "Wireless earbuds featuring Active Noise Cancellation, Transparency Mode and spatial audio.",

    category: "Accessories",

    images: [
      {
        id: "pods-1",
        url: "/mock/products/novatech/airpods-case.jpg",
        type: "image",
        isCover: true,
      },
      {
        id: "pods-2",
        url: "/mock/products/novatech/airpods-open.jpg",
        type: "image",
      },
    ],

    price: 420000,

    negotiable: false,

    stockStatus: "Low Stock",

    features: ["ANC", "USB-C", "Wireless Charging"],

    tags: ["Apple", "AirPods", "Audio"],

    saveCount: 251,

    negotiationCount: 34,

    createdAt: "2026-07-21",
  },
  {
    id: "product-luxe-cargo",
    sellerId: "seller-luxewear",
    slug: "oversized-cargo-joggers",

    name: "Oversized Cargo Joggers",

    description:
      "Premium oversized cargo joggers made from breathable heavyweight cotton. Designed for everyday streetwear.",

    category: "Fashion",

    images: [
      {
        id: "cargo-1",
        url: "/mock/products/luxewear/cargo-front.jpg",
        type: "image",
        isCover: true,
      },
      {
        id: "cargo-2",
        url: "/mock/products/luxewear/cargo-back.jpg",
        type: "image",
      },
      {
        id: "cargo-3",
        url: "/mock/products/luxewear/cargo-fit.jpg",
        type: "image",
      },
    ],

    price: 58000,

    negotiable: true,

    stockStatus: "In Stock",

    features: [
      "Heavy Cotton",
      "Oversized Fit",
      "Multiple Pockets",
      "Available S - XXL",
    ],

    tags: ["Cargo", "Streetwear", "Fashion"],

    saveCount: 228,

    negotiationCount: 84,

    createdAt: "2026-07-12",
  },
  {
    id: "product-luxe-sneakers",
    sellerId: "seller-luxewear",
    slug: "premium-white-sneakers",

    name: "Premium Leather Sneakers",

    description:
      "Minimal premium leather sneakers suitable for casual and business casual outfits.",

    category: "Shoes",

    images: [
      {
        id: "shoe-1",
        url: "/mock/products/luxewear/sneakers-front.jpg",
        type: "image",
        isCover: true,
      },
      {
        id: "shoe-2",
        url: "/mock/products/luxewear/sneakers-side.jpg",
        type: "image",
      },
    ],

    price: 92000,

    negotiable: true,

    stockStatus: "In Stock",

    features: ["Genuine Leather", "Rubber Sole", "Water Resistant"],

    tags: ["Sneakers", "Leather", "Men"],

    saveCount: 371,

    negotiationCount: 113,

    createdAt: "2026-07-18",
  },
  {
    id: "product-luxe-watch",

    sellerId: "seller-luxewear",

    slug: "stainless-steel-watch",

    name: "Luxury Stainless Steel Wristwatch",

    description:
      "Elegant stainless steel wristwatch with sapphire crystal glass and water resistance.",

    category: "Accessories",

    images: [
      {
        id: "watch-1",
        url: "/mock/products/luxewear/watch-front.jpg",
        type: "image",
        isCover: true,
      },
      {
        id: "watch-2",
        url: "/mock/products/luxewear/watch-close.jpg",
        type: "image",
      },
    ],

    price: 145000,

    negotiable: false,

    stockStatus: "Low Stock",

    features: ["Sapphire Glass", "Stainless Steel", "2-Year Warranty"],

    tags: ["Watch", "Luxury", "Accessories"],

    saveCount: 189,

    negotiationCount: 28,

    createdAt: "2026-07-22",
  },
  {
    id: "product-fresh-rice",

    sellerId: "seller-freshharvest",

    slug: "50kg-premium-rice",

    name: "Premium Long Grain Rice (50kg)",

    description:
      "Stone-free premium long grain rice suitable for homes, restaurants and wholesalers.",

    category: "Groceries",

    images: [
      {
        id: "rice-1",
        url: "/mock/products/freshharvest/rice-bag.jpg",
        type: "image",
        isCover: true,
      },
      {
        id: "rice-2",
        url: "/mock/products/freshharvest/rice-open.jpg",
        type: "image",
      },
    ],

    price: 98000,

    negotiable: true,

    stockStatus: "In Stock",

    features: ["50kg", "Stone Free", "Premium Grade"],

    tags: ["Rice", "Food", "Wholesale"],

    saveCount: 402,

    negotiationCount: 164,

    createdAt: "2026-07-09",
  },
  {
    id: "product-fresh-tomatoes",

    sellerId: "seller-freshharvest",

    slug: "fresh-tomatoes-crate",

    name: "Fresh Tomatoes (Full Crate)",

    description:
      "Fresh farm-picked tomatoes supplied daily to homes, restaurants and resellers.",

    category: "Vegetables",

    images: [
      {
        id: "tomato-1",
        url: "/mock/products/freshharvest/tomatoes.jpg",
        type: "image",
        isCover: true,
      },
    ],

    price: 32000,

    negotiable: true,

    stockStatus: "In Stock",

    features: ["Farm Fresh", "Daily Supply", "Bulk Available"],

    tags: ["Tomatoes", "Vegetables"],

    saveCount: 286,

    negotiationCount: 201,

    createdAt: "2026-07-20",
  },
  {
    id: "product-fresh-eggs",

    sellerId: "seller-freshharvest",

    slug: "crate-of-eggs",

    name: "Crate of Fresh Eggs",

    description: "Farm-fresh eggs sourced daily from trusted poultry farms.",

    category: "Poultry",

    images: [
      {
        id: "egg-1",
        url: "/mock/products/freshharvest/eggs.jpg",
        type: "image",
        isCover: true,
      },
    ],

    price: 8500,

    negotiable: false,

    stockStatus: "In Stock",

    features: ["30 Eggs", "Fresh Daily"],

    tags: ["Eggs", "Poultry"],

    saveCount: 194,

    negotiationCount: 41,

    createdAt: "2026-07-23",
  },
];
