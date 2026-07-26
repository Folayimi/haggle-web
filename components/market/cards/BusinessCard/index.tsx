"use client";

import { Seller } from "@/types";

import { motion } from "framer-motion";

import { BusinessBanner } from "./BusinessBanner";
import { BusinessMeta } from "./BusinessMeta";
import { BusinessStats } from "./BusinessStats";
import { BusinessActions } from "./BusinessActions";

interface BusinessCardProps {
  seller: Seller;

  variant?: "compact" | "default" | "expanded";

  className?: string;
}

export function BusinessCard({
  seller,
  variant = "default",
  className,
}: BusinessCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="panel overflow-hidden rounded-[30px]"
    >
      <BusinessBanner seller={seller} variant={variant} />

      <div className="space-y-5 p-5">
        <BusinessMeta seller={seller} variant={variant} />

        <BusinessStats seller={seller} />

        <BusinessActions seller={seller} />
      </div>
    </motion.article>
  );
}
