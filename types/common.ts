export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface Media {
  id: string;

  url: string;

  type: "image" | "video";

  isCover?: boolean;
}

export interface Tag {
  id: string;
  label: string;
}

export interface ReviewSummary {
  rating: number;
  totalReviews: number;
}

export interface ListingReview {
  id: string;
  authorName?: string;
  reviewerAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt?: string;
  isVerifiedPurchase?: boolean;
}

export interface ListingReviewData {
  rating: number;
  reviewCount: number;
  reviews: ListingReview[];
  isSample: boolean;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}
