// components/business-profile/ProfileCompletionCard.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { CompletionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProfileCompletionCardProps {
  completion: CompletionStatus;
  onAction: (field: keyof CompletionStatus) => void;
  className?: string;
}

const COMPLETION_ITEMS: {
  key: keyof CompletionStatus;
  label: string;
  actionLabel: string;
}[] = [
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
  const [isExpanded, setIsExpanded] = useState(false);

  const total = COMPLETION_ITEMS.length;
  const completed = COMPLETION_ITEMS.filter(
    (item) => completion[item.key],
  ).length;
  const percentage = Math.round((completed / total) * 100);
  const remaining = COMPLETION_ITEMS.filter((item) => !completion[item.key]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "rounded-2xl border border-border/40 bg-background-elevated/10 backdrop-blur-sm p-4 shadow-sm",
        className,
      )}
    >
      {/* Compact header: progress bar + stats + action */}
      <div className="flex items-center gap-3">
        {/* Progress bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground/80">
                Profile
              </span>
              <span className="text-xs font-semibold text-primary">
                {percentage}%
              </span>
            </div>
            {remaining.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-muted/50 hover:text-foreground transition flex items-center gap-0.5"
              >
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                <span>{remaining.length} left</span>
              </button>
            )}
          </div>
          <div className="w-full h-1.5 rounded-full bg-border/60 overflow-hidden mt-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Action button (only if incomplete) */}
        {remaining.length > 0 && (
          <button
            onClick={() => onAction(remaining[0].key)}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition flex-shrink-0"
          >
            Continue
            <span className="hidden sm:inline">Setup</span>
            <span className="text-[10px]">→</span>
          </button>
        )}
      </div>

      {/* Expandable checklist */}
      <AnimatePresence>
        {isExpanded && remaining.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-2 pt-2 border-t border-border/30"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {remaining.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onAction(item.key)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all text-left hover:bg-background-elevated/20"
                >
                  <Circle className="h-3 w-3 text-muted/30 flex-shrink-0" />
                  <span className="truncate text-muted/70">{item.label}</span>
                  <AlertCircle className="h-3 w-3 text-warning/50 flex-shrink-0 ml-auto" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-muted/40">
              <Clock className="h-3 w-3" />
              <span>Estimated {Math.max(1, remaining.length * 2)} min</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
