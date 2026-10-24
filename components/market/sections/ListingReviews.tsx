"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { getCatalogErrorStatus } from "@/services/catalog";
import type { ListingReview } from "@/types/common";

type UserReview = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
};

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`h-3.5 w-3.5 ${index < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted/30"}`}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: ListingReview }) {
  return (
    <article className="border-b border-border/60 py-4 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-foreground">{review.authorName || "Buyer"}</p>
          {review.isVerifiedPurchase && (
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
              Verified purchase
            </span>
          )}
        </div>
        {review.createdAt && (
          <time dateTime={review.createdAt} className="text-xs text-muted">
            {new Date(review.createdAt).toLocaleDateString()}
          </time>
        )}
      </div>
      <div className="mt-1"><ReviewStars rating={review.rating} /></div>
      {review.title && <h3 className="mt-2 text-sm font-semibold">{review.title}</h3>}
      {review.comment && (
        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted">
          {review.comment}
        </p>
      )}
    </article>
  );
}

function ReviewEditor({
  review,
  onSave,
  onDelete,
}: {
  review: UserReview | null;
  onSave: (input: { rating: number; title?: string; comment?: string }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [title, setTitle] = useState(review?.title ?? "");
  const [comment, setComment] = useState(review?.comment ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError("Choose a rating from 1 to 5 stars.");
      return;
    }
    if (title.length > 120 || comment.length > 4_000) {
      setError("Check the title and review length limits.");
      return;
    }
    setPending(true);
    try {
      await onSave({ rating, title: title.trim(), comment: comment.trim() });
    } catch (saveError) {
      const status = getCatalogErrorStatus(saveError);
      setError(
        status === 401
          ? "Sign in to submit a review."
          : status === 403
            ? "You cannot review this listing."
            : status === 409
              ? "A review already exists. Your review has been refreshed so you can edit it."
              : "Your review could not be saved. Please try again.",
      );
    } finally {
      setPending(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete your review? You can submit a new one later.")) return;
    setError("");
    setPending(true);
    try {
      await onDelete();
    } catch (deleteError) {
      const status = getCatalogErrorStatus(deleteError);
      setError(
        status === 403
          ? "Only the review author can delete this review."
          : "Your review could not be deleted. Please try again.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 rounded-xl border border-border/60 p-4">
      <h2 className="text-base font-semibold">{review ? "Edit your review" : "Write a review"}</h2>
      <fieldset className="mt-3">
        <legend className="text-sm font-medium">Your rating</legend>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} stars`}
              aria-pressed={rating === value}
              onClick={() => setRating(value)}
              className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Star className={`h-6 w-6 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-muted/30"}`} />
            </button>
          ))}
        </div>
      </fieldset>
      <label className="mt-3 block text-sm font-medium" htmlFor="review-title">Title (optional)</label>
      <input
        id="review-title"
        value={title}
        maxLength={120}
        onChange={(event) => setTitle(event.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <label className="mt-3 block text-sm font-medium" htmlFor="review-comment">Review (optional)</label>
      <textarea
        id="review-comment"
        value={comment}
        maxLength={4_000}
        rows={4}
        onChange={(event) => setComment(event.target.value)}
        className="mt-1 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving..." : review ? "Update review" : "Submit review"}
        </button>
        {review && (
          <button
            type="button"
            onClick={() => void remove()}
            disabled={pending}
            className="rounded-lg border border-danger/40 px-4 py-2 text-sm font-semibold text-danger disabled:opacity-60"
          >
            Delete review
          </button>
        )}
      </div>
    </form>
  );
}

export function ReviewPreview({
  rating,
  reviewCount,
  reviews,
  isLoading = false,
  error = "",
  canWriteReview = false,
  hasOwnReview = false,
  onShowAll,
}: {
  rating?: number;
  reviewCount?: number;
  reviews?: ListingReview[];
  isLoading?: boolean;
  error?: string;
  canWriteReview?: boolean;
  hasOwnReview?: boolean;
  onShowAll: () => void;
}) {
  const visibleReviews = reviews?.slice(0, 3) ?? [];
  const count = reviewCount ?? reviews?.length ?? 0;

  return (
    <section aria-labelledby="reviews-heading" className="rounded-2xl bg-background p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="reviews-heading" className="text-base font-semibold">Reviews</h2>
          <div className="mt-1 flex items-center gap-2 text-sm">
            {rating !== undefined && rating > 0 ? (
              <>
                <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
                <ReviewStars rating={rating} />
                <span className="text-muted">({count} {count === 1 ? "review" : "reviews"})</span>
              </>
            ) : (
              <span className="text-muted">{count > 0 ? `${count} ${count === 1 ? "review" : "reviews"}` : "Not rated yet"}</span>
            )}
          </div>
        </div>
        {(count > 3 || canWriteReview || hasOwnReview) && (
          <button
            type="button"
            onClick={onShowAll}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {count > 3 ? "Show more" : hasOwnReview ? "Manage your review" : "Write a review"}
          </button>
        )}
      </div>

      {isLoading ? (
        <p role="status" className="mt-4 text-sm text-muted">Loading reviews...</p>
      ) : error ? (
        <p role="alert" className="mt-4 text-sm text-danger">{error}</p>
      ) : visibleReviews.length > 0 ? (
        <div className="mt-2">
          {visibleReviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">No reviews yet.</p>
      )}
    </section>
  );
}

export function AllReviewsView({
  title,
  rating,
  reviewCount,
  reviews,
  myReview,
  isOwner,
  isAuthenticated,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  personalError = "",
  onLoadMore,
  onSaveReview,
  onDeleteReview,
}: {
  title: string;
  rating?: number;
  reviewCount?: number;
  reviews?: ListingReview[];
  myReview: UserReview | null;
  isOwner: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string;
  personalError?: string;
  onLoadMore: () => void;
  onSaveReview: (input: { rating: number; title?: string; comment?: string }) => Promise<void>;
  onDeleteReview: () => Promise<void>;
}) {
  const count = reviewCount ?? reviews?.length ?? 0;

  return (
    <section aria-labelledby="all-reviews-title" className="min-h-[320px] rounded-2xl bg-background p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3 border-b border-border/60 pb-4">
        <h1 id="all-reviews-title" className="text-xl font-semibold">Reviews for {title}</h1>
        {rating !== undefined && rating > 0 && (
          <span className="inline-flex items-center gap-2 text-sm">
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <ReviewStars rating={rating} />
          </span>
        )}
        <span className="text-sm text-muted">{count} {count === 1 ? "review" : "reviews"}</span>
      </div>
      {isLoading ? (
        <p role="status" className="py-8 text-center text-sm text-muted">Loading reviews...</p>
      ) : error ? (
        <p role="alert" className="py-8 text-center text-sm text-danger">{error}</p>
      ) : reviews && reviews.length > 0 ? (
        <div>
          {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted">No reviews yet.</p>
      )}
      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="mt-3 rounded-lg border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {isLoadingMore ? "Loading more..." : "Load more reviews"}
        </button>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
      {personalError && <p role="alert" className="mt-3 text-sm text-danger">{personalError}</p>}
      {isAuthenticated && !isOwner ? (
        <ReviewEditor key={myReview?.id ?? "new"} review={myReview} onSave={onSaveReview} onDelete={onDeleteReview} />
      ) : !isAuthenticated ? (
        <p className="mt-6 text-sm text-muted">
          <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link> to write a review.
        </p>
      ) : null}
    </section>
  );
}
