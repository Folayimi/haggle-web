"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeaderProps } from "./types";



export function SectionHeader({
  title,
  subtitle,
  href,
  hrefLabel = "See all",
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">

      <div className="min-w-0">

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .25 }}
          className="text-2xl font-bold tracking-tight"
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: .05 }}
            className="mt-1 max-w-2xl text-sm leading-6 text-muted"
          >
            {subtitle}
          </motion.p>
        )}

      </div>

      {action}

      {!action && href && (
        <Link
          href={href}
          className="
            group
            inline-flex
            items-center
            gap-2
            whitespace-nowrap
            rounded-full
            border
            border-border
            bg-background-elevated
            px-4
            py-2
            text-sm
            font-medium
            transition-all
            hover:border-primary/40
            hover:bg-primary/5
          "
        >
          {hrefLabel}

          <ArrowRight
            className="
              h-4
              w-4
              transition-transform
              group-hover:translate-x-1
            "
          />
        </Link>
      )}

    </div>
  );
}