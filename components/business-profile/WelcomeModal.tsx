"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onContinue: () => void;
}

const BENEFITS = [
  "AI-powered insights",
  "Live shopping rooms",
  "Reach nearby buyers",
  "Instant negotiation",
  "Trust & verification",
  "Build your brand",
  "Analytics dashboard",
  "Customer engagement",
];

export default function WelcomeModal({
  isOpen,
  onClose,
  username,
  onContinue,
}: WelcomeModalProps) {
  const router = useRouter();

  const handleContinue = () => {
    onContinue();
    router.push(`/profile/${encodeURIComponent(username)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto p-4"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border/40 bg-background-elevated/80 p-6 pt-14 shadow-2xl backdrop-blur-xl sm:p-8 sm:pt-14"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close welcome modal"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Welcome to <span className="text-primary">Haggle</span> Business
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted/80">
                We&apos;re committed to growing your business. Here&apos;s what
                you get as a seller:
              </p>
            </div>

            <div className="mx-auto mb-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 text-sm font-medium text-foreground/85"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex w-full max-w-sm cursor-pointer items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-strong hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Set up your business
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-muted/40">
              You can always access your profile from the navigation bar.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
