"use client";

import { CalendarClock } from "lucide-react";

import { Carousel } from "../common/Carousel";
import { MarketSection } from "../common/MarketSection";
import { LiveSessionCard } from "@/components/market/cards/LiveSessionCard";

import { SellerLiveSession } from "@/types";

interface UpcomingLiveProps {
  sessions: SellerLiveSession[];
}

export function UpcomingLive({ sessions }: UpcomingLiveProps) {
  const upcoming = sessions.filter((item) => item.status !== "Live now");

  if (!upcoming.length) return null;

  return (
    <MarketSection
      title="Upcoming Live Events"
      subtitle="Schedule a reminder so you never miss a negotiation."
    >
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4">
        <CalendarClock className="h-6 w-6 text-primary" />

        <div>
          <p className="font-semibold">Live Events Coming Soon</p>

          <p className="text-sm text-muted">
            Join sellers as they launch new products.
          </p>
        </div>
      </div>

      <Carousel
        items={upcoming}
        itemWidth={320}
        renderItem={(session) => (
          <LiveSessionCard session={session} variant="compact" />
        )}
      />
    </MarketSection>
  );
}
