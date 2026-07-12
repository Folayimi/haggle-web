// components/feed/CategoryRail.tsx
"use client";

import { motion } from "framer-motion";
import {
  Flame,
  MapPin,
  Clock,
  ShoppingBag,
  Sparkles,
  Home,
  Utensils,
  Zap,
  Briefcase,
  Car,
  Shirt,
  Gem,
  Droplet,
  Sprout,
  Package,
  Wrench,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface CategoryRailProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// ============================================
// CATEGORIES CONFIG
// ============================================
const CATEGORIES: Category[] = [
  {
    id: "all",
    label: "For You",
    icon: <Sparkles className="w-4 h-4" />,
    color: "text-primary",
  },
  {
    id: "live",
    label: "Live Now",
    icon: <Clock className="w-4 h-4" />,
    color: "text-red-400",
  },
  {
    id: "services",
    label: "Services",
    icon: <Briefcase className="w-4 h-4" />,
    color: "text-purple-400",
  },
  {
    id: "food",
    label: "Food",
    icon: <Utensils className="w-4 h-4" />,
    color: "text-emerald-400",
  },
  {
    id: "trending",
    label: "Trending",
    icon: <Flame className="w-4 h-4" />,
    color: "text-orange-400",
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const CategoryRail = ({
  selectedCategory,
  onSelectCategory,
}: CategoryRailProps) => {
  return (
    <div className="flex flex-col pt-[30px] gap-2 h-[80vh] overflow-y-auto overflow-x-hidden pl-[30px] w-[300px]">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <motion.button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
            className={`relative group flex items-center justify-start px-[20px] gap-3 w-[130px] py-[20px] rounded-2xl transition-all duration-200 backdrop-blur-sm border ${
              isSelected
                ? `bg-primary/20 border-primary/50 ${category.color} shadow-lg shadow-primary/20`
                : "bg-black/30 border-white/5 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <span
              className={
                isSelected
                  ? category.color
                  : "text-white/60 group-hover:text-white/80"
              }
            >
              {category.icon}
            </span>

            <p className="text-white text-[12px]">{category.label}</p>

            {/* Tooltip on hover */}
            <div className="absolute left-full ml-3 px-2 py-1 rounded-lg bg-black/90 backdrop-blur-sm text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/5">
              {category.label}
            </div>

            {/* Small indicator dot for active */}
            {isSelected && (
              <span className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
