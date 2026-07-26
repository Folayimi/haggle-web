"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { ProductCard } from "@/components/haggle-ui";

import { Carousel } from "../common/Carousel";
import { SectionHeader } from "../common/SectionHeader";

import { SellerProduct } from "@/types";

interface RecommendedProps {
  products: SellerProduct[];
}

export function Recommended({ products }: RecommendedProps) {
  if (!products.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Recommended For You"
        subtitle="Curated based on your interests and recent activity."
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
          duration: 0.35,
        }}
      >
        <div className="mb-5 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-primary/10 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h3 className="text-xl font-bold">Picks just for you</h3>

              <p className="mt-1 text-sm text-muted">
                Personalized recommendations based on your interests, saved
                items and negotiations.
              </p>
            </div>
          </div>
        </div>

        <Carousel
          items={products}
          itemWidth={300}
          renderItem={(product) => <ProductCard product={product} />}
        />
      </motion.div>
    </section>
  );
}
