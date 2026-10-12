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
  negotiationNote?: string;
  tags?: string[];
  saveCount?: number;
  negotiationCount?: number;
  createdAt?: string;
}