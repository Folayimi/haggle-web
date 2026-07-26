import { Media } from "./common";

export interface SellerProduct {

  id: string;

  sellerId: string;

  slug: string;

  name: string;

  description: string;

  category: string;

  images: Media[];

  price: number;

  negotiable: boolean;

  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";

  features: string[];

  tags: string[];

  saveCount: number;

  negotiationCount: number;

  createdAt: string;

}