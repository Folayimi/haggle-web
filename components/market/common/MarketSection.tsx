"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { SectionHeader } from "./SectionHeader";
import { MarketSectionProps } from "./types";

export function MarketSection({
  title,
  subtitle,
  href,
  hrefLabel,
  action,
  children,
  className,
  animate = true,
}: MarketSectionProps) {

  const content = (
    <div className={cn("space-y-6", className)}>

      <SectionHeader
        title={title}
        subtitle={subtitle}
        href={href}
        hrefLabel={hrefLabel}
        action={action}
      />

      {children}

    </div>
  );

  if (!animate) {
    return (
      <section className="relative">
        {content}
      </section>
    );
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: .35,
        ease: "easeOut",
      }}
      className="relative"
    >
      {content}
    </motion.section>
  );
}