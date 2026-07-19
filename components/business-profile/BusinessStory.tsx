// components/business-profile/BusinessStory.tsx
"use client";

import { motion } from "framer-motion";
import { Edit3, Sparkles, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessStoryProps {
  story: string;
  businessName?: string;
  category?: string;
  isOwner: boolean;
  isPreviewMode?: boolean;
  onEdit?: () => void;
  className?: string;
}

export default function BusinessStory({
  story,
  businessName = "this business",
  category = "their craft",
  isOwner,
  isPreviewMode = false,
  onEdit,
  className,
}: BusinessStoryProps) {
  // If story exists, display it
  if (story && story.trim().length > 0) {
    const paragraphs = story.split("\n").filter((line) => line.trim() !== "");

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "rounded-3xl border border-border/40 bg-background-elevated/20 backdrop-blur-sm p-6 shadow-card",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary flex-shrink-0 mt-0.5">
              <Quote className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Business Story
              </h3>
              <p className="text-sm text-muted">
                Our journey, mission, and values
              </p>
            </div>
          </div>
          {isOwner && !isPreviewMode && (
            <button
              onClick={onEdit}
              className="rounded-full p-2 text-muted hover:bg-surface hover:text-foreground transition"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3 text-sm text-muted/80 leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-foreground/90">
              {p}
            </p>
          ))}
        </div>

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

  // No story: if owner and not preview, show empty state with add button
  if (isOwner && !isPreviewMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "rounded-3xl border border-dashed border-border/40 bg-background-elevated/10 p-8 text-center",
          className,
        )}
      >
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Quote className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Tell your business story
        </h3>
        <p className="text-sm text-muted mt-1 max-w-md mx-auto">
          Share your journey, mission, and what makes your business special.
          Customers love stories.
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

  // No story and (visitor or preview): show a default story from the business owner's perspective
  // This default text should be inspiring and align with Haggle's vision
  const defaultStory = `At ${businessName}, we are passionate about ${category}. Our journey began with a simple belief: that every product or service we offer should not only meet a need but also create a lasting connection with our community. We are committed to quality, transparency, and the spirit of collaboration that Haggle empowers. We believe in building relationships, not just transactions. Every interaction is an opportunity to grow together, and we are excited to share our story with you. Welcome to our corner of the Haggle marketplace – where every purchase is a step toward supporting local, sustainable business.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-3xl border border-border/40 bg-background-elevated/20 backdrop-blur-sm p-6 shadow-card",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary flex-shrink-0 mt-0.5">
          <Quote className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Business Story
          </h3>
          <p className="text-sm text-muted">Learn about {businessName}</p>
        </div>
      </div>
      <div className="mt-4 text-sm text-foreground/80 leading-relaxed">
        {defaultStory.split("\n").map((p, i) => (
          <p key={i} className={i > 0 ? "mt-3" : ""}>
            {p}
          </p>
        ))}
      </div>
      {!isPreviewMode && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-muted/50">
            This is a placeholder story.{" "}
            {isOwner
              ? "Add your own story to personalize your page."
              : "The business owner can add their personal story."}
          </p>
        </div>
      )}
    </motion.div>
  );
}
