"use client";

import { motion } from "framer-motion";

import { SellerProduct } from "@/types";
import { cn } from "@/lib/utils";

import { ProductActions } from "./ProductActions";
import { ProductImage } from "./ProductImage";
import { ProductMeta } from "./ProductMeta";
import { ProductSeller } from "./ProductSeller";
import { useHaggleStore } from "@/lib/app-store";
import { getSellerById } from "@/components/market/data/market";
import { Bookmark } from "lucide-react";

import { CardImage } from "@/components/market/common/CardImage";

import { getProductCover } from "@/components/data/market";

export interface ProductCardProps {
  product: SellerProduct;

  variant?: "compact" | "default" | "expanded";

  showSeller?: boolean;

  showActions?: boolean;

  showNegotiationStats?: boolean;
}

export default function ProductCard({
  product,
  variant = "default",
  showSeller = true,
  showActions = true,
  showNegotiationStats = true,
}: ProductCardProps) {
  const seller = getSellerById(product.sellerId);

  const savedIds = useHaggleStore((state) => state.savedItemIds);

  const toggleSavedItem = useHaggleStore((state) => state.toggleSavedItem);

  const saved = savedIds.includes(product.id);

  if (!seller) return null;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "group overflow-hidden rounded-[24px] border border-border bg-background shadow-sm transition-all",
        "hover:border-primary/20 hover:shadow-xl",
        variant === "compact" && "max-w-[250px]",
        variant === "default" && "max-w-[300px]",
        variant === "expanded" && "max-w-[360px]",
      )}
    >
      <CardImage
        image={getProductCover(product)}
        alt={product.name}
        aspectRatio={variant === "compact" ? "portrait" : "landscape"}
        topOverlay={
          <>
            {/* Category */}

            <span
              className="
          rounded-full
          bg-black/55
          px-3
          py-1
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-white
          backdrop-blur-md
        "
            >
              {product.category}
            </span>

            {/* Save */}

            <button
              onClick={() => toggleSavedItem(product.id)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200",
                saved
                  ? "bg-primary text-white"
                  : "bg-white/90 text-foreground hover:bg-white",
              )}
            >
              <Bookmark
                className="h-4 w-4"
                fill={saved ? "currentColor" : "none"}
              />
            </button>
          </>
        }
        bottomOverlay={
          <>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                product.stockStatus === "In Stock" &&
                  "bg-green-100 text-green-700",
                product.stockStatus === "Low Stock" &&
                  "bg-yellow-100 text-yellow-700",
                product.stockStatus === "Out of Stock" &&
                  "bg-red-100 text-red-700",
              )}
            >
              {product.stockStatus}
            </span>

            {product.negotiable && (
              <span
                className="
            rounded-full
            bg-primary
            px-3
            py-1
            text-xs
            font-semibold
            text-white
            shadow-lg
          "
              >
                Negotiable
              </span>
            )}
          </>
        }
      />

      <div className="space-y-5 p-5">
        <ProductMeta
          product={product}
          showNegotiationStats={showNegotiationStats}
          variant={variant}
        />

        {showSeller && seller && <ProductSeller seller={seller} />}

        {showActions && <ProductActions product={product} seller={seller} />}
      </div>
    </motion.article>
  );
}
