"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { ServiceCard } from "@/components/haggle-ui";
import { MarketSection } from "../common/MarketSection";

import { MarketService } from "@/types";

interface ServiceFeedProps {
  services: MarketService[];
}

const INITIAL = 8;

export function ServiceFeed({ services }: ServiceFeedProps) {
  const [visible, setVisible] = useState(INITIAL);

  const visibleServices = services.slice(0, visible);

  if (!services.length) return null;

  return (
    <MarketSection
      title="Professional Services"
      subtitle="Book trusted professionals around you."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            viewport={{ once: true }}
          >
            <ServiceCard service={service} />
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
