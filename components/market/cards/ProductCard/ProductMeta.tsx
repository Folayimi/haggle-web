"use client";

import { TrendingUp } from "lucide-react";

import { SellerProduct } from "@/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
// import { formatCurrency } from "@/lib/formatters";

interface ProductMetaProps {
  product: SellerProduct;

  variant: "compact" | "default" | "expanded";

  showNegotiationStats?: boolean;
}

export function ProductMeta({
  product,
  variant,
  showNegotiationStats = true,
}: ProductMetaProps) {
  const compact = variant === "compact";
  const expanded = variant === "expanded";

  return (
    <div className="space-y-4">
      {/* ---------- Price + Negotiation ---------- */}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              "font-bold tracking-tight text-primary",
              compact && "text-xl",
              variant === "default" && "text-2xl",
              expanded && "text-3xl"
            )}
          >
            {formatPrice(product.price)}
          </p>

          {product.negotiable && (
            <p className="mt-1 text-xs font-medium text-primary">
              Price is negotiable
            </p>
          )}
        </div>

        {showNegotiationStats && (
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />

            <span className="text-xs font-semibold text-primary whitespace-nowrap">
              {product.negotiationCount} negotiating
            </span>
          </div>
        )}
      </div>

      {/* ---------- Product Name ---------- */}

      <div>
        <h3
          className={cn(
            "font-semibold leading-snug text-foreground line-clamp-2",

            compact && "text-base",

            variant === "default" && "text-lg",

            expanded && "text-xl"
          )}
        >
          {product.name}
        </h3>

        {!compact && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {product.description}
          </p>
        )}
      </div>

      {/* ---------- Features ---------- */}

      <div className="flex flex-wrap gap-2">
        {product.features
          .slice(0, compact ? 2 : expanded ? 5 : 3)
          .map((feature) => (
            <span
              key={feature}
              className="
                rounded-full
                bg-surface
                px-3
                py-1
                text-xs
                font-medium
                text-muted
              "
            >
              {feature}
            </span>
          ))}
      </div>

      {/* ---------- Tags ---------- */}

      {!compact && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="
                rounded-full
                border
                border-border
                px-3
                py-1
                text-xs
                text-muted
              "
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ---------- Social Proof ---------- */}

      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          ❤️ {product.saveCount.toLocaleString()} saves
        </span>

        <span>
          {new Date(product.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}