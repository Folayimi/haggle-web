// components/business-profile/EditHeroModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Upload, Camera, Plus, Trash2 } from "lucide-react";
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
    hero?: {
      slogan?: string;
      category?: string;
      status?: "open" | "closed" | "live" | "away" | "holiday";
      location?: string;
      yearsInBusiness?: number;
      businessHours?: { day: string; open: string; close: string; isClosed: boolean }[];
      deliveryRadius?: number;
      averageResponseTime?: string;
      verifiedBadge?: boolean;
    };
  };
  onSave: (updatedUser: any) => void;
}

const CATEGORIES = [
  "Fashion", "Electronics", "Food", "Furniture", "Beauty",
  "Services", "Education", "Healthcare", "Repairs", "Wholesale",
  "Art", "Construction", "Real Estate", "Automobile", "Photography"
];

const STATUSES = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "live", label: "Live" },
  { value: "away", label: "Away" },
  { value: "holiday", label: "Holiday" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ============================================
// MAIN COMPONENT
// ============================================
export default function EditHeroModal({ isOpen, onClose, user, onSave }: EditHeroModalProps) {
  // --- Form State ---
  const [formData, setFormData] = useState({
    businessName: "",
    username: "",
    slogan: "",
    category: "",
    location: "",
    yearsInBusiness: "",
    status: "open" as const,
    deliveryRadius: "",
    averageResponseTime: "",
    verifiedBadge: false,
  });

  const [businessHours, setBusinessHours] = useState<
    { day: string; open: string; close: string; isClosed: boolean }[]
  >([]);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatarUrl);
  const [coverPreview, setCoverPreview] = useState<string>(user.coverUrl || "");

  // Initialize form
  useEffect(() => {
    if (user) {
      const hero = user.hero || {};
      setFormData({
        businessName: user.businessName || "",
        username: user.username || "",
        slogan: hero.slogan || "",
        category: hero.category || "",
        location: hero.location || "",
        yearsInBusiness: hero.yearsInBusiness?.toString() || "",
        status: hero.status || "open",
        deliveryRadius: hero.deliveryRadius?.toString() || "",
        averageResponseTime: hero.averageResponseTime || "",
        verifiedBadge: hero.verifiedBadge ?? false,
      });
      setBusinessHours(hero.businessHours || DAYS.map(day => ({
        day,
        open: "09:00",
        close: "17:00",
        isClosed: day === "Sunday",
      })));
      setAvatarPreview(user.avatarUrl);
      setCoverPreview(user.coverUrl || "");
    }
  }, [user]);

  // Handlers for hours
  const updateHour = (index: number, field: string, value: any) => {
    const updated = [...businessHours];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessHours(updated);
  };

  const toggleClosed = (index: number) => {
    const updated = [...businessHours];
    updated[index].isClosed = !updated[index].isClosed;
    setBusinessHours(updated);
  };

  // File upload handlers
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

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
      avatarUrl: avatarPreview,
      coverUrl: coverPreview,
      hero: {
        slogan: formData.slogan,
        category: formData.category,
        status: formData.status,
        location: formData.location,
        yearsInBusiness: parseInt(formData.yearsInBusiness) || undefined,
        businessHours,
        deliveryRadius: parseFloat(formData.deliveryRadius) || undefined,
        averageResponseTime: formData.averageResponseTime || undefined,
        verifiedBadge: formData.verifiedBadge,
      },
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
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/40 bg-background-elevated/90 backdrop-blur-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-surface hover:text-foreground transition">
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
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera className="h-6 w-6 text-muted/40" />
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <Upload className="h-5 w-5 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Cover Image</label>
                  <div className="mt-1.5 relative group">
                    <div className="aspect-[3/1] rounded-2xl border-2 border-dashed border-border/60 bg-background-elevated/20 overflow-hidden">
                      {coverPreview ? (
                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera className="h-6 w-6 text-muted/40" />
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <Upload className="h-5 w-5 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground/80">Username</label>
                  <div className="mt-1.5 flex items-center rounded-xl border border-border/60 bg-background-elevated/40 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all shadow-sm">
                    <span className="pl-4 text-sm text-muted/40">@</span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Slogan</label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                    placeholder="e.g. Premium fashion for every occasion"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  />
                </div>
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
              </div>

              {/* Location, Years, Status, Delivery Radius, Response Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="text-sm font-medium text-foreground/80">Years in Business</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.yearsInBusiness}
                    onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="text-sm font-medium text-foreground/80">Delivery Radius (km)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.deliveryRadius}
                    onChange={(e) => setFormData({ ...formData, deliveryRadius: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80">Avg Response Time</label>
                  <input
                    type="text"
                    value={formData.averageResponseTime}
                    onChange={(e) => setFormData({ ...formData, averageResponseTime: e.target.value })}
                    placeholder="e.g. 12m"
                    className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 rounded-xl border border-border/40 bg-background-elevated/10 px-4 py-3 cursor-pointer hover:bg-background-elevated/20 transition w-full">
                    <input
                      type="checkbox"
                      checked={formData.verifiedBadge}
                      onChange={(e) => setFormData({ ...formData, verifiedBadge: e.target.checked })}
                      className="h-4 w-4 rounded border-border/60 accent-primary"
                    />
                    <span className="text-sm text-foreground/70">Verified Badge</span>
                  </label>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Business Hours</label>
                <div className="mt-2 space-y-2">
                  {businessHours.map((item, idx) => (
                    <div key={item.day} className="flex items-center gap-2 flex-wrap">
                      <span className="w-24 text-sm text-foreground/70">{item.day}</span>
                      <label className="flex items-center gap-1.5 text-xs text-muted/60">
                        <input
                          type="checkbox"
                          checked={item.isClosed}
                          onChange={() => toggleClosed(idx)}
                          className="h-3.5 w-3.5 rounded accent-primary"
                        />
                        Closed
                      </label>
                      {!item.isClosed && (
                        <>
                          <input
                            type="time"
                            value={item.open}
                            onChange={(e) => updateHour(idx, 'open', e.target.value)}
                            className="rounded border border-border/60 bg-background-elevated/40 px-2 py-1 text-sm w-24"
                          />
                          <span className="text-xs text-muted/40">—</span>
                          <input
                            type="time"
                            value={item.close}
                            onChange={(e) => updateHour(idx, 'close', e.target.value)}
                            className="rounded border border-border/60 bg-background-elevated/40 px-2 py-1 text-sm w-24"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
                <button type="button" onClick={onClose} className="rounded-full border border-border/60 px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface">
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong shadow-lg shadow-primary/25">
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