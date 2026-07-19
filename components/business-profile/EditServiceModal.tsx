// components/business-profile/EditServiceModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

// ============================================
// TYPES
// ============================================
interface ServiceFormData {
  id?: string;
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl?: string;
  deliveryTime?: string;
  includes: string; // comma-separated
  audience: string;
  negotiationNote: string;
  deliveryMode: "remote" | "onsite" | "hybrid";
  serviceDuration: string; // minutes
  isPopular: boolean;
}

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceFormData | null;
  onSave: (service: ServiceFormData) => void;
}

const CATEGORIES = [
  "Creative Services", "Consulting", "Digital Marketing", "Design & Branding",
  "Development & IT", "Photography & Video", "Writing & Translation",
  "Music & Audio", "Business Services", "Home Services", "Health & Wellness",
  "Education & Tutoring", "Legal & Financial", "Other"
];

const DELIVERY_MODES = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function EditServiceModal({
  isOpen,
  onClose,
  service,
  onSave,
}: EditServiceModalProps) {
  const isEditing = !!service?.id;

  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    price: "",
    category: "",
    description: "",
    imageUrl: "",
    deliveryTime: "",
    includes: "",
    audience: "",
    negotiationNote: "",
    deliveryMode: "remote",
    serviceDuration: "",
    isPopular: false,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        id: service.id,
        name: service.name || "",
        price: service.price || "",
        category: service.category || "",
        description: service.description || "",
        imageUrl: service.imageUrl || "",
        deliveryTime: service.deliveryTime || "",
        includes: service.includes || "",
        audience: service.audience || "",
        negotiationNote: service.negotiationNote || "",
        deliveryMode: service.deliveryMode || "remote",
        serviceDuration: service.serviceDuration || "",
        isPopular: service.isPopular ?? false,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        imageUrl: "",
        deliveryTime: "",
        includes: "",
        audience: "",
        negotiationNote: "",
        deliveryMode: "remote",
        serviceDuration: "",
        isPopular: false,
      });
    }
  }, [service, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: service?.id });
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
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/40 bg-background-elevated/90 backdrop-blur-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-surface hover:text-foreground transition">
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-foreground">
              {isEditing ? "Edit Service" : "Add Service"}
            </h2>
            <p className="text-sm text-muted mt-1">
              {isEditing ? "Update your service details" : "List a new service for buyers"}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Professional Logo Design"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
                  required
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Starting Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="₦50,000"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
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
                  placeholder="Describe the service, what's included, and what makes it unique..."
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm resize-none"
                />
              </div>

              {/* Delivery & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Delivery Time</label>
                  <input
                    type="text"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    placeholder="e.g. 3-5 days"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Duration (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.serviceDuration}
                    onChange={(e) => setFormData({ ...formData, serviceDuration: e.target.value })}
                    placeholder="e.g. 60"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Delivery Mode & Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Delivery Mode</label>
                  <select
                    value={formData.deliveryMode}
                    onChange={(e) => setFormData({ ...formData, deliveryMode: e.target.value as any })}
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
                  >
                    {DELIVERY_MODES.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Target Audience</label>
                  <input
                    type="text"
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    placeholder="e.g. New sellers leveling up their storefront"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Includes & Negotiation Note */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">What's Included</label>
                  <input
                    type="text"
                    value={formData.includes}
                    onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                    placeholder="e.g. Moodboard, Story templates, Mini brand guide (comma-separated)"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Negotiation Note</label>
                  <input
                    type="text"
                    value={formData.negotiationNote}
                    onChange={(e) => setFormData({ ...formData, negotiationNote: e.target.value })}
                    placeholder="e.g. Bulk discounts available"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/service-image.jpg"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-secondary/50 focus:outline-none focus:ring-1 focus:ring-secondary/30 transition-all shadow-sm"
                />
              </div>

              {/* Popular toggle */}
              <label className="flex items-center gap-2 rounded-xl border border-border/40 bg-background-elevated/10 px-3 py-2 cursor-pointer hover:bg-background-elevated/20 transition">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="h-4 w-4 rounded border-border/60 accent-secondary"
                />
                <span className="text-sm text-foreground/70">Mark as Popular</span>
              </label>

              {/* AI Helper */}
              <div className="rounded-xl border border-secondary/10 bg-secondary/5 p-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-secondary mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-foreground">💡 AI Service Helper</p>
                    <p className="text-xs text-muted/70 mt-0.5">
                      Services with clear pricing and delivery times get 2x more inquiries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
                <button type="button" onClick={onClose} className="rounded-full border border-border/60 px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface">
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-strong shadow-lg shadow-secondary/25">
                  {isEditing ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}