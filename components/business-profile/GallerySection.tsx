// components/business-profile/GallerySection.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Image, Video, Plus, X, Trash2, Edit, Play, Grid, LayoutGrid } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  items: GalleryItem[];
  isOwner: boolean;
  onAddItem: () => void;
  onEditItem: (item: GalleryItem) => void;
  onDeleteItem: (id: string) => void;
}

export default function GallerySection({
  items,
  isOwner,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: GallerySectionProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Extract categories
  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.category || "uncategorized"));
    return ["all", ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter(i => (i.category || "uncategorized") === activeCategory);
  }, [items, activeCategory]);

  const openLightbox = (item: GalleryItem) => setSelectedItem(item);
  const closeLightbox = () => setSelectedItem(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Gallery</h2>
          <p className="text-sm text-muted-foreground">
            Photos and videos from your business
          </p>
        </div>
        {isOwner && (
          <button
            onClick={onAddItem}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            <Plus className="h-4 w-4" />
            Add Media
          </button>
        )}
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap",
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "border border-border/40 text-muted hover:text-foreground"
              )}
            >
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background-elevated/20 p-8 text-center">
          <Image className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {activeCategory !== "all"
              ? `No items in "${activeCategory}" category.`
              : "No gallery items yet."}
            {isOwner ? " Click 'Add Media' to get started." : ""}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layoutId={item.id}
              className="relative group aspect-square rounded-lg overflow-hidden bg-background-elevated border border-border/40 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openLightbox(item)}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.caption || "Gallery image"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.caption || "Video"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-10 w-10 text-white fill-white" />
                  </div>
                </div>
              )}

              {isOwner && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditItem(item);
                    }}
                    className="p-1 rounded-full bg-background/80 text-foreground hover:bg-background"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="p-1 rounded-full bg-background/80 text-destructive hover:bg-background"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs text-white truncate">{item.caption}</p>
                </div>
              )}
              {item.category && (
                <div className="absolute top-2 left-2">
                  <span className="text-[8px] font-medium bg-black/50 text-white px-1.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-6 w-6" />
            </button>
            {selectedItem.type === "image" ? (
              <img
                src={selectedItem.url}
                alt={selectedItem.caption || ""}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedItem.url}
                controls
                autoPlay
                className="w-full h-auto max-h-[80vh] rounded-lg"
              />
            )}
            {selectedItem.caption && (
              <p className="mt-2 text-center text-sm text-white bg-black/50 p-2 rounded">
                {selectedItem.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}