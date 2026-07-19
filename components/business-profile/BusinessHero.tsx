// components/business-profile/BusinessHero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Users,
  ShoppingBag,
  Clock,
  Zap,
  MessageCircle,
  Share2,
  Edit3,
  CheckCircle,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SellerProfile } from "@/lib/types";

interface BusinessHeroProps {
  user: SellerProfile;
  isOwner: boolean;
  isPreviewMode?: boolean; // ← new
  onEditHero?: () => void;
}

const STATUS_CONFIG = {
  open: { label: "Open", color: "bg-success text-white border-success/30" },
  closed: { label: "Closed", color: "bg-danger text-white border-danger/30" },
  live: { label: "🔴 Live", color: "bg-red-500 text-white border-red-400 animate-pulse" },
  away: { label: "Away", color: "bg-warning text-dark-900 border-warning/30" },
  holiday: { label: "Holiday", color: "bg-muted text-white border-muted/30" },
} as const;

export default function BusinessHero({
  user,
  isOwner,
  isPreviewMode = false,
  onEditHero,
}: BusinessHeroProps) {
  const hero = user.hero || {};
  const status = hero.status || "open";
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  const category = hero.category || "";
  const location = hero.location || "";
  const yearsInBusiness = hero.yearsInBusiness || 0;
  const slogan = hero.slogan || "";
  const verifiedBadge = hero.verifiedBadge ?? user.isVerified ?? false;

  const rating = user.rating ? parseFloat(user.rating) : 0;
  const followers = user.followers ? parseInt(user.followers.replace(/,/g, "")) : 0;
  const responseTime = hero.averageResponseTime || user.responseTime || "—";

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  };

  const coverImage =
    user.coverImageUrl ||
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop&q=80";

  return (
    <motion.div
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-b-[40px] md:rounded-b-[60px]"
    >
      {/* Cover */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-primary/20 via-background to-secondary/10">
        <Image src={coverImage} alt={`${user.businessName} cover`} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

        {/* Cover Edit Overlay – hidden in preview */}
        {isOwner && !isPreviewMode && (
          <button className="absolute top-4 right-4 z-10 rounded-full bg-black/40 backdrop-blur-sm p-2.5 text-white hover:bg-black/60 transition border border-white/10">
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative -mt-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          {/* Avatar */}
          <motion.div variants={childVariants} className="flex-shrink-0">
            <div className="relative">
              <div className="h-32 w-32 rounded-3xl border-4 border-background bg-background-elevated shadow-xl overflow-hidden">
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              {isOwner && !isPreviewMode && (
                <button className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-white shadow-lg hover:bg-primary-strong transition">
                  <Edit3 className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Business Info */}
          <motion.div variants={childVariants} className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                {user.businessName}
              </h1>
              {verifiedBadge && (
                <CheckCircle className="h-5 w-5 text-primary fill-primary/10 flex-shrink-0" />
              )}
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="font-medium text-foreground">{user.name}</span>
              <span className="h-1 w-1 rounded-full bg-muted/40" />
              <span>@{user.username}</span>
              {category && (
                <>
                  <span className="h-1 w-1 rounded-full bg-muted/40" />
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {category}
                  </span>
                </>
              )}
              {slogan && (
                <>
                  <span className="h-1 w-1 rounded-full bg-muted/40" />
                  <span className="text-muted/70">{slogan}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted/70">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location}
                </span>
              )}
              {yearsInBusiness > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {yearsInBusiness} years in business
                </span>
              )}
              {hero.averageResponseTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Avg. response {hero.averageResponseTime}
                </span>
              )}
            </div>
          </motion.div>

          {/* Actions – Edit button hidden in preview */}
          <motion.div variants={childVariants} className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {isOwner && !isPreviewMode ? (
              <button
                onClick={onEditHero}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25"
              >
                <Edit3 className="h-4 w-4" />
                Edit Hero
              </button>
            ) : (
              // Visitor actions (visible to everyone)
              <>
                <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25">
                  <Zap className="h-4 w-4" />
                  Go Live
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface">
                  Follow
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface">
                  <Share2 className="h-4 w-4" />
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Stats Row */}
      <motion.div
        variants={childVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
      >
        <div className="flex flex-wrap items-center gap-6 py-3 border-t border-b border-border/40">
          {[
            {
              icon: <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />,
              label: "Rating",
              value: rating.toFixed(1),
              detail: "reviews",
            },
            {
              icon: <Users className="h-4 w-4 text-blue-400" />,
              label: "Followers",
              value: followers.toLocaleString(),
              detail: "growing",
            },
            {
              icon: <ShoppingBag className="h-4 w-4 text-emerald-400" />,
              label: "Orders",
              value: "0",
              detail: "completed",
            },
            {
              icon: <Clock className="h-4 w-4 text-orange-400" />,
              label: "Response Time",
              value: responseTime,
              detail: "average",
            },
            {
              icon: <Award className="h-4 w-4 text-purple-400" />,
              label: "Trust Score",
              value: "86%",
              detail: "excellent",
            },
          ].map((stat, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <div className="rounded-full bg-background-elevated/30 p-1.5 border border-border/30">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted/60">{stat.label}</p>
              </div>
              {index < 4 && <span className="h-6 w-px bg-border/40" />}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}