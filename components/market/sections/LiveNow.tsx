"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";

import { LiveSessionCard } from "@/components/market/cards/LiveSessionCard";
import { Carousel } from "../common/Carousel";
import { SectionHeader } from "../common/SectionHeader";

import { SellerLiveSession } from "@/types";

interface LiveNowProps {
  sessions: SellerLiveSession[];
}

export function LiveNow({ sessions }: LiveNowProps) {
  if (!sessions.length) return null;

  const liveSessions = sessions.filter((session) => session.status === "Live now");

  if (!liveSessions.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Happening Live"
        subtitle="Join live negotiations happening right now."
        href="/market-search?type=lives"
        hrefLabel="View all"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <div className="mb-5 rounded-3xl border border-primary/15 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>

                <span className="text-xs font-semibold uppercase tracking-wide text-red-500">
                  Live
                </span>
              </div>

              <h2 className="text-3xl font-bold">
                {liveSessions.length} Live Negotiation
                {liveSessions.length > 1 ? "s" : ""}
              </h2>

              <p className="mt-2 max-w-lg text-muted">
                Join sellers as they showcase products, negotiate with buyers,
                answer questions, and close deals in real time.
              </p>
            </div>

            <Link
              href="/live"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-primary
                px-5
                py-3
                font-semibold
                text-white
                transition
                hover:scale-[1.03]
              "
            >
              <Radio className="h-4 w-4" />
              Browse Live
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Carousel
          items={liveSessions}
          itemWidth={320}
          renderItem={(session) => (
            <LiveSessionCard session={session} variant="compact"/>
          )}
        />
      </motion.div>
    </section>
  );
}
