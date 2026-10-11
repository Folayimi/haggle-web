import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-primary/10", className)}
    />
  );
}

function ProductCardSkeleton() {
  return (
    <div className="min-w-0">
      <SkeletonBlock className="aspect-[4/3] w-full rounded-xl" />
      <SkeletonBlock className="mt-3 h-4 w-3/4" />
      <SkeletonBlock className="mt-2 h-3 w-full" />
    </div>
  );
}

function CarouselSectionSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <section className="space-y-4">
      <div>
        <SkeletonBlock className="h-6 w-40" />
        <SkeletonBlock className="mt-2 h-4 w-64 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: cards }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

export function MarketLoadingSkeleton({
  view = "overview",
}: {
  view?: "overview" | "products" | "collections" | "services" | "live";
}) {
  return (
    <div
      role="status"
      aria-label="Loading marketplace"
      aria-busy="true"
      className="space-y-8"
    >
      <span className="sr-only">Loading marketplace content…</span>

      {view === "overview" && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonBlock key={index} className="h-16 rounded-xl" />
          ))}
        </div>
      )}

      {view === "overview" || view === "products" ? (
        <div className="space-y-8">
          {view === "overview" && (
            <>
              <CarouselSectionSkeleton />
              <CarouselSectionSkeleton />
              <CarouselSectionSkeleton />
              <CarouselSectionSkeleton />
              <CarouselSectionSkeleton />
            </>
          )}
          <section className="space-y-4">
            <div>
              <SkeletonBlock className="h-6 w-44" />
              <SkeletonBlock className="mt-2 h-4 w-60 max-w-full" />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 2xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <section className="space-y-5">
          <div>
            <SkeletonBlock className="h-7 w-52" />
            <SkeletonBlock className="mt-2 h-4 w-72 max-w-full" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),280px))] justify-start gap-x-4 gap-y-6">
            {Array.from({ length: 6 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function MarketSidebarSkeleton() {
  return (
    <aside
      role="status"
      aria-label="Loading marketplace sidebar"
      aria-busy="true"
      className="hidden w-[360px] shrink-0 space-y-5 overflow-y-auto pb-20 pt-5 xl:block"
    >
      <span className="sr-only">Loading marketplace sidebar…</span>
      <div className="h-[220px] rounded-xl border border-border bg-background-elevated p-5">
        <SkeletonBlock className="h-6 w-44" />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <SkeletonBlock className="h-24 rounded-2xl" />
          <SkeletonBlock className="h-24 rounded-2xl" />
        </div>
        <SkeletonBlock className="mt-4 h-4 w-48" />
      </div>
      <SkeletonBlock className="h-[200px] w-full rounded-xl" />
      <div className="h-[280px] rounded-xl border border-border bg-background-elevated p-4">
        <SkeletonBlock className="mb-4 h-6 w-40" />
        <div className="grid gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl border border-border p-3"
            >
              <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="mt-2 h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[200px] rounded-xl border border-border bg-background-elevated p-4">
        <SkeletonBlock className="mb-4 h-6 w-44" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
        <SkeletonBlock className="mt-3 h-12 w-full rounded-xl" />
      </div>
      <ProductCardSkeleton />
      <SkeletonBlock className="h-[200px] w-full rounded-xl" />
    </aside>
  );
}

export function MarketProductDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading product details"
      aria-busy="true"
      className="space-y-6"
    >
      <span className="sr-only">Loading product details…</span>
      <div className="grid gap-6 rounded-2xl bg-background p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SkeletonBlock className="aspect-[4/3] w-full rounded-xl lg:aspect-auto lg:min-h-[380px]" />
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-3">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-10 w-10 rounded-full" />
          </div>
          <SkeletonBlock className="mt-5 h-8 w-4/5" />
          <SkeletonBlock className="mt-3 h-7 w-36" />
          <SkeletonBlock className="mt-7 h-4 w-24" />
          <SkeletonBlock className="mt-3 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-3/4" />
          <SkeletonBlock className="mt-6 h-11 w-full rounded-xl" />
        </div>
      </div>
      <section className="space-y-3">
        <SkeletonBlock className="h-5 w-28" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock
              key={index}
              className="aspect-[4/3] w-full rounded-xl"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export function MarketSellerSkeleton() {
  return (
    <div role="status" aria-label="Loading seller information" aria-busy="true">
      <span className="sr-only">Loading seller information…</span>
      <div className="mt-5 flex items-center gap-3">
        <SkeletonBlock className="h-14 w-14 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="mt-2 h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }, (_, index) => (
          <SkeletonBlock key={index} className="h-16 rounded-lg" />
        ))}
      </div>
      <SkeletonBlock className="mt-3 h-3 w-2/3" />
    </div>
  );
}

export function MarketSellerActivitySkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading seller activity"
      aria-busy="true"
      className="space-y-3"
    >
      <span className="sr-only">Loading seller activity…</span>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg bg-background p-2"
        >
          <SkeletonBlock className="h-14 w-14 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1">
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="mt-2 h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
