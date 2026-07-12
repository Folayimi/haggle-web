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
  Sparkles,
  Zap,
  Flame,
  Award,
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
    marketStyle:
      | "fresh"
      | "boutique"
      | "workshop"
      | "kitchen"
      | "studio"
      | "farm"
      | "warehouse";
    location: {
      city: string;
      distance: number; // in km (backend)
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
  story: {
    headline: string;
    primaryEmotion: "trending" | "highly-rated" | "fast-shipping" | "negotiating" | "popular";
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
  fresh: {
    label: "Fresh Market",
    icon: "🌿",
    color: "bg-emerald-500/20 text-emerald-400",
  },
  boutique: {
    label: "Boutique",
    icon: "👗",
    color: "bg-rose-500/20 text-rose-400",
  },
  workshop: {
    label: "Workshop",
    icon: "🔧",
    color: "bg-amber-500/20 text-amber-400",
  },
  kitchen: {
    label: "Kitchen",
    icon: "🍲",
    color: "bg-orange-500/20 text-orange-400",
  },
  studio: {
    label: "Studio",
    icon: "🎨",
    color: "bg-purple-500/20 text-purple-400",
  },
  farm: { label: "Farm", icon: "🚜", color: "bg-green-500/20 text-green-400" },
  warehouse: {
    label: "Warehouse",
    icon: "📦",
    color: "bg-blue-500/20 text-blue-400",
  },
};

// ============================================
// STATUS ROTATION ITEMS (Expanded)
// ============================================
const STATUS_ROTATIONS = [
  { icon: "✅", text: "Just sold 2 items" },
  { icon: "💬", text: "Responding to offers" },
  { icon: "🔥", text: "18 buyers watching" },
  { icon: "⚡", text: "Last sale 1 min ago" },
  { icon: "🤝", text: "Negotiating now" },
  { icon: "📦", text: "Packing orders" },
  { icon: "🤝", text: "Accepting offers" },
  { icon: "🔥", text: "Going viral" },
  { icon: "✅", text: "Just sold 3 items" },
  { icon: "⚡", text: "Responding fast" },
  { icon: "⏳", text: "Closing soon" },
  { icon: "📍", text: "Delivering nearby" },
  { icon: "👀", text: "5 new viewers just joined" },
];

// ============================================
// MAIN COMPONENT
// ============================================
const FeedCard = ({ item, onJoin }: FeedCardProps) => {
  const style = MARKET_STYLES[item.seller.marketStyle];

  // Format price with "Starting from"
  const formattedPrice = `${item.product.currency}${item.product.price.toLocaleString()}`;
  const priceDisplay = `Starting from ${formattedPrice}`;

  // Distance to time (approx 30 km/h -> minutes = distance * 2)
  const minutesAway = Math.round(item.seller.location.distance * 2);
  const distanceLabel = minutesAway < 1
    ? "📍 <1 min away"
    : `📍 ${minutesAway} mins away`;

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

  // Emotion icon for story
  const emotionIcons = {
    trending: <Flame className="w-4 h-4 text-orange-400" />,
    "highly-rated": <Award className="w-4 h-4 text-yellow-400" />,
    "fast-shipping": <Zap className="w-4 h-4 text-blue-400" />,
    negotiating: <Handshake className="w-4 h-4 text-emerald-400" />,
    popular: <Sparkles className="w-4 h-4 text-purple-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative w-full max-w-[400px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-dark-900 h-[95vh]"
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
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${liveBadge.color}`}
          >
            {liveBadge.label}
          </span>
          <span className="text-xs text-white/80 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
            <Eye className="w-3 h-3" />
            {item.live.viewerCount}
          </span>
        </div>

        {/* Story Headline - Primary Emotion */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
          {emotionIcons[item.story.primaryEmotion]}
          <span className="text-xs font-medium text-white/90">
            {item.story.headline}
          </span>
        </div>
      </div>

      {/* ============================================ */}
      {/* MIDDLE - INTEREST INDICATORS (Reduced to 3) */}
      {/* ============================================ */}
      <div className="absolute top-24 right-4 flex flex-col gap-2 z-10">
        {/* Offers Made */}
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
          <Handshake className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-medium text-white">
            {item.live.offersMade}
          </span>
        </div>
        {/* Sold Today */}
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-white">
            {item.live.soldToday} sold
          </span>
        </div>
        {/* Rating (now shown as star) */}
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-white">
            {item.seller.rating}
          </span>
        </div>
        {/* Distance removed from here, moved to bottom */}
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

        {/* Seller Info (avatar enlarged) */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
            <span className="text-white font-bold text-base">
              {item.seller.avatar}
            </span>
          </div>
          <div>
            <p className="text-white font-semibold text-lg">
              @{item.seller.username}
            </p>
            <p className="text-white/60 text-xs flex items-center gap-1">
              {item.seller.displayName} · {item.seller.location.city}
              <span className="mx-1">•</span>
              <span className="text-blue-400">{distanceLabel}</span>
            </p>
          </div>
        </div>

        {/* Product Info with "Starting from" price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium text-sm line-clamp-1">
              {item.product.title}
            </p>
            <p className="text-white/60 text-xs">{item.product.category}</p>
          </div>
          <p className="text-white font-bold text-lg">{priceDisplay}</p>
        </div>

        {/* Join Live Button with pulse on hover */}
        <button
          onClick={onJoin}
          className="w-full py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 hover:scale-[1.02] group relative overflow-hidden"
        >
          <span className="relative z-10">Join Live</span>
          <span className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-slow group-hover:animate-none" />
        </button>
      </div>
    </motion.div>
  );
};

export default FeedCard;