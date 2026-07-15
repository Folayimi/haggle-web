// components/LiveRoomPreview.tsx
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
  Camera,
  Mic,
  MessageSquare,
  ShoppingBag,
  Zap,
  MapPin,
  Clock,
  Flame,
  Package,
  Wrench,
  Truck,
  Calendar,
  AlertCircle,
  Sparkles,
  Send,
  MessageCircle,
} from "lucide-react";
import { url } from "inspector";

// ============================================
// TYPES
// ============================================
type BroadcastRequest = {
  id: string;
  buyer: {
    name: string;
    avatar: string;
    distance: string;
  };
  title: string;
  category: string;
  budget?: string;
  urgency?:
    | "urgent"
    | "immediate"
    | "wholesale"
    | "service"
    | "product"
    | "scheduled";
  quantity?: string;
  timestamp: string;
};

// ============================================
// BADGE CONFIG
// ============================================
const BADGE_CONFIG = {
  urgent: {
    label: "🔥 Urgent",
    color: "bg-red-500/80 text-white border-red-400",
  },
  immediate: {
    label: "⚡ Immediate",
    color: "bg-orange-500/80 text-white border-orange-400",
  },
  wholesale: {
    label: "🛒 Wholesale",
    color: "bg-blue-500/80 text-white border-blue-400",
  },
  service: {
    label: "🛠 Service",
    color: "bg-purple-500/80 text-white border-purple-400",
  },
  product: {
    label: "📦 Product",
    color: "bg-green-500/80 text-white border-green-400",
  },
  scheduled: {
    label: "📅 Scheduled",
    color: "bg-teal-500/80 text-white border-teal-400",
  },
};

// ============================================
// MOCK DATA (extended)
// ============================================
const generateMockBroadcasts = (): BroadcastRequest[] => {
  const names = [
    "Sarah Mitchell",
    "Michael Chen",
    "Emma Watson",
    "James Rodriguez",
    "Lisa Wong",
    "Ahmed Bello",
    "Grace Okafor",
    "David Adeyemi",
    "Chioma Eze",
    "Oluwaseun Adebayo",
    "Fatima Musa",
    "Tunde Balogun",
  ];
  const categories = [
    "Fashion",
    "Furniture",
    "Art",
    "Food",
    "Services",
    "Electronics",
    "Home",
    "Automobile",
  ];
  const titles = [
    "Vintage Wedding Dress",
    "Handcrafted Wooden Table",
    "Custom Portrait Painting",
    "Fresh Organic Vegetables",
    "Professional Logo Design",
    "iPhone 15 Pro Max",
    "Luxury Sofa Set",
    "Toyota Camry 2022",
    "Wedding Photography",
    "Plumbing Services",
    "Gaming Laptop",
    "Designer Handbag",
  ];
  const urgencyList: BroadcastRequest["urgency"][] = [
    "urgent",
    "immediate",
    "wholesale",
    "service",
    "product",
    "scheduled",
  ];
  const budgets = [
    "₦120,000",
    "₦250,000",
    "₦85,000",
    "₦15,000",
    "₦50,000",
    "₦900,000",
    "₦450,000",
    "₦2,500,000",
  ];
  const quantities = ["2 units", "3 units", "5kg", "1 unit", "10kg", "4 units"];

  return Array.from({ length: 20 }, (_, i) => {
    const name = names[i % names.length];
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const distance = `${(Math.random() * 10 + 0.5).toFixed(1)} km away`;
    const urgency = urgencyList[i % urgencyList.length];
    const budget =
      Math.random() > 0.3 ? budgets[i % budgets.length] : undefined;
    const quantity =
      Math.random() > 0.6 ? quantities[i % quantities.length] : undefined;
    const category = categories[i % categories.length];
    const title = titles[i % titles.length];
    const timestamp = `${Math.floor(Math.random() * 60 + 1)} min${Math.random() > 0.5 ? "s" : ""} ago`;

    return {
      id: `broadcast-${i + 1}`,
      buyer: {
        name,
        avatar: initials,
        distance,
      },
      title,
      category,
      budget,
      urgency,
      quantity,
      timestamp: timestamp,
    };
  });
};

// ============================================
// TOOLTIP BUTTON (for right controls)
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
          w-12 h-12 flex items-center justify-center
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
// SINGLE BROADCAST ITEM (compact)
// ============================================
function BroadcastItem({
  broadcast,
  isNew,
  onAction,
}: {
  broadcast: BroadcastRequest;
  isNew: boolean;
  onAction: (action: "go-live" | "message", id: string) => void;
}) {
  const badge = broadcast.urgency ? BADGE_CONFIG[broadcast.urgency] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`
        relative py-3 px-4
        ${isNew ? "bg-primary/5" : ""}
      `}
    >
      {/* New indicator */}
      {isNew && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-2 right-2 bg-primary text-white text-[8px] font-semibold px-2 py-0.5 rounded-full shadow-lg"
        >
          NEW
        </motion.div>
      )}

      <div className="flex items-end gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
          {broadcast.buyer.avatar}
        </div>

        <div className="w-[310px] flex flex-col gap-[10px] bg-black/80 border-white/20 border px-[20px] py-[10px] rounded-2xl rounded-bl-sm">
          {/* Top row: name + distance + badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-medium text-sm truncate">
              {broadcast.buyer.name}
            </span>
            <span className="text-white/40 text-xs flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {broadcast.buyer.distance}
            </span>
            {badge && (
              <span
                className={`text-[8px] font-medium px-2 py-0.5 rounded-full border ${badge.color}`}
              >
                {badge.label}
              </span>
            )}
          </div>

          {/* Title & category */}
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-[10px] uppercase tracking-wider">
              {broadcast.category}
            </span>
            <span className="text-white text-sm font-medium truncate">
              {broadcast.title}
            </span>
          </div>

          {/* Details row: budget, quantity, timestamp */}
          <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
            {broadcast.budget && (
              <span className="flex items-center gap-0.5">
                <span className="text-primary/60">Budget:</span>
                {broadcast.budget}
              </span>
            )}
            {broadcast.quantity && (
              <span className="flex items-center gap-0.5">
                <span>Qty:</span>
                {broadcast.quantity}
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {broadcast.timestamp}
            </span>
          </div>

          {/* Actions: subtle buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onAction("go-live", broadcast.id)}
              className="text-[10px] font-medium text-primary hover:text-primary-strong transition px-2 py-0.5 rounded-full border border-primary/30 hover:bg-primary/10"
            >
              Go Live
            </button>
            <button
              onClick={() => onAction("message", broadcast.id)}
              className="text-[10px] font-medium text-white/50 hover:text-white transition px-2 py-0.5 rounded-full border border-white/10 hover:bg-white/5"
            >
              Message
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN EXPORT: BroadCastShowRoom
// ============================================
export function BroadCastShowRoom() {
  const [broadcastQueue, setBroadcastQueue] = useState<BroadcastRequest[]>([]);
  const [newBroadcastId, setNewBroadcastId] = useState<string | null>(null);
  const [allBroadcasts] = useState<BroadcastRequest[]>(() =>
    generateMockBroadcasts(),
  );
  const [pointer, setPointer] = useState(0);
  const VISIBLE_COUNT = 5; // number of visible items

  // Initialize queue with first VISIBLE_COUNT items
  useEffect(() => {
    const initial = allBroadcasts.slice(0, VISIBLE_COUNT);
    setBroadcastQueue(initial);
    setPointer(VISIBLE_COUNT);
  }, [allBroadcasts]);

  // Timer: every 20 seconds, shift oldest out, add new one
  useEffect(() => {
    if (broadcastQueue.length === 0) return;

    const interval = setInterval(() => {
      // Get next broadcast from mock list, loop if needed
      const nextIndex = pointer % allBroadcasts.length;
      const nextBroadcast = allBroadcasts[nextIndex];

      // Update queue: remove first, add new at end
      setBroadcastQueue((prev) => {
        const newQueue = [...prev.slice(1), nextBroadcast];
        return newQueue;
      });

      // Mark the new item as "new"
      setNewBroadcastId(nextBroadcast.id);
      setTimeout(() => setNewBroadcastId(null), 1500);

      setPointer((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [broadcastQueue, pointer, allBroadcasts]);

  // Handle action (for now, just log)
  const handleAction = (action: "go-live" | "message", id: string) => {
    console.log(`Action: ${action} on broadcast ${id}`);
    // TODO: navigate or open modal
  };

  // Count active broadcasts
  const activeCount = broadcastQueue.length;

  return (
    <div
      className="
      border border-border/40
          bg-background-elevated/70 backdrop-blur-md backdrop-saturate-150
        relative overflow-hidden rounded-[32px]
        shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.35)]
        flex-1
        h-100
        flex
      "
      style={{ backgroundImage: 'url("./bg3.jpg")', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', objectFit:'contain' }}
    >
      {/* LEFT: Broadcast Feed */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-white font-semibold text-sm uppercase tracking-wider">
              Live Buyer Requests
            </span>
          </div>
          <div className="text-xs text-white/40">
            {activeCount} buyer{activeCount !== 1 ? "s" : ""} nearby
          </div>
        </div>

        {/* Feed Items with overflow hidden and scroll? We'll keep it as a flex column with height auto but overflow hidden and animate items. */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence initial={false} mode="popLayout">
            {broadcastQueue.map((broadcast, index) => (
              <BroadcastItem
                key={broadcast.id}
                broadcast={broadcast}
                isNew={newBroadcastId === broadcast.id}
                onAction={handleAction}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: Controls (vertical) */}
      <div className="flex-shrink-0 w-30 flex flex-col items-center justify-center gap-2 px-2 py-4">
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

        <div className="w-8 h-px bg-white/10 my-1" />

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/instant-live"
            className="
              flex items-center justify-center
              rounded-full bg-primary px-4 py-2.5
              text-xs font-bold text-white
              shadow-lg shadow-primary/25
              hover:shadow-xl hover:shadow-primary/35
              transition-all duration-300
              hover:bg-primary-strong
              border border-primary/20
              min-w-[80px]
              text-center
            "
          >
            <Zap className="h-4 w-4 mr-1.5" />
            Go Live
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
