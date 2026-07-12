// components/feed/MarketMood.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Flame, ShoppingBag, Users, Handshake } from "lucide-react";

// ============================================
// TYPES
// ============================================
interface MarketMoodItem {
  icon: React.ReactNode;
  text: string;
  color: string;
}

// ============================================
// MOCK DATA
// ============================================
const MOODS: MarketMoodItem[] = [
  { icon: <Flame className="w-3.5 h-3.5" />, text: "Mile 12 is active • 387 sellers live", color: "text-orange-400" },
  { icon: <ShoppingBag className="w-3.5 h-3.5" />, text: "Fashion District • 102 live shows", color: "text-rose-400" },
  { icon: <MapPin className="w-3.5 h-3.5" />, text: "📍Yaba • 127 sellers live", color: "text-blue-400" },
  { icon: <Handshake className="w-3.5 h-3.5" />, text: "18 people negotiating nearby", color: "text-emerald-400" },
  { icon: <Users className="w-3.5 h-3.5" />, text: "32 new sellers joined today", color: "text-purple-400" },
  { icon: <Flame className="w-3.5 h-3.5" />, text: "🔥 Sarah accepted an offer", color: "text-orange-400" },
  { icon: <ShoppingBag className="w-3.5 h-3.5" />, text: "14 orders packed today", color: "text-emerald-400" },
  { icon: <MapPin className="w-3.5 h-3.5" />, text: "📍Ikeja • 94 sellers live", color: "text-blue-400" },
  { icon: <Handshake className="w-3.5 h-3.5" />, text: "Wholesale negotiations active", color: "text-purple-400" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const MarketMood = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOODS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const mood = MOODS[currentIndex];

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-1.5 text-xs font-medium ${mood.color} bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5`}
        >
          {mood.icon}
          <span>{mood.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};