"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";

import { Carousel } from "../common/Carousel";
import { SectionHeader } from "../common/SectionHeader";

import { Seller } from "@/types";
import Image from "next/image";

interface PopularBusinessesProps {
  businesses: Seller[];
}

function BusinessCard({ business }: { business: Seller }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="overflow-hidden rounded-3xl border border-border bg-background"
    >
      <img src={business.bannerUrl} className="h-36 w-full object-cover" />

      <div className="relative p-5">
        <Image
          width={500}
          height={500}
          src={business.avatarUrl}
          alt="img"
          className="
          transition-opacity duration-500 absolute
            -top-8
            h-16
            w-16
            rounded-full
            border-4
            border-background
            object-cover
          "
        />

        <div className="pt-10">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{business.businessName}</h3>

            {business.verified && (
              <BadgeCheck className="h-4 w-4 text-primary" />
            )}
          </div>

          <div className="mt-2 flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

            {business.review.rating}

            <span className="text-muted">({business.review.totalReviews})</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/10 p-3">
              <p className="text-xs text-muted">Followers</p>

              <p className="font-semibold">{business.followers}</p>
            </div>

            <div className="rounded-xl bg-muted/10 p-3">
              <p className="text-xs text-muted">Response</p>

              <p className="font-semibold">{business.responseRate}%</p>
            </div>
          </div>

          <Link
            href={`/business/${business.id}`}
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
              rounded-full
              bg-primary
              py-3
              font-semibold
              text-white
            "
          >
            Visit Store
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function PopularBusinesses({ businesses }: PopularBusinessesProps) {
  if (!businesses.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Popular Businesses"
        subtitle="Businesses customers trust and negotiate with the most."
      />

      <Carousel
        items={businesses}
        itemWidth={320}
        renderItem={(business) => <BusinessCard business={business} />}
      />
    </section>
  );
}
