// components/business-profile/EditGalleryModal.tsx
"use client";

import { useState, useEffect } from "react";
import type { GalleryItem } from "@/lib/types";

interface EditGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryItem | null;
  onSave: (item: GalleryItem) => void;
}

const CATEGORIES = [
  "Store",
  "Products",
  "Behind the Scenes",
  "Team",
  "Customer Moments",
  "Warehouse",
  "Events",
  "Other",
];

export default function EditGalleryModal({
  isOpen,
  onClose,
  item,
  onSave,
}: EditGalleryModalProps) {
  const [type, setType] = useState<"image" | "video">("image");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (item) {
      setType(item.type);
      setUrl(item.url);
      setThumbnail(item.thumbnail || "");
      setCaption(item.caption || "");
      setCategory(item.category || "");
    } else {
      setType("image");
      setUrl("");
      setThumbnail("");
      setCaption("");
      setCategory("");
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: GalleryItem = {
      id: item?.id || "",
      type,
      url,
      thumbnail: type === "video" ? thumbnail : undefined,
      caption: caption || undefined,
      category: category || undefined,
      createdAt: item?.createdAt || new Date().toISOString(),
    };
    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="bg-background rounded-lg shadow-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          {item ? "Edit" : "Add"} Gallery Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Media Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "image" | "video")}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/media.jpg"
              required
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          {type === "video" && (
            <div>
              <label className="block text-sm font-medium mb-1">Thumbnail URL (optional)</label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/thumb.jpg"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Brief description"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded border border-border hover:bg-background-elevated"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}