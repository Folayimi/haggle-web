"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { CardImage } from "@/components/market/common/CardImage";
import { ActionButton } from "@/components/market/common/ActionButton";
import { useHaggleStore } from "@/lib/app-store";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { MarketService } from "@/types";

export interface ServiceCardProps {
  service: MarketService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const savedIds = useHaggleStore((state) => state.savedItemIds);
  const toggleSavedItem = useHaggleStore((state) => state.toggleSavedItem);
  const saved = savedIds.includes(service.id);
  const price =
    typeof service.price === "string"
      ? Number(service.price.replace(/[^\d.-]/g, ""))
      : Number(service.price);

  return (
    <article className="market-card group min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <CardImage
          image={service.imageUrl}
          alt={service.name}
          className="h-full w-full [&_img]:h-full"
          topOverlay={
            <div className="flex items-center justify-between gap-2">
              <span className="max-w-[70%] truncate rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur sm:px-3 sm:text-xs">
              {service.category}
              </span>
              <button
                type="button"
                onClick={() => toggleSavedItem(service.id)}
                aria-label={saved ? "Remove service from favorites" : "Add service to favorites"}
                aria-pressed={saved}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/50 bg-black/70 text-white shadow-md backdrop-blur transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  saved && "border-primary bg-primary text-white hover:bg-primary-strong",
                )}
              >
                <Heart className="h-4 w-4 stroke-[2.5]" fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
          }
        />

        <p className="absolute bottom-2 left-2 z-10 rounded-md bg-black/55 px-2.5 py-1 text-sm font-bold text-white shadow-sm backdrop-blur-sm sm:bottom-3 sm:left-3">
          {Number.isFinite(price) ? formatPrice(price) : "Price unavailable"}
          <span className="ml-1 text-[10px] font-medium text-white/70">starting</span>
        </p>
      </div>

      <div className="flex items-start justify-between gap-3 pt-2.5">
        <div className="min-w-0">
          <h2 className="line-clamp-1 text-sm font-semibold text-foreground">{service.name}</h2>
          <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-muted">{service.description}</p>
        </div>
        <ActionButton asChild variant="secondary" size="sm" className="market-card-action shrink-0">
          <Link href={`/services/${service.id}/book`}>Request Service</Link>
        </ActionButton>
      </div>
    </article>
  );
}
