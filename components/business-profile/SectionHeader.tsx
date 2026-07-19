// components/business-profile/SectionHeader.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
}

export default function SectionHeader({
  title,
  description,
  icon,
  action,
  className,
  variant = "default",
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "flex items-start justify-between gap-4",
      variant === "compact" ? "mb-3" : "mb-5",
      className
    )}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="rounded-lg bg-primary/10 p-2 text-primary flex-shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}