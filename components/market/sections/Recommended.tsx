"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/market/cards/ProductCard";

import { Carousel } from "../common/Carousel";
import { SectionActionButton, SectionHeader } from "../common/SectionHeader";

import { SellerProduct } from "@/types";

interface RecommendedProps {
  products: SellerProduct[];
  onProductSelect?: (product: SellerProduct) => void;
  onViewAll?: () => void;
}

export function Recommended({
  products,
  onProductSelect,
  onViewAll,
}: RecommendedProps) {
  if (!products.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Recommended For You"
        subtitle="Curated based on your interests and recent activity."
        action={
          onViewAll ? (
            <SectionActionButton label="View all" onClick={onViewAll} />
          ) : undefined
        }
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.35,
        }}
      >

        <Carousel
          items={products}
          itemWidth={280}
          renderItem={(product) => (
            <ProductCard product={product} onSelect={onProductSelect} />
          )}
        />
      </motion.div>
    </section>
  );
}
