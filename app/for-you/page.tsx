// ForYou.tsx - Main Page
"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Heart,
  MessageCircle,
  Share2,
  Users,
  ChevronUp,
  ChevronDown,
  Bell,
  Bookmark,
} from "lucide-react";
import FeedCard from "@/components/FeedCard";
import Background from "@/components/Background";
import { url } from "inspector";

// Sample feed data with images from the web
const feedData = [
  {
    id: 1,
    username: "sarah_mitchell",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop",
  },
  {
    id: 2,
    username: "michael_chen",
    imageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop",
  },
  {
    id: 3,
    username: "emma_watson",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1200&fit=crop",
  },
  {
    id: 4,
    username: "james_rodriguez",
    imageUrl:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=800&h=1200&fit=crop",
  },
  {
    id: 5,
    username: "lisa_wong",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop",
  },
];

const ForYou = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentIndex < feedData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }
    if (touchStart - touchEnd < -50) {
      handlePrevious();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrevious();
    }
  };

  const currentFeed = feedData[currentIndex];

  return (
    <div
      className="w-full h-screen relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="relative w-full h-full flex items-center justify-center px-[20px] py-[40px]"
        // style={{
        //   backgroundImage: "url(/road-cloud.png)",
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "center",
        //   backgroundSize: "cover",
        // }}
      >
        {/* <Background /> */}
        <div className="flex items-start gap-[20px]">
          {/* Feed Container */}
          <div
            ref={feedContainerRef}
            className="w-[420px] transition-all duration-500 ease-out"
          >
            <FeedCard
              key={currentFeed.id}
              imageUrl={currentFeed.imageUrl}
              username={currentFeed.username}
              onJoin={() => console.log("Join negotiation")}
            />
          </div>

          {/* Side Action Buttons - Icons only */}
          <div className="flex flex-col gap-5 pt-4">
            <button
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center border border-white/20"
              onClick={() => console.log("Profile")}
            >
              <User
                size={20}
                className="text-dark-700 hover:text-primary transition-colors"
              />
            </button>

            <button
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center border border-white/20"
              onClick={() => console.log("Like")}
            >
              <Heart
                size={20}
                className="text-dark-700 hover:text-danger transition-colors"
              />
            </button>

            <button
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center border border-white/20 relative"
              onClick={() => console.log("Messages")}
            >
              <MessageCircle
                size={20}
                className="text-dark-700 hover:text-secondary transition-colors"
              />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-danger text-white text-[8px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            <button
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center border border-white/20"
              onClick={() => console.log("Share")}
            >
              <Share2
                size={20}
                className="text-dark-700 hover:text-primary transition-colors"
              />
            </button>

            <button
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center border border-white/20"
              onClick={() => console.log("Save")}
            >
              <Bookmark
                size={20}
                className="text-dark-700 hover:text-primary transition-colors"
              />
            </button>

            <button
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center border border-white/20"
              onClick={() => console.log("Notifications")}
            >
              <Bell
                size={20}
                className="text-dark-700 hover:text-primary transition-colors"
              />
            </button>

            <button
              className="w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:shadow-primary/30 transition-all duration-200 hover:scale-110 flex items-center justify-center"
              onClick={() => console.log("Join")}
            >
              <Users size={20} />
            </button>
          </div>
        </div>

        {/* Chevron Controls */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-white/20 ${
              currentIndex === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-primary hover:text-white"
            }`}
          >
            <ChevronUp size={22} />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === feedData.length - 1}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-white/20 ${
              currentIndex === feedData.length - 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-primary hover:text-white"
            }`}
          >
            <ChevronDown size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForYou;
