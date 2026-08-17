"use client";

import { Clock3, Users } from "lucide-react";

import { MarketService } from "@/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
// import { formatCurrency } from "@/lib/formatters";

interface ServiceMetaProps {
  service: MarketService;
  variant: "compact" | "default" | "expanded";
}

export function ServiceMeta({
  service,
  variant,
}: ServiceMetaProps) {
  const compact = variant === "compact";
  const expanded = variant === "expanded";

  return (
    <div className="space-y-4">
      {/* ---------- Price ---------- */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={cn(
              "font-bold tracking-tight text-primary",
              compact && "text-xl",
              variant === "default" && "text-2xl",
              expanded && "text-3xl"
            )}
          >
            {formatPrice(service.price)}
          </p>

          <p className="mt-1 text-xs text-muted">
            Starting price
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5">
          <Clock3 className="h-4 w-4 text-secondary" />

          <span className="text-xs font-semibold text-secondary">
            {service.deliveryTime}
          </span>
        </div>
      </div>

      {/* ---------- Service Name ---------- */}

      <div>
        <h3
          className={cn(
            "font-semibold leading-snug text-foreground line-clamp-2",
            compact && "text-base",
            variant === "default" && "text-lg",
            expanded && "text-xl"
          )}
        >
          {service.name}
        </h3>

        {!compact && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {service.description}
          </p>
        )}
      </div>

      {/* ---------- Includes ---------- */}

      <div className="flex flex-wrap gap-2">
        {service.includes
          .slice(0, compact ? 2 : expanded ? 5 : 3)
          .map((item) => (
            <span
              key={item}
              className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted"
            >
              {item}
            </span>
          ))}
      </div>

      {/* ---------- Audience ---------- */}

      {!compact && (
        <div className="rounded-2xl border border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />

            <span className="text-sm font-medium">
              Best for
            </span>
          </div>

          <p className="mt-2 text-sm text-muted">
            {service.audience}
          </p>
        </div>
      )}

      {/* ---------- Social Proof ---------- */}

      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          {service.bookingCount.toLocaleString()} bookings
        </span>

        <span>
          {service.category}
        </span>
      </div>
    </div>
  );
}