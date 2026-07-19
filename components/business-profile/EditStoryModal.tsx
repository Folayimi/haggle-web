// components/business-profile/EditStoryModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Sparkles, Wand2 } from "lucide-react";

// ============================================
// TYPES
// ============================================
interface EditStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: string;
  onSave: (updatedStory: string) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function EditStoryModal({ isOpen, onClose, story, onSave }: EditStoryModalProps) {
  const [content, setContent] = useState(story || "");

  // Reset content when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent(story || "");
    }
  }, [isOpen, story]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(content);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/40 bg-background-elevated/90 backdrop-blur-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-surface hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-foreground">Business Story</h2>
            <p className="text-sm text-muted mt-1">Tell your story and connect with customers emotionally.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground/80">Your Story</label>
                <p className="text-xs text-muted/60 mt-0.5">
                  Share your journey, mission, and what makes your business special.
                </p>
                <textarea
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Started in 2019 with one sewing machine. Today we've served over 4,300 happy customers across Lagos..."
                  className="mt-2 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm resize-none"
                />
              </div>

              {/* AI Assistant Suggestion (optional) */}
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-foreground">💡 AI Story Helper</p>
                    <p className="text-xs text-muted/70 mt-0.5">
                      "We believe great stories build trust. Share how you started, what you care about, and why customers should choose you."
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-medium text-primary hover:text-primary-strong transition"
                    >
                      Generate example story
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-border/60 px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25"
                >
                  Save Story
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}