// components/business-profile/AIAssistantWidget.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles, ArrowRight, MessageSquare, Lightbulb, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAssistantWidgetProps {
  suggestions: { id: string; message: string; action?: () => void }[];
  isOwner: boolean;
  className?: string;
}

export default function AIAssistantWidget({
  suggestions,
  isOwner,
  className,
}: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOwner) return null;

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-primary p-3 shadow-lg shadow-primary/30 hover:shadow-xl transition-all hover:scale-105"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
      </button>

      {/* Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 rounded-2xl border border-border/40 bg-background-elevated/90 backdrop-blur-xl shadow-2xl p-5 max-h-[500px] overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-foreground">AI Business Assistant</h4>
            </div>
            <p className="text-xs text-muted/60 mb-4">
              Smart suggestions to grow your business
            </p>

            {suggestions.length === 0 ? (
              <p className="text-sm text-muted/50">Everything looks great! Keep up the good work.</p>
            ) : (
              <div className="space-y-3">
                {suggestions.map((s) => (
                  <div key={s.id} className="rounded-xl border border-border/30 bg-background-elevated/20 p-3">
                    <p className="text-sm text-foreground/80">{s.message}</p>
                    {s.action && (
                      <button
                        onClick={s.action}
                        className="mt-2 text-xs text-primary hover:text-primary-strong flex items-center gap-1"
                      >
                        Take action <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}