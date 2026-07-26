"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  Radio,
} from "lucide-react";

import { Seller } from "@/types";
import { cn } from "@/lib/utils";
import { formatLocation } from "@/lib/location";

interface LiveSessionSellerProps {
  seller: Seller;
  compact?: boolean;
}

export function LiveSessionSeller({
  seller,
  compact = false,
}: LiveSessionSellerProps) {
  return (
    <Link
      href={`/business/${seller.username}`}
      className={cn(
        "group block rounded-2xl border border-border bg-surface transition-all duration-200",
        "hover:border-primary/30 hover:bg-surface/80 hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Avatar */}

        <div className="relative">
          <Image
            src={seller.avatarUrl}
            alt={seller.businessName}
            width={compact ? 44 : 52}
            height={compact ? 44 : 52}
            className="rounded-full object-cover"
          />

          {seller.verified && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>

        {/* Seller */}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-semibold">
              {seller.businessName}
            </h4>

            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Lv.{seller.sellerLevel}
            </span>
          </div>

          <p className="truncate text-sm text-muted">
            @{seller.username}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {seller.review.rating.toFixed(1)}
            </span>

            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {formatLocation(seller.location)}
            </span>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-1" />
      </div>

      {!compact && (
        <div className="grid grid-cols-3 border-t border-border">
          <div className="flex flex-col items-center py-3">
            <span className="flex items-center gap-1 text-sm font-semibold">
              <Radio className="h-3.5 w-3.5 text-danger" />
              Live
            </span>

            <span className="text-[11px] text-muted">
              Host
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-border py-3">
            <span className="text-sm font-semibold">
              {seller.responseRate}%
            </span>

            <span className="text-[11px] text-muted">
              Response
            </span>
          </div>

          <div className="flex flex-col items-center py-3">
            <div className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5 text-primary" />

              <span className="text-sm font-semibold">
                {seller.averageResponseTime}
              </span>
            </div>

            <span className="text-[11px] text-muted">
              Avg. Reply
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}