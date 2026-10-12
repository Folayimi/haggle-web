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
}