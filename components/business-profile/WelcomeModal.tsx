// components/business-profile/WelcomeModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Rocket, Users, Zap, Shield, Star, TrendingUp, MessageSquare } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string; // current user's username
  onContinue: () => void; // navigate to profile
}

const BENEFITS = [
  { icon: <Sparkles className="h-5 w-5" />, label: "AI-powered insights" },
  { icon: <Rocket className="h-5 w-5" />, label: "Live shopping rooms" },
  { icon: <Users className="h-5 w-5" />, label: "Reach nearby buyers" },
  { icon: <Zap className="h-5 w-5" />, label: "Instant negotiation" },
  { icon: <Shield className="h-5 w-5" />, label: "Trust & verification" },
  { icon: <Star className="h-5 w-5" />, label: "Build your brand" },
  { icon: <TrendingUp className="h-5 w-5" />, label: "Analytics dashboard" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "Customer engagement" },
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
    router.push(`/profile/${username}`);
  };

  const handleExplore = () => {
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
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={handleExplore}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/40 bg-background-elevated/95 backdrop-blur-xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 text-primary mb-4">
                <Sparkles className="h-10 w-10" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Welcome to <span className="text-primary">Haggle</span> Business
              </h2>
              <p className="text-muted/80 mt-2 max-w-lg mx-auto">
                We're committed to growing your business. Here's what you get as a seller:
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {BENEFITS.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/30 bg-background-elevated/20 hover:bg-background-elevated/40 transition"
                >
                  <div className="text-primary">{benefit.icon}</div>
                  <span className="text-xs font-medium text-center text-foreground/80">
                    {benefit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleContinue}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:bg-primary-strong transition-all"
              >
                <Rocket className="h-5 w-5" />
                Go to My Profile
              </button>
              <button
                onClick={handleExplore}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 px-8 py-3.5 text-base font-medium text-foreground hover:bg-surface transition-all"
              >
                Explore on My Own
              </button>
            </div>

            <p className="text-xs text-muted/40 text-center mt-4">
              You can always access your profile from the navigation bar.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}