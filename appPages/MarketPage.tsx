"use client";
import { AppShell } from "@/components/app-shell";
import { MarketSearch } from "@/components/market/search/MarketSearch";
import { useState } from "react";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// BroadcastButton (unchanged)
// ============================================================
interface BroadcastButtonProps {
  onClick?: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function BroadcastButton({
  onClick,
  className,
  size = "default",
}: BroadcastButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:bg-primary-strong transition",
        sizeClasses[size],
        className,
      )}
    >
      <Megaphone
        className={cn(
          "h-4 w-4",
          size === "sm" && "h-3 w-3",
          size === "lg" && "h-5 w-5",
        )}
      />
      Broadcast
    </button>
  );
}

// ============================================================
// FEED COMPONENTS (placeholders – refined architecture)
// ============================================================

// Hero – 280px
const MarketplaceHero = () => (
  <div className="w-full h-[280px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]">
    Marketplace Hero
  </div>
);

// Quick Categories – 72px, utility strip
const QuickCategories = () => (
  <div className="w-full h-[72px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]">
    Quick Categories
  </div>
);

// Trending Near You – horizontal rail, 220x280 cards
const TrendingNearYouSection = () => (
  <div className="space-y-2">
    <div className="text-sm font-medium text-white/70">Trending Near You</div>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="min-w-[220px] h-[280px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3] shrink-0"
        >
          Product Card
        </div>
      ))}
    </div>
  </div>
);

// Negotiations Happening Now – horizontal rail, 280x200 cards
const LiveNegotiationsSection = () => (
  <div className="space-y-2">
    <div className="text-sm font-medium text-white/70">Negotiations Happening Now</div>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="min-w-[280px] h-[200px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3] shrink-0"
        >
          Negotiation Card
        </div>
      ))}
    </div>
  </div>
);

// Based On Your Interests – 2‑column grid, 220px height
const InterestBasedProductsSection = () => (
  <div className="space-y-2">
    <div className="text-sm font-medium text-white/70">Based On Your Interests</div>
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[220px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]"
        >
          Interest Product Card
        </div>
      ))}
    </div>
  </div>
);

// Deals Around You – banner, 220px
const DealsAroundYouSection = () => (
  <div className="space-y-2">
    <div className="text-sm font-medium text-white/70">Deals Around You</div>
    <div className="w-full h-[220px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]">
      Deals Banner
    </div>
  </div>
);

// Services Around You – 3‑column grid, 200px height
const ServicesAroundYouSection = () => (
  <div className="space-y-2">
    <div className="text-sm font-medium text-white/70">Services Around You</div>
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[200px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]"
        >
          Service Card
        </div>
      ))}
    </div>
  </div>
);

// Recently Added – horizontal rail, 160x180 cards
const RecentlyAddedSection = () => (
  <div className="space-y-2">
    <div className="text-sm font-medium text-white/70">Recently Added</div>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="min-w-[160px] h-[180px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3] shrink-0"
        >
          Collection Card
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// RIGHT SIDEBAR WIDGETS (order and heights as specified)
// ============================================================

const MarketplaceActivityWidget = () => (
  <div className="w-full h-[220px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]">
    Marketplace Activity
  </div>
);

const NegotiationActivityWidget = () => (
  <div className="w-full h-[200px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]">
    Negotiations Happening Now
  </div>
);

const SuggestedSellersWidget = () => (
  <div className="w-full h-[280px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]">
    Suggested Sellers
  </div>
);

const NearbyBusinessesWidget = () => (
  <div className="w-full h-[200px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]">
    Nearby Businesses
  </div>
);

const SponsoredWidget = () => (
  <div className="w-full h-[160px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]">
    Sponsored
  </div>
);

const CommunityHighlightsWidget = () => (
  <div className="w-full h-[200px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm text-[#b3b3b3]">
    Community Highlights
  </div>
);

// ============================================================
// MAIN PAGE
// ============================================================

const MarketPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppShell>
      <div className="w-full h-screen flex flex-col px-3">
        {/* Header – fixed height 64px, search bar 60% width, left aligned */}
        <header className="w-full h-16 sticky z-10 top-0 left-0 flex items-center justify-between pl-50 pr-20">
          <div className="flex-1 max-w-[60%] flex h-full items-center">
            <MarketSearch
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
          </div>
          <BroadcastButton />
        </header>

        {/* Main Content Area – gap-8 (32px) between columns */}
        <div className="flex flex-1 gap-8 overflow-hidden">
          {/* Marketplace Feed – scrollable, sections spaced 40px (space-y-10) */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-10 pb-20">
            <MarketplaceHero />
            <QuickCategories />
            <TrendingNearYouSection />
            <LiveNegotiationsSection />
            <InterestBasedProductsSection />
            <DealsAroundYouSection />
            <ServicesAroundYouSection />
            <RecentlyAddedSection />
          </div>

          {/* Right Workspace – fixed width, order and heights as specified */}
          <div className="w-[360px] shrink-0 overflow-y-auto space-y-5 pb-20">
            <MarketplaceActivityWidget />
            <NegotiationActivityWidget />
            <SuggestedSellersWidget />
            <NearbyBusinessesWidget />
            <SponsoredWidget />
            <CommunityHighlightsWidget />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default MarketPage;