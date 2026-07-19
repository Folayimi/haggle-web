// components/business-profile/ProfileCompletionCard.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle, ChevronRight, Clock, AlertCircle, ArrowRight } from "lucide-react";
import type { CompletionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProfileCompletionCardProps {
  completion: CompletionStatus;
  onAction: (field: keyof CompletionStatus) => void;
  className?: string;
}

const COMPLETION_ITEMS: { key: keyof CompletionStatus; label: string; actionLabel: string }[] = [
  { key: "logo", label: "Business Logo", actionLabel: "Add Logo" },
  { key: "cover", label: "Cover Image", actionLabel: "Add Cover" },
  { key: "story", label: "Business Story", actionLabel: "Write Story" },
  { key: "contact", label: "Contact Information", actionLabel: "Add Contact" },
  { key: "hours", label: "Business Hours", actionLabel: "Set Hours" },
  { key: "delivery", label: "Delivery Policy", actionLabel: "Set Delivery" },
  { key: "gallery", label: "Gallery", actionLabel: "Add Photos" },
  { key: "social", label: "Social Links", actionLabel: "Connect" },
  { key: "team", label: "Team Members", actionLabel: "Add Team" },
];

export default function ProfileCompletionCard({
  completion,
  onAction,
  className,
}: ProfileCompletionCardProps) {
  const total = COMPLETION_ITEMS.length;
  const completed = COMPLETION_ITEMS.filter((item) => completion[item.key]).length;
  const percentage = Math.round((completed / total) * 100);

  const remaining = COMPLETION_ITEMS.filter((item) => !completion[item.key]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "rounded-3xl border border-border/40 bg-background-elevated/20 backdrop-blur-sm p-6 shadow-card",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Left: Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-lg font-semibold text-foreground">
              Business Website <span className="text-sm font-normal text-muted/60">Complete</span>
            </h4>
            <span className="text-2xl font-bold text-primary">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-border/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted/50 mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Estimated time: {Math.max(1, remaining.length * 2)} minutes
          </p>
        </div>

        {/* Right: Action Button */}
        {remaining.length > 0 && (
          <button
            onClick={() => onAction(remaining[0].key)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25 flex-shrink-0"
          >
            Continue Setup
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Checklist */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
        {COMPLETION_ITEMS.map((item) => {
          const isComplete = completion[item.key];
          return (
            <button
              key={item.key}
              onClick={() => onAction(item.key)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all text-left",
                isComplete
                  ? "text-success/80 bg-success/5 hover:bg-success/10"
                  : "text-muted/60 bg-background-elevated/10 hover:bg-background-elevated/20 hover:text-foreground"
              )}
            >
              {isComplete ? (
                <CheckCircle className="h-3.5 w-3.5 text-success flex-shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-muted/30 flex-shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
              {!isComplete && <AlertCircle className="h-3 w-3 text-warning/60 flex-shrink-0 ml-auto" />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}