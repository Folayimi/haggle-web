// components/business-profile/DraftPublishBar.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Save, Check, Eye, EyeOff, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraftPublishBarProps {
  isDirty: boolean; // whether there are unsaved changes
  isSaving: boolean;
  isPublished: boolean;
  isPreviewMode: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onTogglePreview: () => void;
  onDiscard: () => void;
}

export default function DraftPublishBar({
  isDirty,
  isSaving,
  isPublished,
  isPreviewMode,
  onSaveDraft,
  onPublish,
  onTogglePreview,
  onDiscard,
}: DraftPublishBarProps) {
  return (
    <AnimatePresence>
      {!isPreviewMode ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background-elevated/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 flex-wrap justify-center"
        >
          {/* Preview toggle */}
          <button
            onClick={onTogglePreview}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted/70 hover:text-foreground transition px-3 py-1.5 rounded-full border border-border/30"
          >
            <Eye className="h-4 w-4" />
            Preview Website
          </button>

          <div className="w-px h-6 bg-border/30" />

          {/* Save Draft */}
          <button
            onClick={onSaveDraft}
            disabled={!isDirty || isSaving}
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition",
              isDirty && !isSaving
                ? "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                : "text-muted/40 cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Draft
              </>
            )}
          </button>

          {/* Publish */}
          {isDirty && (
            <button
              onClick={onPublish}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-white px-4 py-1.5 rounded-full shadow-lg shadow-primary/25 hover:bg-primary-strong transition"
            >
              <Check className="h-4 w-4" />
              Publish Changes
            </button>
          )}

          {/* Discard */}
          {isDirty && (
            <button
              onClick={onDiscard}
              className="text-xs text-muted/40 hover:text-danger transition p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Status indicator */}
          {!isDirty && !isSaving && (
            <span className="text-xs text-success flex items-center gap-1">
              <Check className="h-3 w-3" />
              All changes saved
            </span>
          )}
        </motion.div>
      ) : (
        // Preview mode bar
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background-elevated/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3"
        >
          <span className="text-xs text-muted/60 flex items-center gap-1">
            <EyeOff className="h-4 w-4" />
            Preview Mode
          </span>
          <button
            onClick={onTogglePreview}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-white px-4 py-1.5 rounded-full shadow-lg shadow-primary/25 hover:bg-primary-strong transition"
          >
            Exit Preview
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}