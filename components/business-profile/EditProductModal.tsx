// components/business-profile/EditProductModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Upload, Sparkles } from "lucide-react";

// ============================================
// TYPES
// ============================================
interface ProductFormData {
  id?: string;
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string;
  isNegotiable: boolean;
  isLive: boolean;
  isTrending: boolean;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductFormData | null;
  onSave: (product: ProductFormData) => void;
}

const CATEGORIES = [
  "Fashion",
  "Electronics",
  "Food",
  "Furniture",
  "Beauty",
  "Services",
  "Art",
  "Automobile",
  "Home",
  "Other",
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onSave,
}: EditProductModalProps) {
  const isEditing = !!product?.id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    category: "",
    description: "",
    imageUrl: "",
    isNegotiable: true,
    isLive: false,
    isTrending: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || "",
        price: product.price || "",
        category: product.category || "",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
        isNegotiable: product.isNegotiable ?? true,
        isLive: product.isLive ?? false,
        isTrending: product.isTrending ?? false,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        imageUrl: "",
        isNegotiable: true,
        isLive: false,
        isTrending: false,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: product?.id });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/40 bg-background-elevated/90 backdrop-blur-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-surface hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-foreground">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>
            <p className="text-sm text-muted mt-1">
              {isEditing
                ? "Update your product details"
                : "List a new product for buyers"}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vintage Denim Jacket"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  required
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="₦50,000"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the product in warm, buyer-friendly language..."
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm resize-none"
                />
              </div>

              {/* Image */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Product Settings</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 rounded-xl border border-border/40 bg-background-elevated/10 px-3 py-2 cursor-pointer hover:bg-background-elevated/20 transition">
                    <input
                      type="checkbox"
                      checked={formData.isNegotiable}
                      onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                      className="h-4 w-4 rounded border-border/60 accent-primary"
                    />
                    <span className="text-sm text-foreground/70">Negotiable</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-border/40 bg-background-elevated/10 px-3 py-2 cursor-pointer hover:bg-background-elevated/20 transition">
                    <input
                      type="checkbox"
                      checked={formData.isLive}
                      onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                      className="h-4 w-4 rounded border-border/60 accent-primary"
                    />
                    <span className="text-sm text-foreground/70">Live</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-border/40 bg-background-elevated/10 px-3 py-2 cursor-pointer hover:bg-background-elevated/20 transition">
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                      className="h-4 w-4 rounded border-border/60 accent-primary"
                    />
                    <span className="text-sm text-foreground/70">Trending</span>
                  </label>
                </div>
              </div>

              {/* AI Helper */}
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-foreground">💡 AI Product Helper</p>
                    <p className="text-xs text-muted/70 mt-0.5">
                      Products with high-quality images and detailed descriptions get 3x more views.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-border/60 px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25"
                >
                  {isEditing ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}