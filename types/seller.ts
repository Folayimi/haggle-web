import { Location, ReviewSummary } from "./common";

export interface Seller {

  id: string;

  ownerName: string;

  businessName: string;

  username: string;

  avatarUrl: string;

  bannerUrl: string;

  verified: boolean;

  sellerLevel: number;

  bio: string;

  categories: string[];

  followers: number;

  following: number;

  totalProducts: number;

  totalServices: number;

  totalNegotiations: number;

  responseRate: number;

  averageResponseTime: string;

  review: ReviewSummary;

  location: Location;

}