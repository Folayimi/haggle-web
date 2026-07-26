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
      className="group overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={collection.coverImage}
          width={500}
          height={500}
          alt={collection.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute bottom-5 left-5">
          <div className="mb-3 text-4xl">{collection.emoji}</div>

          <h3 className="text-xl font-bold text-white">{collection.title}</h3>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="line-clamp-2 text-sm text-muted">
          {collection.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {collection.productIds.length} Items
          </span>

          <Link
            href={`/collections/${collection.id}`}
            className="flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Browse
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
