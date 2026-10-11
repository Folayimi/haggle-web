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
  sellers: Seller[];
  liveSessions: SellerLiveSession[];
  negotiations?: Negotiation[];
}

export function useMarketDiscovery({
  products,

  services,

  sellers,

  liveSessions,

  negotiations = [],
}: Params) {
  return useMemo(() => {
    const recommended = products.slice(0, 8);

    const trending = [...products]
      .sort(
        (a, b) =>
          (b.negotiationCount ?? 0) - (a.negotiationCount ?? 0),
      )
      .slice(0, 8);

    const latest = [...products].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime(),
    );

    const liveNow = liveSessions.filter((x) => x.status === "Live now");

    const upcoming = liveSessions.filter((x) => x.status !== "Live now");

    return {
      recommended,

      trending,

      latest,

      liveNow,

      upcoming,

      services,

      sellers,

      negotiations,
    };
  }, [products, services, sellers, liveSessions, negotiations]);
}
