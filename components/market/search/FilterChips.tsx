// components/market/search/FilterChips.tsx
"use client";

import { cn } from "@/lib/utils";

interface FilterChipsProps {
  filters: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function FilterChips({ filters, selected, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cn(
            "rounded-full",
            "px-3",
            "py-1.5",
            "text-xs",
            "font-medium",
            "whitespace-nowrap",
            "transition-all",
            "duration-200",
            "border",
            "border-transparent",
            selected === filter
              ? "bg-primary text-white shadow-sm shadow-primary/20 border-primary/30"
              : "bg-background-elevated/5 text-muted/70 hover:text-foreground hover:bg-background-elevated/10 border-border/30 hover:border-border/50",
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
