"use client";

// The "Quick Categories" strip from your layout spec (72px horizontal
// utility strip). Real component -- was an empty stub file.

import { cn } from "@/lib/utils";

interface CategoriesProps {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}

export function Categories({ categories, active, onSelect }: CategoriesProps) {
  return (
    <div className="flex h-[72px] items-center gap-3 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={cn(
            "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition",
            active === category
              ? "bg-primary text-white"
              : "border border-border bg-background-elevated text-muted hover:text-foreground",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
