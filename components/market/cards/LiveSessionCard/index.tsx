"use client";

import { SellerLiveSession, Seller } from "@/types";
import { getSellerById } from "@/components/market/data/market";

import { LiveSessionImage } from "./LiveSessionImage";
import { LiveSessionMeta } from "./LiveSessionMeta";
import { LiveSessionSeller } from "./LiveSessionSeller";
import { motion } from "framer-motion";
import { LiveSessionActions } from "./LiveSessionAction";

interface LiveSessionCardProps {
  session: SellerLiveSession;

  variant?: "compact" | "default" | "expanded";

  showSeller?: boolean;

  className?: string;
}

export function LiveSessionCard({
  session,
  variant = "default",
  showSeller = true,
  className,
}: LiveSessionCardProps) {
  const seller = getSellerById(session.sellerId);

  if (!seller) return null;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="panel overflow-hidden rounded-[30px]"
    >
      {/* Cover */}

      <LiveSessionImage session={session} variant={variant} />

      <div className="space-y-5 p-5">
        {/* Session Details */}

        <LiveSessionMeta session={session} variant={variant} />

        {/* Seller */}

        {showSeller && (
          <LiveSessionSeller seller={seller} compact={variant === "compact"} />
        )}

        {/* CTA */}

        <LiveSessionActions session={session} seller={seller} />
      </div>
    </motion.article>
  );
}
