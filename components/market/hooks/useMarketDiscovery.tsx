import { useMemo } from "react";

import {
  Seller,
  SellerLiveSession,
  SellerProduct,
  MarketService,
  Negotiation,
} from "@/types";

interface Params {
  sellers: Seller[];
  liveSessions: SellerLiveSession[];
  negotiations?: Negotiation[];
  recommendedProducts?: SellerProduct[];
  trendingProducts?: SellerProduct[];
  latestProducts?: SellerProduct[];
  latestServices?: MarketService[];
  trendingServices?: MarketService[];
  recommendedServices?: MarketService[];
}

export function useMarketDiscovery({
  sellers,

  liveSessions,

  negotiations = [],
  recommendedProducts = [],
  trendingProducts = [],
  latestProducts = [],
  latestServices = [],
  trendingServices = [],
  recommendedServices = [],
}: Params) {
  return useMemo(() => {
    const liveNow = liveSessions.filter((x) => x.status === "Live now");

    const upcoming = liveSessions.filter((x) => x.status !== "Live now");

    return {
      recommended: recommendedProducts,
      trending: trendingProducts,
      latest: latestProducts,
      latestServices,
      trendingServices,
      recommendedServices,

      liveNow,

      upcoming,

      sellers,

      negotiations,
    };
  }, [sellers, liveSessions, negotiations, recommendedProducts, trendingProducts, latestProducts, latestServices, trendingServices, recommendedServices]);
}
