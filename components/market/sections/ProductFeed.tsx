"use client";

import { motion } from "framer-motion";

import ProductCard from "@/components/market/cards/ProductCard";
import { Carousel } from "../common/Carousel";
import { SectionActionButton, SectionHeader } from "../common/SectionHeader";

import { SellerProduct } from "@/types";

interface ProductFeedProps {
  products: SellerProduct[];
  onProductSelect?: (product: SellerProduct) => void;
  onViewAll?: () => void;
}

export function ProductFeed({
  products,
  onProductSelect,
  onViewAll,
}: ProductFeedProps) {
  if (!products.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Latest Listings"
        subtitle="Fresh products added by sellers."
        action={
          onViewAll ? (
            <SectionActionButton label="See all" onClick={onViewAll} />
          ) : undefined
        }
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        <Carousel
          items={products}
          itemWidth={280}
          gap={12}
          renderItem={(product) => (
            <ProductCard product={product} onSelect={onProductSelect} />
          )}
        />
      </motion.div>
    </section>
  );
}
