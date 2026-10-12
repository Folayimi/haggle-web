"use client";

import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

import { CardImage } from "@/components/market/common/CardImage";
import { ActionButton } from "@/components/market/common/ActionButton";
import { getProductCover } from "@/components/market/data/market";
import { useHaggleStore } from "@/lib/app-store";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { SellerProduct } from "@/types";

export interface ProductCardProps {
  product: SellerProduct;
  onSelect?: (product: SellerProduct) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const savedIds = useHaggleStore((state) => state.savedItemIds);
  const toggleSavedItem = useHaggleStore((state) => state.toggleSavedItem);
  const saved = savedIds.includes(product.id);
  const rawPrice = String(product.price).trim();
  const price =
    typeof product.price === "string"
      ? rawPrice
        ? Number(rawPrice.replace(/[^\d.-]/g, ""))
        : Number.NaN
      : product.price;
  return (
    <article className="market-card group min-w-0">
      <div className="relative">
        <button
          type="button"
          onClick={() => onSelect?.(product)}
          disabled={!onSelect}
          aria-label={`View ${product.name}`}
          className={cn(
            "block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-default",
            onSelect && "cursor-pointer",
          )}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <CardImage
              image={getProductCover(product)}
              alt={product.name}
              className="h-full w-full [&_img]:h-full"
            />
            <p className="absolute bottom-2 left-2 z-10 rounded-md bg-black/55 px-2.5 py-1 text-sm font-bold tracking-tight text-white shadow-sm backdrop-blur-sm sm:bottom-3 sm:left-3">
              {Number.isFinite(price)
                ? formatPrice(price, product.priceCurrency)
                : "Price unavailable"}
            </p>
          </div>

          <div className="min-w-0 pt-2.5">
            <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-foreground">
              {product.name}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-muted">
              {product.description}
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => toggleSavedItem(product.id)}
          aria-label={saved ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={saved}
          className={cn(
            "absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-black/70 text-white shadow-md backdrop-blur transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            saved && "border-primary bg-primary text-white hover:bg-primary-strong",
          )}
        >
          <Heart
            className="h-4 w-4 stroke-[2.5]"
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="flex justify-end pt-2">
        <ActionButton asChild size="sm" className="shrink-0">
          <Link
            href={`/product-detail?product=${encodeURIComponent(product.id)}`}
          >
            <MessageCircle className="h-4 w-4" />
            Negotiate
          </Link>
        </ActionButton>
      </div>
    </article>
  );
}
