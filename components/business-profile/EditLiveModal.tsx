// components/business-profile/EditLiveModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Calendar, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================
interface LiveFormData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  coverImage?: string;
  status?: "live" | "upcoming" | "past";
}

interface EditLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: LiveFormData | null;
  onSave: (session: LiveFormData) => void;
  mode?: "schedule" | "edit" | "go-live";
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function EditLiveModal({
  isOpen,
  onClose,
  session,
  onSave,
  mode = "schedule",
}: EditLiveModalProps) {
  const isEditing = !!session?.id || mode === "edit";

  const [formData, setFormData] = useState<LiveFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    coverImage: "",
    status: "upcoming",
  });

  useEffect(() => {
    if (session) {
      setFormData({
        id: session.id,
        title: session.title || "",
        description: session.description || "",
        date: session.date || "",
        time: session.time || "",
        coverImage: session.coverImage || "",
        status: session.status || "upcoming",
      });
    } else {
      // Default to today's date and current time + 1 hour for scheduling
      const now = new Date();
      const defaultDate = now.toISOString().split("T")[0];
      const defaultTime = `${String(now.getHours() + 1).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setFormData({
        title: "",
        description: "",
        date: defaultDate,
        time: defaultTime,
        coverImage: "",
        status: "upcoming",
      });
    }
  }, [session, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: session?.id,
      status: mode === "go-live" ? "live" : formData.status || "upcoming",
    });
    onClose();
  };

  const isGoLive = mode === "go-live";

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
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-surface hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-foreground">
              {isGoLive ? "🔴 Go Live" : isEditing ? "Edit Live Session" : "Schedule Live Session"}
            </h2>
            <p className="text-sm text-muted mt-1">
              {isGoLive
                ? "Start broadcasting to your buyers right now."
                : isEditing
                ? "Update your live session details"
                : "Plan your next live shopping event"}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Session Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Summer Collection Launch"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What will buyers see and what's special about this live session?"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm resize-none"
                />
              </div>

              {/* Date & Time */}
              {!isGoLive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Cover Image (Optional) */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/live-cover.jpg"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                />
              </div>

              {/* AI Helper */}
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-foreground">💡 Live Shopping Tips</p>
                    <p className="text-xs text-muted/70 mt-0.5">
                      {isGoLive
                        ? "Going live now? Prepare your products and set up your camera for the best experience."
                        : "Promote your live session early to build anticipation and attract more buyers."}
                    </p>
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
                  className={cn(
                    "rounded-full px-6 py-2.5 text-sm font-semibold text-white transition shadow-lg",
                    isGoLive
                      ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
                      : "bg-primary hover:bg-primary-strong shadow-primary/25"
                  )}
                >
                  {isGoLive ? "Go Live Now" : isEditing ? "Update Session" : "Schedule Live"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}