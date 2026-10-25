"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  Eye,
  Handshake,
  MessageCircle,
  MousePointer2,
  Play,
  Package,
  RefreshCw,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  getCatalogErrorStatus,
  getListing,
  getListingAnalytics,
  type ListingAnalytics,
} from "@/services/catalog";
import { resolveListingMediaUrl, type BackendListing } from "@/services/mappers";

const numberFormat = new Intl.NumberFormat();

function getListingCoverImage(listing: BackendListing) {
  const media = [...(listing.medias ?? listing.media ?? [])].sort(
    (left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0),
  );
  const cover = media.find((item) => item.is_cover) ?? media[0];
  const path = listing.thumbnail_url?.trim() || cover?.thumbnail_url || cover?.url;
  if (!path) return "";
  try {
    return resolveListingMediaUrl(path);
  } catch {
    return path;
  }
}

export function ListingAnalyticsPage({
  listingId,
}: {
  listingId: string;
}) {
  const [listing, setListing] = useState<BackendListing | null>(null);
  const [analytics, setAnalytics] = useState<ListingAnalytics | null>(null);
  const [days, setDays] = useState(30);
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState<number | undefined>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setErrorStatus(undefined);

    void Promise.all([getListing(listingId), getListingAnalytics(listingId, days)])
      .then(([listingResult, analyticsResult]) => {
        if (cancelled) return;
        setListing(listingResult);
        setAnalytics(analyticsResult);
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        const status = getCatalogErrorStatus(reason);
        setErrorStatus(status);
        setError(
          status === 401
            ? "Your session has expired. Sign in again to view listing analytics."
            : status === 403
              ? "Only this listing’s seller can view its analytics."
              : status === 404
                ? "This listing could not be found."
                : "Listing analytics could not be loaded. Please try again.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [days, listingId, retryKey]);

  const engagement = analytics
    ? [
        { label: "Taps", value: analytics.taps, icon: MousePointer2 },
        { label: "Watches", value: analytics.watches, icon: Play },
        { label: "Shares", value: analytics.shares, icon: Share2 },
        { label: "Saves", value: analytics.saves, icon: Bookmark },
        { label: "Contacts", value: analytics.contacts, icon: MessageCircle },
        {
          label: "Negotiations started",
          value: analytics.negotiations_started,
          icon: Handshake,
        },
      ]
    : [];
  const maxEngagement = Math.max(1, ...engagement.map((item) => item.value));
  const totalInteractions = engagement.reduce((total, item) => total + item.value, 0);
  const coverImage = listing ? getListingCoverImage(listing) : "";
  const viewRate = (value: number) =>
    analytics && analytics.views > 0
      ? `${((value / analytics.views) * 100).toFixed(1)}%`
      : "0%";

  return (
    <AppShell>
      <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background-elevated/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <header className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-background-elevated/40 to-background-elevated/10 p-5 sm:flex-row sm:items-end sm:p-7">
            <div className="flex min-w-0 items-center gap-4">
              {listing ? (
                <div
                  role="img"
                  aria-label={`${listing.title} cover image`}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background-elevated/60 bg-cover bg-center shadow-sm sm:h-20 sm:w-20"
                  style={{ backgroundImage: coverImage ? `url(${JSON.stringify(coverImage)})` : undefined }}
                >
                  {!coverImage && (
                    <div className="flex h-full w-full items-center justify-center text-primary/60">
                      <Package className="h-7 w-7" />
                    </div>
                  )}
                </div>
              ) : null}
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Listing analytics
                </div>
                <h1 className="max-w-3xl truncate text-2xl font-bold sm:text-3xl">
                  {listing?.title || (loading ? "Loading listing…" : "Listing performance")}
                </h1>
                {listing && (
                  <p className="mt-2 text-sm capitalize text-muted">
                    {listing.listing_type || "Listing"}
                    {listing.status ? ` · ${listing.status}` : ""}
                  </p>
                )}
              </div>
            </div>
            <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted">
              Period
              <select
                aria-label="Analytics period"
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
                className="rounded-lg border border-border/70 bg-background px-3 py-2 font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                {[7, 30, 90].map((period) => (
                  <option key={period} value={period}>
                    Last {period} days
                  </option>
                ))}
              </select>
            </label>
          </header>

          {loading ? (
            <p role="status" className="rounded-2xl border border-border/60 bg-background-elevated/20 p-10 text-center text-sm text-muted">
              Loading analytics…
            </p>
          ) : error ? (
            <section role="alert" className="rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
              <p className="text-sm text-danger">{error}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setRetryKey((current) => current + 1)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
                {errorStatus === 401 && (
                  <Link href="/login" className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary/40">
                    Sign in
                  </Link>
                )}
              </div>
            </section>
          ) : analytics ? (
            <>
              <section aria-label="Performance summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: `Views · ${days} days`, value: analytics.views, icon: Eye, accent: "text-primary bg-primary/10" },
                  { label: "Unique viewers", value: analytics.unique_viewers, icon: Users, accent: "text-secondary bg-secondary/10" },
                  { label: "Lifetime views", value: analytics.total_views, icon: BarChart3, accent: "text-primary bg-primary/10" },
                  { label: "Total interactions", value: totalInteractions, icon: TrendingUp, accent: "text-success bg-success/10" },
                ].map(({ label, value, icon: Icon, accent }) => (
                  <article key={label} className="rounded-2xl border border-border/60 bg-background-elevated/20 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted">{label}</p>
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-bold tracking-tight">{numberFormat.format(value)}</p>
                    {label.startsWith("Views") && (
                      <p className="mt-1 text-xs text-muted">{numberFormat.format(analytics.total_views)} all-time views</p>
                    )}
                  </article>
                ))}
              </section>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.8fr)]">
                <section aria-labelledby="engagement-breakdown" className="rounded-2xl border border-border/60 bg-background-elevated/20 p-5 sm:p-6">
                  <div className="mb-6">
                    <h2 id="engagement-breakdown" className="text-lg font-bold">Engagement breakdown</h2>
                    <p className="mt-1 text-sm text-muted">Recorded actions for the selected {days}-day period.</p>
                  </div>
                  <div className="space-y-5">
                    {engagement.map(({ label, value, icon: Icon }) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                          <span className="inline-flex items-center gap-2 text-muted">
                            <Icon className="h-4 w-4 text-primary" />
                            {label}
                          </span>
                          <span className="font-semibold tabular-nums">{numberFormat.format(value)}</span>
                        </div>
                        <div
                          role="img"
                          aria-label={`${label}: ${numberFormat.format(value)} recorded actions`}
                          className="h-2.5 overflow-hidden rounded-full bg-background"
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/55 transition-[width] duration-500"
                            style={{ width: `${value === 0 ? 0 : Math.max(3, (value / maxEngagement) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section aria-labelledby="interaction-rates" className="rounded-2xl border border-border/60 bg-background-elevated/20 p-5 sm:p-6">
                  <div className="mb-5">
                    <h2 id="interaction-rates" className="text-lg font-bold">Interactions per view</h2>
                    <p className="mt-1 text-sm text-muted">Action counts compared with views in this period.</p>
                  </div>
                  <div className="space-y-1">
                    {engagement.map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center justify-between gap-3 border-b border-border/40 py-3 last:border-0">
                        <span className="inline-flex min-w-0 items-center gap-2 text-sm text-muted">
                          <Icon className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">{label}</span>
                        </span>
                        <span className="shrink-0 text-sm font-bold tabular-nums">{viewRate(value)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 rounded-xl bg-primary/[0.06] p-3 text-xs leading-relaxed text-muted">
                    Rates are calculated as recorded actions divided by views. A viewer can create more than one action.
                  </p>
                </section>
              </div>

              <section aria-labelledby="analytics-period-note" className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
                <h2 id="analytics-period-note" className="text-sm font-semibold">About these numbers</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Counts and charts use the marketplace analytics response for the selected period. The current analytics data provides period totals, not daily history, so the bars compare action volume rather than imply a day-by-day trend.
                </p>
              </section>
            </>
          ) : null}
        </div>
      </main>
    </AppShell>
  );
}
