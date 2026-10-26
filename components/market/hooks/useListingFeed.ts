"use client";

import { useCallback, useEffect, useState } from "react";

import { getListingFeed, type ListingFeedKind, type ListingTypeFilter } from "@/services/catalog";
import type { BackendListing } from "@/services/mappers";

export function useListingFeed(
  kind: ListingFeedKind,
  listingType: ListingTypeFilter,
  categoryId?: string,
) {
  const [listings, setListings] = useState<BackendListing[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        setLoading(true);
        setError(null);
        setPage(1);
        return getListingFeed(kind, {
          page: 1,
          limit: 20,
          listing_type: listingType,
          ...(categoryId ? { category_id: categoryId } : {}),
        });
      })
      .then((result) => {
        if (!result || cancelled) return;
        setListings(result.listings);
        setPage(result.page);
        setHasMore(result.listings.length === result.limit);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setListings([]);
          setError(loadError);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId, kind, listingType]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const result = await getListingFeed(kind, {
        page: nextPage,
        limit: 20,
        listing_type: listingType,
        ...(categoryId ? { category_id: categoryId } : {}),
      });
      setListings((current) => [...current, ...result.listings]);
      setPage(result.page);
      setHasMore(result.listings.length === result.limit);
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoadingMore(false);
    }
  }, [categoryId, hasMore, kind, loadingMore, listingType, page]);

  return { listings, loading, loadingMore, hasMore, error, loadMore };
}
