"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Home,
  ImagePlus,
  MapPin,
  Package,
  Save,
  Sparkles,
  Tag,
  TrendingUp,
  X,
  Upload,
  Star,
  CheckCircle,
  Handshake,
  Scale,
  Shield,
  ShoppingBag,
  Eye,
  Briefcase,
  Users,
  Video,
  Wifi,
  Battery,
  Smartphone,
  Link as LinkIcon,
  ArrowRight,
  Building2,
  User,
  Award,
  Zap,
  Lightbulb,
  Target,
  Heart,
  ThumbsUp,
  Clock as ClockIcon,
  Timer,
  Mic,
  MessageCircle,
  Plus,
  Rocket,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";
import {
  getApplicableCategoryTags,
  SERVICE_CATEGORIES,
  type Subcategory,
} from "@/types/categories";
import { ProductMedia, ProductMediaRef, GalleryImage } from "@/components/ProductMedia";
import {
  createCategory,
  createListing,
  getAllCategories,
  getCategory,
  getListing,
  updateListing,
} from "@/services/request";
import { notifyApiError } from "@/services/toastify";
import { useHaggleStore } from "@/lib/app-store";
import Loader from "@/reusables/loader";
import { useRouter } from "next/navigation";
import { resolveListingMediaUrl } from "@/services/mappers";

// ============================================
// TYPES
// ============================================
type TabId = "tell" | "offer" | "show";
type WorkLocation = "home" | "workshop";
type TargetAudience =
  | "general"
  | "businesses"
  | "individuals"
  | "creators"
  | "students"
  | "startups"
  | "professionals";
type NegotiationStyle = "FIXED" | "NEGOTIABLE" | "COUNTER";

// ============================================
// CONSTANTS
// ============================================
const SERVICE_TIPS = [
  { icon: "🎯", text: "Show your best work first." },
  { icon: "💡", text: "People buy confidence before they buy skills." },
  { icon: "🤝", text: "Your first image is your handshake." },
  { icon: "💰", text: "Specific pricing reduces unnecessary negotiations." },
  { icon: "🎬", text: "A short video can answer questions before buyers ask." },
];

const TARGET_AUDIENCES = [
  { id: "general", label: "Everyone", icon: Users },
  { id: "businesses", label: "Businesses", icon: Building2 },
  { id: "individuals", label: "Individuals", icon: User },
  { id: "creators", label: "Creators", icon: Sparkles },
  { id: "students", label: "Students", icon: Users },
  { id: "startups", label: "Startups", icon: Rocket },
  { id: "professionals", label: "Professionals", icon: Briefcase },
];

const CONFIDENCE_MESSAGES = {
  details: {
    good: "Great! Buyers prefer detailed descriptions.",
    neutral: "Add more details to build trust.",
    empty: "Tell buyers what makes your service unique.",
  },
  pricing: {
    good: "Clear pricing builds confidence.",
    neutral: "Add a delivery timeframe and negotiation details.",
    empty: "Set your pricing to start receiving offers.",
  },
  media: {
    good: "Excellent portfolio! Listings like yours get 2.3× more enquiries.",
    neutral: "Add more work samples to showcase your expertise.",
    empty: "Show your best work first.",
  },
};

// ============================================
// UI COMPONENTS
// ============================================

// ============================================
// GLASSY FIELD
// ============================================
function GlassyField({
  label,
  placeholder,
  multiline = false,
  optional = false,
  icon,
  prominent = false,
  inputType = "text",
  value,
  onChange,
  helper,
  className,
  error,
  ...props
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
  optional?: boolean;
  icon?: React.ReactNode;
  prominent?: boolean;
  inputType?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  helper?: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "font-medium text-foreground/80",
            prominent ? "text-base" : "text-sm",
          )}
        >
          {label}
        </span>
        {optional && (
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted/50">
            Optional
          </span>
        )}
        {icon && <span className="text-muted/30">{icon}</span>}
      </div>
      {multiline ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            `
            w-full rounded-xl
            border border-border/60 bg-background-elevated/40
            px-4 py-3 text-sm text-foreground
            placeholder:text-muted/40
            backdrop-blur-sm
            transition-all duration-200
            focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30
            resize-none
            shadow-sm
          `,
            prominent && "text-base py-3.5",
            error && "border-danger/50 focus:border-danger/50 focus:ring-danger/30",
          )}
          {...props}
        />
      ) : (
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            `
            w-full rounded-xl
            border border-border/60 bg-background-elevated/40
            px-4 py-3 text-sm text-foreground
            placeholder:text-muted/40
            backdrop-blur-sm
            transition-all duration-200
            focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30
            shadow-sm
          `,
            prominent && "text-base py-3.5",
            error && "border-danger/50 focus:border-danger/50 focus:ring-danger/30",
          )}
          {...props}
        />
      )}
      {helper && <div className="mt-1 text-xs text-muted/60">{helper}</div>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

// ============================================
// GLASSY SELECT
// ============================================
function GlassySelect({
  label,
  options,
  placeholder,
  optional = false,
  onChange,
  value,
  error,
}: {
  label: string;
  options: Array<string | { id: string; name: string }>;
  placeholder: string;
  optional?: boolean;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground/80">{label}</span>
        {optional && (
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted/50">
            Optional
          </span>
        )}
      </div>
      <Select
        items={options.map((item) => ({
          label: typeof item === "string" ? item : item.name,
          value: typeof item === "string" ? item : item.name,
        }))}
      >
        <SelectTrigger
          className={cn(`
            relative w-full rounded-xl
            border border-border/60 bg-background-elevated/40
            px-4 py-6 text-sm text-foreground
            backdrop-blur-sm
            transition-all duration-200
            focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30
            text-left flex items-center justify-between
            shadow-sm
          `, error && "border-danger/50 focus:border-danger/50 focus:ring-danger/30")}
        >
          <SelectValue placeholder={value ? value : placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="bg-popover">
            {options.map((item) => {
              const optionValue =
                typeof item === "string" ? item : item.name;
              return (
                <SelectItem
                  key={typeof item === "string" ? item : item.id}
                  value={optionValue}
                  className="w-full px-4 py-2 text-left text-sm text-foreground focus:bg-primary/5 hover:bg-primary/5 transition"
                  onClick={() => onChange(optionValue)}
                >
                  {optionValue}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

// ============================================
// TARGET AUDIENCE PICKER (Multi-Select)
// ============================================
function TargetAudiencePicker({
  value,
  onChange,
}: {
  value: TargetAudience;
  onChange: (value: TargetAudience) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-foreground/80">
        Who is this service for?
      </span>
      <div className="flex flex-wrap gap-2">
        {TARGET_AUDIENCES.map((audience) => {
          const Icon = audience.icon;
          const isSelected = value === audience.id;
          return (
            <button
              key={audience.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(audience.id as TargetAudience)}
              className={`
                rounded-xl border px-4 py-2.5 transition-all duration-200 flex items-center gap-2
                ${
                  isSelected
                    ? "border-primary/50 bg-primary/10 shadow-sm shadow-primary/5"
                    : "border-border/40 bg-background-elevated/20 hover:border-border/60"
                }
              `}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isSelected ? "text-primary" : "text-muted/40",
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-foreground" : "text-muted/60",
                )}
              >
                {audience.label}
              </span>
              {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// WORK LOCATION TOGGLE
// ============================================
function WorkLocationToggle({
  value,
  onChange,
}: {
  value: WorkLocation;
  onChange: (value: WorkLocation) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-foreground/80">
        Where do you work?
      </span>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange("home")}
          className={`
            rounded-xl border p-3 text-left transition-all duration-200 flex items-center gap-3
            ${
              value === "home"
                ? "border-primary/50 bg-primary/10 shadow-sm shadow-primary/5"
                : "border-border/40 bg-background-elevated/20 hover:border-border/60"
            }
          `}
        >
          <div
            className={cn(
              "rounded-full p-1.5",
              value === "home"
                ? "bg-primary/20 text-primary"
                : "bg-background-elevated/40 text-muted/40",
            )}
          >
            <Home className="h-4 w-4" />
          </div>
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                value === "home" ? "text-foreground" : "text-muted/60",
              )}
            >
              From Home
            </p>
            <p className="text-[10px] text-muted/40">
              Work remotely or from home
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange("workshop")}
          className={`
            rounded-xl border p-3 text-left transition-all duration-200 flex items-center gap-3
            ${
              value === "workshop"
                ? "border-primary/50 bg-primary/10 shadow-sm shadow-primary/5"
                : "border-border/40 bg-background-elevated/20 hover:border-border/60"
            }
          `}
        >
          <div
            className={cn(
              "rounded-full p-1.5",
              value === "workshop"
                ? "bg-primary/20 text-primary"
                : "bg-background-elevated/40 text-muted/40",
            )}
          >
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                value === "workshop" ? "text-foreground" : "text-muted/60",
              )}
            >
              Workshop / Studio
            </p>
            <p className="text-[10px] text-muted/40">
              Physical location for clients
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

function ServiceNegotiationPicker({
  value,
  onChange,
}: {
  value: NegotiationStyle;
  onChange: (value: NegotiationStyle) => void;
}) {
  const options: {
    value: NegotiationStyle;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "FIXED",
      label: "Fixed",
      description: "Price is firm",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      value: "NEGOTIABLE",
      label: "Negotiable",
      description: "Open to offers",
      icon: <Handshake className="h-4 w-4" />,
    },
    {
      value: "COUNTER",
      label: "Counter offers",
      description: "You can make a counter offer",
      icon: <Scale className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-foreground/80">
        Negotiation Style
      </span>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-xl border p-3 text-left transition-all",
                selected
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/40 bg-background-elevated/20 hover:border-border/60",
              )}
            >
              <span className="flex items-center gap-2">
                <span className={selected ? "text-primary" : "text-muted/40"}>
                  {option.icon}
                </span>
                <span className="text-sm font-medium">{option.label}</span>
              </span>
              <span className="mt-1 block text-[10px] text-muted/50">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// SERVICE MEDIA UPLOAD (With Two-Option Flow)
// ============================================
type MediaMode = "choose" | "upload" | "connect";

const PORTFOLIO_SLOTS = [
  {
    id: "hero",
    label: "Hero Image",
    starred: true,
    tip: "This is what buyers notice first.",
    emoji: "📸",
  },
  {
    id: "work1",
    label: "Sample 1",
    starred: true,
    tip: "Before & After · Recommended",
    emoji: "🔄",
  },
  {
    id: "work2",
    label: "Sample 2",
    starred: true,
    tip: "Finished Project · Recommended",
    emoji: "✨",
  },
  {
    id: "work3",
    label: "Sample 3",
    starred: false,
    tip: "Add variety to your portfolio",
    emoji: "🎨",
  },
  {
    id: "work4",
    label: "Sample 4",
    starred: false,
    tip: "Show your range",
    emoji: "📐",
  },
  {
    id: "video",
    label: "Video Walkthrough",
    starred: false,
    tip: "30 second walkthrough · Highest engagement",
    emoji: "🎬",
  },
];

function ServiceMediaUpload({
  onImagesChange,
}: {
  onImagesChange?: (images: Record<string, string>) => void;
}) {
  const [images, setImages] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<MediaMode>("choose");
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "scanning" | "connected"
  >("idle");
  const [deviceName, setDeviceName] = useState<string | null>(null);

  useEffect(() => {
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  const handleFileSelect = (slotId: string) => {
    document.getElementById(`file-upload-service-${slotId}`)?.click();
  };

  const handleFileChange = (
    slotId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => ({
          ...prev,
          [slotId]: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (slotId: string) => {
    const newImages = { ...images };
    delete newImages[slotId];
    setImages(newImages);
  };

  const startPhoneConnection = () => {
    setMode("connect");
    setConnectionStatus("scanning");
    setTimeout(() => {
      setConnectionStatus("connected");
      setDeviceName("Ridwan's iPhone 15 Pro");
    }, 3000);
  };

  const goBack = () => {
    setMode("choose");
    setConnectionStatus("idle");
    setDeviceName(null);
  };

  const uploadedCount = PORTFOLIO_SLOTS.filter(
    (slot) => images[slot.id],
  ).length;
  const totalSlots = PORTFOLIO_SLOTS.length;

  // Portfolio Strength calculation
  const getStrength = () => {
    const ratio = uploadedCount / totalSlots;
    if (ratio >= 0.8)
      return { label: "Excellent", emoji: "🌟", color: "text-success" };
    if (ratio >= 0.5)
      return { label: "Good", emoji: "👍", color: "text-primary" };
    if (ratio >= 0.3)
      return { label: "Getting there", emoji: "📈", color: "text-warning" };
    return { label: "Add more", emoji: "📸", color: "text-muted" };
  };

  const strength = getStrength();

  return (
    <div className="space-y-3">
      {/* Portfolio Strength */}
      {uploadedCount > 0 && (
        <div className="rounded-xl bg-primary/5 p-3 border border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{strength.emoji}</span>
              <span className="text-sm font-medium text-foreground">
                Portfolio Strength
              </span>
              <span className={cn("text-sm font-semibold", strength.color)}>
                {strength.label}
              </span>
            </div>
            <span className="text-xs text-muted/40">
              {uploadedCount}/{totalSlots}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${(uploadedCount / totalSlots) * 100}%` }}
            />
          </div>
          {uploadedCount >= 5 && (
            <p className="mt-1.5 text-[10px] text-success/70">
              ⚡ Excellent! Listings like yours receive 2.3× more enquiries.
            </p>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {mode === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-3"
          >
            {/* Drag & Drop */}
            <div
              className="
                rounded-xl border-2 border-dashed border-border/30
                bg-background-elevated/10 p-3
                hover:border-primary/30 transition-all cursor-pointer
                flex flex-col items-center justify-center min-h-[100px]
              "
              onClick={() => setMode("upload")}
            >
              <Upload className="h-5 w-5 text-muted/30" />
              <p className="mt-1 text-xs font-medium text-foreground/60">
                Browse Files
              </p>
              <p className="text-[10px] text-muted/40">Upload from computer</p>
            </div>

            {/* Connect Phone */}
            <div
              className="
                rounded-xl border-2 border-border/30
                bg-background-elevated/10 p-3
                hover:border-primary/30 transition-all cursor-pointer
                flex flex-col items-center justify-center min-h-[100px]
              "
              onClick={startPhoneConnection}
            >
              <Smartphone className="h-5 w-5 text-muted/30" />
              <p className="mt-1 text-xs font-medium text-foreground/60">
                Connect Phone
              </p>
              <p className="text-[10px] text-muted/40">Scan QR to capture</p>
            </div>
          </motion.div>
        )}

        {mode === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Back button */}
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-xs text-muted/60 hover:text-foreground transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to options
            </button>

            {/* Upload grid */}
            <div className="grid grid-cols-3 gap-2">
              {PORTFOLIO_SLOTS.map((slot) => {
                const image = images[slot.id];
                return (
                  <div
                    key={slot.id}
                    onClick={() => handleFileSelect(slot.id)}
                    className={`
                      relative rounded-lg aspect-square
                      border-2 transition-all duration-200
                      ${
                        image
                          ? "border-border/40 bg-background-elevated/30"
                          : "border-border/30 bg-background-elevated/10 hover:border-primary/30"
                      }
                      flex items-center justify-center
                      overflow-hidden
                      cursor-pointer
                      group
                    `}
                  >
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt={slot.label}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(slot.id);
                          }}
                          className="absolute top-0.5 right-0.5 rounded-full bg-danger/90 p-0.5 text-white hover:bg-danger"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <span className="text-lg">{slot.emoji}</span>
                        <p className="mt-0.5 text-[9px] font-medium text-muted/40">
                          {slot.label}
                        </p>
                        <p className="text-[7px] text-muted/30 leading-tight px-1">
                          {slot.tip}
                        </p>
                        {slot.starred && (
                          <Star className="mx-auto mt-0.5 h-2.5 w-2.5 text-yellow-400/60" />
                        )}
                      </div>
                    )}
                    <input
                      id={`file-upload-service-${slot.id}`}
                      type={slot.id === "video" ? "file" : "file"}
                      accept={slot.id === "video" ? "video/*" : "image/*"}
                      className="hidden"
                      onChange={(e) => handleFileChange(slot.id, e)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Drag & Drop area inside upload mode */}
            <div
              className="
                rounded-xl border-2 border-dashed border-border/30
                bg-background-elevated/10 p-3
                hover:border-primary/30 transition-all cursor-pointer
                flex items-center justify-center gap-3
              "
              onClick={() =>
                document.getElementById("file-upload-global-service")?.click()
              }
            >
              <Upload className="h-4 w-4 text-muted/30" />
              <span className="text-xs text-muted/60">
                Drop more files or click to browse
              </span>
              <input
                id="file-upload-global-service"
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const emptySlots = PORTFOLIO_SLOTS.filter(
                      (slot) => !images[slot.id],
                    );
                    Array.from(files).forEach((file, index) => {
                      if (index < emptySlots.length) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setImages((prev) => ({
                            ...prev,
                            [emptySlots[index].id]: ev.target?.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    });
                  }
                }}
              />
            </div>

            {/* Supported formats */}
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-muted/40">Supported:</span>
                <span className="rounded-full bg-background-elevated/40 px-1.5 py-0.5 text-[8px] font-medium text-foreground/60 border border-border/30">
                  PNG
                </span>
                <span className="rounded-full bg-background-elevated/40 px-1.5 py-0.5 text-[8px] font-medium text-foreground/60 border border-border/30">
                  JPG
                </span>
                <span className="rounded-full bg-background-elevated/40 px-1.5 py-0.5 text-[8px] font-medium text-foreground/60 border border-border/30">
                  WEBP
                </span>
                <span className="rounded-full bg-background-elevated/40 px-1.5 py-0.5 text-[8px] font-medium text-foreground/60 border border-border/30">
                  MP4
                </span>
              </div>
              <span className="text-[8px] text-muted/40">⭐ = Recommended</span>
            </div>
          </motion.div>
        )}

        {mode === "connect" && (
          <motion.div
            key="connect"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Back button */}
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-xs text-muted/60 hover:text-foreground transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to options
            </button>

            {/* QR Code & Connection Status */}
            <div className="rounded-xl border border-border/40 bg-background-elevated/20 p-4">
              <div className="flex items-center gap-6">
                <div className="shrink-0">
                  <div className="rounded-xl bg-[#1a1a1a] p-3">
                    <QRCodeSVG
                      value={`https://haggle.app/connect/${crypto.randomUUID()}`}
                      size={100}
                      level="H"
                      bgColor="#1a1a1a"
                      fgColor="#ffffff"
                    />
                  </div>
                  <p className="mt-1 text-[8px] text-center text-muted/40">
                    Scan with Haggle app
                  </p>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <LinkIcon className="h-3 w-3 text-primary" />
                    {connectionStatus === "connected"
                      ? "Connected!"
                      : "Waiting for device..."}
                  </p>
                  {connectionStatus === "connected" && deviceName && (
                    <p className="text-xs text-muted/60 flex items-center gap-2">
                      <span>{deviceName}</span>
                      <span className="flex items-center gap-1 text-[10px] text-success">
                        <CheckCircle className="h-3 w-3" />
                        Live
                      </span>
                    </p>
                  )}
                  <ol className="space-y-0.5 text-[10px] text-muted/50">
                    <li className="flex items-center gap-1.5">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/10 text-[7px] font-bold text-primary">
                        1
                      </span>
                      Open Haggle app on your phone
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/10 text-[7px] font-bold text-primary">
                        2
                      </span>
                      Tap <strong className="text-foreground/70">Upload</strong>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/10 text-[7px] font-bold text-primary">
                        3
                      </span>
                      Scan this QR code
                    </li>
                  </ol>
                  {connectionStatus === "scanning" && (
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted/40">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      Establishing secure connection...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload grid (still accessible when connected) */}
            <div className="grid grid-cols-3 gap-2">
              {PORTFOLIO_SLOTS.slice(0, 3).map((slot) => {
                const image = images[slot.id];
                return (
                  <div
                    key={slot.id}
                    className={`
                      relative rounded-lg aspect-square
                      border-2 transition-all duration-200
                      ${
                        image
                          ? "border-border/40 bg-background-elevated/30"
                          : "border-border/30 bg-background-elevated/10"
                      }
                      flex items-center justify-center
                      overflow-hidden
                    `}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={slot.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-lg">{slot.emoji}</span>
                        <p className="mt-0.5 text-[9px] text-muted/40">
                          {slot.label}
                        </p>
                        <p className="text-[7px] text-muted/30 leading-tight px-1">
                          Waiting...
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Simulate phone upload button */}
            {connectionStatus === "connected" && (
              <button
                onClick={() => {
                  const emptySlot = PORTFOLIO_SLOTS.find(
                    (slot) => !images[slot.id],
                  );
                  if (emptySlot) {
                    const placeholderImage =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50' y='110' font-family='Arial' font-size='20' fill='%23999'%3E📸%3C/text%3E%3C/svg%3E";
                    setImages((prev) => ({
                      ...prev,
                      [emptySlot.id]: placeholderImage,
                    }));
                  }
                }}
                className="w-full rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition"
              >
                📱 Simulate Phone Upload
              </button>
            )}

            {/* Supported formats */}
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-muted/40">Supported:</span>
                <span className="rounded-full bg-background-elevated/40 px-1.5 py-0.5 text-[8px] font-medium text-foreground/60 border border-border/30">
                  PNG
                </span>
                <span className="rounded-full bg-background-elevated/40 px-1.5 py-0.5 text-[8px] font-medium text-foreground/60 border border-border/30">
                  JPG
                </span>
                <span className="rounded-full bg-background-elevated/40 px-1.5 py-0.5 text-[8px] font-medium text-foreground/60 border border-border/30">
                  WEBP
                </span>
                <span className="rounded-full bg-background-elevated/40 px-1.5 py-0.5 text-[8px] font-medium text-foreground/60 border border-border/30">
                  MP4
                </span>
              </div>
              <span className="text-[8px] text-muted/40">⭐ = Recommended</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// CONFIDENCE INDICATOR
// ============================================
function ConfidenceIndicator({
  status,
  message,
}: {
  status: "empty" | "neutral" | "good";
  message: string;
}) {
  const config = {
    empty: {
      icon: Lightbulb,
      color: "text-muted/40",
      bg: "bg-background-elevated/10",
    },
    neutral: { icon: MessageCircle, color: "text-warning", bg: "bg-warning/5" },
    good: { icon: ThumbsUp, color: "text-success", bg: "bg-success/5" },
  };

  const { icon: Icon, color, bg } = config[status];

  return (
    <div className={cn("flex items-center gap-2 rounded-xl px-3 py-2", bg)}>
      <Icon className={cn("h-3.5 w-3.5", color)} />
      <span className="text-[10px] text-muted/70">{message}</span>
    </div>
  );
}

// ============================================
// TAB COMPONENT (Conversational Names)
// ============================================
function TabButton({
  id,
  label,
  active,
  onClick,
  completed = false,
  number,
}: {
  id: TabId;
  label: string;
  active: boolean;
  onClick: () => void;
  completed?: boolean;
  number: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative pb-2 text-sm font-medium transition-colors flex items-center gap-2
        ${active ? "text-foreground" : "text-muted/60 hover:text-foreground/80"}
      `}
    >
      {completed ? (
        <CheckCircle className="h-4 w-4 text-success" />
      ) : (
        <span className="text-[10px] font-mono text-muted/40">{number}</span>
      )}
      {label}
      <span
        className={`
          absolute bottom-0 left-0 h-0.5 w-full rounded-full
          bg-primary transition-all duration-300
          ${active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
        `}
      />
    </button>
  );
}

// ============================================
// COMPLETION SUMMARY (Smart Progress)
// ============================================
function CompletionSummary({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percentage = Math.round((completed / total) * 100);
  const remaining = total - completed;

  const getMessage = () => {
    if (percentage === 100) return "🎉 All done! Ready to publish.";
    if (percentage >= 66)
      return `🌟 Almost there! ${remaining} step${remaining > 1 ? "s" : ""} left`;
    if (percentage >= 33)
      return `📝 You're making progress! ${remaining} step${remaining > 1 ? "s" : ""} left`;
    if (percentage === 0)
      return "✨ Start by telling buyers about your service";
    return `⏳ ${remaining} step${remaining > 1 ? "s" : ""} remaining`;
  };

  const getTimeEstimate = () => {
    if (percentage === 0) return "~2 minutes remaining";
    if (percentage >= 100) return "";
    const minutes = Math.max(1, Math.round((remaining / total) * 2));
    return `~${minutes} minute${minutes > 1 ? "s" : ""} remaining`;
  };

  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-2 rounded-full border border-border/40 bg-background-elevated/20 backdrop-blur-sm shadow-sm">
      <span className="text-xs font-medium text-foreground/60">
        Service Progress
      </span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-5 rounded-full transition-all ${
              i < completed ? "bg-primary" : "bg-border/40"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-foreground">
        {percentage}%
      </span>
      <span className="hidden sm:inline text-[10px] text-muted/40">
        {getMessage()}
      </span>
      <span className="hidden sm:inline text-[10px] text-muted/40">
        · {getTimeEstimate()}
      </span>
    </div>
  );
}

// ============================================
// SMART SAVE DRAFT BUTTON
// ============================================
function SmartSaveButton({
  onSave,
  saving,
  lastSaved,
}: {
  onSave: () => void;
  saving: boolean;
  lastSaved: Date | null;
}) {
  const saved = !saving && lastSaved !== null;

  const getTimeAgo = () => {
    if (!lastSaved) return "";
    const seconds = Math.floor(
      (new Date().getTime() - lastSaved.getTime()) / 1000,
    );
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className={`
        rounded-full border border-border/60
        px-4 py-2 text-sm font-medium
        transition-all duration-300
        flex items-center gap-2
        ${
          saved
            ? "bg-success/10 text-success border-success/30"
            : saving
              ? "bg-primary/10 text-primary border-primary/30"
              : "text-muted/70 hover:bg-surface hover:text-foreground"
        }
        shadow-sm
      `}
    >
      {saved ? (
        <>
          <Check className="h-4 w-4" />
          <span>Draft saved {getTimeAgo()}</span>
        </>
      ) : saving ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          <span>Save Draft</span>
        </>
      )}
    </button>
  );
}

// ============================================
// ROTATING SELLER TIP (Mentor Voice)
// ============================================
function RotatingSellerTip() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SERVICE_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tip = SERVICE_TIPS[currentIndex];

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2 text-xs text-muted/60"
    >
      <span>{tip.icon}</span>
      <span className="italic">&quot;{tip.text}&quot;</span>
    </motion.div>
  );
}

// ============================================
// AI TITLE SUGGESTION
// ============================================
function AITitleSuggestion({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = [
    "Professional Logo Design for Startups & Brands",
    "Complete Brand Identity Package with 50% Faster Delivery",
    "Expert Logo Design + Brand Guidelines & Social Kit",
    "Minimalist Logo Design for Modern Businesses",
  ];

  const handleSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  if (!value || value.length < 3) {
    return null;
  }

  return (
    <div className="mt-1.5">
      <button
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="flex items-center gap-1.5 text-[10px] text-muted/40 hover:text-primary transition"
      >
        <Sparkles className="h-3 w-3" />
        <span>AI title suggestions available</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            showSuggestions && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-2 space-y-1.5"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestion(suggestion)}
                className="w-full rounded-xl border border-border/40 bg-background-elevated/20 p-2 text-left text-xs text-foreground/80 hover:border-primary/30 hover:bg-primary/5 transition group flex items-center justify-between"
              >
                <span>{suggestion}</span>
                <span className="text-[8px] text-muted/40 group-hover:text-primary transition">
                  Use
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// PRICE PACKAGE CARD (Visual Connection)
// ============================================
function PricePackageCard({
  basePrice,
  deliveryTime,
  onPriceChange,
  onDeliveryChange,
  priceError,
  deliveryError,
}: {
  basePrice: string;
  deliveryTime: string;
  onPriceChange: (value: string) => void;
  onDeliveryChange: (value: string) => void;
  priceError?: string;
  deliveryError?: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-background-elevated/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Package className="h-4 w-4 text-primary/60" />
        <span className="text-sm font-medium text-foreground">
          Base Package
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted/40">Price</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="₦50,000"
            value={basePrice}
            onChange={(e) => onPriceChange(e.target.value)}
            className={cn(
              "w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 shadow-sm mt-1",
              priceError && "border-danger/50 focus:border-danger/50 focus:ring-danger/30",
            )}
          />
          {priceError && <p className="mt-1 text-xs text-danger">{priceError}</p>}
        </div>
        <div>
          <label className="text-xs text-muted/40">Delivery</label>
          <input
            type="text"
            placeholder="3-5 days"
            value={deliveryTime}
            onChange={(e) => onDeliveryChange(e.target.value)}
            className={cn(
              "w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground placeholder:text-muted/40 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 shadow-sm mt-1",
              deliveryError && "border-danger/50 focus:border-danger/50 focus:ring-danger/30",
            )}
          />
          {deliveryError && (
            <p className="mt-1 text-xs text-danger">{deliveryError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SERVICE CARD PREVIEW (Real Haggle Card)
// ============================================
function ServiceCardPreview({
  serviceName = "Your Service Name",
  price = "From ₦50,000",
  category = "Creative Services",
  location = "Remote",
  negotiationStyle = "NEGOTIABLE",
  rating = 4.9,
  reviews = 8,
  imageCount = 0,
  deliveryTime = "3-5 days",
}: {
  serviceName?: string;
  price?: string;
  category?: string;
  location?: string;
  negotiationStyle?: NegotiationStyle;
  rating?: number;
  reviews?: number;
  imageCount?: number;
  deliveryTime?: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-background-elevated/20 overflow-hidden shadow-sm">
      {/* Image area */}
      <div className="aspect-video bg-gradient-to-br from-secondary/10 via-background/20 to-primary/10 flex items-center justify-center relative">
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[8px] font-medium text-secondary border border-secondary/20">
            Service
          </span>
          <span className="rounded-full bg-success/20 px-2 py-0.5 text-[8px] font-medium text-success border border-success/20">
            {negotiationStyle === "FIXED"
              ? "Fixed"
              : negotiationStyle === "COUNTER"
                ? "Counter offers"
                : "Negotiable"}
          </span>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-white/80">{rating}</span>
          <span className="text-[10px] text-white/40">({reviews})</span>
        </div>
        <div className="text-center">
          <Briefcase className="mx-auto h-8 w-8 text-muted/20" />
          <p className="text-xs text-muted/40 mt-1">
            {imageCount > 0
              ? `${imageCount} images · Ready`
              : "Add images to preview"}
          </p>
        </div>
        {deliveryTime && (
          <div className="absolute bottom-2 left-2">
            <span className="rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[8px] text-white/70 border border-white/10">
              ⏱ {deliveryTime}
            </span>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground line-clamp-1">
              {serviceName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-secondary">{price}</span>
              <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[8px] font-medium text-secondary border border-secondary/20">
                {category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-muted/40">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </span>
          <span className="h-3 w-px bg-border/30" />
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            12 clients served
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STICKY HEADER (Fixed background & button logic)
// ============================================
function StickyHeader({
  activeTab,
  onSave,
  onCancel,
  onNext,
  title,
  saving,
  lastSaved,
}: {
  activeTab: TabId;
  onSave: () => void;
  onCancel?: () => void;
  onNext: () => void;
  title?: string;
  saving: boolean;
  lastSaved: Date | null;
}) {
  // Button text based on active tab
  const getButtonText = () => {
    if (activeTab === "tell") return "Next: Set your offer →";
    if (activeTab === "offer") return "Next: Show your work →";
    return "Publish Service";
  };

  return (
    <div
      className="
        sticky top-0 z-30
        bg-background/20 backdrop-blur        
        rounded-full
        px-3 py-3 lg:px-6
        flex items-center justify-between
        -mx-3 lg:-mx-6
      "
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="
            rounded-full p-2
            border border-border/80 bg-background-elevated/30
            text-foreground/60 hover:text-foreground
            transition-colors shadow-sm
          "
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-secondary/80">
            Add Service
          </span>
          <h1 className="text-xl font-bold text-foreground mt-0.5">
            {title || "New Service"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SmartSaveButton
          onSave={onSave}
          saving={saving}
          lastSaved={lastSaved}
        />
        <button
          type="button"
          onClick={onCancel}
          className="
            rounded-full border border-border/60
            px-4 py-2 text-sm font-medium text-muted/70
            hover:bg-surface hover:text-foreground
            transition shadow-sm
          "
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={saving}
          className={`
            rounded-full px-6 py-2.5 text-sm font-semibold text-white
            shadow-lg shadow-secondary/25
            transition-all duration-300
            hover:shadow-xl hover:shadow-secondary/35
            flex items-center gap-2
            bg-secondary hover:bg-secondary-strong
          `}
        >
          {activeTab === "show" ? <Sparkles className="h-4 w-4" /> : null}
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
const AddServicePage = ({ listingId: editListingId }: { listingId?: string } = {}) => {
  const serviceMediaRef = useRef<ProductMediaRef>(null);
  const saveInProgressRef = useRef(false);
  const userData = useHaggleStore((state) => state.userData);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("tell");
  const [workLocation, setWorkLocation] = useState<WorkLocation>("home");
  const [targetAudience, setTargetAudience] =
    useState<TargetAudience>("businesses");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [category, setCategory] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [address, setAddress] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceSubcategories, setServiceSubCategories] = useState<
    Subcategory[]
  >([]);
  const [negotiationStyle, setNegotiationStyle] =
    useState<NegotiationStyle>("NEGOTIABLE");
  const [negotiationNote, setNegotiationNote] = useState("");
  const [imageGallery, setImageGallery] = useState<GalleryImage[]>([]);
  const [listingId, setListingId] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (window.localStorage.getItem("serviceListingId") ?? ""),
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [completed, setCompleted] = useState({
    tell: false,
    offer: false,
    show: false,
  });

  // ============================================
  // TAGS STATE - Dynamic service tags as pipe-delimited string
  // ============================================
  const [tags, setTags] = useState("");
  const [editLoading, setEditLoading] = useState(Boolean(editListingId));
  const [editError, setEditError] = useState("");
  const [initialGallery, setInitialGallery] = useState<
    { mediaId: string; url: string; previewUrl: string }[] | undefined
  >(undefined);

  useEffect(() => {
    if (!editListingId) return;
    let active = true;
    const loadListing = async () => {
      setEditLoading(true);
      setEditError("");
      try {
        const [listing, categories] = await Promise.all([
          getListing(editListingId),
          getAllCategories(),
        ]);
        if (listing.listing_type && listing.listing_type.toLowerCase() !== "service" && listing.listing_type.toLowerCase() !== "services") {
          throw new Error("This listing is not a service.");
        }
        const child = categories.find((item) => item.id === listing.category_id);
        const parent = child?.parent_id
          ? categories.find((item) => item.id === child.parent_id)
          : undefined;
        const selectedCategory = SERVICE_CATEGORIES.find(
          (item) => item.id === parent?.slug,
        );
        const selectedSubcategory = selectedCategory?.subcategories.find(
          (item) => item.id === child?.slug,
        );
        if (!selectedCategory || !selectedSubcategory) {
          throw new Error("The service category is not available in this form.");
        }
        if (!active) return;
        setCategory(selectedCategory.name);
        setServiceSubCategories(selectedCategory.subcategories);
        setServiceType(selectedSubcategory.name);
        setServiceName(listing.title || "");
        setServiceDescription(listing.description || "");
        setPrice(listing.starting_amount || "");
        setDeliveryTime(listing.delivery_duration || "");
        setAddress(listing.work_address || "");
        setWorkLocation(String(listing.work_place || "").toUpperCase() === "ON_SITE" ? "workshop" : "home");
        const audience = String(listing.target_audience || "businesses").toLowerCase() as TargetAudience;
        if (["general", "businesses", "individuals", "creators", "students", "startups", "professionals"].includes(audience)) setTargetAudience(audience);
        const style = String(listing.negotiation_style || "").toUpperCase();
        if (["FIXED", "NEGOTIABLE", "COUNTER"].includes(style)) setNegotiationStyle(style as NegotiationStyle);
        setNegotiationNote(listing.negotiation_note || "");
        const applicableTags = getApplicableCategoryTags(
          selectedCategory,
          selectedSubcategory.id,
        ).filter(
          (tag) =>
            !["delivery time", "location"].includes(tag.name.toLowerCase()),
        );
        const tagEntries = (
          Array.isArray(listing.tags) ? listing.tags.join("|") : listing.tags || ""
        )
          .split("|")
          .filter(Boolean)
          .filter((entry) =>
            applicableTags.some((tag) =>
              entry.startsWith(`${tag.name.toLowerCase()}:`),
            ),
          );
        for (const tag of applicableTags.filter((item) => item.required)) {
          const key = tag.name.toLowerCase();
          if (!tagEntries.some((entry) => entry.startsWith(`${key}:`))) {
            tagEntries.push(`${key}:`);
          }
        }
        setTags(tagEntries.join("|"));
        setListingId(listing.id);
        localStorage.setItem("serviceListingId", listing.id);
        const media = [...(listing.medias?.length ? listing.medias : listing.media || [])]
          .filter((item) => item.media_type.toLowerCase() === "image")
          .sort((a, b) => Number(Boolean(b.is_cover)) - Number(Boolean(a.is_cover)) || (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setInitialGallery(media.map((item) => {
          let previewUrl = item.url;
          try { previewUrl = resolveListingMediaUrl(item.url); } catch { /* show the stored media path as a fallback */ }
          return { mediaId: item.id, url: item.url, previewUrl };
        }));
      } catch (error) {
        if (active) setEditError(error instanceof Error ? error.message : "Unable to load this listing.");
      } finally {
        if (active) setEditLoading(false);
      }
    };
    void loadListing();
    return () => { active = false; };
  }, [editListingId]);

  // ============================================
  // HANDLE TAG CHANGE
  // ============================================
  const handleTagChange = (name: string, value: string) => {
    // Clean up: remove any existing entry for this name
    const existing = tags
      .split("|")
      .filter((tag) => !tag.startsWith(`${name.toLowerCase()}:`))
      .filter(Boolean);

    // Add the new tag
    const updated = [
      ...existing,
      `${name.toLowerCase()}:${value.toLowerCase()}`,
    ];

    setTags(updated.join("|"));
  };

  // ============================================
  // GET CURRENT VALUE FOR A TAG
  // ============================================
  const getTagValue = (name: string) => {
    const tag = tags
      .split("|")
      .find((t) => t.startsWith(`${name.toLowerCase()}:`));
    return tag?.split(":")[1] || "";
  };

  // ============================================
  // INITIALIZE TAGS WHEN CATEGORY CHANGES
  // ============================================
  const selectedCategory = SERVICE_CATEGORIES.find((c) => c.name === category);
  const selectedSubcategory = selectedCategory?.subcategories.find(
    (item) => item.name === serviceType,
  );
  const requiredTags =
    getApplicableCategoryTags(selectedCategory, selectedSubcategory?.id).filter(
      (tag) =>
        !["delivery time", "location"].includes(tag.name.toLowerCase()),
    ) ?? [];

  const tabs: { id: TabId; label: string }[] = [
    { id: "tell", label: "Tell buyers" },
    { id: "offer", label: "Set your offer" },
    { id: "show", label: "Show your work" },
  ];

  const completedCount = Object.values(completed).filter(Boolean).length;
  const imageCount = imageGallery.length;

  const validateTab = (tab: TabId) => {
    const errors: Record<string, string> = {};
    if (tab === "tell") {
      if (!serviceName.trim()) errors.serviceName = "Service name is required";
      if (!serviceDescription.trim())
        errors.serviceDescription = "Description is required";
      if (!category) errors.category = "Category is required";
      if (!serviceType) errors.serviceType = "Service type is required";
      if (workLocation === "workshop" && !address.trim())
        errors.address = "Workshop address is required";

      requiredTags.forEach((tag) => {
        if (tag.required && !getTagValue(tag.name).trim()) {
          errors[tag.name] = `${tag.name} is required`;
        }
      });
    } else if (tab === "offer") {
      const parsedPrice = Number(price.replace(/[^\d.]/g, ""));
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        errors.price = "Enter a valid starting price";
      }
      if (!deliveryTime.trim())
        errors.deliveryTime = "Delivery duration is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTabChange = (tab: TabId) => {
    if (saveInProgressRef.current) return;
    const currentIndex = tabs.findIndex((item) => item.id === activeTab);
    const targetIndex = tabs.findIndex((item) => item.id === tab);
    if (targetIndex > currentIndex + 1) return;
    if (targetIndex > currentIndex && !validateTab(activeTab)) return;

    if (targetIndex > currentIndex) {
      setCompleted((prev) => ({ ...prev, [activeTab]: true }));
    }
    setActiveTab(tab);
  };

  const getServiceCategoryId = async () => {
    const selectedServiceCategory = SERVICE_CATEGORIES.find(
      (item) => item.name === category,
    );
    const selectedSubcategory = selectedServiceCategory?.subcategories.find(
      (item) => item.name === serviceType,
    );
    if (!selectedServiceCategory || !selectedSubcategory) {
      throw new Error("Select a service category and type before saving.");
    }

    let parentCategory = await getCategory(selectedServiceCategory.id);
    if (!parentCategory?.data?.id) {
      parentCategory = await createCategory({
        name: selectedServiceCategory.name,
        slug: selectedServiceCategory.id,
        kind: "service",
        status: "draft",
      });
    }
    const parentCategoryId = parentCategory?.data?.id;
    if (typeof parentCategoryId !== "string") {
      throw new Error("Unable to create the service category.");
    }

    let subcategory = await getCategory(selectedSubcategory.id);
    if (!subcategory?.data?.id) {
      subcategory = await createCategory({
        name: selectedSubcategory.name,
        slug: selectedSubcategory.id,
        kind: "service",
        status: "draft",
        parent_id: parentCategoryId,
      });
    }
    const subcategoryId = subcategory?.data?.id;
    if (typeof subcategoryId !== "string") {
      throw new Error("Unable to create the service type.");
    }
    return subcategoryId;
  };

  const saveListing = async (status: "draft" | "published" = "draft") => {
    if (saveInProgressRef.current) return false;
    saveInProgressRef.current = true;
    setSaving(true);
    setPublishing(status === "published");
    try {
      const categoryId = await getServiceCategoryId();
      const sellerId = userData?.profile?.user_id ?? userData?.id;
      if (typeof sellerId !== "string" || !sellerId) {
        throw new Error("Sign in as a seller before saving a service.");
      }
      const parsedPrice = Number(price.replace(/[^\d.]/g, ""));
      const payload = {
        seller_id: sellerId,
        listing_type: "service",
        category_id: categoryId,
        title: serviceName.trim(),
        description: serviceDescription.trim(),
        target_audience: targetAudience.toUpperCase(),
        work_place: workLocation === "home" ? "REMOTE" : "ON_SITE",
        work_address: workLocation === "workshop" ? address.trim() : "",
        delivery_duration: deliveryTime.trim(),
        starting_amount:
          Number.isFinite(parsedPrice) && parsedPrice > 0
            ? String(parsedPrice)
            : null,
        price_currency: "NGN",
        negotiation_style: negotiationStyle,
        negotiation_note: negotiationNote.trim() || null,
        tags,
        status: "draft",
      };

      let savedListingId = listingId;
      if (savedListingId) {
        const response = await updateListing(savedListingId, payload);
        if (!response) throw new Error("Unable to save the service listing.");
      } else {
        const response = await createListing(payload);
        savedListingId = response?.data?.id;
        if (typeof savedListingId !== "string" || !savedListingId) {
          throw new Error("The service listing could not be created.");
        }
        setListingId(savedListingId);
        localStorage.setItem("serviceListingId", savedListingId);
      }

      if (!serviceMediaRef.current) {
        throw new Error("Service portfolio upload is unavailable.");
      }
      const uploadResults =
        await serviceMediaRef.current.uploadGalleryImages(savedListingId);
      const failedUpload = uploadResults.find(
        (image) => image.status !== "uploaded",
      );
      if (failedUpload) {
        throw new Error(
          failedUpload.error || `Unable to upload ${failedUpload.slotId}.`,
        );
      }

      if (status === "published") {
        const response = await updateListing(savedListingId, {
          ...payload,
          status: "published",
        });
        if (!response) throw new Error("Unable to publish the service.");
      }

      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error("Failed to save service listing:", error);
      notifyApiError(
        error,
        error instanceof Error ? error.message : "Unable to save service.",
      );
      return false;
    } finally {
      saveInProgressRef.current = false;
      setSaving(false);
      setPublishing(false);
    }
  };

  const handleNext = async () => {
    if (saveInProgressRef.current) return;
    if (activeTab === "tell") {
      if (!validateTab("tell")) return;
      if (await saveListing()) {
        setCompleted((prev) => ({ ...prev, tell: true }));
        setActiveTab("offer");
      }
      return;
    }
    if (activeTab === "offer") {
      if (!validateTab("offer")) return;
      if (await saveListing()) {
        setCompleted((prev) => ({ ...prev, offer: true }));
        setActiveTab("show");
      }
      return;
    }

    if (!validateTab("tell") || !validateTab("offer")) return;
    if (await saveListing("published")) {
      localStorage.removeItem("serviceListingId");
      const username = String(
        userData?.username ||
          userData?.profile?.username ||
          userData?.data?.username ||
          userData?.data?.profile?.username ||
          "",
      )
        .trim()
        .replace(/^@/, "");
      router.push(`/profile/${encodeURIComponent(username)}`);
    }
  };

  // Confidence status checks
  const getDetailsConfidence = () => {
    if (serviceName.length > 10 && serviceDescription.length > 20)
      return "good";
    if (serviceName.length > 0 || serviceDescription.length > 0)
      return "neutral";
    return "empty";
  };

  const getPricingConfidence = () => {
    if (price.length > 0 && deliveryTime.length > 0) return "good";
    if (price.length > 0 || deliveryTime.length > 0) return "neutral";
    return "empty";
  };

  const getMediaConfidence = () => {
    if (imageCount >= 3) return "good";
    if (imageCount > 0) return "neutral";
    return "empty";
  };

  const detailsConfidence = getDetailsConfidence();
  const pricingConfidence = getPricingConfidence();
  const mediaConfidence = getMediaConfidence();
  const isSaving = saving || publishing;

  return (
    <AppShell>
      {publishing && <Loader type="publishing" />}
      {editLoading && <Loader type="publishing" />}
      {editError && <div role="alert" className="mx-auto mt-4 max-w-3xl rounded-xl bg-danger/10 p-4 text-sm text-danger">{editError}</div>}
      <fieldset
        disabled={isSaving || editLoading}
        aria-busy={isSaving || editLoading}
        className="contents"
      >
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 mx-auto max-w-7xl w-full px-3 lg:px-6 flex flex-col">
          {/* STICKY HEADER */}
          <StickyHeader
            activeTab={activeTab}
            title={editListingId ? "Edit Service" : "New Service"}
            onNext={handleNext}
            onSave={() => {
              if (validateTab("tell")) void saveListing("draft");
            }}
            onCancel={() => router.back()}
            saving={saving}
            lastSaved={lastSaved}
          />

          {/* COMPLETION SUMMARY */}
          <div className="mt-4 mb-4 flex items-center justify-between">
            <CompletionSummary completed={completedCount} total={tabs.length} />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 grid gap-6 lg:grid-cols-2 pb-6">
            {/* LEFT COLUMN - Portfolio Always Visible */}
            <div className="space-y-4">
              <ProductMedia
                ref={serviceMediaRef}
                variant="service"
                onGalleryChange={setImageGallery}
                initialGallery={initialGallery}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              {/* TAB BAR */}
              <div className="flex items-center gap-6 border-b border-border/50 pb-1">
                {tabs.map((tab, index) => (
                  <TabButton
                    key={tab.id}
                    id={tab.id}
                    label={tab.label}
                    active={activeTab === tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    completed={completed[tab.id]}
                    number={index + 1}
                  />
                ))}
              </div>

              {/* TAB CONTENT */}
              <div className="rounded-2xl border border-border/60 bg-background-elevated/30 p-5 backdrop-blur-sm shadow-card">
                <AnimatePresence mode="wait">
                  {activeTab === "tell" && (
                    <motion.div
                      key="tell"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-secondary/10 p-1.5 text-secondary">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-foreground">
                            Tell buyers about your service
                          </h2>
                          <p className="text-[11px] text-muted/60">
                            Be clear, warm, and specific. Confidence builds
                            trust.
                          </p>
                        </div>
                      </div>

                      <ConfidenceIndicator
                        status={detailsConfidence}
                        message={
                          detailsConfidence === "good"
                            ? "Great! Buyers prefer detailed descriptions."
                            : detailsConfidence === "neutral"
                              ? "Add more details to build trust."
                              : "Tell buyers what makes your service unique."
                        }
                      />

                      <GlassyField
                        label="Service Name"
                        placeholder="e.g. Professional Logo Design"
                        prominent
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        error={validationErrors.serviceName}
                        helper={
                          <AITitleSuggestion
                            value={serviceName}
                            onChange={setServiceName}
                          />
                        }
                      />

                      <GlassyField
                        label="What makes your service unique?"
                        placeholder="Describe your approach, experience, and what sets you apart..."
                        multiline
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        error={validationErrors.serviceDescription}
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <GlassySelect
                          label="Category"
                          options={SERVICE_CATEGORIES}
                          value={category}
                          placeholder="Select category"
                          error={validationErrors.category}
                          onChange={(value) => {
                            setCategory(value);
                            setServiceType("");
                            const selected = SERVICE_CATEGORIES.find(
                              (item) => item.name === value,
                            );
                            setServiceSubCategories(
                              selected?.subcategories ?? [],
                            );
                            const applicableTags = getApplicableCategoryTags(selected)
                              .filter(
                                (tag) =>
                                  !["delivery time", "location"].includes(
                                    tag.name.toLowerCase(),
                                  ),
                              );
                            setTags(
                              applicableTags
                                .filter((tag) => tag.required)
                                .map((tag) => `${tag.name.toLowerCase()}:`)
                                .join("|"),
                            );
                            setValidationErrors((prev) => {
                              const next = { ...prev };
                              delete next.category;
                              delete next.serviceType;
                              return next;
                            });
                          }}
                        />
                        <GlassySelect
                          label="Service Type"
                          options={serviceSubcategories}
                          value={serviceType}
                          placeholder="Select type"
                          error={validationErrors.serviceType}
                          onChange={(value) => {
                            setServiceType(value);
                            const subcategory = selectedCategory?.subcategories.find(
                              (item) => item.name === value,
                            );
                            const applicableTags = getApplicableCategoryTags(
                              selectedCategory,
                              subcategory?.id,
                            ).filter(
                              (tag) =>
                                !["delivery time", "location"].includes(
                                  tag.name.toLowerCase(),
                                ),
                            );
                            setTags((current) => {
                              const entries = current
                                .split("|")
                                .filter(Boolean)
                                .filter((entry) =>
                                  applicableTags.some((tag) =>
                                    entry.startsWith(
                                      `${tag.name.toLowerCase()}:`,
                                    ),
                                  ),
                                );
                              for (const tag of applicableTags.filter(
                                (item) => item.required,
                              )) {
                                const key = tag.name.toLowerCase();
                                if (
                                  !entries.some((entry) =>
                                    entry.startsWith(`${key}:`),
                                  )
                                ) {
                                  entries.push(`${key}:`);
                                }
                              }
                              return entries.join("|");
                            });
                            setValidationErrors((prev) => {
                              const next = { ...prev };
                              delete next.serviceType;
                              return next;
                            });
                          }}
                        />
                      </div>

                      {/* ============================================ */}
                      {/* DYNAMIC TAGS - Rendered when serviceType is selected */}
                      {/* ============================================ */}
                      {serviceType && requiredTags.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-foreground/60">
                            Service Requirements
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {requiredTags.map((tag) => (
                              <React.Fragment key={tag.name}>
                                {tag.type === "select" ? (
                                  <GlassySelect
                                    label={tag.name}
                                    options={tag?.options ?? []}
                                    placeholder={tag.placeholder ?? "Select"}
                                    value={getTagValue(tag.name)}
                                    optional={!tag.required}
                                    error={validationErrors[tag.name]}
                                    onChange={(value) =>
                                      handleTagChange(tag.name, value)
                                    }
                                  />
                                ) : (
                                  <GlassyField
                                    label={tag.name}
                                    placeholder={tag.placeholder ?? ""}
                                    prominent
                                    inputType={tag.type === "date" ? "date" : "text"}
                                    value={getTagValue(tag.name)}
                                    optional={!tag.required}
                                    error={validationErrors[tag.name]}
                                    onChange={(e) =>
                                      handleTagChange(tag.name, e.target.value)
                                    }
                                  />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      <TargetAudiencePicker
                        value={targetAudience}
                        onChange={setTargetAudience}
                      />

                      <WorkLocationToggle
                        value={workLocation}
                        onChange={setWorkLocation}
                      />

                      {workLocation === "workshop" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <GlassyField
                            label="Workshop Address"
                            placeholder="Enter your studio or workshop address..."
                            icon={<MapPin className="h-3 w-3" />}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            error={validationErrors.address}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "offer" && (
                    <motion.div
                      key="offer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-success/10 p-1.5 text-success">
                          <Tag className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-foreground">
                            Set your offer
                          </h2>
                          <p className="text-[11px] text-muted/60">
                            Clear pricing reduces unnecessary negotiations.
                          </p>
                        </div>
                      </div>

                      <ConfidenceIndicator
                        status={pricingConfidence}
                        message={
                          pricingConfidence === "good"
                            ? "Clear pricing builds confidence."
                            : pricingConfidence === "neutral"
                              ? "Add a delivery timeframe and negotiation details."
                              : "Set your pricing to start receiving offers."
                        }
                      />

                      <PricePackageCard
                        basePrice={price}
                        deliveryTime={deliveryTime}
                        onPriceChange={(value) => {
                          setPrice(value);
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.price;
                            return next;
                          });
                        }}
                        onDeliveryChange={(value) => {
                          setDeliveryTime(value);
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.deliveryTime;
                            return next;
                          });
                        }}
                        priceError={validationErrors.price}
                        deliveryError={validationErrors.deliveryTime}
                      />

                      <ServiceNegotiationPicker
                        value={negotiationStyle}
                        onChange={setNegotiationStyle}
                      />

                      <GlassyField
                        label="Negotiation Note"
                        placeholder="Add any details buyers should know when making an offer..."
                        multiline
                        optional
                        value={negotiationNote}
                        onChange={(e) => setNegotiationNote(e.target.value)}
                      />

                    </motion.div>
                  )}

                  {activeTab === "show" && (
                    <motion.div
                      key="show"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-secondary/10 p-1.5 text-secondary">
                          <Eye className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-foreground">
                            Show your work
                          </h2>
                          <p className="text-[11px] text-muted/60">
                            This is how buyers will see your service. Your
                            portfolio on the left builds trust.
                          </p>
                        </div>
                      </div>

                      <ConfidenceIndicator
                        status={mediaConfidence}
                        message={
                          mediaConfidence === "good"
                            ? "Excellent portfolio! Listings like yours get 2.3× more enquiries."
                            : mediaConfidence === "neutral"
                              ? "Add more work samples to showcase your expertise."
                              : "Show your best work first."
                        }
                      />

                      {/* Only the preview card – no upload area */}
                      <ServiceCardPreview
                        serviceName={serviceName || "Your Service Name"}
                        price={price ? `From ${price}` : "From ₦50,000"}
                        category={category || "Creative Services"}
                        negotiationStyle={negotiationStyle}
                        location={
                          workLocation === "workshop"
                            ? address || "Physical Studio"
                            : "Remote"
                        }
                        rating={4.9}
                        reviews={8}
                        imageCount={imageCount}
                        deliveryTime={deliveryTime || "3-5 days"}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      </fieldset>
      {isSaving && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/30 backdrop-blur-[1px]"
          role="status"
          aria-live="polite"
        >
          <span className="rounded-full bg-background-elevated px-5 py-3 text-sm font-medium text-foreground shadow-lg">
            {publishing ? "Publishing service…" : "Saving service…"}
          </span>
        </div>
      )}
    </AppShell>
  );
};

export default AddServicePage;
