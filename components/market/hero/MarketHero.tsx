"use client";

import Link from "next/link";

import { Search, Sparkles } from "lucide-react";

import { LiveIndicator } from "./LiveIndicator";

import { MarketHeroProps } from "../common/types";

export function MarketHero({
  liveCount,
}: MarketHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/30">

      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"/>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10">

        <LiveIndicator count={liveCount}/>

        <div className="max-w-3xl">

          <h1 className="text-5xl font-black tracking-tight">

            Discover what's worth
            <br/>

            negotiating today.

          </h1>

          <p className="mt-4 text-lg text-muted">

            Browse products, services,
            live sellers and businesses
            around you.

          </p>

        </div>

        <div className="flex max-w-2xl items-center gap-3">

          <div className="relative flex-1">

            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/>

            <input
              placeholder="Search products, businesses or services..."
              className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 outline-none transition focus:border-primary"
            />

          </div>

          <Link
            href="/post-product"
            className="rounded-full bg-primary px-6 py-3 font-semibold text-white"
          >
            <Sparkles className="mr-2 inline h-4 w-4"/>

            List Item

          </Link>

        </div>

      </div>

    </section>
  );
}