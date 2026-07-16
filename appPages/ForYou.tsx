// ForYou.tsx - Main Feed Page
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  Megaphone, 
} from "lucide-react";
import FeedCard from "@/components/feed/FeedCard";
import { CategoryRail } from "@/components/feed/CategoryRail";
import { useHaggleStore } from "@/lib/app-store";
import { AppShell } from "@/components/app-shell";
import { MarketMood } from "@/components/feed/MarketMood";
import Background from "@/components/Background";

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
  story: {
    headline: string;
    primaryEmotion:
      | "trending"
      | "highly-rated"
      | "fast-shipping"
      | "negotiating"
      | "popular";
  };
  sellerStory?: string;
}

// ============================================
// MOCK DATA (will be replaced with real API)
// ============================================
const generateMockFeed = (filter?: string): FeedItem[] => {
  const sellers = [
    {
      id: "seller1",
      username: "sarah_mitchell",
      displayName: "Sarah Mitchell",
      avatar: "SM",
      rating: 4.9,
      totalReviews: 92,
      marketStyle: "boutique" as const,
      location: { city: "Lagos", distance: 2.4 },
    },
    {
      id: "seller2",
      username: "michael_chen",
      displayName: "Michael Chen",
      avatar: "MC",
      rating: 4.8,
      totalReviews: 67,
      marketStyle: "workshop" as const,
      location: { city: "Ikeja", distance: 5.1 },
    },
    {
      id: "seller3",
      username: "emma_watson",
      displayName: "Emma Watson",
      avatar: "EW",
      rating: 4.7,
      totalReviews: 45,
      marketStyle: "studio" as const,
      location: { city: "Surulere", distance: 1.8 },
    },
    {
      id: "seller4",
      username: "james_rodriguez",
      displayName: "James Rodriguez",
      avatar: "JR",
      rating: 4.9,
      totalReviews: 103,
      marketStyle: "fresh" as const,
      location: { city: "Yaba", distance: 3.2 },
    },
    {
      id: "seller5",
      username: "lisa_wong",
      displayName: "Lisa Wong",
      avatar: "LW",
      rating: 4.6,
      totalReviews: 38,
      marketStyle: "kitchen" as const,
      location: { city: "Victoria Island", distance: 6.7 },
    },
  ];

  const products = [
    {
      title: "Vintage Denim Jacket",
      category: "Fashion",
      imageUrl:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop",
      price: 45000,
      currency: "₦",
    },
    {
      title: "Handcrafted Wooden Table",
      category: "Furniture",
      imageUrl:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
      price: 120000,
      currency: "₦",
    },
    {
      title: "Custom Portrait Painting",
      category: "Art",
      imageUrl:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1200&fit=crop",
      price: 85000,
      currency: "₦",
    },
    {
      title: "Fresh Organic Vegetables",
      category: "Food",
      imageUrl:
        "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=800&h=1200&fit=crop",
      price: 15000,
      currency: "₦",
    },
    {
      title: "Homemade Pastries",
      category: "Food",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop",
      price: 8000,
      currency: "₦",
    },
  ];

  const statuses = [
    { text: "Just sold 2 items", icon: "✅" },
    { text: "Responding to offers", icon: "💬" },
    { text: "18 buyers watching", icon: "🔥" },
    { text: "Last sale 1 min ago", icon: "⚡" },
    { text: "Negotiating now", icon: "🤝" },
    { text: "Packing orders", icon: "📦" },
    { text: "Accepting offers", icon: "🤝" },
    { text: "Going viral", icon: "🔥" },
    { text: "Just sold 3 items", icon: "✅" },
    { text: "Responding fast", icon: "⚡" },
    { text: "Closing soon", icon: "⏳" },
    { text: "Delivering nearby", icon: "📍" },
    { text: "5 new viewers just joined", icon: "👀" },
  ];

  const liveStatuses: ("live" | "trending" | "ending")[] = [
    "live",
    "trending",
    "live",
    "trending",
    "ending",
  ];

  const stories: {
    headline: string;
    primaryEmotion: FeedItem["story"]["primaryEmotion"];
  }[] = [
    { headline: "🔥 Trending • 107 watching", primaryEmotion: "trending" },
    { headline: "⭐ Highest Rated • 4.9★", primaryEmotion: "highly-rated" },
    { headline: "📦 Ships in 1 hour", primaryEmotion: "fast-shipping" },
    { headline: "💬 Negotiating with 8 buyers", primaryEmotion: "negotiating" },
    { headline: "❤️ Saved by 312 people", primaryEmotion: "popular" },
  ];

  const sellerStories = [
    "I imported these jackets yesterday.",
    "Only 3 left in stock.",
    "Negotiating wholesale today.",
    "Come see how I make this.",
    "Fresh from Mile 12 market.",
  ];

  let filteredSellers = sellers;
  if (filter === "nearby") {
    filteredSellers = sellers.filter((s) => s.location.distance < 5);
  } else if (filter === "trending") {
    filteredSellers = sellers.slice(0, 3);
  } else if (filter === "fashion") {
    filteredSellers = sellers.filter((_, i) => i === 0 || i === 2);
  } else if (filter === "food") {
    filteredSellers = sellers.filter((_, i) => i === 3 || i === 4);
  }

  return filteredSellers.map((seller, index) => ({
    id: `feed_${index + 1}`,
    seller,
    product: products[index % products.length],
    live: {
      viewerCount: Math.floor(Math.random() * 200) + 20,
      offersMade: Math.floor(Math.random() * 15) + 3,
      soldToday: Math.floor(Math.random() * 8) + 1,
      duration: Math.floor(Math.random() * 45) + 5,
      status: liveStatuses[index % liveStatuses.length],
      lastSale:
        Math.random() > 0.5
          ? `${Math.floor(Math.random() * 5) + 1} mins ago`
          : undefined,
    },
    status: statuses[index % statuses.length],
    story: stories[index % stories.length],
    sellerStory: sellerStories[index % sellerStories.length],
  }));
};

// ============================================
// MAIN COMPONENT
// ============================================
const ForYou = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const userData = useHaggleStore((state) => state.userData);

  useEffect(() => {
    setFeedData(generateMockFeed(selectedCategory));
    setCurrentIndex(0);
  }, [selectedCategory]);

  const currentFeed = feedData[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === feedData.length - 1;

  const handleNext = useCallback(() => {
    if (!isLast && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isLast, isAnimating]);

  const handlePrevious = useCallback(() => {
    if (!isFirst && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isFirst, isAnimating]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrevious();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious]);

  // Handle join live
  const handleJoinLive = (sellerId: string) => {
    console.log(`Joining live room for seller: ${sellerId}`);
  };

  // Handle broadcast button
  const handleBroadcast = () => {
    console.log("Opening broadcast modal");
  };

  if (!currentFeed && feedData.length === 0) return null;

  return (
    <AppShell>
      <Background />
      <div
        className="relative w-full h-screen overflow-hidden bg-dark-900"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ============================================ */}
        {/* TOP HEADER - With Broadcast Button & Market Mood */}
        {/* ============================================ */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-start justify-between">
          {/* ============================================ */}
          {/* LEFT - CATEGORY RAIL */}
          {/* ============================================ */}
          <CategoryRail
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Broadcast Button */}
            <button
              onClick={handleBroadcast}
              className="px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary text-xs font-medium flex items-center gap-1.5 hover:bg-primary/30 transition-all duration-200"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </button>

            {/* Notification */}
            <button className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 border border-white/10">
              <span className="text-white text-sm">🔔</span>
            </button>

            {/* Profile */}
            <button className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 border border-white/10">
              <span className="text-white text-sm">👤</span>
            </button>
          </div>
        </div>

        <div className="absolute left-8 bottom-10 -translate-y-1/2 z-20">
          {/* Left: Logo / Title + Market Mood */}
          <MarketMood />
        </div>

        {/* ============================================ */}
        {/* FEED CONTAINER */}
        {/* ============================================ */}
        <div
          ref={feedContainerRef}
          className="relative w-full h-full flex items-center justify-center px-4 py-5"
        >
          {feedData.length > 0 ? (
            <AnimatePresence mode="wait">
              <FeedCard
                key={currentFeed.id}
                item={currentFeed}
                onJoin={() => handleJoinLive(currentFeed.seller.id)}
              />
            </AnimatePresence>
          ) : (
            <div className="text-center text-white/40">
              <p className="text-lg font-medium">No sellers live right now</p>
              <p className="text-sm mt-1">Try adjusting your filter</p>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* BOTTOM NAVIGATION INDICATOR */}
        {/* ============================================ */}
        {feedData.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {feedData.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primary" : "w-4 bg-white/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* NAVIGATION ARROWS - Desktop only */}
        {/* ============================================ */}
        {feedData.length > 0 && (
          <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-20">
            <button
              onClick={handlePrevious}
              disabled={isFirst}
              className={`p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-200 ${
                isFirst ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
              }`}
            >
              <ChevronUp size={24} />
            </button>
            <button
              onClick={handleNext}
              disabled={isLast}
              className={`p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-200 ${
                isLast ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
              }`}
            >
              <ChevronDown size={24} />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default ForYou;
