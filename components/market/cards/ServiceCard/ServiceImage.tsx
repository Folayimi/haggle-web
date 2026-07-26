"use client";

import { CardImage, TopOverlay } from "@/components/market/common/CardImage";
import { MarketService } from "@/types";

interface ServiceImageProps {
  service: MarketService;
  variant: "compact" | "default" | "expanded";
}

export function ServiceImage({
  service,
  variant,
}: ServiceImageProps) {
  return (
    <CardImage
      image={service.imageUrl}
      alt={service.name}
      aspectRatio={
        variant === "compact"
          ? "portrait"
          : "landscape"
      }
      topOverlay={
        <TopOverlay justify="between">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white">
            {service.category}
          </span>

          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
            Service
          </span>
        </TopOverlay>
      }
      bottomOverlay={
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-white/80">
              Starting from
            </p>

            <h3 className="text-2xl font-bold text-white">
              ${service.price.toLocaleString()}
            </h3>
          </div>

          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white">
            {service.deliveryTime}
          </span>
        </div>
      }
    />
  );
}