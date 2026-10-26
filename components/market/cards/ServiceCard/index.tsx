"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Star } from "lucide-react";

import { CardImage } from "@/components/market/common/CardImage";
import { ActionButton } from "@/components/market/common/ActionButton";
import { useListingSave } from "@/components/market/hooks/useListingSave";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { MarketService } from "@/types";

export interface ServiceCardProps {
  service: MarketService;
  onSelect?: (service: MarketService) => void;
  onUnsave?: () => void;
  savePending?: boolean;
}

export default function ServiceCard({
  service,
  onSelect,
  onUnsave,
  savePending = false,
}: ServiceCardProps) {
  const { saved, pending, toggle } = useListingSave(service.id);
  const price =
    typeof service.price === "string"
      ? Number(service.price.replace(/[^\d.-]/g, ""))
      : Number(service.price);

  return (
    <article className="market-card group min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <button
          type="button"
          onClick={() => onSelect?.(service)}
          disabled={!onSelect}
          aria-label={`View ${service.name} details`}
          className="block h-full w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-default"
        >
          <CardImage
            image={service.imageUrl}
            alt={service.name}
            className="h-full w-full [&_img]:h-full"
          />
        </button>
        <div className="absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {service.sellerSummary?.avatar_url && (
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/70 shadow-sm">
                <Image
                  src={service.sellerSummary.avatar_url}
                  alt={`${service.sellerSummary.full_name || "Seller"} profile`}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <span className="max-w-[70%] truncate rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur sm:px-3 sm:text-xs">
              {service.category}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onUnsave) {
                onUnsave();
                return;
              }
              void toggle();
            }}
            disabled={pending || savePending}
            aria-label={onUnsave || saved ? "Remove service from favorites" : "Add service to favorites"}
            aria-pressed={saved}
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/50 bg-black/70 text-white shadow-md backdrop-blur transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              saved && "border-primary bg-primary text-white hover:bg-primary-strong",
            )}
          >
            <Heart className="h-4 w-4 stroke-[2.5]" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between gap-2 sm:bottom-3 sm:left-3 sm:right-3">
          <p className="min-w-0 truncate rounded-md bg-black/65 px-2.5 py-1 text-sm font-bold text-white shadow-sm backdrop-blur-sm">
            {Number.isFinite(price) ? `~${formatPrice(price)}` : "Price unavailable"}
            <span className="ml-1 text-[10px] font-medium text-white/70">starting</span>
          </p>
          <ActionButton
            asChild
            variant="secondary"
            size="sm"
            className="market-card-action shrink-0"
          >
            <Link
              href={`/service-detail/${encodeURIComponent(service.id)}`}
              className="pointer-events-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Negotiate
            </Link>
          </ActionButton>
        </div>
      </div>

      <div className="min-w-0 pt-2.5">
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(service)}
            className="line-clamp-1 text-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {service.name}
          </button>
        ) : (
          <h2 className="line-clamp-1 text-sm font-semibold text-foreground">
            {service.name}
          </h2>
        )}
        <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-muted">{service.description}</p>
        {service.recommendationReason && <p className="mt-1 text-[11px] font-medium text-primary">{recommendationLabel(service.recommendationReason)}</p>}
        {!!service.ratingSummary?.count && <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted"><Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />{service.ratingSummary.average.toFixed(1)} ({service.ratingSummary.count})</p>}
      </div>
    </article>
  );
}

function recommendationLabel(reason: NonNullable<MarketService["recommendationReason"]>) {
  const labels = {
    based_on_category: "Based on this category",
    based_on_followed_seller: "From a seller you follow",
    recently_listed: "Recently listed",
    trending: "Trending",
  };
  return labels[reason];
}
