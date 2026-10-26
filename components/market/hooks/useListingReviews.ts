import { useCallback, useEffect, useState } from "react";

import {
  createListingReview,
  deleteListingReview,
  getCatalogErrorStatus,
  getMyListingReviews,
  updateListingReview,
} from "@/services/catalog";
import {
  invalidateListingReviews,
  loadListingReviews,
} from "@/services/listing-reviews";
import { useHaggleStore } from "@/lib/app-store";
import type { ListingReviewData } from "@/types/common";

export function useListingReviews(listingId: string, sellerId?: string) {
  const userData = useHaggleStore((state) => state.userData);
  const [reviewData, setReviewData] = useState<ListingReviewData | null>(null);
  const [myReview, setMyReview] = useState<{
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [myReviewError, setMyReviewError] = useState("");
  const isAuthenticated = Boolean(userData?.id);
  const isOwner = Boolean(userData?.id && sellerId && userData.id === sellerId);

  const reload = useCallback(async () => {
    invalidateListingReviews(listingId);
    const firstPage = await loadListingReviews(listingId, 1, 20);
    setReviewData(firstPage);
  }, [listingId]);

  const refreshMyReview = useCallback(async () => {
    if (!isAuthenticated) {
      setMyReview(null);
      setMyReviewError("");
      return;
    }
    try {
      const result = await getMyListingReviews(1, 50);
      setMyReview(result.reviews.find((review) => review.listingId === listingId && !review.deletedAt) ?? null);
      setMyReviewError("");
    } catch {
      setMyReviewError("Your review details could not be loaded.");
    }
  }, [isAuthenticated, listingId]);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return null;
      setIsLoading(true);
      setError("");
      return loadListingReviews(listingId, 1, 20);
    }).then((data) => {
      if (!data) return;
        if (cancelled) return;
        setReviewData(data);
    }).catch(() => {
        if (cancelled) return;
        setError("Reviews could not be loaded. Please try again.");
    }).finally(() => {
        if (!cancelled) setIsLoading(false);
    });
    if (isAuthenticated) {
      void Promise.resolve().then(() => {
        if (cancelled) return null;
        setMyReviewError("");
        return getMyListingReviews(1, 50);
      }).then((mine) => {
        if (!mine || cancelled) return;
        setMyReview(mine.reviews.find((review) => review.listingId === listingId && !review.deletedAt) ?? null);
      }).catch(() => {
        if (!cancelled) setMyReviewError("Your review details could not be loaded.");
      });
    } else {
      void Promise.resolve().then(() => {
        if (!cancelled) setMyReview(null);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, listingId]);

  const loadMore = useCallback(async () => {
    if (!reviewData?.hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = (reviewData.page ?? 1) + 1;
    try {
      const pageData = await loadListingReviews(listingId, nextPage, 20);
      setReviewData((current) =>
        current
          ? {
              ...current,
              page: pageData.page,
              hasMore: pageData.hasMore,
              reviews: [...current.reviews, ...pageData.reviews],
            }
          : pageData,
      );
    } catch {
      setError("More reviews could not be loaded. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, listingId, reviewData]);

  const saveReview = useCallback(
    async (input: { rating: number; title?: string; comment?: string }) => {
      try {
        if (myReview) {
          await updateListingReview(listingId, myReview.id, input);
        } else {
          await createListingReview(listingId, input);
        }
        await Promise.all([reload(), refreshMyReview()]);
      } catch (saveError) {
        if (getCatalogErrorStatus(saveError) === 409) {
          await Promise.all([reload(), refreshMyReview()]);
        }
        throw saveError;
      }
    },
    [listingId, myReview, refreshMyReview, reload],
  );

  const removeReview = useCallback(async () => {
    if (!myReview) return;
    await deleteListingReview(listingId, myReview.id);
    setMyReview(null);
    await reload();
  }, [listingId, myReview, reload]);

  return {
    reviewData,
    myReview,
    isLoading,
    isLoadingMore,
    error,
    myReviewError,
    isAuthenticated,
    isOwner,
    canReview: isAuthenticated && !isOwner,
    loadMore,
    saveReview,
    removeReview,
    reload,
  };
}
