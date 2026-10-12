"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getProductCover } from "@/components/market/data/market";
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
import type { Media, SellerProduct } from "@/types";

export function MarketProductDetail({ product }: { product: SellerProduct }) {
  const savedIds = useHaggleStore((state) => state.savedItemIds);
  const toggleSavedItem = useHaggleStore((state) => state.toggleSavedItem);
  const saved = savedIds.includes(product.id);
  const coverUrl = product.imageUrl ?? getProductCover(product);
  const mediaItems = useMemo(() => {
    const result: Media[] = [];
    const seenMediaUrls = new Set<string>();
    for (const media of [
      ...(coverUrl
        ? [{ id: `cover-${product.id}`, url: coverUrl, type: "image" as const }]
        : []),
      ...(product.images ?? []),
    ]) {
      if (!seenMediaUrls.has(media.url)) {
        seenMediaUrls.add(media.url);
        result.push(media);
      }
    }
    return result;
  }, [coverUrl, product.id, product.images]);
  const [activeMediaUrl, setActiveMediaUrl] = useState(
    coverUrl ?? product.images?.[0]?.url ?? "",
  );
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const activeMedia = product.images?.find(
    (media) => media.url === activeMediaUrl,
  );
  const additionalMedia = mediaItems.filter(
    (media) => media.url !== activeMediaUrl,
  );
  const activeMediaIndex = Math.max(
    0,
    mediaItems.findIndex((media) => media.url === activeMediaUrl),
  );
  const viewerMedia = viewerIndex === null ? null : mediaItems[viewerIndex];
  const openViewer = (index: number) => {
    setActiveMediaUrl(mediaItems[index]?.url ?? activeMediaUrl);
    setViewerIndex(index);
  };
  const showAdjacentMedia = (direction: -1 | 1) => {
    if (viewerIndex === null || mediaItems.length < 2) return;
    const nextIndex =
      (viewerIndex + direction + mediaItems.length) % mediaItems.length;
    setViewerIndex(nextIndex);
    setActiveMediaUrl(mediaItems[nextIndex].url);
  };
  const numericPrice =
    typeof product.price === "number"
      ? product.price
      : Number(String(product.price).replace(/[^\d.-]/g, ""));

  useEffect(() => {
    if (viewerIndex === null || mediaItems.length < 2) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const nextIndex =
        (viewerIndex + direction + mediaItems.length) % mediaItems.length;
      setViewerIndex(nextIndex);
      setActiveMediaUrl(mediaItems[nextIndex].url);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mediaItems, viewerIndex]);

  return (
    <section aria-labelledby="selected-product-title" className="space-y-6">
      <div className="grid gap-6 rounded-2xl bg-background p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-background-elevated lg:aspect-auto lg:min-h-[380px]">
          {activeMedia?.type === "video" ? (
            <video
              key={activeMedia.url}
              src={activeMedia.url}
              controls
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={() => openViewer(activeMediaIndex)}
              aria-label={`View ${product.name} image`}
              className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <Image
                src={activeMediaUrl || getProductCover(product)}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted">
              Product information
            </p>
            <button
              type="button"
              onClick={() => toggleSavedItem(product.id)}
              aria-label={saved ? "Remove from favorites" : "Add to favorites"}
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

          <h1
            id="selected-product-title"
            className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl"
          >
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-bold text-primary">
            {Number.isFinite(numericPrice)
              ? formatPrice(numericPrice, product.priceCurrency)
              : "Price unavailable"}
          </p>
          <p
            className={cn(
              "mt-2 text-sm font-medium",
              product.inventoryCount === 0 ? "text-danger" : "text-muted",
            )}
            role="status"
          >
            {product.stockStatus ?? "Stock status unavailable"}
          </p>

          <div className="mt-5 min-h-0 flex-1">
            <h2 className="text-sm font-semibold">Description</h2>
            <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-muted">
              {product.description || "No description provided."}
            </p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.features.slice(0, 8).map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-background-elevated px-3 py-1 text-xs text-muted"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/product-detail?product=${encodeURIComponent(product.id)}`}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Negotiate
          </Link>
        </div>
      </div>

      {additionalMedia.length > 0 && (
        <section aria-label="More listing photos" className="space-y-3">
          <h2 className="text-base font-semibold">More photos</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {additionalMedia.map((media: Media) => (
              <button
                key={media.id}
                type="button"
                onClick={() =>
                  openViewer(
                    mediaItems.findIndex((item) => item.url === media.url),
                  )
                }
                aria-label={`View ${product.name} photo in image viewer`}
                aria-pressed={activeMediaUrl === media.url}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-xl bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  activeMediaUrl === media.url && "ring-2 ring-primary",
                )}
              >
                {media.type === "video" ? (
                  <>
                    <video
                      src={media.url}
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                      <Video className="h-6 w-6" aria-hidden="true" />
                    </span>
                  </>
                ) : (
                  <Image
                    src={media.url}
                    alt={`${product.name} photo`}
                    fill
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="object-cover transition-transform hover:scale-105"
                  />
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      <Dialog
        open={viewerIndex !== null}
        onOpenChange={(open) => {
          if (!open) setViewerIndex(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="h-[90dvh] w-[min(96vw,1200px)] max-w-none gap-0 overflow-hidden border-0 bg-black/70 p-0 text-white shadow-none sm:max-w-none"
        >
          <DialogTitle className="sr-only">{product.name} photos</DialogTitle>
          <DialogDescription className="sr-only">
            Browse product photos using the previous and next buttons.
          </DialogDescription>
          {viewerMedia && (
            <div className="relative flex h-full w-full items-center justify-center">
              {viewerMedia.type === "video" ? (
                <video
                  key={viewerMedia.url}
                  src={viewerMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-full max-w-full"
                />
              ) : (
                <Image
                  key={viewerMedia.url}
                  src={viewerMedia.url}
                  alt={`${product.name} photo ${viewerIndex! + 1}`}
                  fill
                  sizes="96vw"
                  className="object-contain"
                  priority
                />
              )}

              <DialogClose
                aria-label="Close image viewer"
                className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </DialogClose>

              {mediaItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => showAdjacentMedia(-1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5"
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showAdjacentMedia(1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5"
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <p
                    aria-live="polite"
                    className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white"
                  >
                    {viewerIndex! + 1} / {mediaItems.length}
                  </p>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
