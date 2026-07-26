import { useMemo } from "react";

import {
  Seller,
  SellerLiveSession,
  SellerProduct,
  MarketService,
  Negotiation,
} from "@/types";

interface Params {
  products: SellerProduct[];
  services: MarketService[];
  businesses: Seller[];
  liveSessions: SellerLiveSession[];
  negotiations?: Negotiation[];
}

export function useMarketDiscovery({
  products,

  services,

  businesses,

  liveSessions,

  negotiations = [],
}: Params) {
  return useMemo(() => {
    const recommended = products.slice(0, 8);

    const trending = [...products]
      .sort((a, b) => b.negotiationCount - a.negotiationCount)
      .slice(0, 8);

    const latest = [...products].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const liveNow = liveSessions.filter((x) => x.status === "live");

    const upcoming = liveSessions.filter((x) => x.status !== "live");

    return {
      recommended,

      trending,

      latest,

      liveNow,

      upcoming,

      services,

      businesses,

      negotiations,
    };
  }, [products, services, businesses, liveSessions, negotiations]);
}
