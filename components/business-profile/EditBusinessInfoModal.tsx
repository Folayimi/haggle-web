// components/business-profile/EditBusinessInfoModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================
interface BusinessInfoData {
  phone: string;
  email: string;
  website: string;
  deliveryOptions: string[];
  paymentMethods: string[];
  languages: string[];
  returnPolicy: string;
  socialLinks: { platform: string; url: string }[];
  faqs: { question: string; answer: string }[];
}

interface EditBusinessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BusinessInfoData;
  onSave: (data: BusinessInfoData) => void;
}

const SOCIAL_PLATFORMS = ["Facebook", "Instagram", "Twitter", "YouTube", "LinkedIn", "TikTok", "Pinterest"];

// ============================================
// MAIN COMPONENT
// ============================================
export default function EditBusinessInfoModal({
  isOpen,
  onClose,
  data,
  onSave,
}: EditBusinessInfoModalProps) {
  const [formData, setFormData] = useState<BusinessInfoData>({
    phone: "",
    email: "",
    website: "",
    deliveryOptions: [],
    paymentMethods: [],
    languages: [],
    returnPolicy: "",
    socialLinks: [],
    faqs: [],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || "",
        deliveryOptions: data.deliveryOptions || [],
        paymentMethods: data.paymentMethods || [],
        languages: data.languages || [],
        returnPolicy: data.returnPolicy || "",
        socialLinks: data.socialLinks || [],
        faqs: data.faqs || [],
      });
    }
  }, [isOpen, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Array helpers
  const addToArray = (field: keyof BusinessInfoData, value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()],
    }));
  };

  const removeFromArray = (field: keyof BusinessInfoData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const updateSocialLink = (index: number, field: "platform" | "url", value: string) => {
    const updated = [...formData.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: updated }));
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...formData.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, faqs: updated }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
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

            <h2 className="text-2xl font-bold text-foreground">Edit Business Information</h2>
            <p className="text-sm text-muted mt-1">Update your business details that customers see</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Contact */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/80">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted/60">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 800 123 4567"
                      className="mt-1 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted/60">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="hello@business.com"
                      className="mt-1 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted/60">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.business.com"
                    className="mt-1 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Delivery & Payment */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/80">Delivery & Payment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted/60">Delivery Options</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        placeholder="e.g. Same-day delivery"
                        className="flex-1 rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addToArray("deliveryOptions", (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                          if (input) {
                            addToArray("deliveryOptions", input.value);
                            input.value = "";
                          }
                        }}
                        className="rounded-xl bg-primary/10 px-3 text-primary hover:bg-primary/20 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formData.deliveryOptions.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary border border-primary/20">
                          {item}
                          <button type="button" onClick={() => removeFromArray("deliveryOptions", idx)} className="hover:text-danger">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted/60">Payment Methods</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        placeholder="e.g. Bank Transfer"
                        className="flex-1 rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addToArray("paymentMethods", (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                          if (input) {
                            addToArray("paymentMethods", input.value);
                            input.value = "";
                          }
                        }}
                        className="rounded-xl bg-primary/10 px-3 text-primary hover:bg-primary/20 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formData.paymentMethods.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary border border-primary/20">
                          {item}
                          <button type="button" onClick={() => removeFromArray("paymentMethods", idx)} className="hover:text-danger">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Languages</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. English, French"
                    className="flex-1 rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addToArray("languages", (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      if (input) {
                        addToArray("languages", input.value);
                        input.value = "";
                      }
                    }}
                    className="rounded-xl bg-primary/10 px-3 text-primary hover:bg-primary/20 transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.languages.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary border border-primary/20">
                      {item}
                      <button type="button" onClick={() => removeFromArray("languages", idx)} className="hover:text-danger">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Return Policy */}
              <div>
                <label className="text-sm font-medium text-foreground/80">Return Policy</label>
                <textarea
                  rows={2}
                  value={formData.returnPolicy}
                  onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                  placeholder="e.g. Returns accepted within 7 days of delivery"
                  className="mt-1.5 w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm resize-none"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground/80">Social Links</label>
                  <button type="button" onClick={addSocialLink} className="text-xs text-primary hover:text-primary-strong flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add Social
                  </button>
                </div>
                {formData.socialLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(idx, "platform", e.target.value)}
                      className="rounded-xl border border-border/60 bg-background-elevated/40 px-3 py-2 text-sm text-foreground backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm w-36"
                    >
                      <option value="">Platform</option>
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                      placeholder="https://..."
                      className="flex-1 rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-2 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                    />
                    <button type="button" onClick={() => removeSocialLink(idx)} className="text-muted/40 hover:text-danger transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* FAQs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground/80">FAQs</label>
                  <button type="button" onClick={addFaq} className="text-xs text-primary hover:text-primary-strong flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add FAQ
                  </button>
                </div>
                {formData.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-border/40 rounded-xl p-3 space-y-2 bg-background-elevated/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(idx, "question", e.target.value)}
                        placeholder="Question"
                        className="flex-1 rounded-lg border border-border/60 bg-background-elevated/30 px-3 py-1.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                      <button type="button" onClick={() => removeFaq(idx)} className="text-muted/40 hover:text-danger transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.answer}
                      onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                      placeholder="Answer"
                      className="w-full rounded-lg border border-border/60 bg-background-elevated/30 px-3 py-1.5 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                ))}
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