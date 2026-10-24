export interface MarketService {

  id: string;

  sellerId: string;

  name: string;

  description: string;

  category: string;

  imageUrl: string;

  price: string | number;

  deliveryTime: string;

  audience: string;

  includes: string[];

  priceCurrency?: string;

  negotiable?: boolean;

  workPlace?: string;

  workAddress?: string;

  negotiationNote?: string;

  gallery?: string[];
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

}
