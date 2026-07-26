"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { ProductCard } from "@/components/haggle-ui";
import { MarketSection } from "../common/MarketSection";

import { SellerProduct } from "@/types";

interface ProductFeedProps {
  products: SellerProduct[];
}
const INITIAL_PRODUCTS = 12;

export function ProductFeed({ products }: ProductFeedProps) {
  const [visible, setVisible] = useState(INITIAL_PRODUCTS);

  const visibleProducts = products.slice(0, visible);

  return (
    <MarketSection
      title="Latest Listings"
      subtitle="Fresh products added by sellers."
    >
      <div
        className="
          grid
          grid-cols-1
          gap-6

          sm:grid-cols-2

          lg:grid-cols-3

          xl:grid-cols-4
        "
      >
        {visibleProducts.map((product, index) => (
          <motion.div
            key={product.id}
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
            <ProductCard product={product} />
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
