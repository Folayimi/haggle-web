// FeedCard.tsx - Reusable Feed Component
"use client";

interface FeedCardProps {
  imageUrl: string;
  username: string;
  onJoin?: () => void;
}

const FeedCard = ({ imageUrl, username, onJoin }: FeedCardProps) => {
  return (
    <div
      className="relative w-full h-[90vh] rounded-2xl overflow-hidden shadow-xl border border-white/10"
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(4px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        // margin: "12px 16px",
        overflow: "hidden",
        transition: "all 0.3s ease;",
      }}
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={username}
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay for text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Bottom Left - Username */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="text-white font-bold text-sm">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-white font-semibold text-lg">@{username}</p>
          <p className="text-white/60 text-xs">Live now</p>
        </div>
      </div>

      {/* Join Button */}
      <button
        onClick={onJoin}
        className="absolute bottom-6 right-6 px-6 py-2.5 bg-primary hover:bg-primary-600 text-white font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
      >
        Join Live
      </button>
    </div>
  );
};

export default FeedCard;
