"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import ServiceCard from "@/components/market/cards/ServiceCard";
import { MarketSection } from "../common/MarketSection";
import { SectionActionButton } from "../common/SectionHeader";

import { MarketService } from "@/types";

interface ServiceFeedProps {
  services: MarketService[];
  onServiceSelect?: (service: MarketService) => void;
  onViewAll?: () => void;
}

const INITIAL = 8;

export function ServiceFeed({
  services,
  onServiceSelect,
  onViewAll,
}: ServiceFeedProps) {
  const [visible, setVisible] = useState(INITIAL);

  const visibleServices = services.slice(0, visible);

  if (!services.length) return null;

  return (
    <MarketSection
      title="Professional Services"
      subtitle="Book trusted professionals around you."
      action={
        onViewAll ? (
          <SectionActionButton label="View all" onClick={onViewAll} />
        ) : undefined
      }
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),280px))] justify-start gap-x-4 gap-y-6">
        {visibleServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            viewport={{ once: true }}
          >
            <ServiceCard service={service} onSelect={onServiceSelect} />
          </motion.div>
        ))}
      </div>

      {visible < services.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisible((v) => v + INITIAL)}
            className="rounded-full bg-primary px-6 py-3 font-semibold text-white"
          >
            Load More
          </button>
        </div>
      )}
    </MarketSection>
  );
}
