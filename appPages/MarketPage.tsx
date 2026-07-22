// app/market/page.tsx
"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  ChevronRight,
  Eye,
  Flame,
  Heart,
  MapPin,
  Play,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { AppShell } from "@/components/app-shell";
import {
  LiveSessionCard,
  ProductCard,
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
// HERO COMPONENT (Immersive)
// ============================================
function MarketHero() {
  return (
    <div className="relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-primary/20 via-background to-secondary/10 border-b border-border/40">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-10" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-12 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20 mb-4">
            <Flame className="h-3 w-3" />
            Live Now · 127 negotiations happening
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight max-w-3xl">
            Discover what’s <span className="text-gradient">negotiable</span>.
          </h1>
          <p className="mt-3 text-muted max-w-xl text-sm md:text-base">
            Browse products, services, and live sessions from sellers near you.
            Every listing is open to negotiation.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/post-product"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition"
            >
              <Sparkles className="h-4 w-4" />
              List an Item
            </Link>
            <Link
              href="/market-search"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-6 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition"
            >
              Browse All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// SEARCH BAR (Sticky)
// ============================================
function SearchBar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative flex-1 transition-all duration-200",
              isFocused && "scale-[1.02]",
            )}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search for anything..."
              className="w-full rounded-full border border-border/60 bg-background-elevated/30 pl-11 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
            {marketCategories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition",
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-background-elevated/20 text-muted hover:text-foreground hover:bg-background-elevated/40 border border-border/30",
                )}
              >
                {cat}
              </button>
            ))}
            <button className="px-3 py-1.5 rounded-full text-xs font-medium text-muted/50 hover:text-foreground transition border border-border/30">
              More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SECTION ROW (Like Netflix)
// ============================================
function SectionRow({
  title,
  items,
  renderItem,
  viewAllHref,
  seeAllLabel = "See all",
}: {
  title: string;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  viewAllHref?: string;
  seeAllLabel?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    const target = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: target, behavior: "smooth" });
  };

  const updateArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateArrows);
      updateArrows();
      return () => el.removeEventListener("scroll", updateArrows);
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-primary hover:text-primary-strong flex items-center gap-1 transition"
          >
            {seeAllLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full shadow-lg hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="flex-shrink-0 w-64">
              {renderItem(item, idx)}
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full shadow-lg hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// CATEGORY HERO (Pinterest-Style Mood Board)
// ============================================
function CategoryMoodBoard({ activeCategory }: { activeCategory: Category }) {
  const categories = marketCategories.slice(1, 9); // exclude "All"
  const colors = [
    "bg-amber-500/10",
    "bg-blue-500/10",
    "bg-emerald-500/10",
    "bg-rose-500/10",
    "bg-purple-500/10",
    "bg-cyan-500/10",
    "bg-lime-500/10",
    "bg-orange-500/10",
  ];
  const icons = [
    <ShoppingBag className="h-5 w-5" />,
    <Sparkles className="h-5 w-5" />,
    <Star className="h-5 w-5" />,
    <Heart className="h-5 w-5" />,
    <Ticket className="h-5 w-5" />,
    <TrendingUp className="h-5 w-5" />,
    <MapPin className="h-5 w-5" />,
    <Eye className="h-5 w-5" />,
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {categories.map((cat, idx) => (
        <motion.div
          key={cat}
          whileHover={{ scale: 1.02 }}
          className={cn(
            "rounded-2xl p-4 border border-border/40 transition cursor-pointer",
            activeCategory === cat ? "border-primary/60 bg-primary/5" : "hover:bg-background-elevated/20",
            colors[idx % colors.length],
          )}
          onClick={() => setActiveCategory(cat)}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {icons[idx % icons.length]}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{cat}</p>
              <p className="text-xs text-muted/60">
                {sellerProducts.filter((p) => p.category === cat).length +
                  marketServices.filter((s) => s.category === cat).length}{" "}
                listings
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
const MarketPage = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered data
  const filteredProducts = useMemo(() => {
    let products = sellerProducts;
    if (activeCategory !== "All") {
      products = products.filter((p) => p.category === activeCategory);
    }
    if (searchQuery) {
      products = products.filter((p) =>
        `${p.name} ${p.description}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }
    return products;
  }, [activeCategory, searchQuery]);

  const filteredServices = useMemo(() => {
    let services = marketServices;
    if (activeCategory !== "All") {
      services = services.filter((s) => s.category === activeCategory);
    }
    if (searchQuery) {
      services = services.filter((s) =>
        `${s.name} ${s.description}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }
    return services;
  }, [activeCategory, searchQuery]);

  const filteredLives = useMemo(() => {
    let lives = allLiveSessions;
    if (activeCategory !== "All") {
      lives = lives.filter((l) => l.category === activeCategory);
    }
    if (searchQuery) {
      lives = lives.filter((l) =>
        `${l.title} ${l.description}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }
    return lives;
  }, [activeCategory, searchQuery]);

  // Compute total results for empty state
  const totalResults =
    (activeFilter === "all" || activeFilter === "products" ? filteredProducts.length : 0) +
    (activeFilter === "all" || activeFilter === "services" ? filteredServices.length : 0) +
    (activeFilter === "all" || activeFilter === "lives" ? filteredLives.length : 0);

  // Determine which rows to show
  const showProducts = activeFilter === "all" || activeFilter === "products";
  const showServices = activeFilter === "all" || activeFilter === "services";
  const showLives = activeFilter === "all" || activeFilter === "lives";

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <MarketHero />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Category Mood Board */}
        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
          <CategoryMoodBoard activeCategory={activeCategory} />
        </div>

        {/* Content Rows */}
        <div className="max-w-7xl mx-auto px-4 pb-12 lg:px-6 space-y-10">
          {/* Live Sessions (Top Priority) */}
          {showLives && filteredLives.length > 0 && (
            <SectionRow
              title="🔴 Live Now"
              items={filteredLives.filter((l) => l.status === "live").slice(0, 10)}
              renderItem={(session) => (
                <LiveSessionCard session={session} compact />
              )}
              viewAllHref="/market-search?type=lives"
              seeAllLabel="All live sessions"
            />
          )}

          {/* Upcoming Lives */}
          {showLives && filteredLives.filter((l) => l.status === "upcoming").length > 0 && (
            <SectionRow
              title="📅 Upcoming"
              items={filteredLives.filter((l) => l.status === "upcoming").slice(0, 10)}
              renderItem={(session) => (
                <LiveSessionCard session={session} compact />
              )}
              viewAllHref="/market-search?type=lives"
              seeAllLabel="All upcoming"
            />
          )}

          {/* Products */}
          {showProducts && filteredProducts.length > 0 && (
            <SectionRow
              title="🛍️ Products"
              items={filteredProducts.slice(0, 10)}
              renderItem={(product) => (
                <ProductCard product={product} />
              )}
              viewAllHref="/market-search?type=products"
              seeAllLabel="All products"
            />
          )}

          {/* Services */}
          {showServices && filteredServices.length > 0 && (
            <SectionRow
              title="✨ Services"
              items={filteredServices.slice(0, 10)}
              renderItem={(service) => (
                <ServiceCard service={service} />
              )}
              viewAllHref="/market-search?type=services"
              seeAllLabel="All services"
            />
          )}

          {/* Past Lives (if any) */}
          {showLives && filteredLives.filter((l) => l.status === "past").length > 0 && (
            <SectionRow
              title="📼 Past Sessions"
              items={filteredLives.filter((l) => l.status === "past").slice(0, 10)}
              renderItem={(session) => (
                <LiveSessionCard session={session} compact />
              )}
              viewAllHref="/market-search?type=lives"
              seeAllLabel="All past sessions"
            />
          )}

          {/* Empty State */}
          {totalResults === 0 && (
            <div className="text-center py-20">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Nothing found</h3>
              <p className="text-sm text-muted mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default MarketPage;