import {
  Seller,
  SellerProduct,
  MarketService,
  Media,
} from "@/types";

import {
  sellers,
  products,
  services,
  liveSessions,
  negotiations,
  featuredCollections,
} from "./mock";

export function getSellerById(id: string): Seller | undefined {
  return sellers.find((seller) => seller.id === id);
}

export const getProductById = (id: string) =>
  products.find((product) => product.id === id);

export const getServiceById = (id: string) =>
  services.find((service) => service.id === id);

export const getLiveSessionById = (id: string) =>
  liveSessions.find((session) => session.id === id);

export function getServiceCover(service: MarketService): string {
  return service.imageUrl;
}

export function getProductCover(
  product: SellerProduct & { imageUrl?: string; images?: Media[] },
): string {
  return (
    product.imageUrl ||
    product.images?.find((image) => image.isCover)?.url ||
    product.images?.[0]?.url ||
    "/images/placeholders/product.jpg"
  );
}

export function getSellerAvatar(seller?: Seller): string {
  return seller?.avatarUrl ?? "/images/placeholders/avatar.jpg";
}

export function getSellerBanner(seller?: Seller): string {
  return seller?.bannerUrl ?? "/images/placeholders/banner.jpg";
}

export {
  sellers,
  products,
  services,
  liveSessions,
  negotiations,
  featuredCollections,
};

export const businesses = sellers;
