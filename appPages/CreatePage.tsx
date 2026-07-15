"use client";

import { motion, AnimatePresence } from "framer-motion";
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
import { BroadCastShowRoom } from "@/components/BroadCastShowRoom";
import Link from "next/link";

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
            <BroadCastShowRoom />

            {/* RIGHT CARDS - 2x2 Grid with Hierarchy */}
            <div className="grid grid-cols-2 grid-rows-[1fr_1fr] gap-4">
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
        </div>
      </div>
    </AppShell>
  );
};

export default CreatePage;
