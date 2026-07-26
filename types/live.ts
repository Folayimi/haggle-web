export type LiveSessionStatus = "Live now" | "Upcoming" | "Scheduled" | "Ended";

export interface SellerLiveSession {
  id: string;

  sellerId: string;

  title: string;

  preview: string;

  coverImageUrl: string;

  status: LiveSessionStatus;

  schedule: string;

  participantCount: number;

  offerCount: number;

  saveCount: number;

  buyerBenefits: string[];

  featuredProductIds: string[];
}
