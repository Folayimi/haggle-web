// components/business-profile/SectionPlaceholder.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";

interface SectionPlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  isOwner?: boolean;
  hasContent?: boolean;
}

export default function SectionPlaceholder({
  title,
  description,
  icon,
  onAction,
  actionLabel = "Setup",
  isOwner = false,
  hasContent = false,
}: SectionPlaceholderProps) {
  // If it has content, render a different card (for now, still placeholder)
  // In future, this will render the actual content

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-border/40 bg-background-elevated/20 backdrop-blur-sm p-6 shadow-card transition-all duration-200 hover:shadow-soft hover:border-border/60"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-xs text-muted/70 mt-0.5 line-clamp-2">{description}</p>
        </div>
      </div>

      {isOwner && !hasContent && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-strong transition group"
          >
            <Plus className="h-4 w-4" />
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}

      {!isOwner && !hasContent && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-muted/40">No content yet</p>
        </div>
      )}

      {hasContent && (
        <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
          <p className="text-xs text-success">✓ Content ready</p>
          <button className="text-xs text-muted/50 hover:text-foreground transition">
            View
          </button>
        </div>
      )}
    </motion.div>
  );
}