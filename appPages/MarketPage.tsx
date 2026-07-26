"use client";

import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";

import { MarketHero } from "@/components/market/hero/MarketHero";

import { StickyHeader } from "@/components/market/search/StickyHeader";

import {
  ContinueNegotiating,
  FeaturedCollections,
  LiveNow,
  UpcomingLive,
  PopularBusinesses,
  ProductFeed,
  Recommended,
  ServiceFeed,
  TrendingNearYou,
} from "@/components/market/sections";

import {
  products,
  services,
  businesses,
  liveSessions,
  negotiations,
  featuredCollections,
} from "@/components/market/data/market";

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const query = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.description, product.category]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [query]);

  const filteredServices = useMemo(() => {
    if (!query) return services;

    return services.filter((service: any) =>
      [service.name, service.description, service.category]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [query]);

  const liveNow = useMemo(
    () => liveSessions.filter((x) => x.status === "Live now"),
    [],
  );

  const upcoming = useMemo(
    () => liveSessions.filter((x) => x.status !== "Live now"),
    [],
  );

  return (
    <AppShell>
      <div className="min-h-screen">
        <StickyHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <MarketHero />

        <main
          className="
            mx-auto
            flex
            w-full
            max-w-[1700px]
            flex-col
            space-y-24
            px-6
            py-10
            2xl:px-10
          "
        >
          <ContinueNegotiating negotiations={negotiations} />

          <LiveNow sessions={liveNow} />

          <UpcomingLive sessions={upcoming} />

          <FeaturedCollections collections={featuredCollections} />

          <TrendingNearYou
            products={filteredProducts.slice(0, 10)}
            location="Lagos"
          />

          <Recommended products={filteredProducts.slice(0, 12)} />

          <PopularBusinesses businesses={businesses} />

          <ServiceFeed services={filteredServices} />

          <ProductFeed products={filteredProducts} />
        </main>
      </div>
    </AppShell>
  );
}
