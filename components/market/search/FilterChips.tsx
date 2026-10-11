// components/market/search/FilterChips.tsx
"use client";

import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterChipsProps {
  filters: { id: string; name: string }[];
  selected: string;
  onChange: (value: string) => void;
}

export function FilterChips({ filters, selected, onChange }: FilterChipsProps) {
  const selectedName =
    filters.find((filter) => filter.id === selected)?.name ?? "Category";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <span className="hidden max-w-28 truncate sm:inline">
          {selected === "All" ? "Category" : selectedName}
        </span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        {filters.map((filter) => (
          <DropdownMenuItem
            key={filter.id}
            onClick={() => onChange(filter.id)}
            aria-current={selected === filter.id ? "true" : undefined}
          >
            <span className="flex-1">
              {filter.id === "All" ? "All categories" : filter.name}
            </span>
            {selected === filter.id && <Check className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
