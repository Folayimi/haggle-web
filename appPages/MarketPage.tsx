"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowUp,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronLeft,
  Megaphone,
  MapPin,
  Package,
  X,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { useHaggleStore } from "@/lib/app-store";
import { ActionCard } from "@/components/market/common/ActionCard";
import {
  MarketLoadingSkeleton,
  MarketProductDetailSkeleton,
  MarketSellerActivitySkeleton,
  MarketSellerSkeleton,
} from "@/components/market/common/MarketSkeletons";
import { useMarketDiscovery } from "@/components/market/hooks/useMarketDiscovery";
import { useListingFeed } from "@/components/market/hooks/useListingFeed";
import { FilterChips } from "@/components/market/search/FilterChips";
import { MarketSearch } from "@/components/market/search/MarketSearch";
import { FeaturedCollections } from "@/components/market/sections/FeaturedCollections";
import { LiveNow } from "@/components/market/sections/LiveNow";
import { ProductFeed } from "@/components/market/sections/ProductFeed";
import { Recommended } from "@/components/market/sections/Recommended";
import { ServiceFeed } from "@/components/market/sections/ServiceFeed";
import { TrendingNearYou } from "@/components/market/sections/TrendingNearYou";
import { MarketProductDetail } from "@/components/market/sections/MarketProductDetail";
import { MarketServiceDetail } from "@/components/market/sections/MarketServiceDetail";
import { MarketBrowseView } from "@/components/market/sections/MarketBrowseView";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  featuredCollections,
  liveSessions,
  negotiations,
  sellers,
} from "@/components/market/data/market";
import { cn } from "@/lib/utils";
import { getAllCategories, getAllListings, getListing } from "@/services/request";
import {
  mapListingToProduct,
  mapListingToService,
  mapUserToSeller,
} from "@/services/mappers";
import type { BackendCategory, BackendListing } from "@/services/mappers";
import { getUserById } from "@/services/users";
import { getCatalogErrorStatus } from "@/services/catalog";
import { trackListingInteraction } from "@/services/catalog";
import { notifyApiError } from "@/services/toastify";
import type { MarketService, SellerProduct } from "@/types";

interface BroadcastButtonProps {
  onClick?: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
}

type MarketListingType = "products" | "services";

function MarketListingTabs({
  selected,
  onChange,
}: {
  selected: MarketListingType;
  onChange: (type: MarketListingType) => void;
}) {
  return (
    <div
      aria-label="Listing type"
      className="flex gap-2 overflow-x-auto border-b border-border/60"
      role="tablist"
    >
      {(["products", "services"] as const).map((type) => (
        <button
          key={type}
          type="button"
          role="tab"
          aria-selected={selected === type}
          onClick={() => onChange(type)}
          className={`inline-flex shrink-0 items-center border-b-2 px-4 py-3 text-sm font-semibold capitalize transition ${selected === type ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground"}`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export function BroadcastButton({
  onClick,
  className,
  size = "default",
}: BroadcastButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-strong hover:shadow-xl",
        sizeClasses[size],
        className,
      )}
    >
      <Megaphone
        className={cn(
          "h-4 w-4",
          size === "sm" && "h-3 w-3",
          size === "lg" && "h-5 w-5",
        )}
      />
      Broadcast
    </button>
  );
}

const MarketPage = ({
  initialProductId,
  initialServiceId,
}: {
  initialProductId?: string;
  initialServiceId?: string;
} = {}) => {
  const router = useRouter();
  const userData = useHaggleStore((state) => state.userData);
  const setActivateAuth = useHaggleStore((state) => state.setActivateAuth);
  const sectionsContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMarketView, setSelectedMarketView] = useState<
    | "trending"
    | "recommended"
    | "collections"
    | "latest"
    | "services"
    | "live"
    | null
  >(null);
  const [selectedMarketType, setSelectedMarketType] =
    useState<MarketListingType>("products");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialProductId ?? null,
  );
  const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(
    null,
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    initialServiceId ?? null,
  );
  const [selectedService, setSelectedService] = useState<MarketService | null>(
    null,
  );
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<
    ReturnType<typeof mapUserToSeller> | null
  >(null);
  const [sellerProfileOpen, setSellerProfileOpen] = useState(false);
  const [productDetailLoading, setProductDetailLoading] = useState(Boolean(initialProductId));
  const [productDetailError, setProductDetailError] = useState(false);
  const [serviceDetailLoading, setServiceDetailLoading] = useState(Boolean(initialServiceId));
  const [serviceDetailError, setServiceDetailError] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [serviceListings, setServiceListings] = useState<BackendListing[]>([]);
  const [publishedCategories, setPublishedCategories] = useState<
    BackendCategory[]
  >([]);
  const categories = [
    { id: "All", name: "All categories" },
    ...publishedCategories.map(({ id, name }) => ({ id, name })),
  ];
  const categoryFilter = selectedCategory === "All" ? undefined : selectedCategory;
  const latestProductFeed = useListingFeed("latest", "product", categoryFilter);
  const latestServiceFeed = useListingFeed("latest", "service", categoryFilter);
  const trendingProductFeed = useListingFeed("trending", "product", categoryFilter);
  const trendingServiceFeed = useListingFeed("trending", "service", categoryFilter);
  const recommendationProductFeed = useListingFeed("recommendations", "product", categoryFilter);
  const recommendationServiceFeed = useListingFeed("recommendations", "service", categoryFilter);
  const categoryNames = useMemo(
    () =>
      new Map(
        publishedCategories.map((category) => [category.id, category.name]),
      ),
    [publishedCategories],
  );
  const latestProducts = useMemo(
    () => latestProductFeed.listings.map(mapListingToProduct),
    [latestProductFeed.listings],
  );
  const latestServices = useMemo(
    () => latestServiceFeed.listings.map((listing) => mapListingToService(listing, categoryNames.get(listing.category_id) ?? listing.category_id)),
    [latestServiceFeed.listings, categoryNames],
  );
  const trendingProducts = useMemo(
    () => trendingProductFeed.listings.map(mapListingToProduct),
    [trendingProductFeed.listings],
  );
  const trendingServices = useMemo(
    () => trendingServiceFeed.listings.map((listing) => mapListingToService(listing, categoryNames.get(listing.category_id) ?? listing.category_id)),
    [trendingServiceFeed.listings, categoryNames],
  );
  const recommendedProducts = useMemo(
    () => recommendationProductFeed.listings.map(mapListingToProduct),
    [recommendationProductFeed.listings],
  );
  const recommendedServices = useMemo(
    () => recommendationServiceFeed.listings.map((listing) => mapListingToService(listing, categoryNames.get(listing.category_id) ?? listing.category_id)),
    [recommendationServiceFeed.listings, categoryNames],
  );
  const discovery = useMarketDiscovery({
    sellers,
    liveSessions,
    negotiations,
    latestProducts,
    latestServices,
    trendingProducts,
    recommendedProducts,
    trendingServices,
    recommendedServices,
  });

  const query = searchQuery.trim().toLowerCase();
  const matchesService = (service: MarketService) =>
    !query || `${service.name} ${service.category}`.toLowerCase().includes(query);
  const matchesProduct = (product: (typeof products)[number]) =>
    (selectedCategory === "All" || product.category === selectedCategory) &&
    (!query ||
      `${product.name} ${categoryNames.get(product.category) ?? ""}`
        .toLowerCase()
        .includes(query));
  const handleSectionsScroll = () => {
    const container = sectionsContainerRef.current;
    if (!container) return;

    const scrollableDistance = container.scrollHeight - container.clientHeight;
    setShowBackToTop(
      scrollableDistance > 0 &&
        container.scrollTop >= scrollableDistance * 0.45,
    );
  };
  const handleProductSelect = (product: SellerProduct) => {
    if (localStorage.getItem("haggleAccessToken")) {
      void trackListingInteraction(product.id, "tap").catch((error) => notifyApiError(error, "Could not record this interaction."));
    }
    setShowAllReviews(false);
    setSelectedServiceId(null);
    setSelectedService(null);
    setServiceDetailLoading(false);
    setServiceDetailError(false);
    setSelectedProductId(product.id);
    setSelectedProduct(product);
    setSelectedSeller(null);
    setProductDetailLoading(true);
    setProductDetailError(false);
    setSellerLoading(true);
    setSellerError(false);
    router.push(`/product-detail/${encodeURIComponent(product.id)}`);
    sectionsContainerRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
  };
  const handleServiceSelect = (service: MarketService) => {
    if (localStorage.getItem("haggleAccessToken")) {
      void trackListingInteraction(service.id, "tap").catch((error) => notifyApiError(error, "Could not record this interaction."));
    }
    setShowAllReviews(false);
    setSelectedProductId(null);
    setSelectedProduct(null);
    setProductDetailLoading(false);
    setProductDetailError(false);
    setSelectedServiceId(service.id);
    setSelectedService(service);
    setSelectedSeller(null);
    setServiceDetailLoading(true);
    setServiceDetailError(false);
    setSellerLoading(true);
    setSellerError(false);
    router.push(`/service-detail/${encodeURIComponent(service.id)}`);
    sectionsContainerRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
  };
  const handleBackToListings = () => {
    if (initialProductId || initialServiceId) {
      router.back();
      return;
    }
    setShowAllReviews(false);
    setSelectedProductId(null);
    setSelectedProduct(null);
    setSelectedServiceId(null);
    setSelectedService(null);
    setSelectedSeller(null);
    setProductDetailLoading(false);
    setProductDetailError(false);
    setServiceDetailLoading(false);
    setServiceDetailError(false);
    setSellerLoading(false);
    setSellerError(false);
    sectionsContainerRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
  };
  const openMarketView = (
    view: NonNullable<typeof selectedMarketView>,
    type: MarketListingType = view === "services" ? "services" : "products",
  ) => {
    setSelectedMarketView(view);
    setSelectedMarketType(type);
    sectionsContainerRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
  };
  const handleBackToMarket = () => {
    if (showAllReviews) {
      setShowAllReviews(false);
      sectionsContainerRef.current?.scrollTo({ top: 0 });
      return;
    }

    if (initialProductId || initialServiceId) {
      router.back();
      return;
    }

    if (selectedProductId || selectedServiceId) {
      handleBackToListings();
      return;
    }

    setSelectedMarketView(null);
    sectionsContainerRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
  };

  useEffect(() => {
    if (!initialProductId) return;
    setSelectedProductId(initialProductId);
    setSelectedProduct(null);
    setProductDetailLoading(true);
    setProductDetailError(false);
  }, [initialProductId]);

  useEffect(() => {
    if (!initialServiceId) return;
    setSelectedServiceId(initialServiceId);
    setSelectedService(null);
    setServiceDetailLoading(true);
    setServiceDetailError(false);
  }, [initialServiceId]);

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      try {
        const listings = await getAllListings("product");
        if (cancelled) return;
        setProducts(
          listings
            .filter(
              (listing) =>
                listing.listing_type === "product" &&
                listing.status?.toLowerCase() === "published",
            )
            .map(mapListingToProduct),
        );

        console.log("Loaded products:", listings);
      } catch {}
    };

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadServices = async () => {
      try {
        const listings = await getAllListings("services");
        if (cancelled) return;
        setServiceListings(
          listings.filter(
            (listing) =>
              listing.listing_type === "service" &&
              listing.status?.toLowerCase() === "published",
          ),
        );
      } catch {}
    };

    void loadServices();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;
    let cancelled = false;

    const loadSelectedProduct = async () => {
      setProductDetailLoading(true);
      setProductDetailError(false);
      try {
        const listing = await getListing(selectedProductId);
        if (!cancelled) setSelectedProduct(mapListingToProduct(listing));
      } catch {
        if (!cancelled) setProductDetailError(true);
      } finally {
        if (!cancelled) setProductDetailLoading(false);
      }
    };

    void loadSelectedProduct();
    return () => {
      cancelled = true;
    };
  }, [selectedProductId]);

  useEffect(() => {
    if (!selectedServiceId) return;
    let cancelled = false;

    const loadSelectedService = async () => {
      setServiceDetailLoading(true);
      setServiceDetailError(false);
      try {
        const listing = await getListing(selectedServiceId);
        if (listing.listing_type !== "service") {
          throw new Error("The selected listing is not a service.");
        }
        if (!cancelled) {
          setSelectedService(
            mapListingToService(
              listing,
              categoryNames.get(listing.category_id) ?? listing.category_id,
            ),
          );
        }
      } catch {
        if (!cancelled) setServiceDetailError(true);
      } finally {
        if (!cancelled) setServiceDetailLoading(false);
      }
    };

    void loadSelectedService();
    return () => {
      cancelled = true;
    };
  }, [selectedServiceId, categoryNames]);

  useEffect(() => {
    const selectedSellerId = selectedProduct?.sellerId ?? selectedService?.sellerId;
    if (!selectedSellerId) return;
    let cancelled = false;
    const loadSeller = async () => {
      try {
        const seller = await getUserById(selectedSellerId);
        if (!seller) throw new Error("Seller profile was not found");
        if (!cancelled) setSelectedSeller(mapUserToSeller(seller));
      } catch {
        if (!cancelled) setSellerError(true);
      } finally {
        if (!cancelled) setSellerLoading(false);
      }
    };

    void loadSeller();
    return () => {
      cancelled = true;
    };
  }, [selectedProduct?.sellerId, selectedService?.sellerId]);

  useEffect(() => {
    const fetchCategories = async () => {
      console.log("Fetching categories...");
      const categoryList = await getAllCategories();
      console.log("Loaded categories:", categoryList);
      setPublishedCategories(
        categoryList.filter(
          (category) =>
            (category.status?.toLowerCase() === "published" ||
              category.status?.toLowerCase() === "draft") &&
            category.parent_id !== null,
        ),
      );
    };

    fetchCategories();
  }, []);

  return (
    <AppShell>
      <div className="flex min-h-[calc(100dvh-10rem)] w-full flex-col px-3 sm:px-4 xl:h-screen">
        <header className="sticky z-30 mt-2 mx-3 flex w-[calc(100%+1.5rem)] items-center justify-between gap-2 border-b border-border/40 bg-background/90 rounded-full px-3 py-3 backdrop-blur-xl sm:mx-3 sm:w-[calc(100%-24px)] sm:gap-3 sm:px-4 xl:top-0">
          {(selectedProductId || selectedServiceId || selectedMarketView) && (
            <button
              type="button"
              onClick={handleBackToMarket}
              aria-label={
                showAllReviews
                  ? "Back to product or service details"
                  : selectedProductId || selectedServiceId
                  ? "Back to marketplace"
                  : "Back to marketplace sections"
              }
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <FilterChips
            filters={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
          <div className="flex w-[600px] items-center">
            <MarketSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!userData && (
              <button
                type="button"
                onClick={() => setActivateAuth(true)}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Sign in
              </button>
            )}
            <BroadcastButton size="sm" className="shrink-0" />
          </div>
        </header>

        <div
          className={cn(
            "mt-2 flex min-h-0 flex-1 gap-2 overflow-hidden",
            (selectedProductId || selectedServiceId) && "flex-col xl:flex-row",
          )}
        >
          <div className="relative min-h-0 min-w-0 flex-1">
            <div
              ref={sectionsContainerRef}
              onScroll={handleSectionsScroll}
              className="h-full min-w-0 space-y-8 overflow-y-auto bg-background-elevated/50 rounded-xl p-5 pb-24 pr-1 xl:pb-20"
            >
              {selectedProductId || selectedServiceId ? (
                productDetailLoading || serviceDetailLoading ? (
                  <MarketProductDetailSkeleton />
                ) : selectedProductId &&
                  (productDetailError || !selectedProduct) ? (
                  <div role="alert" className="py-12 text-center">
                    <p className="text-sm text-danger">
                      Product details could not be loaded.
                    </p>
                    <button
                      type="button"
                      onClick={handleBackToListings}
                      className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong"
                    >
                      Back to listings
                    </button>
                  </div>
                ) : selectedProduct ? (
                  <MarketProductDetail
                    key={selectedProduct.id}
                    product={selectedProduct}
                    onProductSelect={handleProductSelect}
                    showAllReviews={showAllReviews}
                    onShowAllReviewsChange={setShowAllReviews}
                  />
                ) : serviceDetailError || !selectedService ? (
                  <div role="alert" className="py-12 text-center">
                    <p className="text-sm text-danger">
                      Service details could not be loaded.
                    </p>
                    <button
                      type="button"
                      onClick={handleBackToListings}
                      className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong"
                    >
                      Back to listings
                    </button>
                  </div>
                ) : (
                  <MarketServiceDetail
                    key={selectedService.id}
                    service={selectedService}
                    showAllReviews={showAllReviews}
                    onShowAllReviewsChange={setShowAllReviews}
                  />
                )
              ) : !selectedMarketView && latestProductFeed.loading && trendingProductFeed.loading ? (
                <MarketLoadingSkeleton
                  view={
                    selectedMarketView === "collections"
                      ? "collections"
                      : selectedMarketView === "services"
                        ? "services"
                        : selectedMarketView === "live"
                          ? "live"
                          : selectedMarketView
                            ? "products"
                            : "overview"
                  }
                />
              ) : selectedMarketView === "trending" ? (
                <div className="space-y-6">
                  <MarketListingTabs selected={selectedMarketType} onChange={setSelectedMarketType} />
                  {selectedMarketType === "products" ? (
                    <MarketBrowseView type="products" title="Trending products" description="Products ordered by the marketplace trending feed." items={discovery.trending.filter(matchesProduct)} onProductSelect={handleProductSelect} isLoading={trendingProductFeed.loading} error={trendingProductFeed.error ? "Trending products could not be loaded." : undefined} hasMore={trendingProductFeed.hasMore} isLoadingMore={trendingProductFeed.loadingMore} onLoadMore={() => void trendingProductFeed.loadMore()} />
                  ) : (
                    <MarketBrowseView type="services" title="Trending services" description="Services ordered by the marketplace trending feed." items={discovery.trendingServices.filter(matchesService)} onServiceSelect={handleServiceSelect} isLoading={trendingServiceFeed.loading} error={trendingServiceFeed.error ? "Trending services could not be loaded." : undefined} hasMore={trendingServiceFeed.hasMore} isLoadingMore={trendingServiceFeed.loadingMore} onLoadMore={() => void trendingServiceFeed.loadMore()} />
                  )}
                </div>
              ) : selectedMarketView === "recommended" ? (
                <div className="space-y-6">
                  {[recommendationProductFeed.error, recommendationServiceFeed.error].some((error) => getCatalogErrorStatus(error) === 401) && <p role="status" className="rounded-xl bg-background p-4 text-sm text-muted"><Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link> to see personalized recommendations.</p>}
                  <MarketListingTabs selected={selectedMarketType} onChange={setSelectedMarketType} />
                  {selectedMarketType === "products" ? (
                    <MarketBrowseView type="products" title="Recommended products" description="Listings selected by the marketplace recommendation feed." items={discovery.recommended.filter(matchesProduct)} onProductSelect={handleProductSelect} isLoading={recommendationProductFeed.loading} error={recommendationProductFeed.error && getCatalogErrorStatus(recommendationProductFeed.error) !== 401 ? "Recommended products could not be loaded." : undefined} hasMore={recommendationProductFeed.hasMore} isLoadingMore={recommendationProductFeed.loadingMore} onLoadMore={() => void recommendationProductFeed.loadMore()} />
                  ) : (
                    <MarketBrowseView type="services" title="Recommended services" description="Listings selected by the marketplace recommendation feed." items={discovery.recommendedServices.filter(matchesService)} onServiceSelect={handleServiceSelect} isLoading={recommendationServiceFeed.loading} error={recommendationServiceFeed.error && getCatalogErrorStatus(recommendationServiceFeed.error) !== 401 ? "Recommended services could not be loaded." : undefined} hasMore={recommendationServiceFeed.hasMore} isLoadingMore={recommendationServiceFeed.loadingMore} onLoadMore={() => void recommendationServiceFeed.loadMore()} />
                  )}
                </div>
              ) : selectedMarketView === "collections" ? (
                <MarketBrowseView
                  type="collections"
                  title="Featured Collections"
                  description="Explore all curated collections."
                  items={featuredCollections}
                />
              ) : selectedMarketView === "latest" ? (
                <div className="space-y-6">
                  <MarketListingTabs selected={selectedMarketType} onChange={setSelectedMarketType} />
                  {selectedMarketType === "products" ? (
                    <MarketBrowseView type="products" title="Latest products" description="Browse recently added products." items={discovery.latest.filter(matchesProduct)} onProductSelect={handleProductSelect} isLoading={latestProductFeed.loading} error={latestProductFeed.error ? "Latest products could not be loaded." : undefined} hasMore={latestProductFeed.hasMore} isLoadingMore={latestProductFeed.loadingMore} onLoadMore={() => void latestProductFeed.loadMore()} />
                  ) : (
                    <MarketBrowseView type="services" title="Latest services" description="Browse recently added services." items={discovery.latestServices.filter(matchesService)} onServiceSelect={handleServiceSelect} isLoading={latestServiceFeed.loading} error={latestServiceFeed.error ? "Latest services could not be loaded." : undefined} hasMore={latestServiceFeed.hasMore} isLoadingMore={latestServiceFeed.loadingMore} onLoadMore={() => void latestServiceFeed.loadMore()} />
                  )}
                </div>
              ) : selectedMarketView === "services" ? (
                <MarketBrowseView
                  type="services"
                  title="Professional Services"
                  description="Browse trusted professionals and services."
                  items={discovery.latestServices.filter(matchesService)}
                  onServiceSelect={handleServiceSelect}
                  isLoading={latestServiceFeed.loading}
                  error={latestServiceFeed.error ? "Professional services could not be loaded." : undefined}
                  hasMore={latestServiceFeed.hasMore}
                  isLoadingMore={latestServiceFeed.loadingMore}
                  onLoadMore={() => void latestServiceFeed.loadMore()}
                />
              ) : selectedMarketView === "live" ? (
              <MarketBrowseView
                type="live"
                title="Happening Live"
                description="Join live negotiations happening right now."
                items={discovery.liveNow}
              />
            ) : (
              <>
              <nav
                aria-label="Marketplace sections"
                className="sticky top-0 z-30 -mx-5 -mt-5 grid grid-cols-6 gap-1 border-b border-border/60 bg-background/95 px-3 py-2 shadow-sm backdrop-blur-md sm:gap-2 sm:px-5"
              >
                <ActionCard
                  title="Recommended For You"
                  label="For You"
                  targetId="market-recommended"
                />
                <ActionCard
                  title="Latest Listings"
                  label="Latest"
                  targetId="market-latest"
                />
                <ActionCard
                  title="Trending"
                  label="Trend"
                  targetId="market-trending"
                />
                <ActionCard
                  title="Professional Services"
                  label="Services"
                  targetId="market-services"
                />
                <ActionCard
                  title="Happening Live"
                  label="Live"
                  targetId="market-live"
                />
                <ActionCard
                  title="Featured Collections"
                  label="Picks"
                  targetId="market-collections"
                />
              </nav>

              <div id="market-recommended" className="scroll-mt-20">
                <Recommended
                  products={discovery.recommended.filter(matchesProduct)}
                  onProductSelect={handleProductSelect}
                  onViewAll={() => openMarketView("recommended")}
                />
              </div>
              <div id="market-latest" className="scroll-mt-20">
                <ProductFeed
                  products={discovery.latest.filter(matchesProduct)}
                  onProductSelect={handleProductSelect}
                  onViewAll={() => openMarketView("latest")}
                />
              </div>
              <div id="market-trending" className="scroll-mt-20">
                <TrendingNearYou
                  products={discovery.trending.filter(matchesProduct)}
                  location="Lagos"
                  onProductSelect={handleProductSelect}
                  onViewAll={() => openMarketView("trending")}
                />
              </div>
              <div id="market-services" className="scroll-mt-20">
                <ServiceFeed
                  services={discovery.latestServices.filter(matchesService)}
                  onServiceSelect={handleServiceSelect}
                  onViewAll={() => openMarketView("services")}
                />
              </div>
              <div id="market-live" className="scroll-mt-20">
                <LiveNow
                  sessions={discovery.liveNow}
                  onViewAll={() => openMarketView("live")}
                />
              </div>
              <div id="market-collections" className="scroll-mt-20">
                <FeaturedCollections
                  collections={featuredCollections}
                  onViewAll={() => openMarketView("collections")}
                />
              </div>
              </>
            )}
            </div>
            {showBackToTop && (
              <button
                type="button"
                aria-label={
                  selectedProductId
                    ? "Back to top of product details"
                    : "Back to top of marketplace sections"
                }
                onClick={() =>
                  sectionsContainerRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                className="absolute bottom-5 right-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <ArrowUp className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>

          {selectedProductId || selectedServiceId ? (
            <aside className="flex max-h-[90vh] w-full shrink-0 flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-xl bg-[#101010] pb-20 xl:max-h-full xl:w-[320px]">
              <section className="relative isolate min-h-[420px] shrink-0 overflow-hidden bg-[#14252b] text-white xl:min-h-[460px]">
                {selectedSeller?.coverImageUrl ? (
                  <Image
                    src={selectedSeller.coverImageUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 1280px) 320px, 100vw"
                    className="z-0 object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/80 via-[#17333c] to-secondary/70" />
                )}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/45 to-black/10" />
                <div className="relative z-20 flex min-h-[420px] flex-col justify-between p-5 xl:min-h-[460px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur">
                      Haggle seller
                    </span>
                    {selectedSeller?.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
                        <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="line-clamp-2 text-3xl font-bold leading-tight">
                      {selectedSeller?.businessName || selectedSeller?.name || "Seller on Haggle"}
                    </h2>
                    {selectedSeller?.bio && (
                      <p className="mt-3 line-clamp-3 max-w-sm text-sm leading-5 text-white/80">
                        {selectedSeller.bio}
                      </p>
                    )}
                    {selectedSeller?.location && (
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-white/75">
                        <MapPin className="h-3.5 w-3.5" />
                        {selectedSeller.location}
                      </p>
                    )}
                  </div>
                </div>
              </section>
              <section
                id="seller-info-card"
                className="min-h-[360px] shrink-0 scroll-mt-4 overflow-hidden rounded-xl bg-[#1c1c1c] text-white"
              >
                {sellerLoading && !selectedSeller && (
                  <div className="p-4 text-white">
                    <div className="relative flex h-[220px] items-start overflow-hidden rounded-lg bg-gradient-to-br from-primary/30 via-[#293840] to-secondary/30 p-4">
                      <h2 className="text-sm font-bold">About the seller</h2>
                    </div>
                    <MarketSellerSkeleton />
                  </div>
                )}
                {sellerError && (
                  <p role="alert" className="p-4 text-sm text-danger">
                    Seller information could not be loaded.
                  </p>
                )}
                {selectedSeller && (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`About ${selectedSeller.name}`}
                    onClick={() => setSellerProfileOpen(true)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSellerProfileOpen(true);
                      }
                    }}
                    className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  >
                    <div className="relative h-[220px] overflow-hidden bg-gradient-to-br from-primary/30 via-[#293840] to-secondary/30">
                      {selectedSeller.avatarUrl &&
                      selectedSeller.avatarUrl !== "/placeholder-avatar.jpg" ? (
                        <Image
                          src={selectedSeller.avatarUrl}
                          alt=""
                          fill
                          unoptimized
                          sizes="(min-width: 1280px) 320px, 100vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-white/70">
                          {selectedSeller.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
                      <h2 className="absolute left-4 top-4 text-sm font-bold drop-shadow">
                        About the seller
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-1 truncate text-base font-bold">
                            {selectedSeller.name}
                            {selectedSeller.isVerified && (
                              <BadgeCheck className="h-4 w-4 shrink-0 fill-emerald-300 text-[#1c1c1c]" />
                            )}
                          </p>
                          <p className="mt-1 truncate text-sm text-white/60">
                            {selectedSeller.businessName ||
                              (selectedSeller.username
                                ? `@${selectedSeller.username}`
                                : selectedSeller.badge)}
                          </p>
                          <p className="mt-1 truncate text-xs text-white/55">
                            {[
                              selectedSeller.followers !== "—"
                                ? `${selectedSeller.followers} followers`
                                : "",
                              selectedSeller.location,
                            ]
                              .filter(Boolean)
                              .join(" · ") || selectedSeller.badge}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-white/40 px-4 py-2 text-xs font-bold transition group-hover:bg-white group-hover:text-[#1c1c1c]">
                          View
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm leading-5 text-white/65">
                        {selectedSeller.bio ||
                          "Open this seller profile to learn more about their business."}
                      </p>
                    </div>
                  </div>
                )}
                {!sellerLoading && !selectedSeller && (
                  <div className="min-h-40 p-5 text-white">
                    <h2 className="text-base font-bold">About the seller</h2>
                    <p className="mt-2 text-sm leading-5 text-white/65">
                      {sellerError
                        ? "Seller details are temporarily unavailable. You can still browse this listing."
                        : "Seller details will appear here when available."}
                    </p>
                  </div>
                )}
              </section>
              {(sellerLoading || selectedSeller) && (
                <section className="shrink-0 rounded-2xl border border-border/60 bg-background-elevated p-4">
                  <h2 className="text-base font-bold">More from this seller</h2>
                  <p className="mt-1 text-xs text-muted">
                    More to discover from this shop
                  </p>
                  {sellerLoading ? (
                    <MarketSellerActivitySkeleton />
                  ) : selectedSeller ? (
                    <div className="mt-4 space-y-3">
                      {products
                        .filter(
                          (product) =>
                            product.sellerId === selectedSeller.id &&
                            product.id !== selectedProductId,
                        )
                        .slice(0, 3)
                        .map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleProductSelect(product)}
                            className="flex w-full items-center gap-3 rounded-lg bg-background p-2 text-left transition hover:bg-background-elevated"
                          >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Package className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium">
                                {product.name}
                              </span>
                              <span className="mt-1 block truncate text-xs text-muted">
                                {product.description}
                              </span>
                            </span>
                          </button>
                        ))}
                      {discovery.latestServices
                        .filter(
                          (service) =>
                            service.sellerId === selectedSeller.id &&
                            service.id !== selectedServiceId,
                        )
                        .slice(0, 3)
                        .map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => handleServiceSelect(service)}
                            className="flex w-full items-center gap-3 rounded-lg bg-background p-2 text-left transition hover:bg-background-elevated"
                          >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                              <BriefcaseBusiness className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium">
                                {service.name}
                              </span>
                              <span className="mt-1 block truncate text-xs text-muted">
                                {service.description}
                              </span>
                            </span>
                          </button>
                        ))}
                      {!products.some(
                        (product) =>
                          product.sellerId === selectedSeller.id &&
                          product.id !== selectedProductId,
                      ) &&
                        !discovery.latestServices.some(
                          (service) =>
                            service.sellerId === selectedSeller.id &&
                            service.id !== selectedServiceId,
                        ) && (
                        <p className="text-sm text-muted">
                          No other published listings yet.
                        </p>
                      )}
                    </div>
                  ) : null}
                </section>
              )}
            </aside>
          ) : null}
        </div>
      </div>
      <Dialog
        open={sellerProfileOpen && Boolean(selectedSeller)}
        onOpenChange={setSellerProfileOpen}
      >
        <DialogContent
          overlayClassName="bg-black/85 supports-backdrop-filter:backdrop-blur-sm"
          showCloseButton={false}
          className="flex h-[92dvh] max-h-[92dvh] w-[min(96vw,960px)] max-w-[96vw] flex-col gap-0 overflow-hidden rounded-2xl border-0 bg-[#121212] p-0 text-white ring-1 ring-white/10 sm:max-w-[96vw]"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>
              {selectedSeller?.businessName || selectedSeller?.name || "Seller profile"}
            </DialogTitle>
            <DialogDescription>
              Seller image, business details, and profile information.
            </DialogDescription>
          </DialogHeader>
          {selectedSeller && (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="relative h-[min(52dvh,480px)] shrink-0 bg-black">
                {selectedSeller.avatarUrl &&
                selectedSeller.avatarUrl !== "/placeholder-avatar.jpg" ? (
                  <Image
                    src={selectedSeller.avatarUrl}
                    alt={`${selectedSeller.name} profile`}
                    fill
                    unoptimized
                    sizes="(min-width: 960px) 960px, 96vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-8xl font-bold text-white/70">
                    {selectedSeller.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  aria-label="Close seller profile"
                  onClick={() => setSellerProfileOpen(false)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="space-y-6 bg-[#171717] p-5 sm:p-7">
                  {selectedSeller.followers !== "—" && (
                    <div>
                      <p className="text-3xl font-bold">
                        {selectedSeller.followers}
                      </p>
                      <p className="mt-1 text-sm text-white/60">Followers</p>
                    </div>
                  )}
                  <div>
                    <p className="text-3xl font-bold">
                      {products.filter((product) => product.sellerId === selectedSeller.id).length +
                        serviceListings.filter((service) => service.seller_id === selectedSeller.id).length}
                    </p>
                    <p className="mt-1 text-sm text-white/60">Published listings</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {products
                        .filter((product) => product.sellerId === selectedSeller.id)
                        .reduce((total, product) => total + (product.saveCount ?? 0), 0) +
                        serviceListings
                          .filter((service) => service.seller_id === selectedSeller.id)
                          .reduce((total, service) => total + (service.save_count ?? 0), 0)}
                    </p>
                    <p className="mt-1 text-sm text-white/60">Saves on listings</p>
                  </div>
                  {selectedSeller.location && (
                    <div>
                      <p className="font-semibold">{selectedSeller.location}</p>
                      <p className="mt-1 text-sm text-white/60">Based in</p>
                    </div>
                  )}
                  {selectedSeller.username && (
                    <p className="break-all text-sm text-white/65">
                      @{selectedSeller.username}
                    </p>
                  )}
                </aside>
                <div className="space-y-5 p-5 sm:p-7">
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                      {selectedSeller.name}
                      {selectedSeller.isVerified && (
                        <BadgeCheck className="h-5 w-5 shrink-0 fill-emerald-300 text-[#121212]" />
                      )}
                    </h2>
                    {selectedSeller.businessName && (
                      <p className="mt-1 text-white/60">
                        {selectedSeller.businessName}
                      </p>
                    )}
                  </div>
                  <p className="whitespace-pre-line text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                    {selectedSeller.bio ||
                      "This seller has not added a business description yet."}
                  </p>
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="flex items-center gap-2 font-semibold">
                      <BadgeCheck className="h-5 w-5 text-emerald-300" />
                      {selectedSeller.isVerified ? "Verified seller" : "Haggle seller"}
                    </p>
                    <p className="mt-2 text-sm leading-5 text-white/60">
                      {selectedSeller.isVerified
                        ? "This seller has a verified Haggle profile."
                        : "Seller profile and business details on Haggle."}
                    </p>
                  </div>
                  {selectedSeller.username && (
                    <Link
                      href={`/profile/${encodeURIComponent(selectedSeller.username)}`}
                      onClick={() => setSellerProfileOpen(false)}
                      className="inline-flex rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold transition hover:border-white hover:bg-white/10"
                    >
                      Visit seller profile
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default MarketPage;
