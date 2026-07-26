"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
}

export function Reveal({ children }: RevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
