"use client";

import { motion } from "framer-motion";
import { Flame, MapPin } from "lucide-react";

import { ProductCard } from "@/components/haggle-ui";
import { Carousel } from "../common/Carousel";
import { SectionHeader } from "../common/SectionHeader";

import { SellerProduct } from "@/types";

interface TrendingNearYouProps {
  products: SellerProduct[];
  location?: string;
}

export function TrendingNearYou({
  products,
  location = "Your Area",
}: TrendingNearYouProps) {
  if (!products.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title={`Trending in ${location}`}
        subtitle="Products people around you are viewing, negotiating and buying."
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-6 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="rounded-2xl bg-orange-500/10 p-3">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>

              <div>
                <h3 className="text-xl font-bold">Hot Around You</h3>

                <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                  <MapPin className="h-4 w-4" />

                  {location}
                </p>
              </div>
            </div>

            <div className="hidden rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary md:block">
              Updated every few minutes
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
