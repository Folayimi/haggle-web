// components/feed/InteractionButtons.tsx
"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

interface InteractionButtonsProps {
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export const InteractionButtons = ({
  onLike,
  onComment,
  onShare,
  onSave,
}: InteractionButtonsProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => {
          setLiked(!liked);
          onLike?.();
        }}
        className="p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 border border-white/10 group"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            liked
              ? "text-red-500 fill-red-500"
              : "text-white group-hover:text-red-400"
          }`}
        />
      </button>

      <button
        onClick={onComment}
        className="p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 border border-white/10 group"
      >
        <MessageCircle className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
      </button>

      <button
        onClick={onShare}
        className="p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 border border-white/10 group"
      >
        <Share2 className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />
      </button>

      <button
        onClick={() => {
          setSaved(!saved);
          onSave?.();
        }}
        className="p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 border border-white/10 group"
      >
        <Bookmark
          className={`w-5 h-5 transition-colors ${
            saved
              ? "text-primary fill-primary"
              : "text-white group-hover:text-primary/80"
          }`}
        />
      </button>
    </div>
  );
};
