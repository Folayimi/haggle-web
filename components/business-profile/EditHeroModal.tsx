// components/business-profile/EditHeroModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Upload, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================
interface EditHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    fullName: string;
    username: string;
    businessName: string;
    avatarUrl: string;
    coverUrl?: string;
    category?: string;
    tagline?: string;
    location?: string;
    yearsInBusiness?: number;
    status?: "open" | "closed" | "live" | "away" | "holiday";
  };
  onSave: (updatedUser: any) => void;
}

const CATEGORIES = [
  "Fashion",
  "Electronics",
  "Food",
  "Furniture",
  "Beauty",
  "Services",
  "Education",
  "Healthcare",
  "Repairs",
  "Wholesale",
  "Art",
  "Construction",
  "Real Estate",
  "Automobile",
  "Photography",
];

const STATUSES = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "live", label: "Live" },
  { value: "away", label: "Away" },
  { value: "holiday", label: "Holiday" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function EditHeroModal({ isOpen, onClose, user, onSave }: EditHeroModalProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    username: "",
    tagline: "",
    category: "",
    location: "",
    yearsInBusiness: "",
    status: "open" as const,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatarUrl);
  const [coverPreview, setCoverPreview] = useState<string>(user.coverUrl || "");

  // Initialize form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        businessName: user.businessName || "",
        username: user.username || "",
        tagline: user.tagline || "",
        category: user.category || "",
        location: user.location || "",
        yearsInBusiness: user.yearsInBusiness?.toString() || "",
        status: user.status || "open",
      });
      setAvatarPreview(user.avatarUrl);
      setCoverPreview(user.coverUrl || "");
    }
  }, [user]);

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle cover upload
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      businessName: formData.businessName,
      username: formData.username,
      tagline: formData.tagline,
      category: formData.category,
      location: formData.location,
      yearsInBusiness: parseInt(formData.yearsInBusiness) || undefined,
      status: formData.status,
      avatarUrl: avatarPreview,
      coverUrl: coverPreview,
    };
    onSave(updatedUser);
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
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-surface hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-foreground">Edit Hero</h2>
            <p className="text-sm text-muted mt-1">Update your business identity</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Avatar & Cover Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Avatar</label>
                  <div className="mt-1.5 relative group">
                    <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-border/60 bg-background-elevated/20 overflow-hidden">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera className="h-6 w-6 text-muted/40" />
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <Upload className="h-5 w-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Cover Image</label>
                  <div className="mt-1.5 relative group">
                    <div className="aspect-[3/1] rounded-2xl border-2 border-dashed border-border/60 bg-background-elevated/20 overflow-hidden">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera className="h-6 w-6 text-muted/40" />
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <Upload className="h-5 w-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Sarah's Boutique"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Username</label>
                <div className="mt-1.5 flex items-center rounded-xl border border-border/60 bg-background-elevated/40 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all shadow-sm">
                  <span className="pl-4 text-sm text-muted/40">@</span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="sarahsboutique"
                    className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted/40 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Premium fashion for every occasion"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Lagos, Nigeria"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Years in Business & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Years in Business</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.yearsInBusiness}
                    onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                    placeholder="e.g. 5"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
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
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}