"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { CardImage } from "@/components/market/common/CardImage";
import { ActionButton } from "@/components/market/common/ActionButton";
import { useHaggleStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import { SellerLiveSession } from "@/types";

interface LiveSessionCardProps {
  session: SellerLiveSession;
}

export function LiveSessionCard({ session }: LiveSessionCardProps) {
  const savedIds = useHaggleStore((state) => state.savedItemIds);
  const toggleSavedItem = useHaggleStore((state) => state.toggleSavedItem);
  const saved = savedIds.includes(session.id);
  const isLive = session.status === "Live now";

  return (
    <article className="market-card group min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <CardImage
          image={session.coverImageUrl}
          alt={session.title}
          className="h-full w-full [&_img]:h-full"
          topOverlay={
            <div className="flex items-center justify-between">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                isLive ? "bg-danger text-white" : "bg-white/95 text-foreground",
              )}
            >
              {session.status}
            </span>
            <button
              type="button"
              onClick={() => toggleSavedItem(session.id)}
              aria-label={saved ? "Remove event from favorites" : "Add event to favorites"}
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

      <div className="flex items-start justify-between gap-3 pt-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-muted">{session.schedule}</p>
          <h2 className="line-clamp-1 text-sm font-semibold text-foreground">{session.title}</h2>
          <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-muted">{session.preview}</p>
        </div>
        <ActionButton asChild size="sm" className="market-card-action shrink-0">
          <Link href={`/live/${session.id}`}>{isLive ? "Join Live" : "View Event"}</Link>
        </ActionButton>
      </div>
    </article>
  );
}
