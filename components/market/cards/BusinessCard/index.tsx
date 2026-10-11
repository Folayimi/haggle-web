"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, Star } from "lucide-react";

import { CardImage } from "@/components/market/common/CardImage";
import { ActionButton } from "@/components/market/common/ActionButton";
import { useHaggleStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import { Seller } from "@/types";

interface BusinessCardProps {
  seller: Seller;
}

export function BusinessCard({ seller }: BusinessCardProps) {
  const savedIds = useHaggleStore((state) => state.savedItemIds);
  const toggleSavedItem = useHaggleStore((state) => state.toggleSavedItem);
  const saved = savedIds.includes(seller.id);

  return (
    <article className="market-card group min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <CardImage
          image={seller.bannerUrl}
          alt={`${seller.name} storefront`}
          className="h-full w-full [&_img]:h-full"
          topOverlay={
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => toggleSavedItem(seller.id)}
                aria-label={saved ? "Remove business from favorites" : "Add business to favorites"}
                aria-pressed={saved}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-black/70 text-white shadow-md backdrop-blur transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  saved && "border-primary bg-primary text-white hover:bg-primary-strong",
                )}
              >
                <Heart className="h-4 w-4 stroke-[2.5]" fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
          }
        />
      </div>

      <div className="flex items-start gap-2.5 pt-2.5">
        <Image
          src={seller.avatarUrl}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-sm font-semibold text-foreground">{seller.name}</h2>
            {seller.isVerified && (
              <BadgeCheck aria-label="Verified business" className="h-4 w-4 shrink-0 text-primary" />
            )}
          </div>
          <p className="line-clamp-1 text-xs leading-4 text-muted">{seller.bio}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{seller.review.rating.toFixed(1)}</span>
            <span>({seller.review.totalReviews.toLocaleString()})</span>
            {seller.hero.location && <span className="ml-1 truncate">{seller.hero.location}</span>}
          </div>
        </div>
        <ActionButton asChild size="sm" className="market-card-action shrink-0">
          <Link href={`/business/${seller.username}`}>Visit Store</Link>
        </ActionButton>
      </div>
    </article>
  );
}
