"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { FeaturedCollection } from "@/types";
import Image from "next/image";

interface CollectionCardProps {
  collection: FeaturedCollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="market-card group min-w-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          src={collection.coverImage}
          width={500}
          height={500}
          alt={collection.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

      </div>

      <div className="flex items-start justify-between gap-3 pt-2.5">
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
            <span className="mr-1.5" aria-hidden="true">{collection.emoji}</span>
            {collection.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-muted">
          {collection.description}
          </p>
        </div>
        <Link
          href={`/collections/${collection.id}`}
          className="market-card-action inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Browse
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
