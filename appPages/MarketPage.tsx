"use client";

import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  Flame,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Ticket,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Eye,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import {
  GhostButton,
  LiveSessionCard,
  PageIntro,
  PrimaryButton,
  ProductCard,
  SectionTitle,
  ServiceCard,
} from "@/components/haggle-ui";
import { useHaggleStore } from "@/lib/app-store";
import {
  allLiveSessions,
  marketCategories,
  marketServices,
  sellerProducts,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================
type Category = (typeof marketCategories)[number];
type FilterType = "all" | "products" | "services" | "lives";

// ============================================
// MARKET MOOD TICKER
// ============================================
function MarketMoodTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const moods = [
    { icon: "🔥", text: "127 live negotiations happening right now", color: "text-orange-400" },
    { icon: "📦", text: "48 products sold in the last hour", color: "text-emerald-400" },
    { icon: "📍", text: "34 sellers active within 5km of you", color: "text-blue-400" },
    { icon: "💬", text: "23 offers were accepted today", color: "text-purple-400" },
    { icon: "🛒", text: "12 new sellers joined this hour", color: "text-amber-400" },
  ];

  useState(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % moods.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  const mood = moods[currentIndex];

  return (
    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5">
      <span className="text-sm">{mood.icon}</span>
      <span className={`text-sm font-medium ${mood.color}`}>{mood.text}</span>
    </div>
  );
}

// ============================================
// CATEGORY PILL
// ============================================
function CategoryPill({
  category,
  isActive,
  onClick,
  count,
}: {
  category: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
        isActive
          ? "bg-primary text-white shadow-lg shadow-primary/25"
          : "bg-background-elevated/40 backdrop-blur-sm text-muted hover:text-foreground hover:bg-background-elevated/60 border border-border/40",
      )}
    >
      {category}
      {count !== undefined && (
        <span
          className={cn(
            "ml-1.5 text-xs",
            isActive ? "text-white/60" : "text-muted/50",
          )}
        >
          ({count})
        </span>
      )}
    </button>
  );
}

// ============================================
// STAT CARD (for marketplace metrics)
// ============================================
function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: { value: string; direction: "up" | "down" };
}) {
  return (
    <div className="bg-background-elevated/20 backdrop-blur-sm rounded-2xl border border-border/40 p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2.5 text-primary">{icon}</div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
        {trend && (
          <span
            className={cn(
              "ml-auto text-xs font-medium",
              trend.direction === "up" ? "text-success" : "text-danger",
            )}
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN MARKET PAGE
// ============================================
const MarketPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    marketCategories.forEach((cat) => {
      const products = sellerProducts.filter((p) => p.category === cat);
      const services = marketServices.filter((s) => s.category === cat);
      const lives = allLiveSessions.filter((l) => l.category === cat);
      counts[cat] = products.length + services.length + lives.length;
    });
    counts["All"] = sellerProducts.length + marketServices.length + allLiveSessions.length;
    return counts;
  }, []);

  // Filtered data
  const filteredProducts = useMemo(() => {
    let products = sellerProducts;
    if (activeCategory !== "All") {
      products = products.filter((p) => p.category === activeCategory);
    }
    if (deferredSearch) {
      products = products.filter((p) =>
        `${p.name} ${p.description}`
          .toLowerCase()
          .includes(deferredSearch.toLowerCase()),
      );
    }
    return products;
  }, [activeCategory, deferredSearch]);

  const filteredServices = useMemo(() => {
    let services = marketServices;
    if (activeCategory !== "All") {
      services = services.filter((s) => s.category === activeCategory);
    }
    if (deferredSearch) {
      services = services.filter((s) =>
        `${s.name} ${s.description}`
          .toLowerCase()
          .includes(deferredSearch.toLowerCase()),
      );
    }
    return services;
  }, [activeCategory, deferredSearch]);

  const filteredLives = useMemo(() => {
    let lives = allLiveSessions;
    if (activeCategory !== "All") {
      lives = lives.filter((l) => l.category === activeCategory);
    }
    if (deferredSearch) {
      lives = lives.filter((l) =>
        `${l.title} ${l.description}`
          .toLowerCase()
          .includes(deferredSearch.toLowerCase()),
      );
    }
    return lives;
  }, [activeCategory, deferredSearch]);

  const showProducts = activeFilter === "all" || activeFilter === "products";
  const showServices = activeFilter === "all" || activeFilter === "services";
  const showLives = activeFilter === "all" || activeFilter === "lives";

  // Compute total results
  const totalResults =
    (showProducts ? filteredProducts.length : 0) +
    (showServices ? filteredServices.length : 0) +
    (showLives ? filteredLives.length : 0);

  return (
    <AppShell>
      <div className="min-h-screen">
        {/* ============================================ */}
        {/* HERO BANNER - Market Square Identity */}
        {/* ============================================ */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                    🏪 Market Square
                  </span>
                  <span className="h-4 w-px bg-border/60" />
                  <span className="text-xs text-muted/60 flex items-center gap-1.5">
                    <Users className="h-3 w-3" />
                    {sellerProducts.length + marketServices.length} listings
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Discover, negotiate, and buy live.
                </h1>
                <p className="mt-2 text-muted max-w-2xl">
                  Browse products, services, and live sessions from sellers
                  near you. Every listing is negotiable.
                </p>
              </div>

              {/* Market Mood Ticker */}
              <div className="flex-shrink-0">
                <MarketMoodTicker />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                icon={<ShoppingBag className="h-4 w-4" />}
                label="Products"
                value={String(sellerProducts.length)}
                trend={{ value: "12%", direction: "up" }}
              />
              <StatCard
                icon={<Sparkles className="h-4 w-4" />}
                label="Services"
                value={String(marketServices.length)}
                trend={{ value: "8%", direction: "up" }}
              />
              <StatCard
                icon={<Flame className="h-4 w-4" />}
                label="Live Now"
                value={String(allLiveSessions.filter((l) => l.status === "live").length)}
                trend={{ value: "5%", direction: "up" }}
              />
              <StatCard
                icon={<Users className="h-4 w-4" />}
                label="Active Sellers"
                value="234"
              />
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* SEARCH & FILTERS */}
        {/* ============================================ */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, services, or live sessions..."
                    className="w-full rounded-xl border border-border/60 bg-background-elevated/30 px-11 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                {searchQuery && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted/40">
                    {totalResults} results
                  </span>
                )}
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(["all", "products", "services", "lives"] as FilterType[]).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                        activeFilter === filter
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted hover:text-foreground bg-background-elevated/30 border border-border/30 hover:border-border/60",
                      )}
                    >
                      {filter === "all"
                        ? "All"
                        : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* CATEGORY PILLS */}
        {/* ============================================ */}
        <div className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
          <div className="flex flex-wrap items-center gap-2">
            {marketCategories.map((category) => (
              <CategoryPill
                key={category}
                category={category}
                isActive={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                count={categoryCounts[category]}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted/50">
            <span>Showing {totalResults} results</span>
            <span className="h-3 w-px bg-border/40" />
            <span>Filtered by {activeCategory}</span>
          </div>
        </div>

        {/* ============================================ */}
        {/* CONTENT GRID */}
        {/* ============================================ */}
        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6 space-y-8 pb-12">
          {totalResults === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-primary/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No results found</h3>
              <p className="text-sm text-muted mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Products */}
          {showProducts && filteredProducts.length > 0 && (
            <div>
              <SectionTitle
                title="Products"
                description={`${filteredProducts.length} item${filteredProducts.length !== 1 ? "s" : ""} available`}
                action={
                  <Link
                    href="/market-search"
                    className="text-sm font-medium text-primary hover:text-primary-strong flex items-center gap-1 transition"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {filteredProducts.length > 8 && (
                <div className="mt-4 text-center">
                  <Link
                    href="/market-search"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition"
                  >
                    See all {filteredProducts.length} products
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Services */}
          {showServices && filteredServices.length > 0 && (
            <div>
              <SectionTitle
                title="Services"
                description={`${filteredServices.length} service${filteredServices.length !== 1 ? "s" : ""} available`}
                action={
                  <Link
                    href="/market-search?type=services"
                    className="text-sm font-medium text-primary hover:text-primary-strong flex items-center gap-1 transition"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredServices.slice(0, 8).map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              {filteredServices.length > 8 && (
                <div className="mt-4 text-center">
                  <Link
                    href="/market-search?type=services"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition"
                  >
                    See all {filteredServices.length} services
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Live Sessions */}
          {showLives && filteredLives.length > 0 && (
            <div>
              <SectionTitle
                title="Live Sessions"
                description={`${filteredLives.length} session${filteredLives.length !== 1 ? "s" : ""} ongoing or scheduled`}
                action={
                  <Link
                    href="/market-search?type=lives"
                    className="text-sm font-medium text-primary hover:text-primary-strong flex items-center gap-1 transition"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredLives.slice(0, 8).map((session) => (
                  <LiveSessionCard key={session.id} session={session} compact />
                ))}
              </div>
              {filteredLives.length > 8 && (
                <div className="mt-4 text-center">
                  <Link
                    href="/market-search?type=lives"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition"
                  >
                    See all {filteredLives.length} sessions
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Quick view of all results when filtered */}
          {activeCategory === "All" && activeFilter === "all" && !searchQuery && (
            <div className="rounded-2xl border border-border/40 bg-background-elevated/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    🏪 Explore the Market Square
                  </h3>
                  <p className="text-xs text-muted">Browse all listings or use filters to narrow down</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/post-product"
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white transition hover:bg-primary-strong"
                  >
                    List an item
                  </Link>
                  <Link
                    href="/market-search"
                    className="rounded-full border border-border/40 px-4 py-1.5 text-xs font-medium text-muted transition hover:bg-background-elevated/20"
                  >
                    Advanced search
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default MarketPage;