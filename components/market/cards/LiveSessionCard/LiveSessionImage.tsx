"use client";

import { Heart } from "lucide-react";

import {
  CardImage,
  TopOverlay,
} from "@/components/market/common/CardImage";

import { SellerLiveSession } from "@/types";

import { cn } from "@/lib/utils";
import { useHaggleStore } from "@/lib/app-store";

interface LiveSessionImageProps {
  session: SellerLiveSession;
  variant: "compact" | "default" | "expanded";
}

export function LiveSessionImage({
  session,
  variant,
}: LiveSessionImageProps) {
  const savedIds = useHaggleStore(
    (state) => state.savedItemIds
  );

  const toggleSavedItem = useHaggleStore(
    (state) => state.toggleSavedItem
  );

  const saved = savedIds.includes(session.id);

  return (
    <CardImage
      image={session.coverImageUrl}
      alt={session.title}
      aspectRatio={
        variant === "compact"
          ? "portrait"
          : "landscape"
      }
      topOverlay={
        <TopOverlay>

          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              session.status === "Live now"
                ? "bg-danger text-white"
                : "bg-white/90 text-foreground"
            )}
          >
            {session.status}
          </span>

          <button
            onClick={() =>
              toggleSavedItem(session.id)
            }
            className={cn(
              "rounded-full p-2 backdrop-blur transition",
              saved
                ? "bg-primary text-white"
                : "bg-white/90 text-foreground"
            )}
          >
            <Heart
              className="h-4 w-4"
              fill={
                saved
                  ? "currentColor"
                  : "none"
              }
            />
          </button>

        </TopOverlay>
      }
      bottomOverlay={
        <div className="space-y-2">

          <p className="text-sm text-white/80">
            {session.schedule}
          </p>

          <h3 className="text-xl font-bold text-white">
            {session.title}
          </h3>

        </div>
      }
    />
  );
}