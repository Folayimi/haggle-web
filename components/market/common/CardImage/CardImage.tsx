"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { CardImageProps } from "./types";

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  banner: "aspect-[16/7]",
};

export function CardImage({
  image,
  alt,
  className,
  topOverlay,
  zoomOnHover = true,
}: CardImageProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden h-full",
        className
      )}
    >
      {/* Image */}
      <Image
        src={image}
        alt={alt}
        height={500}
        width={500}
        className={cn(
          "object-cover transition-transform duration-500 w-full h-full",
          zoomOnHover && "group-hover:scale-105 object-cover"
        )}
      />

      {/* Default Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Top Overlay */}
      {topOverlay && (
        <div className="absolute inset-x-4 top-4 z-10">
          {topOverlay}
        </div>
      )}
    </div>
  );
}