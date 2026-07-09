"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Package,
  Sparkles,
  Users,
  Video,
  Wand2,
  Zap,
  Award,
  TrendingUp,
  ArrowRight,
  DollarSign,
  MessageCircle,
  CheckCircle,
  BarChart3,
  Camera,
  Mic,
  MessageSquare,
  ShoppingBag,
  Layers,
  Play,
  Handshake,
  Flame,
  Gift,
  Star,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";

// ============================================
// TYPES
// ============================================
type CarouselImage = {
  id: number;
  src: string;
  alt: string;
  dynamicLabel: string;
  icon: React.ReactNode;
};

// ============================================
// CONSTANTS - Carousel Images with Dynamic Labels
// ============================================
const CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: 1,
    src: "/img1.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "🔥 27 Offers Today",
    icon: <Flame className="h-4 w-4 text-orange-400" />,
  },
  {
    id: 2,
    src: "/img2.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "💬 14 Active Negotiations",
    icon: <MessageCircle className="h-4 w-4 text-blue-400" />,
  },
  {
    id: 3,
    src: "/img3.webp",
    alt: "Marketplace negotiation",
    dynamicLabel: "📈 ₦84.5k Earned This Week",
    icon: <TrendingUp className="h-4 w-4 text-green-400" />,
  },
  {
    id: 4,
    src: "/img4.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "⭐ 4.8 Seller Rating",
    icon: <Star className="h-4 w-4 text-yellow-400" />,
  },
  {
    id: 5,
    src: "/img5.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "🎯 32 Products Listed",
    icon: <Package className="h-4 w-4 text-purple-400" />,
  },
  {
    id: 6,
    src: "/img6.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "🤝 6 Deals Closed Today",
    icon: <Handshake className="h-4 w-4 text-green-400" />,
  },
  {
    id: 7,
    src: "/img7.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "📅 4 Upcoming Lives",
    icon: <Calendar className="h-4 w-4 text-blue-400" />,
  },
  {
    id: 8,
    src: "/img8.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "🚀 Top 5% Seller",
    icon: <Award className="h-4 w-4 text-yellow-400" />,
  },
  {
    id: 9,
    src: "/img9.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "📦 2.4k Products Sold",
    icon: <ShoppingBag className="h-4 w-4 text-orange-400" />,
  },
  {
    id: 10,
    src: "/img10.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "⏰ 92% Response Rate",
    icon: <Clock className="h-4 w-4 text-green-400" />,
  },
  {
    id: 11,
    src: "/img11.jpg",
    alt: "Marketplace negotiation",
    dynamicLabel: "💰 68% Offer Acceptance",
    icon: <CheckCircle className="h-4 w-4 text-teal-400" />,
  },
  {
    id: 12,
    src: "/img12.webp",
    alt: "Marketplace negotiation",
    dynamicLabel: "👥 12 Active Buyers",
    icon: <Users className="h-4 w-4 text-blue-400" />,
  },
  {
    id: 13,
    src: "/img13.jpg",
    alt: "Shopping marketplace",
    dynamicLabel: "🏪 Haggle Studio",
    icon: <Sparkles className="h-4 w-4 text-yellow-400" />,
  },
];

// ============================================
// CONSTANTS - Right Column Cards (Shortened Descriptions)
// ============================================
const RIGHT_CARDS = [
  {
    id: "post-product",
    title: "Post Product",
    description: "List items with pricing and negotiation settings.",
    icon: <Package className="h-6 w-6" />,
    href: "/post-product",
    color: "success" as const,
    stat: "2.4k listed",
    step: "②",
    label: "CREATE",
  },
  {
    id: "add-service",
    title: "Add Service",
    description: "Create service listings and packages.",
    icon: <Sparkles className="h-6 w-6" />,
    href: "/add-service",
    color: "warning" as const,
    stat: "1.8k added",
    step: "③",
    label: "CREATE",
  },
  {
    id: "seller-studio",
    title: "Seller Studio",
    description: "Configure your live room.",
    icon: <Layers className="h-6 w-6" />,
    href: "/room-styling",
    color: "primary" as const,
    stat: "12 presets",
    step: "①",
    label: "SETUP",
  },
  {
    id: "host-live",
    title: "Host Live Shopping",
    description: "Schedule and manage live sessions.",
    icon: <Play className="h-6 w-6" />,
    href: "/schedule-live",
    color: "secondary" as const,
    stat: "3.1k scheduled",
    step: "④",
    label: "GO LIVE",
  },
];

// ============================================
// CAROUSEL COMPONENT (With Dynamic Labels)
// ============================================
function LiveCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentImage = CAROUSEL_IMAGES[currentIndex];

  const imageVariants = {
    enter: { opacity: 0, scale: 1.02 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={`/images/${currentImage.src}`}
            alt={currentImage.alt}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* STRONGER OVERLAY - ensures readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Dynamic Label - Top Left */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6 z-10 flex items-center gap-2"
      >
        <div className="rounded-full bg-black/40 backdrop-blur-sm px-4 py-2 border border-white/10">
          <span className="text-sm font-semibold text-white flex items-center gap-2">
            {currentImage.icon}
            {currentImage.dynamicLabel}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// TOOLTIP BUTTON COMPONENT
// ============================================
function TooltipButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="
          rounded-full bg-white/15 backdrop-blur-sm p-3
          text-white hover:bg-white/25 transition border border-white/10
        "
      >
        {icon}
      </button>
      <div
        className="
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        pointer-events-none whitespace-nowrap
      "
      >
        <span className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm border border-white/10">
          {label}
        </span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-black/80 border-r border-b border-white/10" />
      </div>
    </div>
  );
}

// ============================================
// LIVE ROOM PREVIEW CARD - Enhanced with larger radius + subtle glow
// ============================================
function LiveRoomPreview() {
  return (
    <div
      className="
        relative overflow-hidden rounded-[32px]
        border border-border
        bg-surface-strong
        shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.35)]
        flex-1
        min-h-[300px]
      "
    >
      <div className="absolute inset-0">
        <LiveCarousel />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div />

        {/* Controls */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-white/60 tracking-wider uppercase">
            Manage Controls
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <TooltipButton
                icon={<Camera className="h-5 w-5" />}
                label="Set up camera"
              />
              <TooltipButton
                icon={<Mic className="h-5 w-5" />}
                label="Configure microphone"
              />
              <TooltipButton
                icon={<MessageSquare className="h-5 w-5" />}
                label="Open chat settings"
              />
              <TooltipButton
                icon={<ShoppingBag className="h-5 w-5" />}
                label="Manage products"
              />
            </div>

            {/* REFINED GO LIVE BUTTON */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/instant-live"
                className="
      inline-flex items-center gap-2.5
      rounded-full bg-primary px-7 py-3.5
      text-base font-bold text-white
      shadow-lg shadow-primary/25
      hover:shadow-xl hover:shadow-primary/35
      transition-all duration-300
      hover:bg-primary-strong
      border border-primary/20
      relative
    "
              >
                <Zap className="h-5 w-5" />
                <span>Go Live</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// GLASSY ACTION CARD (With Hierarchy Support)
// ============================================
function GlassyActionCard({
  title,
  description,
  icon,
  href,
  color,
  stat,
  step,
  label,
  index,
  isTop = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: "primary" | "secondary" | "success" | "warning";
  stat: string;
  step: string;
  label: string;
  index: number;
  isTop?: boolean;
}) {
  const colorMap = {
    primary: {
      icon: "text-primary",
      badge: "text-primary border-primary/20 bg-primary/5",
      arrow: "text-primary",
      border: "hover:border-primary/20",
    },
    secondary: {
      icon: "text-secondary",
      badge: "text-secondary border-secondary/20 bg-secondary/5",
      arrow: "text-secondary",
      border: "hover:border-secondary/20",
    },
    success: {
      icon: "text-success",
      badge: "text-success border-success/20 bg-success/5",
      arrow: "text-success",
      border: "hover:border-success/20",
    },
    warning: {
      icon: "text-warning",
      badge: "text-warning border-warning/20 bg-warning/5",
      arrow: "text-warning",
      border: "hover:border-warning/20",
    },
  };

  const config = colorMap[color];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <div
        className={`
          h-full rounded-2xl
          border border-border/40
          bg-background-elevated/70 backdrop-blur-md backdrop-saturate-150
          transition-all duration-200
          shadow-card hover:shadow-soft
          hover:border-border
          ${config.border}
          overflow-hidden
          relative
          ${!isTop ? "opacity-85" : ""}
        `}
      >
        <Link
          href={href}
          className="flex flex-col items-start gap-1.5 p-4 h-full"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-muted/40">{step}</span>
            <span
              className={`text-[8px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-full border ${config.badge}`}
            >
              {label}
            </span>
          </div>

          <div
            className={`${config.icon} transition-all duration-300 group-hover:scale-105`}
          >
            {icon}
          </div>

          <div className="flex-1 min-w-0 w-full mt-1">
            <p className="font-semibold text-sm text-foreground truncate">
              {title}
            </p>
            <p className="text-xs text-muted/70 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted/50 mt-auto pt-1">
            <span>{stat}</span>
            <ArrowRight
              className={`h-3.5 w-3.5 ${config.arrow} transition-transform group-hover:translate-x-1`}
            />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================
// CIRCULAR PROGRESS INDICATOR (With Sparkline + Visible Time Labels)
// ============================================
function CircularProgress({
  label,
  value,
  progress,
  color = "primary",
  icon,
  trend,
  trendValue,
  timeLabel,
  sparkline = [],
}: {
  label: string;
  value: string;
  progress: number;
  color?: "primary" | "secondary" | "success" | "warning" | "gold";
  icon?: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  timeLabel?: string;
  sparkline?: number[];
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const colorMap = {
    primary: "text-primary stroke-primary",
    secondary: "text-secondary stroke-secondary",
    success: "text-success stroke-success",
    warning: "text-warning stroke-warning",
    gold: "text-amber-500 stroke-amber-500",
  };

  // Generate sparkline path
  const sparklinePath =
    sparkline.length > 0
      ? sparkline
          .map((value, i) => {
            const x = (i / (sparkline.length - 1)) * 40;
            const y = 16 - (value / 100) * 14;
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
          })
          .join(" ")
      : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-col items-center rounded-2xl border border-border/40 bg-background-elevated/30 p-4 shadow-card backdrop-blur-sm relative"
    >
      {/* Time label - More visible */}
      {timeLabel && (
        <span className="absolute top-2 right-3 text-[11px] font-medium uppercase tracking-[0.15em] text-muted/60">
          {timeLabel}
        </span>
      )}

      <div className="relative">
        <svg className="h-24 w-24 -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-border/30"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className={`${colorMap[color]} transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <span className="text-muted/30">{icon}</span>}
          <span className="text-lg font-bold text-foreground">{value}</span>
          {trend && trendValue && (
            <div
              className={`flex items-center gap-0.5 text-xs font-medium mt-0.5 ${
                trend === "up" ? "text-success" : "text-danger"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingUp className="h-3 w-3 rotate-180" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sparkline chart */}
      {sparkline.length > 0 && (
        <div className="mt-1 w-16 h-5">
          <svg viewBox="0 0 40 16" className="w-full h-full">
            <polyline
              points={sparklinePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className={`${colorMap[color]}`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Area fill under sparkline */}
            <polygon
              points={`0,16 ${sparklinePath} 40,16`}
              fill="currentColor"
              className={`${colorMap[color]} opacity-10`}
            />
          </svg>
        </div>
      )}

      <p className="mt-1 text-xs font-medium text-muted/70">{label}</p>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
const CreatePage = () => {
  return (
    <AppShell>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 mx-auto max-w-7xl w-full px-3 py-5 lg:px-6 flex flex-col">
          {/* MAIN SPLIT LAYOUT */}
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <LiveRoomPreview />

            {/* RIGHT CARDS - 2x2 Grid with Hierarchy */}
            <div className="grid grid-cols-2 grid-rows-[1.2fr_0.8fr] gap-4">
              {RIGHT_CARDS.map((card, index) => (
                <GlassyActionCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  href={card.href}
                  color={card.color}
                  stat={card.stat}
                  step={card.step}
                  label={card.label}
                  index={index}
                  isTop={index < 2}
                />
              ))}
            </div>
          </div>

          {/* METRICS - KPI with Time Labels & Sparklines */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
            <CircularProgress
              label="Total Earnings"
              value="₦84.5k"
              progress={78}
              color="gold"
              icon={<DollarSign className="h-4 w-4" />}
              trend="up"
              trendValue="12%"
              timeLabel="This Week"
              sparkline={[30, 45, 38, 55, 62, 70, 78]}
            />

            <CircularProgress
              label="Response Rate"
              value="92%"
              progress={92}
              color="success"
              icon={<MessageCircle className="h-4 w-4" />}
              trend="up"
              trendValue="4%"
              timeLabel="Today"
              sparkline={[88, 89, 90, 91, 92, 92, 93]}
            />

            <CircularProgress
              label="Offer Acceptance"
              value="68%"
              progress={68}
              color="primary"
              icon={<CheckCircle className="h-4 w-4" />}
              trend="down"
              trendValue="2%"
              timeLabel="This Month"
              sparkline={[72, 70, 68, 69, 68, 67, 68]}
            />

            <CircularProgress
              label="Live Attendance"
              value="74%"
              progress={74}
              color="secondary"
              icon={<Users className="h-4 w-4" />}
              trend="up"
              trendValue="8%"
              timeLabel="Last 30 Days"
              sparkline={[60, 62, 65, 68, 70, 72, 74]}
            />
          </div>

          {/* BOTTOM BAR */}
          <div
            className="
            mt-4 flex flex-wrap items-center justify-between gap-3 
            rounded-2xl border border-border/50 
            bg-surface-strong 
            px-4 py-3 
            shadow-card
            flex-shrink-0
          "
          >
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-warning" />
                Level 4 Seller
              </span>
              <span className="h-4 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-success" />
                12 listings this week
              </span>
              <span className="h-4 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                92% response rate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Next level:</span>
              <div className="h-1.5 w-24 rounded-full bg-border overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-secondary" />
              </div>
              <span className="text-xs font-medium text-foreground">75%</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default CreatePage;
