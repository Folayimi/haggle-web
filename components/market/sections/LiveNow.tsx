"use client";

import { motion } from "framer-motion";
import { LiveSessionCard } from "@/components/market/cards/LiveSessionCard";
import { Carousel } from "../common/Carousel";
import { SectionActionButton, SectionHeader } from "../common/SectionHeader";

import { SellerLiveSession } from "@/types";

interface LiveNowProps {
  sessions: SellerLiveSession[];
  onViewAll?: () => void;
}

export function LiveNow({ sessions, onViewAll }: LiveNowProps) {
  if (!sessions.length) return null;

  const liveSessions = sessions.filter((session) => session.status === "Live now");

  if (!liveSessions.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Happening Live"
        subtitle="Join live negotiations happening right now."
        action={
          onViewAll ? (
            <SectionActionButton label="View all" onClick={onViewAll} />
          ) : undefined
        }
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

        <Carousel
          items={liveSessions}
          itemWidth={280}
          gap={12}
          renderItem={(session) => (
            <LiveSessionCard session={session} />
          )}
        />
      </motion.div>
    </section>
  );
}
