// components/business-profile/LiveShoppingSection.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Eye,
  ShoppingBag,
  TrendingUp,
  Video,
  Plus,
  Play,
  CalendarPlus,
  Users,
  Award,
  Edit3,
  Trash2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LiveSession {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  date: string;
  time?: string;
  status: "live" | "upcoming" | "past";
  viewers?: number;
  orders?: number;
  watchTime?: string;
  conversion?: number;
  replayUrl?: string;
  sellerId?: string;
  totalViewers?: number;
  topViewed?: boolean;
}

interface LiveShoppingSectionProps {
  sessions: LiveSession[];
  isOwner: boolean;
  isPreviewMode?: boolean;
  onScheduleLive: () => void;
  onEditLive: (session: LiveSession) => void;
  onDeleteLive: (sessionId: string) => void;
  onStartLive?: (session: LiveSession) => void;
  className?: string;
}

const STATUS_CONFIG = {
  live: {
    label: "🔴 Live Now",
    color: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
  },
  upcoming: {
    label: "📅 Upcoming",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  past: {
    label: "✅ Past",
    color: "bg-muted/20 text-muted/70 border-muted/30",
  },
};

function StatCard({ icon, label, value, color = "primary" }: any) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-full p-1.5 ${colorMap[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-semibold text-foreground">{value}</p>
        <p className="text-[10px] text-muted/60">{label}</p>
      </div>
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft("Started");
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      let str = "";
      if (days > 0) str += `${days}d `;
      if (hours > 0 || days > 0) str += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) str += `${minutes}m `;
      str += `${seconds}s`;
      setTimeLeft(str);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return <span className="text-xs text-primary font-mono">{timeLeft}</span>;
}

function SessionCard({
  session,
  isOwner,
  isPreviewMode,
  onEdit,
  onDelete,
  onStart,
}: {
  session: LiveSession;
  isOwner: boolean;
  isPreviewMode?: boolean;
  onEdit: (session: LiveSession) => void;
  onDelete: (sessionId: string) => void;
  onStart?: (session: LiveSession) => void;
}) {
  const status = STATUS_CONFIG[session.status];
  const isLive = session.status === "live";
  const isUpcoming = session.status === "upcoming";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative rounded-xl border border-border/40 bg-background-elevated/20 p-4 transition-all hover:border-border/60 hover:shadow-soft",
        isLive && "border-red-500/30 bg-red-500/5",
        session.topViewed && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.color}`}>
            {status.label}
          </span>
          {session.topViewed && (
            <span className="text-[10px] text-primary flex items-center gap-0.5">
              <Award className="h-3 w-3" />
              Top viewed
            </span>
          )}
        </div>
        {isLive && (
          <span className="flex items-center gap-1 text-xs text-red-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            {session.viewers} watching
          </span>
        )}
        {isUpcoming && (
          <div className="flex items-center gap-1 text-xs text-muted/60">
            <Clock className="h-3 w-3" />
            <CountdownTimer targetDate={session.date} />
          </div>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div className="relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
          {session.coverImage ? (
            <Image src={session.coverImage} alt={session.title} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full bg-primary/5">
              <Video className="h-6 w-6 text-muted/20" />
            </div>
          )}
          {isLive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="rounded-full bg-red-500 p-1.5">
                <Play className="h-3 w-3 fill-white text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground truncate">{session.title}</h4>
          <p className="text-xs text-muted/70 line-clamp-1">{session.description}</p>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted/50">
            <span className="flex items-center gap-0.5">
              <Calendar className="h-3 w-3" />
              {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            {session.time && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {session.time}
              </span>
            )}
          </div>
        </div>

        {/* Actions – hidden in preview */}
        {isOwner && !isPreviewMode && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {isLive && onStart && (
              <button
                onClick={() => onStart(session)}
                className="rounded-full bg-red-500/20 p-1.5 text-red-400 hover:bg-red-500/30 transition"
              >
                <Play className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => onEdit(session)}
              className="rounded-full bg-background-elevated/60 p-1.5 text-muted hover:text-foreground transition"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(session.id)}
              className="rounded-full bg-background-elevated/60 p-1.5 text-muted hover:text-danger transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {session.status === "past" && (
        <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-4 gap-2">
          <StatCard icon={<Eye className="h-3.5 w-3.5" />} label="Viewers" value={session.viewers || 0} color="primary" />
          <StatCard icon={<ShoppingBag className="h-3.5 w-3.5" />} label="Orders" value={session.orders || 0} color="success" />
          <StatCard icon={<Clock className="h-3.5 w-3.5" />} label="Avg Watch" value={session.watchTime || "—"} color="warning" />
          <StatCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="Conversion" value={session.conversion ? `${session.conversion}%` : "—"} color="secondary" />
        </div>
      )}

      {session.status === "past" && session.replayUrl && (
        <div className="mt-2 pt-2 border-t border-border/20">
          <Link
            href={session.replayUrl}
            className="text-xs text-primary hover:text-primary-strong flex items-center gap-1 transition"
          >
            <Play className="h-3 w-3" />
            Watch Replay
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default function LiveShoppingSection({
  sessions,
  isOwner,
  isPreviewMode = false,
  onScheduleLive,
  onEditLive,
  onDeleteLive,
  onStartLive,
  className,
}: LiveShoppingSectionProps) {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "past">("live");

  const liveSessions = sessions.filter((s) => s.status === "live");
  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
  const pastSessions = sessions.filter((s) => s.status === "past");

  const totalViewers = sessions.reduce((sum, s) => sum + (s.viewers || 0), 0);
  const topViewed = sessions.reduce((a, b) => (a.viewers || 0) > (b.viewers || 0) ? a : b, sessions[0]);

  const getTabCount = (status: string) => {
    switch (status) {
      case "live": return liveSessions.length;
      case "upcoming": return upcomingSessions.length;
      case "past": return pastSessions.length;
      default: return 0;
    }
  };

  const currentSessions =
    activeTab === "live" ? liveSessions : activeTab === "upcoming" ? upcomingSessions : pastSessions;
  const totalSessions = sessions.length;

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
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Live Shopping
            <span className="text-sm font-normal text-muted/60">({totalSessions})</span>
          </h3>
          <p className="text-sm text-muted/70">
            {liveSessions.length} live now · {upcomingSessions.length} upcoming · {pastSessions.length} past
          </p>
        </div>
        {isOwner && !isPreviewMode && (
          <button
            onClick={onScheduleLive}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25"
          >
            <CalendarPlus className="h-4 w-4" />
            Schedule Live
          </button>
        )}
      </div>

      {totalSessions > 0 && (
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-muted/70">
            <Eye className="h-4 w-4" />
            <span>{totalViewers} total viewers</span>
          </div>
          {topViewed && (
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>Top: {topViewed.title}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-1 mb-5 border-b border-border/30">
        {["live", "upcoming", "past"].map((tab) => {
          const count = getTabCount(tab);
          const labels = { live: "Live Now", upcoming: "Upcoming", past: "Past" };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition relative",
                activeTab === tab ? "text-foreground" : "text-muted hover:text-foreground/80"
              )}
            >
              {labels[tab as keyof typeof labels]}
              <span className="ml-1.5 text-xs text-muted/40">({count})</span>
              {activeTab === tab && (
                <motion.span
                  layoutId="live-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>

      {currentSessions.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Video className="h-6 w-6 text-primary/40" />
          </div>
          <h4 className="text-base font-semibold text-foreground">
            {activeTab === "live"
              ? "No live sessions right now"
              : activeTab === "upcoming"
              ? "No upcoming live sessions"
              : "No past live sessions"}
          </h4>
          <p className="text-sm text-muted mt-1">
            {isPreviewMode
              ? "Check back later for live sessions."
              : isOwner && activeTab === "upcoming"
              ? "Schedule your first live session to connect with buyers."
              : isOwner && activeTab === "live"
              ? "Go live to start selling in real-time."
              : "Check back later for live sessions."}
          </p>
          {isOwner && !isPreviewMode && activeTab !== "past" && (
            <button
              onClick={onScheduleLive}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              {activeTab === "live" ? "Go Live Now" : "Schedule Live"}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {currentSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isOwner={isOwner}
              isPreviewMode={isPreviewMode}
              onEdit={onEditLive}
              onDelete={onDeleteLive}
              onStart={onStartLive}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}