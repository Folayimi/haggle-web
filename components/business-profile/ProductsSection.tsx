// components/business-profile/ProductsSection.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Package, Edit3, Trash2 } from "lucide-react";
import { ProductCard } from "@/components/haggle-ui";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  category: string;
  description: string;
  isNegotiable?: boolean;
  isLive?: boolean;
  isTrending?: boolean;
  views?: number;
  createdAt?: string;
}

interface ProductsSectionProps {
  products: Product[];
  isOwner: boolean;
  isPreviewMode?: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  className?: string;
}

type FilterType = "all" | "live" | "trending" | "most-viewed" | "recent" | "negotiable" | "wholesale";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "trending", label: "🔥 Trending" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "recent", label: "Recently Added" },
  { value: "negotiable", label: "Negotiable" },
  { value: "wholesale", label: "Wholesale" },
];

export default function ProductsSection({
  products,
  isOwner,
  isPreviewMode = false,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  className,
}: ProductsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }
    switch (activeFilter) {
      case "live":
        result = result.filter((p) => p.isLive);
        break;
      case "trending":
        result = result.filter((p) => p.isTrending);
        break;
      case "most-viewed":
        result = result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "recent":
        result = result.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case "negotiable":
        result = result.filter((p) => p.isNegotiable);
        break;
      case "wholesale":
        result = result.filter((p) => p.category.toLowerCase().includes("wholesale"));
        break;
      default:
        break;
    }
    return result;
  }, [products, searchQuery, activeFilter]);

  const productCount = products.length;
  const filteredCount = filteredProducts.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-3xl border border-border/40 bg-background-elevated/20 backdrop-blur-sm p-6 shadow-card",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Products
            <span className="text-sm font-normal text-muted/60">({productCount})</span>
          </h3>
          <p className="text-sm text-muted/70">
            {filteredCount} product{filteredCount !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Add Product – hidden in preview */}
        {isOwner && !isPreviewMode && (
          <button
            onClick={onAddProduct}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        )}
      </div>

      {/* Search & Filters (visible in preview too – it's visitor-friendly) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-border/60 bg-background-elevated/40 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition",
                activeFilter === filter.value
                  ? "bg-primary text-white shadow-sm"
                  : "border border-border/40 bg-background-elevated/20 text-muted hover:text-foreground hover:bg-background-elevated/40"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-primary/40" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">No products found</h4>
          <p className="text-sm text-muted mt-1">
            {searchQuery
              ? "Try adjusting your search or filters"
              : isPreviewMode
              ? "This business hasn't listed any products yet."
              : isOwner
              ? "Start by adding your first product"
              : "This business hasn't listed any products yet"}
          </p>
          {/* CTA only shown in edit mode */}
          {isOwner && !isPreviewMode && (
            <button
              onClick={onAddProduct}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          )}
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="relative group"
            >
              <ProductCard product={product} />

              {/* Owner Actions Overlay – hidden in preview */}
              {isOwner && !isPreviewMode && (
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="rounded-full bg-background-elevated/90 backdrop-blur-sm p-1.5 text-muted hover:text-foreground transition shadow-sm border border-border/30"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="rounded-full bg-background-elevated/90 backdrop-blur-sm p-1.5 text-danger hover:text-danger/80 transition shadow-sm border border-border/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}