"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BottomOverlayProps {
  children: ReactNode;
  className?: string;
  justify?: "start" | "between" | "end";
}

const justifyClasses = {
  start: "justify-start",
  between: "justify-between",
  end: "justify-end",
};

export function BottomOverlay({
  children,
  className,
  justify = "between",
}: BottomOverlayProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-3",
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}