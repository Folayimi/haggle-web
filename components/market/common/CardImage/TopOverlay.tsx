"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TopOverlayProps {
  children: ReactNode;
  className?: string;
  justify?: "start" | "between" | "end";
}

const justifyClasses = {
  start: "justify-start",
  between: "justify-between",
  end: "justify-end",
};

export function TopOverlay({
  children,
  className,
  justify = "between",
}: TopOverlayProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3",
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}