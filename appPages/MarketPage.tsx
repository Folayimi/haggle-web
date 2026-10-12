"use client";

import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Activity,
  ArrowUp,
  BriefcaseBusiness,
  ChevronLeft,
  Layers3,
  Megaphone,
  MapPin,
  Radio,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ActionCard } from "@/components/market/common/ActionCard";
import {
  MarketLoadingSkeleton,
  MarketProductDetailSkeleton,
  MarketSellerActivitySkeleton,
  MarketSellerSkeleton,
  MarketSidebarSkeleton,
} from "@/components/market/common/MarketSkeletons";
import ProductCard from "@/components/market/cards/ProductCard";
import { LiveSessionCard } from "@/components/market/cards/LiveSessionCard";
import { useMarketDiscovery } from "@/components/market/hooks/useMarketDiscovery";
import { FilterChips } from "@/components/market/search/FilterChips";
import { MarketSearch } from "@/components/market/search/MarketSearch";
import { ContinueNegotiating } from "@/components/market/sections/ContinueNegotiating";
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
import type { MarketService, SellerProduct } from "@/types";

interface BroadcastButtonProps {
  onClick?: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
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

const MarketPage = () => {
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
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(
    null,
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<MarketService | null>(
    null,
  );
  const [selectedSeller, setSelectedSeller] = useState<
    ReturnType<typeof mapUserToSeller> | null
  >(null);
  const [productDetailLoading, setProductDetailLoading] = useState(false);
  const [productDetailError, setProductDetailError] = useState(false);
  const [serviceDetailLoading, setServiceDetailLoading] = useState(false);
  const [serviceDetailError, setServiceDetailError] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [serviceListings, setServiceListings] = useState<BackendListing[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [publishedCategories, setPublishedCategories] = useState<
    BackendCategory[]
  >([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const categories = [
    { id: "All", name: "All categories" },
    ...publishedCategories.map(({ id, name }) => ({ id, name })),
  ];
  const categoryNames = useMemo(
    () =>
      new Map(
        publishedCategories.map((category) => [category.id, category.name]),
      ),
    [publishedCategories],
  );
  const services = useMemo<MarketService[]>(
    () =>
      serviceListings.map((listing) =>
        mapListingToService(
          listing,
          categoryNames.get(listing.category_id) ?? listing.category_id,
        ),
      ),
    [serviceListings, categoryNames],
  );
  const discovery = useMarketDiscovery({
    products,
    services,
    sellers,
    liveSessions,
    negotiations,
  });

  const query = searchQuery.trim().toLowerCase();
  const matchesProduct = (product: (typeof products)[number]) =>
    (selectedCategory === "All" || product.category === selectedCategory) &&
    (!query ||
      `${product.name} ${categoryNames.get(product.category) ?? ""}`
        .toLowerCase()
        .includes(query));
  const filteredProducts = products.filter(matchesProduct);
  const filteredServices = services.filter(
    (service) =>
      !query ||
      `${service.name} ${service.category}`.toLowerCase().includes(query),
  );
  const filteredServicesByCategory = filteredServices.filter(
    (service) =>
      selectedCategory === "All" ||
      serviceListings.some(
        (listing) =>
          listing.id === service.id &&
          listing.category_id === selectedCategory,
      ),
  );
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
    sectionsContainerRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
  };
  const handleServiceSelect = (service: MarketService) => {
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
    sectionsContainerRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
  };
  const handleBackToListings = () => {
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
  ) => {
    setSelectedMarketView(view);
    sectionsContainerRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
  };
  const handleBackToMarket = () => {
    if (selectedProductId || selectedServiceId) {
      handleBackToListings();
      return;
    }

    setSelectedMarketView(null);
    sectionsContainerRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
  };

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError(false);
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
      } catch {
        if (!cancelled) setProductsError(true);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadServices = async () => {
      setServicesLoading(true);
      setServicesError(false);
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
      } catch {
        if (!cancelled) setServicesError(true);
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
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
                selectedProductId || selectedServiceId
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
          <BroadcastButton size="sm" className="shrink-0" />
        </header>

        <div
          className={cn(
            "mt-2 flex min-h-0 flex-1 gap-6 overflow-hidden",
            (selectedProductId || selectedServiceId) && "flex-col xl:flex-row",
          )}
        >
          <div className="relative min-h-0 min-w-0 flex-1">
            <div
              ref={sectionsContainerRef}
              onScroll={handleSectionsScroll}
              className="h-full min-w-0 space-y-8 overflow-y-auto bg-background-elevated/70 rounded-xl p-5 pb-24 pr-1 xl:pb-20"
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
                  />
                )
              ) : productsLoading ? (
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
              <MarketBrowseView
                type="products"
                title="Trending"
                description="Products people are viewing, negotiating, and buying."
                items={discovery.trending.filter(matchesProduct)}
                onProductSelect={handleProductSelect}
              />
            ) : selectedMarketView === "recommended" ? (
              <MarketBrowseView
                type="products"
                title="Recommended for you"
                description="More products curated for your interests."
                items={discovery.recommended.filter(matchesProduct)}
                onProductSelect={handleProductSelect}
              />
            ) : selectedMarketView === "collections" ? (
              <MarketBrowseView
                type="collections"
                title="Featured Collections"
                description="Explore all curated collections."
                items={featuredCollections}
              />
            ) : selectedMarketView === "latest" ? (
              <MarketBrowseView
                type="products"
                title="Latest Listings"
                description="Browse all recently added products."
                items={discovery.latest.filter(matchesProduct)}
                onProductSelect={handleProductSelect}
              />
            ) : selectedMarketView === "services" ? (
              <>
                {servicesError && (
                  <p role="alert" className="text-sm text-danger">
                    Professional services could not be loaded. Please try
                    again shortly.
                  </p>
                )}
                {servicesLoading && (
                  <p role="status" className="text-sm text-muted">
                    Loading professional services...
                  </p>
                )}
                <MarketBrowseView
                  type="services"
                  title="Professional Services"
                  description="Browse trusted professionals and services."
                  items={filteredServicesByCategory}
                  onServiceSelect={handleServiceSelect}
                />
              </>
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
                className="grid grid-cols-2 gap-2 sm:grid-cols-3"
              >
                <ActionCard
                  icon={Activity}
                  title="Trending"
                  targetId="market-trending"
                />
                <ActionCard
                  icon={BriefcaseBusiness}
                  title="Professional Services"
                  targetId="market-services"
                />
                <ActionCard
                  icon={ShoppingBag}
                  title="Latest Listings"
                  targetId="market-latest"
                />
                <ActionCard
                  icon={Radio}
                  title="Happening Live"
                  targetId="market-live"
                />
                <ActionCard
                  icon={Sparkles}
                  title="Recommended (For You)"
                  targetId="market-recommended"
                />
                <ActionCard
                  icon={Layers3}
                  title="Featured Collections"
                  targetId="market-collections"
                />
              </nav>

              {productsError && (
                <p role="alert" className="text-sm text-danger">
                  Products could not be loaded. Please try again shortly.
                </p>
              )}
              {!productsLoading && !productsError && products.length === 0 && (
                <p className="text-sm text-muted">
                  No published products found.
                </p>
              )}
              <div id="market-trending" className="scroll-mt-4">
                <TrendingNearYou
                  products={discovery.trending.filter(matchesProduct)}
                  location="Lagos"
                  onProductSelect={handleProductSelect}
                  onViewAll={() => openMarketView("trending")}
                />
              </div>
              <div id="market-services" className="scroll-mt-4">
                {servicesError && (
                  <p role="alert" className="mb-4 text-sm text-danger">
                    Professional services could not be loaded. Please try
                    again shortly.
                  </p>
                )}
                {servicesLoading && (
                  <p role="status" className="mb-4 text-sm text-muted">
                    Loading professional services...
                  </p>
                )}
                {!servicesLoading &&
                  !servicesError &&
                  filteredServicesByCategory.length === 0 && (
                    <p className="mb-4 text-sm text-muted">
                      No published professional services found.
                    </p>
                  )}
                <ServiceFeed
                  services={filteredServicesByCategory}
                  onServiceSelect={handleServiceSelect}
                  onViewAll={() => openMarketView("services")}
                />
              </div>
              <div id="market-latest" className="scroll-mt-4">
                <ProductFeed
                  products={discovery.latest.filter(matchesProduct)}
                  onProductSelect={handleProductSelect}
                  onViewAll={() => openMarketView("latest")}
                />
              </div>
              <div id="market-live" className="scroll-mt-4">
                <LiveNow
                  sessions={discovery.liveNow}
                  onViewAll={() => openMarketView("live")}
                />
              </div>
              <div id="market-recommended" className="scroll-mt-4">
                <Recommended
                  products={discovery.recommended.filter(matchesProduct)}
                  onProductSelect={handleProductSelect}
                  onViewAll={() => openMarketView("recommended")}
                />
              </div>
              <div id="market-collections" className="scroll-mt-4">
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
            <aside className="max-h-[40vh] w-full shrink-0 space-y-5 overflow-y-auto pb-20 xl:max-h-full xl:w-[360px]">
              <section className="rounded-xl border border-border bg-background-elevated p-5">
                <h2 className="text-lg font-semibold">Seller information</h2>
                {sellerLoading && (
                  <MarketSellerSkeleton />
                )}
                {sellerError && (
                  <p role="alert" className="mt-4 text-sm text-danger">
                    Seller information could not be loaded.
                  </p>
                )}
                {selectedSeller && (
                  <>
                    <div className="mt-5 flex items-center gap-3">
                      {selectedSeller.avatarUrl !== "/placeholder-avatar.jpg" ? (
                        <Image
                          src={selectedSeller.avatarUrl}
                          alt=""
                          width={56}
                          height={56}
                          unoptimized
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                          {selectedSeller.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {selectedSeller.businessName || selectedSeller.name}
                        </p>
                        {selectedSeller.businessName && (
                          <p className="truncate text-sm text-muted">
                            {selectedSeller.name}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-primary">
                          {selectedSeller.badge}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-background p-3 text-center">
                        <p className="font-semibold">
                          {
                            products.filter(
                              (product) =>
                                product.sellerId === selectedSeller.id,
                            ).length
                                + serviceListings.filter(
                                  (service) => service.seller_id === selectedSeller.id,
                                ).length
                          }
                        </p>
                        <p className="mt-1 text-xs text-muted">Listings</p>
                      </div>
                      <div className="rounded-lg bg-background p-3 text-center">
                        <p className="font-semibold">
                          {products
                            .filter(
                              (product) =>
                                product.sellerId === selectedSeller.id,
                            )
                            .reduce(
                              (total, product) =>
                                total + (product.saveCount ?? 0),
                              0,
                            )}
                        </p>
                        <p className="mt-1 text-xs text-muted">Likes</p>
                      </div>
                      <div className="rounded-lg bg-background p-3 text-center">
                        <p className="font-semibold">{selectedSeller.rating}</p>
                        <p className="mt-1 text-xs text-muted">Rating</p>
                      </div>
                    </div>

                    {selectedSeller.rating === "—" && (
                      <p className="mt-3 text-xs text-muted">
                        Seller ratings are not available yet.
                      </p>
                    )}
                  </>
                )}
              </section>

              {(sellerLoading || selectedSeller) && (
                <section className="rounded-xl border border-border bg-background-elevated p-5">
                  <h2 className="text-lg font-semibold">Seller activity</h2>
                  <p className="mt-1 text-sm text-muted">
                    Published listings from this provider
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
                            {product.imageUrl && (
                              <Image
                                src={product.imageUrl}
                                alt=""
                                width={56}
                                height={56}
                                className="h-14 w-14 rounded-md object-cover"
                              />
                            )}
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
                      {services
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
                            <Image
                              src={service.imageUrl}
                              alt=""
                              width={56}
                              height={56}
                              className="h-14 w-14 rounded-md object-cover"
                            />
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
                        !services.some(
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
          ) : productsLoading ? (
            <MarketSidebarSkeleton />
          ) : (
          <div className="hidden w-[360px] shrink-0 space-y-5 overflow-y-auto pb-20 pt-5 xl:block">
            <div className="h-[220px] rounded-xl border border-border bg-background-elevated p-5">
              <h2 className="text-lg font-semibold">Marketplace Activity</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-primary/10 p-4">
                  <Store className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-2xl font-bold">
                    {filteredProducts.length}
                  </p>
                  <p className="text-xs text-muted">Listings</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-4">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-2xl font-bold">{sellers.length}</p>
                  <p className="text-xs text-muted">Sellers</p>
                </div>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4 text-primary" />
                Live marketplace updates
              </p>
            </div>

            <div className="h-[200px] overflow-hidden rounded-xl border border-border bg-background-elevated">
              <ContinueNegotiating
                negotiations={discovery.negotiations.slice(0, 1)}
              />
            </div>

            <div className="h-[280px] overflow-hidden rounded-xl border border-border bg-background-elevated p-4">
              <h2 className="mb-4 text-lg font-semibold">Suggested Sellers</h2>
              <div className="grid gap-3">
                {sellers.slice(0, 3).map((seller) => (
                  <div
                    key={seller.id}
                    className="flex items-center gap-3 rounded-2xl border border-border p-3"
                  >
                    <Image
                      src={seller.avatarUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{seller.name}</p>
                      <p className="text-xs text-muted">
                        {seller.categories[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[200px] overflow-hidden rounded-xl border border-border bg-background-elevated p-4">
              <h2 className="mb-4 text-lg font-semibold">Nearby Businesses</h2>
              <div className="space-y-3">
                {sellers.slice(3, 5).map((seller) => (
                  <div
                    key={seller.id}
                    className="flex items-center justify-between rounded-2xl bg-background p-3"
                  >
                    <span className="truncate font-medium">{seller.name}</span>
                    <span className="text-xs text-muted">
                      {/* {seller.hero.location} */}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {filteredProducts[0] && (
              <div className="rounded-xl border border-border bg-background-elevated">
                <ProductCard
                  product={filteredProducts[0]}
                  onSelect={handleProductSelect}
                />
              </div>
            )}

            {discovery.liveNow[0] && (
              <div className="h-[200px] overflow-hidden rounded-xl border border-border bg-background-elevated">
                <LiveSessionCard session={discovery.liveNow[0]} />
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default MarketPage;
