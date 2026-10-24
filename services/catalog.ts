import axios from "axios";

import apiClient from "@/services/client";
import type { BackendListing } from "@/services/mappers";
import type { ListingReview, ListingReviewData } from "@/types/common";

export type ListingFeedKind = "latest" | "trending" | "recommendations";
export type ListingTypeFilter = "product" | "service";
export type ListingInteractionType =
  | "tap"
  | "watch"
  | "share"
  | "contact_seller"
  | "negotiation_started";

export interface ListingFeedParams {
  page?: number;
  limit?: number;
  listing_type?: ListingTypeFilter;
  category_id?: string;
}

export interface ListingFeedResult {
  listings: BackendListing[];
  page: number;
  limit: number;
}

export interface ListingAnalytics {
  total_views: number;
  views: number;
  unique_viewers: number;
  shares: number;
  saves: number;
  taps: number;
  watches: number;
  contacts: number;
  negotiations_started: number;
  window_days: number;
}

interface ListingReviewResponse {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  reviewer?: { full_name: string; avatar_url: string | null } | null;
}

export interface ListingReviewPage {
  reviews: ListingReview[];
  page: number;
  limit: number;
}

function validatePage(page: number, limit: number) {
  if (!Number.isInteger(page) || page < 1 || page > 10_000) {
    throw new Error("Page must be an integer from 1 to 10000.");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new Error("Page size must be an integer from 1 to 50.");
  }
}

export async function getListing(listingId: string): Promise<BackendListing> {
  const response = await apiClient.get<
    | BackendListing
    | { success: boolean; message?: string; data: BackendListing }
  >(`/catalog/listings/${encodeURIComponent(listingId)}`);
  const payload = response.data;
  const listing = "data" in payload ? payload.data : payload;
  if (
    ("data" in payload && payload.success !== true) ||
    !listing ||
    typeof listing.id !== "string" ||
    typeof listing.seller_id !== "string"
  ) {
    throw new Error("Invalid listing response.");
  }
  return listing;
}

export function mapListingReview(review: ListingReviewResponse): ListingReview {
  return {
    id: review.id,
    rating: review.rating,
    title: review.title ?? undefined,
    comment: review.comment ?? "",
    isVerifiedPurchase: review.is_verified_purchase === true,
    createdAt: review.created_at,
    authorName: review.reviewer?.full_name ?? "Buyer",
    reviewerAvatar: review.reviewer?.avatar_url ?? undefined,
  };
}

export async function getListingFeed(
  kind: ListingFeedKind,
  params: ListingFeedParams = {},
): Promise<ListingFeedResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  validatePage(page, limit);
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    data: BackendListing[];
    pagination: { page: number; limit: number };
  }>(`/catalog/listings/${kind}`, {
    params: { ...params, page, limit },
  });
  const payload = response.data;
  if (payload.success !== true || !Array.isArray(payload.data)) {
    throw new Error(payload.message || `Invalid ${kind} listings response.`);
  }
  return {
    listings: payload.data,
    page: payload.pagination?.page ?? page,
    limit: payload.pagination?.limit ?? limit,
  };
}

export async function getListingReviewSummary(
  listingId: string,
): Promise<Pick<ListingReviewData, "rating" | "reviewCount">> {
  const response = await apiClient.get<{
    success: boolean;
    data: { count: number; average: number };
  }>(`/catalog/listings/${encodeURIComponent(listingId)}/reviews/summary`);
  if (response.data.success !== true) {
    throw new Error("Unable to load the review summary.");
  }
  return {
    rating: response.data.data.count > 0 ? response.data.data.average : 0,
    reviewCount: response.data.data.count,
  };
}

export async function getListingReviews(
  listingId: string,
  page = 1,
  limit = 20,
): Promise<ListingReviewPage> {
  validatePage(page, limit);
  const response = await apiClient.get<{
    success: boolean;
    data: ListingReviewResponse[];
    pagination: { page: number; limit: number };
  }>(`/catalog/listings/${encodeURIComponent(listingId)}/reviews`, {
    params: { page, limit },
  });
  if (response.data.success !== true || !Array.isArray(response.data.data)) {
    throw new Error("Unable to load listing reviews.");
  }
  return {
    reviews: response.data.data.map(mapListingReview),
    page: response.data.pagination?.page ?? page,
    limit: response.data.pagination?.limit ?? limit,
  };
}

export interface MyListingReview {
  id: string;
  listingId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: "published" | "hidden";
  updatedAt: string;
  deletedAt: string | null;
}

export async function getMyListingReviews(page = 1, limit = 20) {
  validatePage(page, limit);
  const response = await apiClient.get<{
    success: boolean;
    data: Array<{
      review: {
        id: string;
        listing_id: string;
        reviewer_user_id: string;
        rating: number;
        title: string | null;
        comment: string | null;
        is_verified_purchase: boolean;
        status: "published" | "hidden";
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
      };
      listing: { id: string; title: string; thumbnail_url: string | null };
    }>;
    pagination: { page: number; limit: number };
  }>("/catalog/users/me/reviews", { params: { page, limit } });
  if (response.data.success !== true || !Array.isArray(response.data.data)) {
    throw new Error("Unable to load your reviews.");
  }
  return {
    reviews: response.data.data.map(({ review }) => ({
      id: review.id,
      listingId: review.listing_id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      status: review.status,
      updatedAt: review.updated_at,
      deletedAt: review.deleted_at,
    })),
    page: response.data.pagination?.page ?? page,
    limit: response.data.pagination?.limit ?? limit,
  };
}

export async function createListingReview(
  listingId: string,
  input: { rating: number; title?: string; comment?: string },
): Promise<ListingReview> {
  validateReviewInput(input);
  const response = await apiClient.post<{
    success: boolean;
    data: ListingReviewResponse;
  }>(`/catalog/listings/${encodeURIComponent(listingId)}/reviews`, input);
  if (response.status !== 201 || response.data.success !== true) {
    throw new Error("Unable to submit your review.");
  }
  return mapListingReview(response.data.data);
}

export async function updateListingReview(
  listingId: string,
  reviewId: string,
  input: { rating?: number; title?: string | null; comment?: string | null },
): Promise<ListingReview> {
  validateReviewInput(input);
  const response = await apiClient.patch<{
    success: boolean;
    data: ListingReviewResponse;
  }>(
    `/catalog/listings/${encodeURIComponent(listingId)}/reviews/${encodeURIComponent(reviewId)}`,
    input,
  );
  if (response.data.success !== true) {
    throw new Error("Unable to update your review.");
  }
  return mapListingReview(response.data.data);
}

function validateReviewInput(input: {
  rating?: number;
  title?: string | null;
  comment?: string | null;
}) {
  if (
    input.rating !== undefined &&
    (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)
  ) {
    throw new Error("Rating must be a whole number from 1 to 5.");
  }
  if (input.title != null && input.title.length > 120) {
    throw new Error("Review title must be 120 characters or fewer.");
  }
  if (input.comment != null && input.comment.length > 4_000) {
    throw new Error("Review must be 4,000 characters or fewer.");
  }
}

export async function deleteListingReview(listingId: string, reviewId: string) {
  const response = await apiClient.delete<{
    success: boolean;
    deleted: boolean;
  }>(`/catalog/listings/${encodeURIComponent(listingId)}/reviews/${encodeURIComponent(reviewId)}`);
  if (response.data.success !== true || response.data.deleted !== true) {
    throw new Error("Unable to delete your review.");
  }
}

export async function saveListing(listingId: string): Promise<unknown> {
  // The documented contract does not define this endpoint's response body.
  const response = await apiClient.post(
    `/catalog/listings/${encodeURIComponent(listingId)}/save`,
  );
  return response.data;
}

export async function unsaveListing(listingId: string): Promise<boolean> {
  const response = await apiClient.delete<{
    removed: boolean;
  }>(`/catalog/listings/${encodeURIComponent(listingId)}/unsave`);
  if (typeof response.data.removed !== "boolean") {
    throw new Error("Invalid unsave response.");
  }
  return response.data.removed;
}

export async function getListingViewCount(listingId: string): Promise<number> {
  const response = await apiClient.get<{
    success: boolean;
    data: { listing_id: string; view_count: number };
  }>(`/catalog/listings/${encodeURIComponent(listingId)}/views`);
  if (
    response.data.success !== true ||
    !Number.isInteger(response.data.data.view_count)
  ) {
    throw new Error("Invalid listing view-count response.");
  }
  return response.data.data.view_count;
}

export async function trackListingInteraction(
  listingId: string,
  type: ListingInteractionType,
  watchMs?: number,
): Promise<boolean> {
  if (
    type === "watch" &&
    (!Number.isInteger(watchMs) || watchMs! < 0 || watchMs! > 3_600_000)
  ) {
    throw new Error("Watch duration must be from 0 to 3600000 milliseconds.");
  }
  const eventId = crypto.randomUUID();
  const response = await apiClient.post<{
    success: boolean;
    data: { recorded: boolean };
  }>(`/catalog/listings/${encodeURIComponent(listingId)}/interactions`, {
    type,
    event_id: eventId,
    ...(type === "watch" ? { watch_ms: watchMs } : {}),
  });
  if (response.data.success !== true) {
    throw new Error("Unable to record listing interaction.");
  }
  return response.data.data.recorded;
}

export async function getListingAnalytics(
  listingId: string,
  days = 7,
): Promise<ListingAnalytics> {
  if (!Number.isInteger(days) || days < 1 || days > 90) {
    throw new Error("Analytics period must be from 1 to 90 days.");
  }
  const response = await apiClient.get<{
    success: boolean;
    data: ListingAnalytics;
  }>(`/catalog/listings/${encodeURIComponent(listingId)}/analytics`, {
    params: { days },
  });
  if (response.data.success !== true) {
    throw new Error("Unable to load listing analytics.");
  }
  return response.data.data;
}

export function getCatalogErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}
