import { Location, ReviewSummary } from "./common";

 const status = hero.status || "open";
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  const category = hero.category || "";
  const location = hero.location || "";
  const yearsInBusiness = hero.yearsInBusiness || 0;
  const slogan = hero.slogan || "";
  const verifiedBadge = hero.verifiedBadge ?? user.isVerified ?? false;

  const rating = user.rating ? parseFloat(user.rating) : 0;
  const followers = user.followers ? parseInt(user.followers.replace(/,/g, "")) : 0;
  const responseTime = hero.averageResponseTime || user.responseTime || "—";

export interface Seller {
  hero: {
    category: string;
    location: string;
    yearsInBusiness: number;
    slogan: string;
    verifiedBadge: boolean;
    rating: string;
    followers: string;
    averageResponseTime: string;
  };
  id: string;

  ownerName: string;

  name: string;

  status: string;

  username: string;

  avatarUrl: string;

  bannerUrl: string;

  isVerified: boolean;

  sellerLevel: number;

  bio: string;

  categories: string[];

  following: number;

  totalProducts: number;

  totalServices: number;

  totalNegotiations: number;

  responseRate: number;

  responseTime: string;

  review: ReviewSummary;
}
