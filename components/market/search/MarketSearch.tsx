"use client";

import { Search, X } from "lucide-react";

interface MarketSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarketSearch({
  value,
  onChange,
}: MarketSearchProps) {
  return (
    <div className="relative flex-1">

      <Search
        className="
          absolute
          left-4
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-muted
        "
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products, businesses or services..."
        className="
          h-11
          w-full
          rounded-full
          border
          border-border
          bg-background
          pl-11
          pr-11
          text-sm
          outline-none
          transition-all
          focus:border-primary
          focus:ring-2
          focus:ring-primary/15
        "
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-muted
            hover:bg-muted/20
          "
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}