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
      <div className="relative">
        <SkeletonBlock className="aspect-[4/3] w-full rounded-xl" />
        <SkeletonBlock className="absolute left-3 top-3 h-8 w-8 rounded-full" />
        <SkeletonBlock className="absolute right-3 top-3 h-7 w-7 rounded-full" />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <SkeletonBlock className="h-7 w-24 rounded-md" />
          <SkeletonBlock className="h-8 w-24 rounded-full" />
        </div>
      </div>
      <SkeletonBlock className="mt-3 h-4 w-3/4" />
      <SkeletonBlock className="mt-2 h-3 w-full" />
    </div>
  );
}

function ServiceCardSkeleton() {
  return (
    <div className="min-w-0">
      <div className="relative">
        <SkeletonBlock className="aspect-[4/3] w-full rounded-xl" />
        <SkeletonBlock className="absolute left-3 top-3 h-8 w-8 rounded-full" />
        <SkeletonBlock className="absolute right-3 top-3 h-7 w-7 rounded-full" />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <SkeletonBlock className="h-7 w-28 rounded-md" />
          <SkeletonBlock className="h-8 w-24 rounded-full" />
        </div>
      </div>
      <SkeletonBlock className="mt-3 h-4 w-3/4" />
      <SkeletonBlock className="mt-2 h-3 w-full" />
    </div>
  );
}

function LiveCardSkeleton() {
  return (
    <div className="min-w-0">
      <div className="relative">
        <SkeletonBlock className="aspect-[4/3] w-full rounded-xl" />
        <SkeletonBlock className="absolute left-3 top-3 h-6 w-16 rounded-full" />
        <SkeletonBlock className="absolute right-3 top-3 h-7 w-7 rounded-full" />
      </div>
      <SkeletonBlock className="mt-3 h-3 w-24" />
      <SkeletonBlock className="mt-2 h-4 w-3/4" />
      <SkeletonBlock className="mt-2 h-3 w-full" />
    </div>
  );
}

function CollectionCardSkeleton() {
  return (
    <div className="min-w-0">
      <SkeletonBlock className="aspect-[4/3] w-full rounded-xl" />
      <div className="flex items-start justify-between gap-3 pt-3">
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="mt-2 h-3 w-full" />
          <SkeletonBlock className="mt-1 h-3 w-2/3" />
        </div>
        <SkeletonBlock className="h-4 w-16 shrink-0" />
      </div>
    </div>
  );
}

export function ProfileListingCardsSkeleton({
  label,
}: {
  label: string;
}) {
  return (
    <div
      role="status"
      aria-label={`Loading ${label}`}
      aria-busy="true"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <span className="sr-only">Loading {label}...</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="min-w-0">
          <SkeletonBlock className="aspect-[4/3] w-full rounded-xl" />
          <SkeletonBlock className="mt-3 h-4 w-3/4" />
          <SkeletonBlock className="mt-2 h-3 w-full" />
          <SkeletonBlock className="mt-2 h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

function SectionHeadingSkeleton() {
  return (
    <div>
      <SkeletonBlock className="h-6 w-40" />
      <SkeletonBlock className="mt-2 h-4 w-64 max-w-full" />
    </div>
  );
}

function CarouselSectionSkeleton({
  cards = 3,
  cardWidth = "280px",
  variant = "product",
}: {
  cards?: number;
  cardWidth?: string;
  variant?: "product" | "live" | "collection";
}) {
  const CardSkeleton =
    variant === "live"
      ? LiveCardSkeleton
      : variant === "collection"
        ? CollectionCardSkeleton
        : ProductCardSkeleton;

  return (
    <section className="space-y-4">
      <SectionHeadingSkeleton />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: cards }, (_, index) => (
          <div
            key={index}
            className="shrink-0"
            style={{ width: `min(100%, ${cardWidth})` }}
          >
            <CardSkeleton />
          </div>
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
        <nav
          aria-label="Marketplace sections"
          className="grid grid-cols-6 gap-1.5 border-b border-border/60 pb-2 sm:gap-2"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonBlock key={index} className="h-12 rounded-xl sm:h-14" />
          ))}
        </nav>
      )}

      {view === "overview" || view === "products" ? (
        <div className="space-y-8">
          {view === "overview" && (
            <>
              <CarouselSectionSkeleton />
              <CarouselSectionSkeleton />
              <CarouselSectionSkeleton />
              <section className="space-y-4">
                <SectionHeadingSkeleton />
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),280px))] justify-start gap-x-4 gap-y-6">
                  {Array.from({ length: 4 }, (_, index) => (
                    <ServiceCardSkeleton key={index} />
                  ))}
                </div>
              </section>
              <CarouselSectionSkeleton variant="live" />
              <CarouselSectionSkeleton
                cards={2}
                cardWidth="560px"
                variant="collection"
              />
            </>
          )}
          {view === "products" && (
            <section className="space-y-4">
              <SectionHeadingSkeleton />
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),280px))] justify-start gap-x-4 gap-y-6">
                {Array.from({ length: 6 }, (_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <section className="space-y-5">
          <SectionHeadingSkeleton />
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

export function MarketServiceDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading service details"
      aria-busy="true"
      className="space-y-6"
    >
      <span className="sr-only">Loading service details...</span>
      <div className="grid gap-6 rounded-2xl bg-background p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          <SkeletonBlock className="h-[320px] w-full rounded-xl sm:h-[380px] lg:h-[420px]" />
          <SkeletonBlock className="h-11 w-full rounded-xl" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <SkeletonBlock
                key={index}
                className="aspect-square w-full rounded-lg"
              />
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="mt-4 h-8 w-4/5" />
          <SkeletonBlock className="mt-3 h-4 w-36" />
          <SkeletonBlock className="mt-6 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-3/4" />
          <div className="mt-6 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <SkeletonBlock key={index} className="h-20 rounded-xl" />
            ))}
          </div>
          <SkeletonBlock className="mt-6 h-11 w-full rounded-xl" />
        </div>
      </div>
      <section className="space-y-3">
        <SkeletonBlock className="h-5 w-36" />
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

export function MarketSellerPanelSkeleton() {
  return (
    <aside
      role="status"
      aria-label="Loading seller panel"
      aria-busy="true"
      className="flex max-h-[90vh] w-full shrink-0 flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-xl bg-[#101010] pb-20 xl:max-h-full xl:w-[320px]"
    >
      <span className="sr-only">Loading seller panel...</span>
      <SkeletonBlock className="h-[420px] w-full shrink-0 rounded-none xl:h-[460px]" />
      <div className="shrink-0 rounded-xl bg-[#1c1c1c] p-4">
        <SkeletonBlock className="h-[220px] w-full rounded-lg" />
        <div className="mt-4 flex items-center gap-3">
          <SkeletonBlock className="h-12 w-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="mt-2 h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} className="h-14 rounded-lg" />
          ))}
        </div>
        <SkeletonBlock className="mt-4 h-10 w-full rounded-xl" />
      </div>
      <div className="shrink-0 rounded-2xl border border-border/60 bg-background-elevated p-4">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="mt-2 h-3 w-52 max-w-full" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 rounded-lg bg-background p-2">
              <SkeletonBlock className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="mt-2 h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
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
