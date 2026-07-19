// components/business-profile/AchievementsSection.tsx
"use client";

import { motion } from "framer-motion";
import { Award, Trophy, ShieldCheck, Clock, Star, Briefcase, Heart, Rocket, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/lib/types";

interface AchievementsSectionProps {
  achievements: Achievement[];
  isOwner: boolean;
  className?: string;
}

const iconMap: Record<string, any> = {
  Trophy, ShieldCheck, Clock, Star, Briefcase, Heart, Rocket, ShoppingBag, Award,
};

export default function AchievementsSection({
  achievements,
  isOwner,
  className,
}: AchievementsSectionProps) {
  const earned = achievements.filter(a => a.earned);
  const total = achievements.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-3xl border border-border/40 bg-background-elevated/20 backdrop-blur-sm p-6 shadow-card",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-5">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
        <span className="text-sm text-muted/60">{earned.length} / {total} earned</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {achievements.map((ach) => {
          const Icon = iconMap[ach.icon] || Award;
          return (
            <div
              key={ach.id}
              className={cn(
                "rounded-xl border p-4 text-center transition-all",
                ach.earned
                  ? "border-primary/30 bg-primary/5 hover:shadow-soft"
                  : "border-border/30 bg-background-elevated/5 opacity-60"
              )}
            >
              <div className={cn(
                "mx-auto w-10 h-10 rounded-full flex items-center justify-center",
                ach.earned ? "bg-primary/20 text-primary" : "bg-muted/10 text-muted/30"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-2 text-xs font-medium text-foreground/80">{ach.name}</div>
              <div className="text-[10px] text-muted/50">{ach.description}</div>
              {ach.earned && ach.earnedAt && (
                <div className="text-[8px] text-muted/40 mt-1">Earned {new Date(ach.earnedAt).toLocaleDateString()}</div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}