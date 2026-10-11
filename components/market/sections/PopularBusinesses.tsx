"use client";

import { BusinessCard } from "@/components/market/cards/BusinessCard";
import { Carousel } from "../common/Carousel";
import { SectionHeader } from "../common/SectionHeader";

import { Seller } from "@/types";

interface PopularBusinessesProps {
  businesses: Seller[];
}

export function PopularBusinesses({ businesses }: PopularBusinessesProps) {
  if (!businesses.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Popular Businesses"
        subtitle="Businesses customers trust and negotiate with the most."
      />

      <Carousel
        items={businesses}
        itemWidth={280}
        gap={12}
        renderItem={(seller) => <BusinessCard seller={seller} />}
      />
    </section>
  );
}
