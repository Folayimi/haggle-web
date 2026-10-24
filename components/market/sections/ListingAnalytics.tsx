"use client";

import { useEffect, useState } from "react";

import { getCatalogErrorStatus, getListingAnalytics, type ListingAnalytics as ListingAnalyticsData } from "@/services/catalog";

export function ListingAnalytics({ listingId }: { listingId: string }) {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<ListingAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return null;
      setLoading(true);
      setError("");
      return getListingAnalytics(listingId, days);
    }).then((result) => {
      if (!result) return;
      if (!cancelled) setData(result);
    }).catch((reason: unknown) => {
        if (!cancelled) {
          const status = getCatalogErrorStatus(reason);
          setError(status === 403 ? "Only the listing owner can view these analytics." : status === 401 ? "Sign in again to view listing analytics." : "Listing analytics could not be loaded.");
        }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [days, listingId]);

  return (
    <section aria-labelledby="listing-analytics-title" className="rounded-2xl bg-background p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="listing-analytics-title" className="text-base font-semibold">Listing analytics</h2>
          <p className="mt-1 text-xs text-muted">Engagement for this listing.</p>
        </div>
        <label className="text-sm text-muted">Period{" "}
          <select value={days} onChange={(event) => setDays(Number(event.target.value))} className="ml-2 rounded-lg border border-border bg-background px-2 py-1 text-foreground">
            {[7, 30, 90].map((value) => <option key={value} value={value}>{value} days</option>)}
          </select>
        </label>
      </div>
      {loading ? <p role="status" className="mt-4 text-sm text-muted">Loading analytics...</p> : error ? <p role="alert" className="mt-4 text-sm text-danger">{error}</p> : data && (
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["Views", data.views], ["Lifetime views", data.total_views], ["Unique viewers", data.unique_viewers], ["Shares", data.shares], ["Saves", data.saves], ["Taps", data.taps], ["Watches", data.watches], ["Contacts", data.contacts], ["Negotiations", data.negotiations_started]]
            .map(([label, value]) => <div key={String(label)} className="rounded-xl bg-background-elevated p-3"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 text-lg font-semibold">{value}</dd></div>)}
        </dl>
      )}
    </section>
  );
}
