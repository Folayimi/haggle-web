"use client";

import { motion } from "framer-motion";

import { MarketService } from "@/types";
import { cn } from "@/lib/utils";


import { ServiceImage } from "./ServiceImage";
import { ServiceMeta } from "./ServiceMeta";
import { ServiceSeller } from "./ServiceSeller";
import { ServiceActions } from "./ServiceActions";
import { getSellerById } from "@/components/market/data/market";

export interface ServiceCardProps {
  service: MarketService;

  variant?: "compact" | "default" | "expanded";

  showSeller?: boolean;

  showActions?: boolean;
}

export default function ServiceCard({
  service,
  variant = "default",
  showSeller = true,
  showActions = true,
}: ServiceCardProps) {
  const seller = getSellerById(service.sellerId);

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: .25 }}
      className={cn(
        "group overflow-hidden rounded-[24px] border border-border bg-background shadow-sm transition-all",
        "hover:border-primary/20 hover:shadow-xl",

        variant === "compact" && "max-w-[250px]",
        variant === "default" && "max-w-[300px]",
        variant === "expanded" && "max-w-[360px]"
      )}
    >
      <ServiceImage
        service={service}
        variant={variant}
      />

      <div className="space-y-5 p-5">

        <ServiceMeta
          service={service}
          variant={variant}
        />

        {showSeller && seller && (
          <ServiceSeller seller={seller} />
        )}

        {showActions && seller && (
          <ServiceActions
            service={service}
            seller={seller}
          />
        )}

      </div>
    </motion.article>
  );
}