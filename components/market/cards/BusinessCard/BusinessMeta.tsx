"use client";

import {
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Seller } from "@/types";
import { formatLocation } from "@/lib/market";
import { cn } from "@/lib/utils";

interface BusinessMetaProps {
  seller: Seller;
  variant: "compact" | "default" | "expanded";
}

export function BusinessMeta({
  seller,
  variant,
}: BusinessMetaProps) {
  const compact = variant === "compact";
  const expanded = variant === "expanded";

  return (
    <div className="space-y-5">

      {/* Business Bio */}

      <div>
        <h3
          className={cn(
            "font-semibold leading-tight",
            compact && "text-lg",
            variant === "default" && "text-xl",
            expanded && "text-2xl"
          )}
        >
          {seller.businessName}
        </h3>

        <p
          className={cn(
            "mt-2 text-sm leading-6 text-muted",
            compact ? "line-clamp-2" : "line-clamp-3"
          )}
        >
          {seller.bio}
        </p>
      </div>

      {/* Trust Metrics */}

      <div className="grid grid-cols-2 gap-3">

        <div className="rounded-2xl bg-surface p-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-warning text-warning" />

            <span className="font-semibold">
              {seller.review.rating.toFixed(1)}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted">
            {seller.review.totalReviews.toLocaleString()} reviews
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-4">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary" />

            <span className="font-semibold">
              {seller.averageResponseTime}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted">
            Average response
          </p>
        </div>

      </div>

      {/* Quick Info */}

      <div className="space-y-3 rounded-2xl border border-border bg-background-elevated p-4">

        <div className="flex items-center gap-3 text-sm">
          <MapPin className="h-4 w-4 text-primary" />

          <span>
            {formatLocation(seller.location)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <ShieldCheck className="h-4 w-4 text-primary" />

          <span>
            {seller.responseRate}% response rate
          </span>
        </div>

      </div>

    </div>
  );
}