"use client";

import { FilterChips } from "./FilterChips";

import { MarketSearch } from "./MarketSearch";

interface StickyHeaderProps {

  searchQuery: string;

  setSearchQuery: (value: string) => void;

  activeFilter: string;

  setActiveFilter: (value: string) => void;

}

const FILTERS = [

  "All",

  "Products",

  "Services",

  "Live",

  "Nearby",

  "Trending",

  "Verified",

];

export function StickyHeader({

  searchQuery,

  setSearchQuery,

  activeFilter,

  setActiveFilter,

}: StickyHeaderProps) {

  return (

    <div
      className="
        sticky
        top-0
        z-40
        border-b
        border-border/40
        bg-background/85
        backdrop-blur-xl
      "
    >

      <div
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          gap-4
          px-6
          py-4
        "
      >

        <MarketSearch

          value={searchQuery}

          onChange={setSearchQuery}

        />

        <FilterChips

          filters={FILTERS}

          selected={activeFilter}

          onChange={setActiveFilter}

        />

      </div>

    </div>

  );

}