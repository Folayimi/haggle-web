import { Media } from "./common";

export interface SellerProduct {
  id: string;
  sellerId: string;
  slug?: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  images?: Media[];
  price: number | string;
  priceCurrency?: string;
  negotiable?: boolean;
  inventoryCount?: number;
  stockStatus?: string;
  features?: string[];
  attributes?: { label: string; value: string }[];
  availableSizes?: string[];
  viewCount?: number;
  saveCount?: number;
  shareCount?: number;
  sellerSummary?: { full_name: string; avatar_url: string | null } | null;
  ratingSummary?: { average: number; count: number } | null;
  trendingScore?: number;
  recommendationReason?:
    | "based_on_category"
    | "based_on_followed_seller"
    | "recently_listed"
    | "trending";
  recommendationScore?: number;
  negotiationNote?: string;
  tags?: string[];
  negotiationCount?: number;
  createdAt?: string;
}
