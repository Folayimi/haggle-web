"use client";

import { cn } from "@/lib/utils";

interface FilterChipsProps {

  filters: string[];

  selected: string;

  onChange: (value: string) => void;
}

export function FilterChips({

  filters,

  selected,

  onChange,

}: FilterChipsProps) {

  return (

    <div
      className="
        flex
        gap-2
        overflow-x-auto
        pb-1
        no-scrollbar
      "
    >

      {filters.map((filter) => (

        <button

          key={filter}

          onClick={() => onChange(filter)}

          className={cn(

            "rounded-full",

            "px-4",

            "py-2",

            "text-sm",

            "font-medium",

            "transition",

            "whitespace-nowrap",

            selected === filter

              ? "bg-primary text-white"

              : "bg-muted/10 hover:bg-muted/20"

          )}

        >

          {filter}

        </button>

      ))}

    </div>

  );

}