"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Flame,
  Play,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";

import { LiveIndicator } from "./LiveIndicator";
import { MarketHeroProps } from "@/types/marketHero";

export function MarketHero({ liveCount }: MarketHeroProps) {
  const featured = {
    title: "Vintage Ceramic Story Vase",
    seller: "Atelier Terra",
    price: 145,
    asking: 170,
    viewers: 182,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723b?w=1200&q=80",
  };

  return (
    <section className="overflow-hidden rounded-[36px] border border-border/40 bg-background-elevated/5">
      <div className="grid lg:grid-cols-[1fr_520px]">
        {/* LEFT */}

        <div className="flex flex-col justify-center px-10 py-10">
          <LiveIndicator count={liveCount} />

          <h1 className="mt-6 text-5xl font-bold tracking-tight leading-tight">
            Live sellers.
            <br />
            Better deals.
            <br />
            Real negotiations.
          </h1>

          <p className="mt-5 max-w-lg text-muted text-lg">
            Discover products around you, negotiate directly with sellers, and
            never overpay again.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/market"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-white font-semibold"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Deals
            </Link>

            <Link
              href="/live"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3"
            >
              <Play className="h-4 w-4" />
              Explore Live
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-full border border-border/40 px-4 py-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-semibold">7.4k</span>
              <span className="text-muted text-sm">Sellers</span>
            </div>

            <div className="rounded-full border border-border/40 px-4 py-2 flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              <span className="font-semibold">184</span>
              <span className="text-muted text-sm">Live</span>
            </div>

            <div className="rounded-full border border-border/40 px-4 py-2 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span className="font-semibold">12k</span>
              <span className="text-muted text-sm">Listings</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="w-[420px] shrink-0 rounded-3xl bg-red-500 h-[420px] flex items-center justify-center text-white text-4xl font-bold">
          RIGHT SIDE
        </div>
      </div>
    </section>
  );
}
