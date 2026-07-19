// components/business-profile/BusinessStory.tsx
"use client";

import { motion } from "framer-motion";
import { Edit3, Sparkles, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================
interface BusinessStoryProps {
  story: string;
  isOwner: boolean;
  onEdit?: () => void;
  className?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function BusinessStory({ story, isOwner, onEdit, className }: BusinessStoryProps) {
  // If no story and not owner, show nothing
  if (!story && !isOwner) return null;

  // If no story and owner, show empty state with setup prompt
  if (!story && isOwner) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "rounded-3xl border border-dashed border-border/40 bg-background-elevated/10 p-8 text-center",
          className
        )}
      >
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Quote className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Tell your business story</h3>
        <p className="text-sm text-muted mt-1 max-w-md mx-auto">
          Share your journey, mission, and what makes your business special. Customers love stories.
        </p>
        <button
          onClick={onEdit}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25"
        >
          <Edit3 className="h-4 w-4" />
          Add Story
        </button>
      </motion.div>
    );
  }

  // Has story - display it
  const formattedStory = story.split("\n").filter(line => line.trim() !== "");

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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary flex-shrink-0 mt-0.5">
            <Quote className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Business Story</h3>
            <p className="text-sm text-muted">Our journey, mission, and values</p>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={onEdit}
            className="rounded-full p-2 text-muted hover:bg-surface hover:text-foreground transition"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3 text-sm text-muted/80 leading-relaxed">
        {formattedStory.map((paragraph, index) => (
          <p key={index} className="text-foreground/90">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Optional: AI-generated summary or tags */}
      {story.length > 100 && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-muted/60">
              ✨ This story helps build trust with customers.
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}