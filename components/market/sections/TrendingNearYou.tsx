"use client";

import { motion } from "framer-motion";

import ProductCard from "@/components/market/cards/ProductCard";
import { Carousel } from "../common/Carousel";
import { SectionActionButton, SectionHeader } from "../common/SectionHeader";

import { SellerProduct } from "@/types";

interface TrendingNearYouProps {
  products: SellerProduct[];
  location?: string;
  onProductSelect?: (product: SellerProduct) => void;
  onViewAll?: () => void;
}

export function TrendingNearYou({
  products,
  location = "Your Area",
  onProductSelect,
  onViewAll,
}: TrendingNearYouProps) {
  if (!products.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Trending"
        subtitle={`Products people in ${location} are viewing, negotiating and buying.`}
        action={
          onViewAll ? (
            <SectionActionButton label="View all" onClick={onViewAll} />
          ) : undefined
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Carousel
          items={products}
          itemWidth={260}
          gap={12}
          renderItem={(product) => (
            <ProductCard product={product} onSelect={onProductSelect} />
          )}
        />
      </motion.div>
    </section>
  );
}
