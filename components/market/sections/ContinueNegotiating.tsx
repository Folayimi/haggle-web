"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3, MessageCircle, TrendingUp } from "lucide-react";

import { Carousel } from "../common/Carousel";
import { SectionHeader } from "../common/SectionHeader";

import { Negotiation, Seller, SellerProduct } from "@/types";

import {
  getProductById,
  getProductCover,
  getSellerById,
} from "@/components/market/data/market";
import Image from "next/image";

interface ContinueNegotiatingProps {
  negotiations: Negotiation[];
}

function NegotiationCard({ negotiation }: { negotiation: Negotiation }) {
  const product = getProductById(negotiation.productId);

  const seller = product ? getSellerById(product.sellerId) : undefined;

  if (!product) return null;

  const cover = getProductCover(product);

  const progress = (negotiation.currentOffer / negotiation.askingPrice) * 100;

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        overflow-hidden
        rounded-3xl
        border
        border-border/40
        bg-background
      "
    >
      <Image
        width={500}
        height={500}
        src={cover}
        alt={product.name}
        className="
          h-44
          w-full
          object-cover
        "
      />

      <div className="space-y-4 p-5">
        <div>
          <p
            className="
              line-clamp-1
              text-lg
              font-semibold
            "
          >
            {product.name}
          </p>

          <p className="text-sm text-muted">
            Sold by {seller?.name ?? "Unknown Seller"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Your Offer</span>

            <span className="font-semibold">
              ₦{negotiation.currentOffer.toLocaleString()}
            </span>
          </div>

          <div className="h-2 rounded-full bg-muted/20">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted">
            <span>Seller asks</span>

            <span>₦{negotiation.askingPrice.toLocaleString()}</span>
          </div>
        </div>

        <div
          className="
            rounded-2xl
            bg-muted/10
            p-3
          "
        >
          <div className="flex gap-2">
            <MessageCircle
              className="
                mt-0.5
                h-4
                w-4
                text-primary
              "
            />

            <div>
              <p className="text-xs text-muted">Latest Update</p>

              <p className="mt-1 text-sm">{negotiation.latestMessage}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Clock3 className="h-3 w-3" />

              {negotiation.updatedAt}
            </div>

            <div
              className="
    rounded-full
    bg-primary/10
    px-3
    py-1
    text-xs
    font-semibold
    capitalize
    text-primary
  "
            >
              {negotiation.status}
            </div>
          </div>

          <Link
            href={`/negotiations/${negotiation.id}`}
            className="
              rounded-full
              bg-primary
              px-4
              py-2
              text-sm
              font-semibold
              text-white
            "
          >
            Resume
          </Link>
        </div>

        {negotiation.unreadCount > 0 && (
          <div
            className="
              inline-flex
              rounded-full
              bg-primary/10
              px-3
              py-1
              text-xs
              font-semibold
              text-primary
            "
          >
            {negotiation.unreadCount} new message
            {negotiation.unreadCount > 1 && "s"}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ContinueNegotiating({
  negotiations,
}: ContinueNegotiatingProps) {
  if (!negotiations.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Continue Negotiating"
        subtitle="Pick up where you left off."
        href="/negotiations"
        hrefLabel="View all"
      />

      <Carousel
        items={negotiations}
        itemWidth={360}
        renderItem={(item) => <NegotiationCard negotiation={item} />}
      />
    </section>
  );
}
