"use client";

import { CollectionCard } from "./CollectionCard";
import { Carousel } from "../common/Carousel";
import { SectionActionButton, SectionHeader } from "../common/SectionHeader";

import { FeaturedCollection } from "@/types";

interface FeaturedCollectionsProps {
  collections: FeaturedCollection[];
  onViewAll?: () => void;
}

export function FeaturedCollections({
  collections,
  onViewAll,
}: FeaturedCollectionsProps) {
  if (!collections.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Featured Collections"
        subtitle="Browse curated collections hand-picked for every lifestyle."
        action={
          onViewAll ? (
            <SectionActionButton label="View all" onClick={onViewAll} />
          ) : undefined
        }
      />
      <Carousel
        items={collections}
        itemWidth={560}
        gap={16}
        renderItem={(collection) => <CollectionCard collection={collection} />}
      />
    </section>
  );
}
