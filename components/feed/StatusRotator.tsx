// components/feed/StatusRotator.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StatusRotatorProps {
  items: { icon: string; text: string }[];
  interval?: number;
}

export const StatusRotator = ({ items, interval = 4000 }: StatusRotatorProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  const current = items[index];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2"
      >
        <span>{current.icon}</span>
        <span className="text-sm text-white/80">{current.text}</span>
      </motion.div>
    </AnimatePresence>
  );
};