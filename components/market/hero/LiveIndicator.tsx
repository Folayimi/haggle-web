"use client";

import { Flame } from "lucide-react";
import { LiveIndicatorProps } from "@/types/liveIndicator";

export function LiveIndicator({
  count,
  label = "Negotiations happening",
}: LiveIndicatorProps) {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2.5
        rounded-full
        border
        border-primary/20
        bg-primary/10
        px-4
        py-2
        backdrop-blur-xl
      "
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
      </span>

      <Flame className="h-4 w-4 text-primary" />

      <span className="text-sm font-semibold tracking-tight">
        {count.toLocaleString()}{" "}
        <span className="font-medium text-muted">{label}</span>
      </span>
    </div>
  );
}
