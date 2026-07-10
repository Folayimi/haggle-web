// FeedCard.tsx - Immersive Feed Card
"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Star,
  MapPin,
  Clock,
  Users,
  ShoppingBag,
  Handshake,
} from "lucide-react";
import { StatusRotator } from "@/components/feed/StatusRotator";
import { InteractionButtons } from "@/components/feed/InteractionButtons";

// ============================================
// TYPES
// ============================================
interface FeedItem {
  id: string;
  seller: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    rating: number;
    totalReviews: number;
    marketStyle: "fresh" | "boutique" | "workshop" | "kitchen" | "studio" | "farm" | "warehouse";
    location: {
      city: string;
      distance: number;
    };
  };
  product: {
    title: string;
    category: string;
    imageUrl: string;
    price: number;
    currency: string;
  };
  live: {
    viewerCount: number;
    offersMade: number;
    soldToday: number;
    duration: number;
    status: "live" | "trending" | "ending";
    lastSale?: string;
  };
  status: {
    text: string;
    icon: string;
  };
}

interface FeedCardProps {
  item: FeedItem;
  onJoin: () => void;
}

// ============================================
// MARKET STYLE CONFIG
// ============================================
const MARKET_STYLES = {
  fresh: { label: "Fresh Market", icon: "🌿", color: "bg-emerald-500/20 text-emerald-400" },
  boutique: { label: "Boutique", icon: "👗", color: "bg-rose-500/20 text-rose-400" },
  workshop: { label: "Workshop", icon: "🔧", color: "bg-amber-500/20 text-amber-400" },
  kitchen: { label: "Kitchen", icon: "🍲", color: "bg-orange-500/20 text-orange-400" },
  studio: { label: "Studio", icon: "🎨", color: "bg-purple-500/20 text-purple-400" },
  farm: { label: "Farm", icon: "🚜", color: "bg-green-500/20 text-green-400" },
  warehouse: { label: "Warehouse", icon: "📦", color: "bg-blue-500/20 text-blue-400" },
};

// ============================================
// STATUS ROTATION ITEMS
// ============================================
const STATUS_ROTATIONS = [
  { icon: "✅", text: "Just sold 2 items" },
  { icon: "💬", text: "Responding to offers" },
  { icon: "🔥", text: "18 buyers watching" },
  { icon: "⚡", text: "Last sale 1 min ago" },
  { icon: "🤝", text: "Negotiating now" },
  { icon: "📦", text: "Packing orders" },
  { icon: "⭐", text: "5-star seller" },
];

// ============================================
// MAIN COMPONENT
// ============================================
const FeedCard = ({ item, onJoin }: FeedCardProps) => {
  const style = MARKET_STYLES[item.seller.marketStyle];

  // Format price
  const formattedPrice = `${item.product.currency}${item.product.price.toLocaleString()}`;

  // Get live status badge
  const getLiveBadge = () => {
    switch (item.live.status) {
      case "trending":
        return { label: "🔥 Trending", color: "bg-orange-500" };
      case "ending":
        return { label: "⏳ Ending soon", color: "bg-red-500" };
      default:
        return { label: "● LIVE", color: "bg-red-500 animate-pulse" };
    }
  };

  const liveBadge = getLiveBadge();

  // Calculate distance label
  const distanceLabel = item.seller.location.distance < 1
    ? "< 1 km away"
    : `${item.seller.location.distance} km away`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative w-full max-w-[420px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-dark-900"
    >
      {/* Background Image */}
      <img
        src={item.product.imageUrl}
        alt={item.product.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* ============================================ */}
      {/* TOP SECTION */}
      {/* ============================================ */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between z-10">
        {/* Live Badge + Viewers */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${liveBadge.color}`}>
            {liveBadge.label}
          </span>
          <span className="text-xs text-white/80 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
            <Eye className="w-3 h-3" />
            {item.live.viewerCount}
          </span>
        </div>

        {/* Market Style Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${style.color}`}>
          {style.icon} {style.label}
        </span>
      </div>

      {/* ============================================ */}
      {/* MIDDLE - INTEREST INDICATORS */}
      {/* ============================================ */}
      <div className="absolute top-20 right-4 flex flex-col gap-2 z-10">
        {/* Offers Made */}
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
          <Handshake className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-medium text-white">{item.live.offersMade}</span>
        </div>
        {/* Sold Today */}
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-white">{item.live.soldToday} sold</span>
        </div>
        {/* Rating */}
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-white">{item.seller.rating}</span>
        </div>
        {/* Distance */}
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-medium text-white">{distanceLabel}</span>
        </div>
      </div>

      {/* ============================================ */}
      {/* RIGHT - INTERACTION BUTTONS */}
      {/* ============================================ */}
      <div className="absolute bottom-32 right-4 z-10">
        <InteractionButtons
          onLike={() => console.log("Liked")}
          onComment={() => console.log("Comment")}
          onShare={() => console.log("Shared")}
          onSave={() => console.log("Saved")}
        />
      </div>

      {/* ============================================ */}
      {/* BOTTOM SECTION */}
      {/* ============================================ */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 space-y-3">
        {/* Status Rotator */}
        <StatusRotator items={STATUS_ROTATIONS} interval={4000} />

        {/* Seller Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {item.seller.avatar}
            </span>
          </div>
          <div>
            <p className="text-white font-semibold text-lg">
              @{item.seller.username}
            </p>
            <p className="text-white/60 text-xs">
              {item.seller.displayName} · {item.seller.location.city}
            </p>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium text-sm line-clamp-1">
              {item.product.title}
            </p>
            <p className="text-white/60 text-xs">{item.product.category}</p>
          </div>
          <p className="text-white font-bold text-lg">{formattedPrice}</p>
        </div>

        {/* Join Button */}
        <button
          onClick={onJoin}
          className="w-full py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02]"
        >
          Join Live
        </button>
      </div>
    </motion.div>
  );
};

export default FeedCard;