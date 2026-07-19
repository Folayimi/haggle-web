// components/business-profile/AnalyticsDashboard.tsx
"use client";

import { motion } from "framer-motion";
import { BarChart3, Eye, Users, ShoppingBag, MessageSquare, TrendingUp, DollarSign, Award, MapPin, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsDashboardProps {
  data: {
    visitors: number;
    profileViews: number;
    clicks: number;
    followers: number;
    productViews: number;
    messages: number;
    broadcastResponses: number;
    conversionRate: number;
    revenue: number;
    topProducts: { name: string; sales: number }[];
    returningCustomers: number;
    nearbyAudience: number;
  };
  isOwner: boolean;
  className?: string;
}

function StatCard({ icon, label, value, color = "primary" }: any) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    danger: "text-danger bg-danger/10",
  };
  return (
    <div className="rounded-xl border border-border/40 bg-background-elevated/10 p-4">
      <div className={`rounded-full w-8 h-8 flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted/60">{label}</div>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard({
  data,
  isOwner,
  className,
}: AnalyticsDashboardProps) {
  if (!isOwner) return null; // Only owner sees analytics

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
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Analytics</h3>
        <span className="text-sm text-muted/60">Real-time business performance</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard icon={<Eye className="h-4 w-4" />} label="Profile Views" value={data.profileViews.toLocaleString()} color="primary" />
        <StatCard icon={<Users className="h-4 w-4" />} label="Visitors" value={data.visitors.toLocaleString()} color="secondary" />
        <StatCard icon={<ShoppingBag className="h-4 w-4" />} label="Product Views" value={data.productViews.toLocaleString()} color="success" />
        <StatCard icon={<MessageSquare className="h-4 w-4" />} label="Messages" value={data.messages} color="warning" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Conversion" value={`${data.conversionRate}%`} color="primary" />
        <StatCard icon={<DollarSign className="h-4 w-4" />} label="Revenue" value={`₦${data.revenue.toLocaleString()}`} color="success" />
        <StatCard icon={<Repeat className="h-4 w-4" />} label="Returning" value={data.returningCustomers} color="secondary" />
        <StatCard icon={<MapPin className="h-4 w-4" />} label="Nearby Audience" value={data.nearbyAudience} color="warning" />
      </div>

      {/* Top Products */}
      {data.topProducts.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-medium text-foreground/80 mb-2">Top Products</h4>
          <div className="space-y-1.5">
            {data.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted/70">{p.name}</span>
                <span className="font-medium">{p.sales} sales</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}