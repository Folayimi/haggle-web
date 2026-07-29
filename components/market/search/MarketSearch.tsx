"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface MarketSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarketSearch({ value, onChange }: MarketSearchProps) {
  return (
    <div className="relative flex-1 shrink">
      <Search
        className="
          absolute
          left-4
          top-1/2
          h-5
          w-5
          -translate-y-1/2
          text-muted/40
          transition-colors
          group-hover:text-muted/60
          peer-focus:text-primary/60
        "
      />
      <Input
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder="I am in need of ..."
        className="pl-12 pr-12 py-5 rounded-full"
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
            text-muted/30
            transition-all
            hover:text-muted/60
            hover:bg-background-elevated/10
            active:scale-95
          "
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
