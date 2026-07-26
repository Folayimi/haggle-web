"use client";

import { Bookmark } from "lucide-react";

import { SellerProduct } from "@/types";
import { CardImage, TopOverlay } from "@/components/market/common/CardImage";
import { cn } from "@/lib/utils";
import { useHaggleStore } from "@/lib/app-store";
import { formatPrice } from "@/lib/formatters";


interface ProductImageProps {
  product: SellerProduct;
  variant: "compact" | "default" | "expanded";
}

export function ProductImage({ product, variant }: ProductImageProps) {
  const savedIds = useHaggleStore((state) => state.savedItemIds);

  const toggleSavedItem = useHaggleStore((state) => state.toggleSavedItem);

  const saved = savedIds.includes(product.id);

  return (
    <CardImage
      image={product.images[0]?.url}
      alt={product.name}
      aspectRatio={variant === "compact" ? "portrait" : "landscape"}
      topOverlay={
        <TopOverlay>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            {product.category}
          </span>

          <button
            onClick={() => toggleSavedItem(product.id)}
            className={cn(
              "rounded-full p-2 backdrop-blur transition",
              saved ? "bg-primary text-white" : "bg-white/90 text-foreground",
            )}
          >
            <Bookmark
              className="h-4 w-4"
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </TopOverlay>
      }
      bottomOverlay={
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-white/80">Starting at</p>

            <h3 className="text-2xl font-bold text-white">
              {formatPrice(product.price)}
            </h3>
          </div>

          {product.negotiable && (
            <span className="rounded-full bg-success px-3 py-1 text-xs font-semibold text-white">
              Negotiable
            </span>
          )}
        </div>
      }
    />
  );
}
