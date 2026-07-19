// components/business-profile/ReviewsSection.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Star,
  StarHalf,
  MessageSquare,
  ThumbsUp,
  Clock,
  Send,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  content: string;
  createdAt: string;
  verifiedPurchase: boolean;
  images?: string[];
  sellerResponse?: {
    content: string;
    createdAt: string;
  };
  helpfulCount?: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
  isOwner: boolean;
  isPreviewMode?: boolean;
  onRespond: (reviewId: string, response: string) => void;
  sellerName?: string;
  className?: string;
}

type SortOption = "recent" | "helpful" | "highest" | "lowest";
type FilterOption = "all" | "with-photos" | "verified" | "with-response";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = rating >= star - 0.5 && rating < star;
        return (
          <span key={star} className="text-yellow-400">
            {filled ? <Star className="h-3.5 w-3.5 fill-yellow-400" /> :
             half ? <StarHalf className="h-3.5 w-3.5 fill-yellow-400" /> :
             <Star className="h-3.5 w-3.5 text-yellow-400/20" />}
          </span>
        );
      })}
    </div>
  );
}

function ReviewCard({
  review,
  isOwner,
  isPreviewMode,
  onRespond,
}: {
  review: Review;
  isOwner: boolean;
  isPreviewMode?: boolean;
  onRespond: (reviewId: string) => void;
}) {
  const date = new Date(review.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border/30 last:border-0 pb-4 last:pb-0"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-sm font-semibold text-secondary">
          {review.buyerAvatar}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{review.buyerName}</span>
              {review.verifiedPurchase && (
                <span className="text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded-full border border-success/20 flex items-center gap-0.5">
                  <Award className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted/40">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <StarRating rating={review.rating} />
            <span className="text-xs text-muted/40">{review.rating}.0</span>
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">{review.content}</p>

          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {review.images.map((img, i) => (
                <img key={i} src={img} alt={`Review image ${i + 1}`} className="h-16 w-16 rounded-lg object-cover border border-border/30" />
              ))}
            </div>
          )}

          {review.helpfulCount && review.helpfulCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted/50">
              <ThumbsUp className="h-3 w-3" />
              <span>{review.helpfulCount} people found this helpful</span>
            </div>
          )}

          {review.sellerResponse && (
            <div className="mt-2 pl-3 border-l-2 border-secondary/30 bg-secondary/5 rounded-r-lg p-2">
              <p className="text-xs text-foreground/70">{review.sellerResponse.content}</p>
              <p className="text-[10px] text-muted/40 mt-0.5">
                Seller responded · {new Date(review.sellerResponse.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {isOwner && !review.sellerResponse && !isPreviewMode && (
            <button
              onClick={() => onRespond(review.id)}
              className="text-xs text-secondary hover:text-secondary-strong transition flex items-center gap-1.5 mt-1"
            >
              <MessageSquare className="h-3 w-3" />
              Respond to review
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
  }));
  const respondedCount = reviews.filter(r => r.sellerResponse).length;
  const responseRate = total ? Math.round((respondedCount / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-background-elevated/20 border border-border/30">
      <div className="text-4xl font-bold text-foreground">{avg.toFixed(1)}</div>
      <div className="flex items-center gap-1 mt-1"><StarRating rating={avg} /></div>
      <div className="text-xs text-muted/60 mt-1">{total} review{total !== 1 ? "s" : ""}</div>
      <div className="text-[10px] text-muted/40 mt-0.5 flex items-center gap-1">
        <MessageSquare className="h-3 w-3" />
        {responseRate}% responded
      </div>
      <div className="w-full mt-3 space-y-1">
        {distribution.map((item) => (
          <div key={item.stars} className="flex items-center gap-2 text-xs">
            <span className="text-muted/60 w-6 text-right">{item.stars}★</span>
            <div className="flex-1 h-1.5 rounded-full bg-border/40 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500" style={{ width: `${total > 0 ? (item.count / total) * 100 : 0}%` }} />
            </div>
            <span className="text-muted/40 w-8 text-left">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsSection({
  reviews,
  isOwner,
  isPreviewMode = false,
  onRespond,
  sellerName,
  className,
}: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const keywords = useMemo(() => {
    const wordFreq: Record<string, number> = {};
    const stopWords = new Set([
      'this','that','with','from','have','were','they','them','your','will','about','more','like','just','what','when','which','would','their','there','after','before','then','than','very','too','also','some','any','such','make','made','same','all','are','was','were','you','your','the','and','for','not','but','product','service'
    ]);
    reviews.forEach(r => {
      const words = r.content.toLowerCase().split(/\s+/);
      words.forEach(w => {
        const clean = w.replace(/[^a-z]/g, '');
        if (clean.length > 3 && !stopWords.has(clean)) {
          wordFreq[clean] = (wordFreq[clean] || 0) + 1;
        }
      });
    });
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({ word, count }));
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let result = [...reviews];
    switch (filterBy) {
      case "with-photos": result = result.filter((r) => r.images && r.images.length > 0); break;
      case "verified": result = result.filter((r) => r.verifiedPurchase); break;
      case "with-response": result = result.filter((r) => r.sellerResponse); break;
      default: break;
    }
    switch (sortBy) {
      case "recent": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "helpful": result.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0)); break;
      case "highest": result.sort((a, b) => b.rating - a.rating); break;
      case "lowest": result.sort((a, b) => a.rating - b.rating); break;
      default: break;
    }
    return result;
  }, [reviews, filterBy, sortBy]);

  const totalReviews = reviews.length;

  const handleSubmitResponse = (reviewId: string) => {
    if (responseText.trim()) {
      onRespond(reviewId, responseText.trim());
      setResponseText("");
      setRespondingTo(null);
    }
  };

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
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Reviews
            <span className="text-sm font-normal text-muted/60">({totalReviews})</span>
          </h3>
          <p className="text-sm text-muted/70">
            {isPreviewMode || !isOwner
              ? "What customers are saying about this business"
              : "Customer feedback helps you improve and build trust"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
        <div className="md:col-span-1"><RatingSummary reviews={reviews} /></div>
        <div className="md:col-span-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted/60">Sort by:</span>
            {["recent", "helpful", "highest", "lowest"].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option as SortOption)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition",
                  sortBy === option
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted/60 hover:text-foreground"
                )}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted/60">Filter:</span>
            {[
              { value: "all", label: "All" },
              { value: "with-photos", label: "With Photos" },
              { value: "verified", label: "Verified" },
              { value: "with-response", label: "Responded" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterBy(option.value as FilterOption)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition",
                  filterBy === option.value
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted/60 hover:text-foreground"
                )}
              >
                {option.label}
                {option.value !== "all" && (
                  <span className="ml-1 text-[10px] text-muted/40">
                    ({reviews.filter((r) => {
                      if (option.value === "with-photos") return r.images && r.images.length > 0;
                      if (option.value === "verified") return r.verifiedPurchase;
                      if (option.value === "with-response") return r.sellerResponse;
                      return true;
                    }).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {keywords.map(({ word, count }) => (
            <span key={word} className="px-2.5 py-1 rounded-full bg-primary/10 text-xs text-primary/80 border border-primary/20 flex items-center gap-1">
              {word}
              <span className="text-[8px] text-primary/40">({count})</span>
            </span>
          ))}
        </div>
      )}

      {filteredReviews.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-yellow-400/10 flex items-center justify-center mb-3">
            <Star className="h-6 w-6 text-yellow-400/40" />
          </div>
          <h4 className="text-base font-semibold text-foreground">
            {isOwner ? "No reviews yet" : "No reviews available"}
          </h4>
          <p className="text-sm text-muted mt-1">
            {isPreviewMode || !isOwner
              ? "This business hasn't received any reviews yet."
              : "Complete sales to start receiving reviews from buyers"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwner={isOwner}
              isPreviewMode={isPreviewMode}
              onRespond={(id) => setRespondingTo(id)}
            />
          ))}
        </div>
      )}

      {respondingTo && !isPreviewMode && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-semibold text-secondary">
              {isOwner ? "You" : "Seller"}
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response to this review..."
                rows={2}
                className="w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmitResponse(respondingTo)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-white transition hover:bg-secondary-strong shadow-lg shadow-secondary/25"
                >
                  <Send className="h-3.5 w-3.5" />
                  Respond
                </button>
                <button
                  onClick={() => { setRespondingTo(null); setResponseText(""); }}
                  className="rounded-full border border-border/60 px-4 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}