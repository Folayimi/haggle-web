export interface MarketService {

  id: string;

  sellerId: string;

  name: string;

  description: string;

  category: string;

  imageUrl: string;

  price: number;

  deliveryTime: string;

  audience: string;

  includes: string[];

  bookingCount: number;

}