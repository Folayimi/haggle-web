"use client";

import { BadgeCheck, MapPin } from "lucide-react";

import { CardImage, BottomOverlay } from "@/components/market/common/CardImage";

import { Seller } from "@/types";
import Image from "next/image";

interface BusinessBannerProps {
  seller: Seller;
}

export function BusinessBanner({ seller }: BusinessBannerProps) {
  return (
    <CardImage
      image={seller.bannerUrl}
      alt={seller.name}
      aspectRatio="banner"
      bottomOverlay={
        <BottomOverlay justify="between">
          <div className="flex items-center gap-4">
            <Image
              width={500}
              height={500}
              sizes="(max-width:768px) 100vw,
           (max-width:1200px) 50vw,
           33vw"
              src={seller.avatarUrl}
              alt={seller.name}
              className="h-16 w-16 rounded-full border-2 border-white object-cover"
            />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">
                  {seller.name}
                </h2>

                {seller.isVerified && (
                  <BadgeCheck className="h-5 w-5 text-sky-400" />
                )}
              </div>

              <p className="text-white/80">@{seller.username}</p>

              <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
                <MapPin className="h-4 w-4" />

                <span>
                  {seller.hero.location.city}, {seller.hero.location.country}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
            Level {seller.sellerLevel}
          </div>
        </BottomOverlay>
      }
    />
  );
}
