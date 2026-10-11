"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import ProductCard from "@/components/market/cards/ProductCard";
import { MarketSection } from "../common/MarketSection";
import { SectionActionButton } from "../common/SectionHeader";

import { SellerProduct } from "@/types";

interface ProductFeedProps {
  products: SellerProduct[];
  onProductSelect?: (product: SellerProduct) => void;
  onViewAll?: () => void;
}
const INITIAL_PRODUCTS = 12;

export function ProductFeed({
  products,
  onProductSelect,
  onViewAll,
}: ProductFeedProps) {
  const [visible, setVisible] = useState(INITIAL_PRODUCTS);

  const visibleProducts = products.slice(0, visible);

  return (
    <MarketSection
      title="Latest Listings"
      subtitle="Fresh products added by sellers."
      action={
        onViewAll ? (
          <SectionActionButton label="See all" onClick={onViewAll} />
        ) : undefined
      }
    >
      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-5
          sm:grid-cols-2
          2xl:grid-cols-3
        "
      >
        {visibleProducts.map((product, index) => (
          <motion.div
            key={product.id}
            className="min-w-0"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.03,
            }}
            viewport={{
              once: true,
            }}
          >
            <ProductCard product={product} onSelect={onProductSelect} />
          </motion.div>
        ))}
      </div>

      {visible < products.length && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setVisible(visible + INITIAL_PRODUCTS)}
            className="
              rounded-full
              bg-primary
              px-8
              py-3
              font-semibold
              text-white
            "
          >
            Load More
          </button>
        </div>
      )}
    </MarketSection>
  );
}
