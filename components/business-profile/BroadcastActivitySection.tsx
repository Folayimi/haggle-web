// components/business-profile/BroadcastActivitySection.tsx
"use client";

import { motion } from "framer-motion";
import { MessageSquare, CheckCircle, Clock, XCircle, ArrowRight, TrendingUp, MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BroadcastActivity } from "@/lib/types";

// ============================================
// TYPES
// ============================================
interface BroadcastActivitySectionProps {
  activities: BroadcastActivity[];
  isOwner: boolean;
  onViewAll?: () => void;
  className?: string;
}

// ============================================
// STATUS CONFIG
// ============================================
const STATUS_CONFIG = {
  responded: {
    label: "Responded",
    icon: <MessageSquare className="h-3.5 w-3.5" />,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  accepted: {
    label: "Accepted",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    color: "text-success bg-success/10 border-success/20",
  },
  declined: {
    label: "Declined",
    icon: <XCircle className="h-3.5 w-3.5" />,
    color: "text-danger bg-danger/10 border-danger/20",
  },
};

// ============================================
// STAT CARD
// ============================================
function StatCard({
  label,
  value,
  icon,
  color = "primary",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "success" | "danger" | "warning" | "primary";
}) {
  const colorMap = {
    success: "text-success bg-success/10",
    danger: "text-danger bg-danger/10",
    warning: "text-warning bg-warning/10",
    primary: "text-primary bg-primary/10",
  };
  return (
    <div className={`rounded-xl border border-border/40 p-3 flex items-center gap-2 ${colorMap[color]}`}>
      {icon}
      <div>
        <div className="text-sm font-semibold">{value}</div>
        <div className="text-[10px] text-muted/60">{label}</div>
      </div>
    </div>
  );
}

// ============================================
// SINGLE ACTIVITY CARD
// ============================================
function ActivityCard({ activity }: { activity: BroadcastActivity }) {
  const statusConfig = STATUS_CONFIG[activity.status];
  const date = new Date(activity.respondedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-background-elevated/10 hover:bg-background-elevated/20 transition-all duration-200"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
        {activity.buyerAvatar}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-sm font-medium text-foreground truncate">
            {activity.buyerName}
          </span>
          <span className="text-[10px] text-muted/40">•</span>
          <span className="text-[10px] text-muted/40">{formattedDate}</span>
          {activity.isNearby && (
            <span className="text-[10px] text-primary flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              Nearby
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-foreground/80 truncate">
            {activity.requestTitle}
          </span>
          <span className="text-[10px] text-muted/50 px-1.5 py-0.5 rounded-full border border-border/30 bg-background-elevated/20">
            {activity.category}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="text-xs text-muted/60">{activity.budget}</span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusConfig.color} flex items-center gap-1`}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>
          {activity.revenue && (
            <span className="text-[10px] text-success flex items-center gap-0.5">
              <DollarSign className="h-3 w-3" />
              ₦{activity.revenue.toLocaleString()}
            </span>
          )}
          {activity.responseTime && (
            <span className="text-[10px] text-muted/40 flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {activity.responseTime}h
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function BroadcastActivitySection({
  activities,
  isOwner,
  onViewAll,
  className,
}: BroadcastActivitySectionProps) {
  const displayActivities = activities.slice(0, 5);
  const hasActivities = displayActivities.length > 0;

  // Stats
  const total = activities.length;
  const won = activities.filter(a => a.status === "completed").length;
  const lost = activities.filter(a => a.status === "declined").length;
  const pending = activities.filter(a => a.status === "responded" || a.status === "accepted").length;
  const revenue = activities.reduce((sum, a) => sum + (a.revenue || 0), 0);
  const avgResponseTime = activities.length
    ? activities.reduce((sum, a) => sum + (a.responseTime || 0), 0) / activities.length
    : 0;
  const nearbyCount = activities.filter(a => a.isNearby).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "rounded-3xl border border-border/40 bg-background-elevated/20 backdrop-blur-sm p-6 shadow-card",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-secondary" />
            Broadcast Activity
            <span className="text-sm font-normal text-muted/60">({total})</span>
          </h3>
          <p className="text-sm text-muted/70">
            {isOwner
              ? "Track your customer acquisition through broadcasts"
              : "Buyer requests this business has responded to"}
          </p>
        </div>
        {isOwner && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-primary hover:text-primary-strong flex items-center gap-1 transition"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Stats Row (CRM-like) */}
      {isOwner && total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard label="Won" value={won} icon={<CheckCircle className="h-4 w-4" />} color="success" />
          <StatCard label="Lost" value={lost} icon={<XCircle className="h-4 w-4" />} color="danger" />
          <StatCard label="Pending" value={pending} icon={<Clock className="h-4 w-4" />} color="warning" />
          <StatCard label="Revenue" value={`₦${revenue.toLocaleString()}`} icon={<TrendingUp className="h-4 w-4" />} color="primary" />
          {avgResponseTime > 0 && (
            <div className="col-span-2 sm:col-span-1 text-xs text-muted/60 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Avg response: {avgResponseTime.toFixed(1)}h
            </div>
          )}
          {nearbyCount > 0 && (
            <div className="col-span-2 sm:col-span-1 text-xs text-primary flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {nearbyCount} nearby opportunities
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasActivities && (
        <div className="py-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
            <MessageSquare className="h-6 w-6 text-secondary/40" />
          </div>
          <h4 className="text-base font-semibold text-foreground">
            {isOwner ? "No broadcast responses yet" : "No broadcast activity"}
          </h4>
          <p className="text-sm text-muted mt-1 max-w-md mx-auto">
            {isOwner
              ? "Start responding to buyer broadcasts to showcase your business and win more customers."
              : "This business hasn't responded to any buyer broadcasts yet."}
          </p>
          {isOwner && (
            <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-sm font-medium text-white transition hover:bg-secondary-strong shadow-lg shadow-secondary/25">
              Browse Broadcasts
            </button>
          )}
        </div>
      )}

      {/* Activity List */}
      {hasActivities && (
        <div className="space-y-2">
          {displayActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
          {activities.length > 5 && (
            <div className="text-center pt-1">
              <button
                onClick={onViewAll}
                className="text-xs text-muted/50 hover:text-foreground transition"
              >
                + {activities.length - 5} more activities
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}