"use client";

import { CollectionCard } from "./CollectionCard";
import { Carousel } from "../common/Carousel";
import { MarketSection } from "../common/MarketSection";

import { FeaturedCollection } from "@/types";

interface FeaturedCollectionsProps {
  collections: FeaturedCollection[];
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  if (!collections.length) return null;

  return (
    <MarketSection
      title="Featured Collections"
      subtitle="Browse curated collections hand-picked for every lifestyle."
    >
      <Carousel
        items={collections}
        itemWidth={340}
        renderItem={(collection) => <CollectionCard collection={collection} />}
      />
    </MarketSection>
  );
}
