// components/business-profile/ServicesSection.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  TrendingUp,
  Clock,
  Sparkles,
  Edit3,
  Trash2,
  Eye,
} from "lucide-react";
import { ServiceCard } from "@/components/haggle-ui";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================
interface Service {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
  category: string;
  description: string;
  deliveryTime?: string;
  isNegotiable?: boolean;
  isPopular?: boolean;
  views?: number;
  createdAt?: string;
  sellerId?: string;
}

interface ServicesSectionProps {
  services: Service[];
  isOwner: boolean;
  onAddService: () => void;
  onEditService: (service: Service) => void;
  onDeleteService: (serviceId: string) => void;
  className?: string;
}

type FilterType = "all" | "popular" | "recent" | "negotiable" | "fast-delivery";

// ============================================
// FILTER CONFIG
// ============================================
const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "popular", label: "🔥 Popular" },
  { value: "recent", label: "Recently Added" },
  { value: "negotiable", label: "Negotiable" },
  { value: "fast-delivery", label: "Fast Delivery" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function ServicesSection({
  services,
  isOwner,
  onAddService,
  onEditService,
  onDeleteService,
  className,
}: ServicesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Filter and search services
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }

    // Filters
    switch (activeFilter) {
      case "popular":
        result = result.filter((s) => s.isPopular);
        break;
      case "recent":
        result = result.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case "negotiable":
        result = result.filter((s) => s.isNegotiable);
        break;
      case "fast-delivery":
        result = result.filter((s) => {
          if (!s.deliveryTime) return false;
          const days = parseInt(s.deliveryTime);
          return !isNaN(days) && days <= 2;
        });
        break;
      default:
        break;
    }

    return result;
  }, [services, searchQuery, activeFilter]);

  const serviceCount = services.length;
  const filteredCount = filteredServices.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "rounded-3xl border border-border/40 bg-background-elevated/20 backdrop-blur-sm p-6 shadow-card",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-secondary" />
            Services
            <span className="text-sm font-normal text-muted/60">
              ({serviceCount})
            </span>
          </h3>
          <p className="text-sm text-muted/70">
            {filteredCount} service{filteredCount !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <button
            onClick={onAddService}
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-white transition hover:bg-secondary-strong shadow-lg shadow-secondary/25"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-xl border border-border/60 bg-background-elevated/40 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
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
                  ? "bg-secondary text-white shadow-sm"
                  : "border border-border/40 bg-background-elevated/20 text-muted hover:text-foreground hover:bg-background-elevated/40"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-secondary/40" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">No services found</h4>
          <p className="text-sm text-muted mt-1">
            {searchQuery
              ? "Try adjusting your search or filters"
              : isOwner
              ? "Start by adding your first service"
              : "This business hasn't listed any services yet"}
          </p>
          {isOwner && (
            <button
              onClick={onAddService}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-sm font-medium text-white transition hover:bg-secondary-strong shadow-lg shadow-secondary/25"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>
          )}
        </div>
      )}

      {/* Service Grid */}
      {filteredServices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="relative group"
            >
              {/* Service Card */}
              <ServiceCard service={service} />

              {/* Owner Actions Overlay */}
              {isOwner && (
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditService(service)}
                    className="rounded-full bg-background-elevated/90 backdrop-blur-sm p-1.5 text-muted hover:text-foreground transition shadow-sm border border-border/30"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteService(service.id)}
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