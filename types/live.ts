export type LiveSessionStatus = "Live now" | "Upcoming" | "Scheduled" | "Ended";

export interface SellerLiveSession {
  id: string;

  sellerId: string;

  title: string;

  preview: string;

  coverImageUrl: string;

  status: LiveSessionStatus;

  schedule: string;

  category: string;
  
  participantCount: number;

  offerCount: number;

  featuredItem: string; 
  
  saveCount: number;

  buyerBenefits: string[];

  featuredProductIds: string[];
}
