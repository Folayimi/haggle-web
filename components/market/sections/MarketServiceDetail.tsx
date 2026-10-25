"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Star,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useListingReviews } from "@/components/market/hooks/useListingReviews";
import { useListingSave } from "@/components/market/hooks/useListingSave";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHaggleStore } from "@/lib/app-store";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { createConversation, sendMessage } from "@/services/conversations";
import { mapListingToService } from "@/services/mappers";
import { getSellerListings } from "@/services/request";
import { notifyError } from "@/services/toastify";
import type { MarketService } from "@/types";
import { AllReviewsView, ReviewPreview } from "./ListingReviews";

function ServiceFact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  if (!value) return null;

  return (
    <div className="rounded-xl bg-background-elevated p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function MarketServiceDetail({
  service,
  showAllReviews,
  onShowAllReviewsChange,
}: {
  service: MarketService;
  showAllReviews: boolean;
  onShowAllReviewsChange: (show: boolean) => void;
}) {
  const router = useRouter();
  const userData = useHaggleStore((state) => state.userData);
  const setActivateAuth = useHaggleStore((state) => state.setActivateAuth);
  const {
    saved,
    pending: savePending,
    toggle: toggleSaved,
  } = useListingSave(service.id);
  const reviews = useListingReviews(service.id, service.sellerId);
  const [sellerServices, setSellerServices] = useState<MarketService[]>([]);
  const [sellerServicesLoading, setSellerServicesLoading] = useState(true);
  const [sellerServicesError, setSellerServicesError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [requirements, setRequirements] = useState("");
  const [quotePending, setQuotePending] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const gallery = Array.from(
    new Set([service.imageUrl, ...(service.gallery ?? [])].filter(Boolean)),
  );
  const price =
    service.price === ""
      ? Number.NaN
      : Number(String(service.price).replace(/[^\d.-]/g, ""));
  const isOwner = Boolean(userData?.id && userData.id === service.sellerId);

  useEffect(() => {
    let cancelled = false;
    void getSellerListings(service.sellerId)
      .then((listings) => {
        if (cancelled) return;
        setSellerServices(
          listings
            .filter(
              (listing) =>
                listing.id !== service.id &&
                listing.listing_type?.toLowerCase() === "service" &&
                listing.status?.toLowerCase() === "published",
            )
            .slice(0, 4)
            .map((listing) =>
              mapListingToService(listing, listing.category_id),
            ),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setSellerServices([]);
          setSellerServicesError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setSellerServicesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [service.id, service.sellerId]);

  useEffect(() => {
    if (!viewerOpen || gallery.length < 2) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      setActiveImageIndex(
        (index) => (index + direction + gallery.length) % gallery.length,
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gallery.length, viewerOpen]);

  const submitQuoteRequest = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setQuoteError("");
    if (isOwner) {
      setQuoteError("You cannot request a quote for your own service.");
      return;
    }
    if (!userData?.id) {
      setActivateAuth(true);
      notifyError("Sign in to request a service quote.");
      return;
    }

    const cleanRequirements = requirements.trim();
    if (!cleanRequirements) {
      setQuoteError(
        "Describe what you need so the seller can prepare a quote.",
      );
      return;
    }
    if (budget && (!Number.isFinite(Number(budget)) || Number(budget) <= 0)) {
      setQuoteError("Enter a valid budget or leave it blank.");
      return;
    }

    setQuotePending(true);
    try {
      const conversation = await createConversation({
        conversation_type: "direct",
        seller_id: service.sellerId,
        listing_id: service.id,
        participant_ids: [userData.id, service.sellerId],
      });
      if (!conversation?.id) {
        throw new Error("A conversation could not be started.");
      }

      const quoteMessage = [
        `I'd like to request a quote for ${service.name}.`,
        budget
          ? `My budget is ${formatPrice(Number(budget), service.priceCurrency)}.`
          : "",
        timeline ? `My preferred timeline is ${timeline.trim()}.` : "",
        `Project details: ${cleanRequirements}`,
      ]
        .filter(Boolean)
        .join("\n");
      const message = await sendMessage(conversation.id, {
        sender_user_id: userData.id,
        message_type: "text",
        text_body: quoteMessage,
      });
      if (!message) {
        throw new Error("Your quote request could not be sent.");
      }
      setQuoteOpen(false);
      router.push(`/conversation?id=${encodeURIComponent(conversation.id)}`);
    } catch {
      setQuoteError("Your quote request could not be sent. Please try again.");
    } finally {
      setQuotePending(false);
    }
  };

  return (
    <section aria-labelledby="selected-service-title" className="space-y-6">
      {showAllReviews ? (
        <AllReviewsView
          title={service.name}
          rating={reviews.reviewData?.rating}
          reviewCount={reviews.reviewData?.reviewCount}
          reviews={reviews.reviewData?.reviews}
          myReview={reviews.myReview}
          isOwner={reviews.isOwner}
          isAuthenticated={reviews.isAuthenticated}
          isLoading={reviews.isLoading}
          isLoadingMore={reviews.isLoadingMore}
          hasMore={reviews.reviewData?.hasMore ?? false}
          error={reviews.error}
          personalError={reviews.myReviewError}
          onLoadMore={() => void reviews.loadMore()}
          onSaveReview={reviews.saveReview}
          onDeleteReview={reviews.removeReview}
        />
      ) : (
        <>
          <div className="grid gap-6 rounded-2xl bg-background p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-3">
              <div className="relative h-[320px] overflow-hidden rounded-xl bg-background-elevated sm:h-[380px] lg:h-[420px]">
                {gallery[activeImageIndex] ? (
                  <button
                    type="button"
                    onClick={() => setViewerOpen(true)}
                    aria-label={`View ${service.name} portfolio image`}
                    className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  >
                    <Image
                      src={gallery[activeImageIndex]}
                      alt={`${service.name} portfolio image ${activeImageIndex + 1}`}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  </button>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted">
                    <BriefcaseBusiness
                      className="h-12 w-12"
                      aria-hidden="true"
                    />
                    <span className="sr-only">
                      No portfolio image available
                    </span>
                  </div>
                )}
                {gallery.length > 1 && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                    {activeImageIndex + 1} / {gallery.length}
                  </span>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Show portfolio image ${index + 1}`}
                      aria-pressed={activeImageIndex === index}
                      className={cn(
                        "relative aspect-[4/3] overflow-hidden rounded-lg bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        activeImageIndex === index && "ring-2 ring-primary",
                      )}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 15vw, 25vw"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted">
                  Professional service
                </p>
                <button
                  type="button"
                  onClick={() => void toggleSaved()}
                  disabled={savePending}
                  aria-label={
                    saved ? "Remove from favorites" : "Add to favorites"
                  }
                  aria-pressed={saved}
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background transition hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    saved && "border-primary bg-primary/10 text-primary",
                  )}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={saved ? "currentColor" : "none"}
                  />
                </button>
              </div>
              <p className="mt-2 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {service.category}
              </p>
              <h1
                id="selected-service-title"
                className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl"
              >
                {service.name}
              </h1>
              {reviews.reviewData?.rating !== undefined &&
                reviews.reviewData.rating > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground">
                      {reviews.reviewData.rating.toFixed(1)}
                    </span>
                    <span
                      aria-label={`${reviews.reviewData.rating.toFixed(1)} out of 5 stars`}
                      className="inline-flex gap-0.5 text-amber-500"
                    >
                      {Array.from(
                        { length: Math.round(reviews.reviewData.rating) },
                        (_, index) => (
                          <Star
                            key={index}
                            className="h-4 w-4 fill-current"
                            aria-hidden="true"
                          />
                        ),
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => onShowAllReviewsChange(true)}
                      className="text-muted underline-offset-4 hover:underline"
                    >
                      {reviews.reviewData.reviewCount}{" "}
                      {reviews.reviewData.reviewCount === 1
                        ? "review"
                        : "reviews"}
                    </button>
                  </div>
                )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="text-2xl font-bold text-primary">
                  {Number.isFinite(price)
                    ? `Starting at ${formatPrice(price, service.priceCurrency)}`
                    : "Price unavailable"}
                </p>
                <button
                  type="button"
                  onClick={() => setQuoteOpen(true)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Request Service
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ServiceFact
                  label="Typical turnaround"
                  value={service.deliveryTime}
                  icon={<Clock3 className="h-4 w-4" />}
                />
                <ServiceFact
                  label="Work arrangement"
                  value={
                    service.workPlace === "On-site" && service.workAddress
                      ? `${service.workPlace} · ${service.workAddress}`
                      : (service.workPlace ?? "")
                  }
                  icon={<MapPin className="h-4 w-4" />}
                />
                <ServiceFact
                  label="Ideal for"
                  value={service.audience
                    .toLowerCase()
                    .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                  icon={<Users className="h-4 w-4" />}
                />
                <ServiceFact
                  label="Pricing"
                  value={
                    service.negotiable ? "Open to negotiation" : "Set package"
                  }
                  icon={<Check className="h-4 w-4" />}
                />
              </div>
              {service.negotiationNote && (
                <p className="mt-4 rounded-xl bg-accent/30 p-4 text-sm leading-6 text-muted">
                  <span className="font-semibold text-foreground">
                    Good to know:{" "}
                  </span>
                  {service.negotiationNote}
                </p>
              )}
            </div>
          </div>

          <ReviewPreview
            rating={reviews.reviewData?.rating}
            reviewCount={reviews.reviewData?.reviewCount}
            reviews={reviews.reviewData?.reviews}
            isLoading={reviews.isLoading}
            error={reviews.error}
            canWriteReview={reviews.canReview}
            hasOwnReview={Boolean(reviews.myReview)}
            onShowAll={() => onShowAllReviewsChange(true)}
          />

          <section className="grid gap-6 rounded-2xl bg-background p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.55fr)]">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">About this service</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">
                  {service.description || "No description provided."}
                </p>
              </div>
              {service.includes.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold">What’s included</h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {service.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 rounded-xl bg-background-elevated p-3 text-sm text-muted"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-success"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <aside className="rounded-xl border border-border/60 p-4">
              <h2 className="text-base font-semibold">How it works</h2>
              <ol className="mt-4 space-y-4">
                {[
                  [
                    "Tell us what you need",
                    "Share your goals, budget, and preferred timeline.",
                  ],
                  [
                    "Agree on the scope",
                    "Discuss the details and settle on a package together.",
                  ],
                  [
                    "Get started",
                    "Confirm the plan directly with the service provider.",
                  ],
                ].map(([title, description], index) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        {title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted">
                        {description}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </aside>
          </section>

          <section
            aria-labelledby="more-services-title"
            className="rounded-2xl bg-background p-4 sm:p-6"
          >
            <div className="mb-5">
              <h2 id="more-services-title" className="text-lg font-bold">
                More services by this seller
              </h2>
              <p className="mt-1 text-sm text-muted">
                Explore other services from the same professional.
              </p>
            </div>
            {sellerServicesLoading ? (
              <div
                role="status"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              >
                <span className="sr-only">
                  Loading more services from this seller
                </span>
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[4/3] rounded-xl bg-primary/10" />
                    <div className="mt-3 h-4 w-3/4 rounded bg-primary/10" />
                    <div className="mt-2 h-3 w-full rounded bg-primary/10" />
                  </div>
                ))}
              </div>
            ) : sellerServicesError ? (
              <p
                role="alert"
                className="rounded-xl border border-danger/30 px-4 py-6 text-center text-sm text-danger"
              >
                More services could not be loaded.
              </p>
            ) : sellerServices.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {sellerServices.map((sellerService) => {
                  const otherPrice = Number(
                    String(sellerService.price).replace(/[^\d.-]/g, ""),
                  );
                  return (
                    <Link
                      key={sellerService.id}
                      href={`/service-detail/${encodeURIComponent(sellerService.id)}`}
                      className="group overflow-hidden rounded-xl border border-border/60 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <div className="relative aspect-[4/3] bg-background-elevated">
                        {sellerService.imageUrl ? (
                          <Image
                            src={sellerService.imageUrl}
                            alt={sellerService.name}
                            fill
                            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 45vw, 100vw"
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted">
                            <BriefcaseBusiness
                              className="h-8 w-8"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="truncate text-sm font-semibold">
                          {sellerService.name}
                        </p>
                        <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-muted">
                          {sellerService.description || sellerService.category}
                        </p>
                        <p className="mt-2 text-sm font-bold text-primary">
                          {Number.isFinite(otherPrice)
                            ? `From ${formatPrice(otherPrice, sellerService.priceCurrency)}`
                            : "Price unavailable"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted">
                This seller has no other published services yet.
              </p>
            )}
          </section>
        </>
      )}

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent
          showCloseButton={false}
          className="h-[90dvh] w-[min(96vw,1200px)] max-w-none gap-0 overflow-hidden border-0 bg-black/70 p-0 text-white shadow-none sm:max-w-none"
        >
          <DialogTitle className="sr-only">
            {service.name} portfolio
          </DialogTitle>
          <DialogDescription className="sr-only">
            Browse portfolio images using the previous and next buttons.
          </DialogDescription>
          {gallery[activeImageIndex] && (
            <div className="relative flex h-full w-full items-center justify-center">
              <Image
                key={gallery[activeImageIndex]}
                src={gallery[activeImageIndex]}
                alt={`${service.name} portfolio image ${activeImageIndex + 1}`}
                fill
                sizes="96vw"
                className="object-contain"
                priority
              />
              <DialogClose
                aria-label="Close portfolio viewer"
                className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </DialogClose>
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex(
                        (index) =>
                          (index - 1 + gallery.length) % gallery.length,
                      )
                    }
                    aria-label="Previous portfolio image"
                    className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5"
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex(
                        (index) => (index + 1) % gallery.length,
                      )
                    }
                    aria-label="Next portfolio image"
                    className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5"
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <p
                    aria-live="polite"
                    className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white"
                  >
                    {activeImageIndex + 1} / {gallery.length}
                  </p>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogTitle>Request a custom quote</DialogTitle>
          <DialogDescription>
            Share your budget, timeline, and project needs with the seller.
          </DialogDescription>
          <form onSubmit={submitQuoteRequest} className="space-y-4">
            <div>
              <label
                htmlFor="service-quote-budget"
                className="text-sm font-medium"
              >
                Budget{" "}
                {service.priceCurrency ? `(${service.priceCurrency})` : ""}
              </label>
              <input
                id="service-quote-budget"
                type="number"
                min="0"
                step="0.01"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                placeholder="Optional"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="service-quote-timeline"
                className="text-sm font-medium"
              >
                Preferred timeline
              </label>
              <input
                id="service-quote-timeline"
                value={timeline}
                onChange={(event) => setTimeline(event.target.value)}
                placeholder="e.g. within two weeks"
                maxLength={120}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="service-quote-requirements"
                className="text-sm font-medium"
              >
                What do you need?
              </label>
              <textarea
                id="service-quote-requirements"
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                maxLength={4000}
                rows={5}
                required
                placeholder="Describe the project and any important details."
                className="mt-1 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            {quoteError && (
              <p role="alert" className="text-sm text-danger">
                {quoteError}
              </p>
            )}
            <button
              type="submit"
              disabled={quotePending}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-wait disabled:opacity-60"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {quotePending ? "Sending request..." : "Send quote request"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
