"use client";

import Link from "next/link";
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
  Target,
  Gem,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";

// ============================================
// TYPES
// ============================================
type CarouselImage = {
  id: number;
  src: string;
  alt: string;
  label: string;
};

// ============================================
// CONSTANTS - Carousel Images
// ============================================
const CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&q=80",
    alt: "Marketplace negotiation",
    label: "Live Negotiation",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1567446537708-ac4f75e3eb5a?w=800&h=500&fit=crop&q=80",
    alt: "Seller interacting with buyers",
    label: "Seller Interaction",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop&q=80",
    alt: "Live shopping stream",
    label: "Live Shopping",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop&q=80",
    alt: "Shopping marketplace",
    label: "Haggle Studio",
  },
];

// ============================================
// CONSTANTS - Right Column Cards with Workflow
// ============================================
const RIGHT_CARDS = [
  {
    id: "seller-studio",
    title: "Seller Studio",
    description: "Set the look, feel, and room of your live session.",
    icon: <Layers className="h-6 w-6" />,
    href: "/room-styling",
    color: "primary" as const,
    stat: "12 presets",
    step: "①",
    label: "SETUP",
  },
  {
    id: "post-product",
    title: "Post Product",
    description: "List items with photos, price, and negotiation settings.",
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
    description: "Offer services with pricing tiers and portfolio samples.",
    icon: <Sparkles className="h-6 w-6" />,
    href: "/add-service",
    color: "warning" as const,
    stat: "1.8k added",
    step: "③",
    label: "CREATE",
  },
  {
    id: "host-live",
    title: "Host Live Shopping",
    description: "Schedule and host live shopping sessions.",
    icon: <Play className="h-6 w-6" />,
    href: "/schedule-live",
    color: "secondary" as const,
    stat: "3.1k scheduled",
    step: "④",
    label: "GO LIVE",
  },
];

// ============================================
// CAROUSEL COMPONENT
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

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-cover transition-opacity duration-700"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>
      <div className="absolute top-4 left-4 z-10">
        <span className="rounded-full bg-black/30 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border border-white/10">
          {currentImage.label}
        </span>
      </div>
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
// LIVE ROOM PREVIEW CARD
// ============================================
function LiveRoomPreview() {
  return (
    <div
      className="
        relative overflow-hidden rounded-3xl
        border border-border
        bg-surface-strong
        shadow-card
        flex-1
        min-h-[300px]
      "
    >
      <div className="absolute inset-0">
        <LiveCarousel />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div />

        {/* PREMIUM STATS BUBBLES - Apple Vision Pro Style */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
          {[
            {
              value: "₦84.5k",
              label: "Earned",
              icon: <TrendingUp className="h-3 w-3" />,
            },
            {
              value: "12",
              label: "Active Buyers",
              icon: <Users className="h-3 w-3" />,
            },
            {
              value: "27",
              label: "Offers Today",
              icon: <Handshake className="h-3 w-3" />,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="
                flex flex-col items-center justify-center
                w-24 h-24 rounded-full
                backdrop-blur-xl
                border border-white/10
                shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                transition-transform duration-300 hover:scale-105
              "
              style={{
                background: "rgba(20, 20, 20, 0.72)",
              }}
            >
              <span className="text-xl font-bold text-white flex items-center gap-0.5">
                {item.value}
                <span className="text-[10px] text-white/50">{item.icon}</span>
              </span>
              <span className="text-[9px] font-medium text-white/60 uppercase tracking-[0.08em] text-center px-1 leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

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

            <Link
              href="/instant-live"
              className="
                relative group inline-flex items-center gap-2.5
                rounded-full bg-primary px-7 py-3.5
                text-base font-bold text-white
                shadow-[0_0_40px_rgba(244,77,36,0.5)]
                hover:shadow-[0_0_60px_rgba(244,77,36,0.7)]
                transition-all duration-300
                hover:scale-105 hover:bg-primary-strong
                before:absolute before:inset-0 before:rounded-full
                before:bg-gradient-to-r before:from-primary before:via-primary/80 before:to-primary
                before:blur-xl before:opacity-70 before:-z-10
                animate-pulse-slow
                border-2 border-white/20
                flex-shrink-0
              "
            >
              <Zap className="h-5 w-5 fill-white/30" />
              <span>Go Live</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BRAND-COLORED GLASSY ACTION CARD (With Workflow)
// ============================================
function BrandGlassyActionCard({
  title,
  description,
  icon,
  href,
  color,
  stat,
  step,
  label,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: "primary" | "secondary" | "success" | "warning";
  stat: string;
  step: string;
  label: string;
}) {
  const colorConfig = {
    primary: {
      bg: "bg-primary/15",
      border: "border-primary/25",
      hoverBorder: "hover:border-primary/50",
      iconBg: "bg-primary/20",
      text: "text-primary",
      glow: "hover:shadow-[0_0_30px_rgba(244,77,36,0.15)]",
      shadow: "shadow-primary/10",
      labelBg: "bg-primary/20",
      labelText: "text-primary",
    },
    secondary: {
      bg: "bg-secondary/15",
      border: "border-secondary/25",
      hoverBorder: "hover:border-secondary/50",
      iconBg: "bg-secondary/20",
      text: "text-secondary",
      glow: "hover:shadow-[0_0_30px_rgba(107,78,255,0.15)]",
      shadow: "shadow-secondary/10",
      labelBg: "bg-secondary/20",
      labelText: "text-secondary",
    },
    success: {
      bg: "bg-success/15",
      border: "border-success/25",
      hoverBorder: "hover:border-success/50",
      iconBg: "bg-success/20",
      text: "text-success",
      glow: "hover:shadow-[0_0_30px_rgba(76,175,80,0.15)]",
      shadow: "shadow-success/10",
      labelBg: "bg-success/20",
      labelText: "text-success",
    },
    warning: {
      bg: "bg-warning/15",
      border: "border-warning/25",
      hoverBorder: "hover:border-warning/50",
      iconBg: "bg-warning/20",
      text: "text-warning",
      glow: "hover:shadow-[0_0_30px_rgba(255,193,7,0.15)]",
      shadow: "shadow-warning/10",
      labelBg: "bg-warning/20",
      labelText: "text-warning",
    },
  };

  const config = colorConfig[color];

  return (
    <Link
      href={href}
      className={`
        group flex flex-col items-start gap-1.5 rounded-2xl
        border ${config.border} ${config.hoverBorder}
        ${config.bg}
        backdrop-blur-md backdrop-saturate-150
        p-4 transition-all duration-200
        shadow-card hover:shadow-soft ${config.glow}
        hover:-translate-y-0.5
        h-full
        overflow-hidden
        relative
      `}
    >
      {/* Step + Label Badge */}
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-bold ${config.text} opacity-60`}>
          {step}
        </span>
        <span
          className={`text-[8px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full ${config.labelBg} ${config.labelText}`}
        >
          {label}
        </span>
      </div>

      <div
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
          ${config.iconBg} ${config.text}
          transition-all duration-300 group-hover:scale-105
        `}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0 w-full">
        <p className={`font-semibold text-sm ${config.text} truncate`}>
          {title}
        </p>
        <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-foreground/50 mt-auto pt-1">
        <span>{stat}</span>
        <ArrowRight
          className={`h-3.5 w-3.5 ${config.text} transition-transform group-hover:translate-x-1`}
        />
      </div>
    </Link>
  );
}

// ============================================
// CIRCULAR PROGRESS INDICATOR (With Trends)
// ============================================
function CircularProgress({
  label,
  value,
  progress,
  color = "primary",
  icon,
  trend,
  trendValue,
}: {
  label: string;
  value: string;
  progress: number;
  color?: "primary" | "secondary" | "success" | "warning" | "gold";
  icon?: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
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

  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-background-elevated p-4 shadow-card">
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
          {icon && <span className="text-muted/50">{icon}</span>}
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
      <p className="mt-2 text-xs font-medium text-muted">{label}</p>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
const CreatePage = () => {
  return (
    <AppShell>
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: "var(--page-bg, #190C05)",
        }}
      >
        <div className="flex-1 mx-auto max-w-7xl w-full px-4 py-5 lg:px-8 flex flex-col">
          {/* MAIN SPLIT LAYOUT */}
          <div className="flex-1 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <LiveRoomPreview />

            {/* RIGHT COLUMN - 2x2 Grid with Workflow Cards */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {RIGHT_CARDS.map((card) => (
                <BrandGlassyActionCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  href={card.href}
                  color={card.color}
                  stat={card.stat}
                  step={card.step}
                  label={card.label}
                />
              ))}
            </div>
          </div>

          {/* METRICS */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
            <CircularProgress
              label="Total Earnings"
              value="₦84.5k"
              progress={78}
              color="gold"
              icon={<DollarSign className="h-4 w-4" />}
              trend="up"
              trendValue="12%"
            />

            <CircularProgress
              label="Response Rate"
              value="92%"
              progress={92}
              color="success"
              icon={<MessageCircle className="h-4 w-4" />}
              trend="up"
              trendValue="4%"
            />

            <CircularProgress
              label="Offer Acceptance"
              value="68%"
              progress={68}
              color="primary"
              icon={<CheckCircle className="h-4 w-4" />}
              trend="down"
              trendValue="2%"
            />

            <CircularProgress
              label="Live Attendance"
              value="74%"
              progress={74}
              color="secondary"
              icon={<Users className="h-4 w-4" />}
              trend="up"
              trendValue="8%"
            />
          </div>

          {/* BOTTOM BAR - Enhanced with stronger presence */}
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
