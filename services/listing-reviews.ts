import {
  getListingReviewSummary,
  getListingReviews as getListingReviewsPage,
} from "@/services/catalog";
import type { ListingReviewData } from "@/types/common";

const REVIEW_CACHE_MS = 30_000;
const reviewCache = new Map<
  string,
  { value: ListingReviewData; expiresAt: number }
>();
const summaryCache = new Map<string, { value: { rating: number; reviewCount: number }; expiresAt: number }>();

export async function loadListingReviews(
  listingId: string,
  page = 1,
  limit = 20,
): Promise<ListingReviewData> {
  const cacheKey = `${listingId}:${page}:${limit}`;
  const cached = reviewCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const cachedSummary = summaryCache.get(listingId);
  const [summary, reviewPage] = await Promise.all([
    cachedSummary && cachedSummary.expiresAt > Date.now()
      ? cachedSummary.value
      : getListingReviewSummary(listingId).then((value) => {
          summaryCache.set(listingId, { value, expiresAt: Date.now() + REVIEW_CACHE_MS });
          return value;
        }),
    getListingReviewsPage(listingId, page, limit),
  ]);
  const result: ListingReviewData = {
    ...summary,
    reviews: reviewPage.reviews,
    isSample: false,
    page: reviewPage.page,
    limit: reviewPage.limit,
    hasMore: reviewPage.reviews.length === reviewPage.limit,
  };
  reviewCache.set(cacheKey, {
    value: result,
    expiresAt: Date.now() + REVIEW_CACHE_MS,
  });
  return result;
}

export function invalidateListingReviews(listingId: string) {
  summaryCache.delete(listingId);
  for (const key of reviewCache.keys()) {
    if (key.startsWith(`${listingId}:`)) reviewCache.delete(key);
  }
}
