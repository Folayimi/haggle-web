"use client";

import { motion } from "framer-motion";
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
  Eye,
  ThumbsUp,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { BroadCastShowRoom } from "@/components/BroadCastShowRoom";
import Link from "next/link";
import { useHaggleStore } from "@/lib/app-store";
import SellerOnboardingPage from "./SellerOnboardingPage";

// ============================================
// CONSTANTS - Right Column Cards
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
        bg-background-elevated/20 backdrop-blur-sm
          transition-all duration-200
          shadow-card hover:shadow-soft
          hover:border-border
          ${config.border}
          overflow-hidden
          relative
          ${!isTop ? "opacity-85" : ""}
          flex flex-col p-5
        `}
      >
        <Link
          href={href}
          className="flex flex-col items-start gap-1.5 h-full w-full"
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
// ANALYTICS SECTION (Full Width)
// ============================================
function AnalyticsSection() {
  const metrics = [
    {
      label: "Total Earnings",
      value: "₦84,500",
      change: "+12%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5" />,
      color: "gold" as const,
      detail: "This week",
    },
    {
      label: "Response Rate",
      value: "92%",
      change: "+4%",
      trend: "up",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "success" as const,
      detail: "Today",
    },
    {
      label: "Offer Acceptance",
      value: "68%",
      change: "-2%",
      trend: "down",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "primary" as const,
      detail: "This month",
    },
    {
      label: "Live Attendance",
      value: "74%",
      change: "+8%",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
      color: "secondary" as const,
      detail: "Last 30 days",
    },
  ];

  const sparklines = [
    [30, 45, 38, 55, 62, 70, 78],
    [88, 89, 90, 91, 92, 92, 93],
    [72, 70, 68, 69, 68, 67, 68],
    [60, 62, 65, 68, 70, 72, 74],
  ];

  const colorMap = {
    primary: "text-primary stroke-primary",
    secondary: "text-secondary stroke-secondary",
    success: "text-success stroke-success",
    warning: "text-warning stroke-warning",
    gold: "text-amber-500 stroke-amber-500",
  };

  return (
    <div
      className="
        w-full
        transition-all duration-200
        flex-shrink-0
      "
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="
              rounded-xl
              bg-background-elevated/20 backdrop-blur-sm
              border border-border/30
              p-4
              transition-all duration-200
              hover:border-primary/30 hover:shadow-sm
            "
          >
            <div className="flex items-start justify-between">
              <div
                className={`rounded-lg ${colorMap[metric.color].split(" ")[0]} bg-primary/5 p-1.5`}
              >
                {metric.icon}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  metric.trend === "up" ? "text-success" : "text-danger"
                } flex items-center gap-0.5`}
              >
                {metric.change}
              </span>
            </div>

            <p className="mt-3 text-xl font-bold text-foreground">
              {metric.value}
            </p>
            <p className="text-xs text-muted">{metric.label}</p>
            <p className="text-[10px] text-muted/40 mt-1">{metric.detail}</p>

            <div className="mt-2 h-6 w-full">
              <svg viewBox="0 0 60 16" className="w-full h-full">
                <polyline
                  points={sparklines[idx]
                    .map((v, i) => {
                      const x = (i / (sparklines[idx].length - 1)) * 60;
                      const y = 16 - (v / 100) * 14;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className={colorMap[metric.color]}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polygon
                  points={sparklines[idx]
                    .map((v, i) => {
                      const x = (i / (sparklines[idx].length - 1)) * 60;
                      const y = 16 - (v / 100) * 14;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  pointsSuffix={` 60,16 0,16`}
                  fill="currentColor"
                  className={`${colorMap[metric.color]} opacity-10`}
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
const CreatePage = () => {
  const userData = useHaggleStore((state) => state.userData);
  return (
    <AppShell>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 mx-auto max-w-7xl w-full px-3 py-5 lg:px-6 flex flex-col">
          {/* Top Row: BroadcastShowRoom + Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5">
            {/* LEFT: BroadcastShowRoom - fills height */}
            <div className="h-full">
              <BroadCastShowRoom />
            </div>

            {/* RIGHT: Action Cards - 2x2 grid, fills height */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-100">
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

          {/* Bottom Row: Analytics - Full Width */}
          <div className="mt-6 w-full">
            <AnalyticsSection />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default CreatePage;
