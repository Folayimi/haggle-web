// app/create/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
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
  LayoutDashboard, // alternative icon
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { BroadcastControls, BroadCastShowRoom } from "@/components/BroadCastShowRoom";
import Link from "next/link";
import { useHaggleStore } from "@/lib/app-store";
import WelcomeModal from "@/components/business-profile/WelcomeModal";

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
  label,
  index,
  isTop = false,
  className = "",
  isStudio = false,
  footer,
  cameraStream,
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
  className?: string;
  isStudio?: boolean;
  footer?: React.ReactNode;
  cameraStream?: MediaStream | null;
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
      className={`relative h-full ${className}`}
    >
      <div
        className={`
          h-full rounded-2xl
          border border-border/40
          ${isStudio ? "bg-black" : "bg-background-elevated/20 backdrop-blur-sm"}
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
          className={`flex flex-col items-start gap-1.5 h-full w-full ${footer && !(isStudio && cameraStream) ? "pb-20" : ""} ${isStudio && cameraStream ? "absolute inset-0" : ""}`}
        >
          {label && !(isStudio && cameraStream) && (
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[8px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-full border ${config.badge}`}
              >
                {label}
              </span>
            </div>
          )}

          {!(isStudio && cameraStream) && (
            <div className={`${config.icon} transition-all duration-300 group-hover:scale-105`}>
              {icon}
            </div>
          )}

          {isStudio && <StudioCameraPreview stream={cameraStream ?? null} active={Boolean(cameraStream)} />}

          {!(isStudio && cameraStream) && (
            <div className="flex-1 min-w-0 w-full mt-1">
              <p className="font-semibold text-sm text-foreground truncate">{title}</p>
              <p className="text-xs text-muted/70 line-clamp-2 leading-relaxed">{description}</p>
            </div>
          )}

          {!(isStudio && cameraStream) && (
            <div className="flex items-center gap-1.5 text-xs text-muted/50 mt-auto pt-1">
              <span>{stat}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${config.arrow} transition-transform group-hover:translate-x-1`} />
            </div>
          )}
        </Link>
      </div>
      {footer && (
        <div className="absolute bottom-5 left-5 right-5 z-10">
          {footer}
        </div>
      )}
    </motion.div>
  );
}

function StudioCameraPreview({ stream, active }: { stream: MediaStream | null; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={active
      ? "absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-black"
      : "my-2 flex min-h-0 flex-1 w-full items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-zinc-900"}>
      {stream ? (
        <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-white/50">
          <Camera className="h-8 w-8" />
          <span className="text-xs">Your camera preview will appear here</span>
        </div>
      )}
    </div>
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
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Your Seller Pulse
      </h2>
      <div className="grid h-full grid-cols-4 items-center gap-2">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="
              aspect-square w-full max-w-[7.5rem] justify-self-center rounded-full
              bg-background-elevated/20 backdrop-blur-sm
              border border-border/30
              p-2
              transition-all duration-200
              hover:border-primary/30 hover:shadow-sm
              flex flex-col items-center justify-center text-center
            "
          >
            <div className="flex w-full items-center justify-center gap-1">
              <div
                className={`rounded-full ${colorMap[metric.color].split(" ")[0]} bg-primary/5 p-1`}
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

            <p className="mt-1 text-sm font-bold text-foreground">
              {metric.value}
            </p>
            <p className="text-[9px] leading-tight text-muted">{metric.label}</p>
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
  const [showWelcome, setShowWelcome] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  useEffect(() => () => cameraStream?.getTracks().forEach((track) => track.stop()), [cameraStream]);

  const replaceCameraStream = (nextStream: MediaStream | null) => {
    setCameraStream((current) => {
      current?.getTracks().forEach((track) => track.stop());
      return nextStream;
    });
  };

  // Check if the user has already seen the welcome modal
  useEffect(() => {
    // Only show if we have user data and the flag isn't set
    if (userData?.profile?.primary_role === "buyer") {
      setShowWelcome(true);
    }
  }, [userData]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  const handleContinue = () => {
    setShowWelcome(false);
    // Navigation is handled inside the modal
  };

  // Extract username from userData
  const username = userData?.username || userData?.profile?.username || "";

  // Action cards for the create page
  const RIGHT_CARDS = useMemo(() => {
    return [
      {
        id: "post-product",
        title: "Post Product",
        description: "List items with pricing and negotiation settings.",
        icon: <Package className="h-6 w-6" />,
        href: "/post-product",
        color: "success" as const,
        stat: "2.4k listed",
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
        label: "CREATE",
      },
      {
        id: "seller-studio",
        title: "Go Live",
        description: "Check your camera and microphone, then get ready to broadcast.",
        icon: <Layers className="h-6 w-6" />,
        href: "/room-styling",
        color: "secondary" as const,
        stat: "Live studio",
        label: "",
      },
    ];
  }, []);

  return (
    <AppShell>
      <div className="min-h-screen flex flex-col xl:h-full xl:min-h-0">
        <div className="flex-1 mx-auto max-w-7xl w-full px-3 py-5 lg:px-6 flex flex-col xl:min-h-0">
          {/* Seller workspace on the left, showroom and analytics on the right. */}
          <div className="grid grid-cols-1 gap-5 xl:flex-1 xl:min-h-0 xl:grid-cols-[1.2fr_0.8fr] xl:grid-rows-[minmax(0,1fr)_14rem] xl:gap-4">
            {/* The studio owns the full upper-left area. */}
            <div className="min-h-[16rem] xl:min-h-0">
              {RIGHT_CARDS.filter((card) => card.id === "seller-studio").map((card) => (
                <GlassyActionCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  icon={<Layers className="h-10 w-10" />}
                  href={card.href}
                  color={card.color}
                  stat={card.stat}
                  label={card.label}
                  index={0}
                  isTop
                  isStudio
                  footer={<BroadcastControls onCameraStream={replaceCameraStream} />}
                  cameraStream={cameraStream}
                  className="h-full"
                />
              ))}
            </div>

            <div className="min-h-[25rem] xl:min-h-0">
              <BroadCastShowRoom />
            </div>

            {/* Product and service creation sit together beneath Seller Studio. */}
            <div className="grid min-h-[12rem] grid-cols-2 gap-4 xl:h-48 xl:min-h-0">
              {RIGHT_CARDS.filter((card) => card.id !== "seller-studio").map((card, index) => (
                <GlassyActionCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  href={card.href}
                  color={card.color}
                  stat={card.stat}
                  label={card.label}
                  index={index + 1}
                  isTop={false}
                />
              ))}
            </div>

            {/* All four analytics fit in the lower-right area. */}
            <div className="flex min-h-[14rem] flex-col justify-center xl:min-h-0">
              <AnalyticsSection />
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleWelcomeClose}
        username={username}
        onContinue={handleContinue}
      />
    </AppShell>
  );
};

export default CreatePage;
