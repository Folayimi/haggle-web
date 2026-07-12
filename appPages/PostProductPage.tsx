"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductMedia, ProductMediaRef } from "@/components/ProductMedia";
import React, { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  ImagePlus,
  Package,
  Save,
  Sparkles,
  Tag,
  TrendingUp,
  X,
  Upload,
  Star,
  Circle,
  CheckCircle,
  Handshake,
  Scale,
  Shield,
  ShoppingBag,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GalleryImage } from "@/components/ProductMedia";

import { AppShell } from "@/components/app-shell";
import { PRODUCT_CATEGORIES } from "@/types/categories";
import { cn } from "@/lib/utils";
import { useHaggleStore } from "@/lib/app-store";
import {
  createCategory,
  createListing,
  createListingMedia,
  getCategory,
  updateListing,
  updateUserProfile,
} from "@/services/request";
import Image from "next/image";

// ============================================
// TYPES
// ============================================
type TabId = "details" | "pricing" | "media";
type NegotiationStyle = "flexible" | "moderate" | "firm";

const NEGOTIATION_STYLES: {
  id: NegotiationStyle;
  icon: React.ReactNode;
  label: string;
  description: string;
}[] = [
  {
    id: "flexible",
    icon: <Handshake className="h-4 w-4" />,
    label: "Flexible",
    description: "Open to offers",
  },
  {
    id: "moderate",
    icon: <Scale className="h-4 w-4" />,
    label: "Moderate",
    description: "Reasonable negotiation",
  },
  {
    id: "firm",
    icon: <Shield className="h-4 w-4" />,
    label: "Firm",
    description: "Price is mostly fixed",
  },
];

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
  value,
  onChange,
  error,
  ...props
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
  optional?: boolean;
  icon?: React.ReactNode;
  prominent?: boolean;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
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
            error &&
              "border-danger/50 focus:border-danger/50 focus:ring-danger/30",
          )}
          {...props}
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          required
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
            error &&
              "border-danger/50 focus:border-danger/50 focus:ring-danger/30",
          )}
          {...props}
        />
      )}
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
  value,
  placeholder,
  type,
  optional = false,
  onChange,
  error,
}: {
  label: string;
  options: any[];
  value: string;
  placeholder: string;
  type?: string;
  optional?: boolean;
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

      <Select items={options}>
        <SelectTrigger
          className={cn(
            `
            relative w-full rounded-xl
            border border-border/60 bg-background-elevated/40
            px-4 py-6 text-sm text-foreground
            backdrop-blur-sm
            transition-all duration-200
            focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30
            text-left flex items-center justify-between
            shadow-sm
          `,
            error &&
              "border-danger/50 focus:border-danger/50 focus:ring-danger/30",
          )}
        >
          <SelectValue placeholder={value ? value : placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="bg-popover">
            {options.map((item) => (
              <SelectItem
                key={type === "tag" ? item : item.id}
                value={type === "tag" ? item : item.name}
                className="w-full px-4 py-2 text-left text-sm text-foreground focus:bg-primary/5 hover:bg-primary/5 transition"
                onClick={() => onChange(type === "tag" ? item : item.name)}
              >
                {type === "tag" ? item : item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

// ============================================
// TAB COMPONENT
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
// STICKY COMPLETION SUMMARY
// ============================================
function CompletionSummary({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-full border border-border/40 bg-background-elevated/20 backdrop-blur-sm shadow-sm">
      <span className="text-xs font-medium text-foreground/60">
        Listing Progress
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
    </div>
  );
}

// ============================================
// SMART SAVE DRAFT BUTTON (Controlled)
// ============================================
function SmartSaveButton({
  status,
  onSave,
  lastSaved,
  setLastSaved,
}: {
  status: "idle" | "saving" | "saved";
  onSave: () => void;
  lastSaved: Date | null;
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
}) {
  const handleSave = () => {
    onSave();
    setLastSaved(new Date());
  };

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
      onClick={handleSave}
      className={`
        rounded-full border border-border/60
        px-4 py-2 text-sm font-medium
        transition-all duration-300
        flex items-center gap-2
        ${
          status === "saved"
            ? "bg-success/10 text-success border-success/30"
            : status === "saving"
              ? "bg-primary/10 text-primary border-primary/30"
              : "text-muted/70 hover:bg-surface hover:text-foreground"
        }
        shadow-sm
      `}
    >
      {status === "saved" ? (
        <>
          <Check className="h-4 w-4" />
          <span>Draft saved {getTimeAgo()}</span>
        </>
      ) : status === "saving" ? (
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
// NEGOTIATION STYLE PICKER
// ============================================
function NegotiationStylePicker({
  value,
  onChange,
}: {
  value: NegotiationStyle;
  onChange: (style: NegotiationStyle) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-foreground/80">
        Negotiation Style
      </span>
      <div className="grid grid-cols-3 gap-2">
        {NEGOTIATION_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange(style.id)}
            className={`
              rounded-xl border p-3 text-left transition-all duration-200
              ${
                value === style.id
                  ? "border-primary/50 bg-primary/10 shadow-sm shadow-primary/5"
                  : "border-border/40 bg-background-elevated/20 hover:border-border/60"
              }
            `}
          >
            <div className="flex items-center gap-2">
              <span
                className={
                  value === style.id ? "text-primary" : "text-muted/40"
                }
              >
                {style.icon}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  value === style.id ? "text-foreground" : "text-muted/60",
                )}
              >
                {style.label}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-muted/40">
              {style.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// REAL PRODUCT CARD PREVIEW
// ============================================
function ProductCardPreview({
  productName = "Your Product Name",
  price = "₦50,000",
  negotiationStyle = "flexible",
  imageGallery,
}: {
  productName?: string;
  price?: string;
  negotiationStyle?: NegotiationStyle;
  imageGallery: GalleryImage[];
}) {
  const styleMap = {
    flexible: { label: "Flexible", icon: <Handshake className="h-3 w-3" /> },
    moderate: { label: "Moderate", icon: <Scale className="h-3 w-3" /> },
    firm: { label: "Firm", icon: <Shield className="h-3 w-3" /> },
  };

  const style = styleMap[negotiationStyle];

  const frontImage = imageGallery.find(
    (item) => item.slotId === "front",
  )?.previewUrl;

  return (
    <div className="rounded-xl border border-border/40 bg-background-elevated/20 overflow-hidden shadow-sm">
      {/* Image area */}
      <div className="aspect-video bg-gradient-to-br from-primary/10 via-background/20 to-secondary/10 flex items-center justify-center relative">
        {frontImage ? (
          <Image
            src={frontImage}
            className=""
            w-full
            h-full
            width={500}
            height={500}
            alt="preview-image"
          />
        ) : (
          <>
            {" "}
            <div className="absolute top-2 left-2">
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[8px] font-medium text-primary border border-primary/20">
                Live
              </span>
            </div>
            <div className="text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-muted/20" />
              <p className="text-xs text-muted/40 mt-1">Product Image</p>
            </div>
          </>
        )}
      </div>

      {/* Info area */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {productName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-primary">{price}</span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[8px] font-medium text-success border border-success/20">
                Negotiable
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-background-elevated/30 px-2 py-1 border border-border/30">
            <span className="text-muted/40">{style.icon}</span>
            <span className="text-[8px] font-medium text-muted/60">
              {style.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-muted/40">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            27 offers today
          </span>
          <span className="h-3 w-px bg-border/30" />
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400/60" />
            4.8 (12 reviews)
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PRICE INPUT (with currency formatting)
// ============================================
function PriceInput({
  label,
  placeholder = "0",
  value,
  onChange,
  error,
  optional = false,
  icon,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
  icon?: React.ReactNode;
}) {
  const userData = useHaggleStore((state) => state.userData);
  const currency = userData?.settings?.preferred_currency || "NGN";
  const currencySymbol = currency === "USD" ? "$" : "₦";

  const formatDisplay = (raw: string) => {
    if (!raw) return "";
    const num = parseFloat(raw);
    if (isNaN(num)) return "";
    return `${currencySymbol}${num.toLocaleString()}`;
  };

  const [displayValue, setDisplayValue] = useState(() => formatDisplay(value));

  useEffect(() => {
    setDisplayValue(value ? formatDisplay(value) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Remove all non-digit characters except dot
    const raw = input.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const parts = raw.split(".");
    if (parts.length > 2) return;
    // Update parent with raw value
    onChange(raw);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground/80">{label}</span>
        {optional && (
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted/50">
            Optional
          </span>
        )}
        {icon && <span className="text-muted/30">{icon}</span>}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
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
          error &&
            "border-danger/50 focus:border-danger/50 focus:ring-danger/30",
        )}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
// ============================================
// MAIN PAGE
// ============================================
const PostProductPage = () => {
  const productMediaRef = useRef<ProductMediaRef>(null);
  const userData = useHaggleStore((state) => state.userData);
  const setUserData = useHaggleStore((state) => state.setUserData);
  const [saveType, setSaveType] = useState("create");
  const [listingId, setListingId] = useState("");
  const [productInfo, setProductInfo] = useState({
    name: "",
    category: "",
    categorySlug: "",
    subCategory: "",
    subCategorySlug: "",
    description: "",
    startingPrice: "",
    lowestAcceptablePrice: "",
    autoDeclinePrice: "",
    negotiationNote: "",
    location: "",
  });
  const [imageGallery, setImageGallery] = useState<GalleryImage[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "done"
  >("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [negotiationStyle, setNegotiationStyle] =
    useState<NegotiationStyle>("flexible");
  const [productSubcategories, setProductSubcategories] = useState<any[]>([]);
  const [tags, setTags] = useState("");
  const [completed, setCompleted] = useState({
    details: false,
    pricing: false,
    media: false,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Product Details" },
    { id: "pricing", label: "Pricing & Negotiation" },
    { id: "media", label: "Media & Preview" },
  ];

  const completedCount = Object.values(completed).filter(Boolean).length;

  // ============================================
  // VALIDATE A SPECIFIC TAB
  // ============================================
  const validateTab = (tabId: TabId): boolean => {
    let errors: Record<string, string> = {};

    if (tabId === "details") {
      errors = validateDetails();
    } else if (tabId === "pricing") {
      errors = validatePricing();
    }
    // media tab doesn't need validation (publish handled separately)

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorField = document.querySelector(".text-danger");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }

    setValidationErrors({});
    return true;
  };

  // ============================================
  // HANDLE TAB CHANGE (with validation for forward moves)
  // ============================================
  const handleTabChange = (tab: TabId) => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    const targetIndex = tabs.findIndex((t) => t.id === tab);
    const nextTab = tabs[currentIndex + 1]?.id;

    // CASE 1: Moving backward → always allowed
    if (targetIndex < currentIndex) {
      setActiveTab(tab);
      return;
    }

    // CASE 2: Moving forward to the immediate next tab → validate current tab
    if (targetIndex === currentIndex + 1) {
      const isValid = validateTab(activeTab);
      if (!isValid) return;

      // Move forward
      setActiveTab(tab);
      // Mark completed and auto-save
      if (activeTab === "details") {
        setCompleted((prev) => ({ ...prev, details: true }));
      } else if (activeTab === "pricing") {
        setCompleted((prev) => ({ ...prev, pricing: true }));
      }
      saveDraft();
      setLastSaved(new Date());
      setSaveType("update");
      return;
    }

    // CASE 3: Moving forward multiple steps (e.g., from details to media)
    // Validate all intermediate tabs
    if (targetIndex > currentIndex + 1) {
      // Check if the current tab is valid first
      const isValidCurrent = validateTab(activeTab);
      if (!isValidCurrent) return;

      // Move to the next tab in sequence (one step at a time)
      // This enforces step-by-step progression
      setActiveTab(nextTab);

      if (activeTab === "details") {
        setCompleted((prev) => ({ ...prev, details: true }));
      } else if (activeTab === "pricing") {
        setCompleted((prev) => ({ ...prev, pricing: true }));
      }
      saveDraft();
      setLastSaved(new Date());
      setSaveType("update");
      return;
    }
  };

  // ============================================
  // VALIDATION FUNCTIONS
  // ============================================
  const validateDetails = () => {
    const errors: Record<string, string> = {};
    if (!productInfo.name.trim()) errors.name = "Product name is required";
    if (!productInfo.description.trim())
      errors.description = "Description is required";
    if (!productInfo.category) errors.category = "Category is required";
    if (!productInfo.subCategory)
      errors.subCategory = "Sub-category is required";
    if (!productInfo.location.trim()) errors.location = "Location is required";

    // Validate required tags
    const categoryObj = PRODUCT_CATEGORIES.find(
      (c) => c.name === productInfo.category,
    );
    if (categoryObj) {
      const requiredTags =
        categoryObj.requiredTags?.filter((t) => t.required) || [];
      requiredTags.forEach((tag) => {
        const value = getTagValue(tag.name);
        if (!value) errors[tag.name] = `${tag.name} is required`;
      });
    }
    return errors;
  };

  const validatePricing = () => {
    const errors: Record<string, string> = {};
    if (
      !productInfo.startingPrice ||
      parseFloat(productInfo.startingPrice) <= 0
    ) {
      errors.startingPrice = "Starting asking price is required";
    }
    return errors;
  };

  // ============================================
  // TAG HELPERS
  // ============================================
  const handleTagChange = (name: string, value: string) => {
    const existing = tags
      .split("|")
      .filter((tag) => !tag.startsWith(`${name.toLowerCase()}:`))
      .filter(Boolean);

    const updated = [...existing, `${name.toLowerCase()}:${value}`];

    setTags(updated.join("|"));
    // Clear error for this field if exists
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getTagValue = (name: string) => {
    const tag = tags
      .split("|")
      .find((t) => t.startsWith(`${name.toLowerCase()}:`));
    return tag?.split(":")[1] || "";
  };

  // ============================================
  // SAVE DRAFT
  // ============================================
  const saveDraft = async () => {
    setDraftStatus("saving");
    const categoryPayload = {
      name: productInfo?.category,
      slug: productInfo?.categorySlug,
      kind: "product",
      status: "draft",
    };
    const subCategoryPayload = {
      name: productInfo?.subCategory,
      slug: productInfo?.subCategorySlug,
      kind: "product",
      status: "draft",
    };
    const payload = {
      seller_id: userData?.profile?.user_id,
      listing_type: "product",
      title: productInfo?.name,
      description: productInfo?.description,
      starting_amount: productInfo?.startingPrice,
      lowest_amount: productInfo?.lowestAcceptablePrice,
      auto_decline_amount: productInfo?.autoDeclinePrice,
      tags: tags,
      status: "draft",
      negotiation_style: negotiationStyle,
      negotiation_note: productInfo?.negotiationNote,
    };
    let listing: any = "";
    try {
      // PRODUCT LISTING LOGIC
      const subCategory = await getCategory(productInfo.subCategorySlug);
      if (subCategory?.data) {
        if (saveType === "create") {
          listing = await createListing({
            ...payload,
            category_id: subCategory.data.id,
          });
          setListingId(listing?.data?.id);
        } else {
          await updateListing(listingId, {
            ...payload,
            category_id: subCategory.data.id,
          });
        }
      } else {
        const category = await getCategory(productInfo.categorySlug);
        if (category?.data) {
          const subCategory = await createCategory({
            ...subCategoryPayload,
            parent_id: category.data.id,
          });
          if (saveType === "create") {
            listing = await createListing({
              ...payload,
              category_id: subCategory.data.id,
            });
            setListingId(listing?.data?.id);
          } else {
            await updateListing(listingId, {
              ...payload,
              category_id: subCategory.data.id,
            });
          }
        } else {
          const data = await createCategory(categoryPayload);
          if (data) {
            const categoryId = data?.data?.id;
            const subCategory = await createCategory({
              ...subCategoryPayload,
              parent_id: categoryId,
            });
            if (saveType === "create") {
              listing = await createListing({
                ...payload,
                category_id: subCategory.data.id,
              });
              setListingId(listing?.data?.id);
            } else {
              await updateListing(listingId, {
                ...payload,
                category_id: subCategory.data.id,
              });
            }
          }
        }
      }
      if (!productMediaRef.current) {
        console.error("❌ ProductMedia ref is null – cannot upload images");
        setDraftStatus("idle");
        return;
      }

      // 1. Upload all pending images via the ref
      const uploadResults =
        await productMediaRef.current?.uploadGalleryImages(listing?.data?.id);
      console.log("uploadResults", uploadResults);

      // 2. Get uploaded keys
      const uploadedKeys = productMediaRef.current?.getUploadedKeys() || [];
      const updatedProfile = await updateUserProfile({
        city: productInfo?.location,
        primary_role: "seller",
        preferred_role: "seller",
      });
      setUserData(updatedProfile);
      console.log("Draft saved:", payload);

      setDraftStatus("saved");
      setTimeout(() => setDraftStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save draft:", error);
      setDraftStatus("idle");
    }
  };

  // ============================================
  // STEP NAVIGATION
  // ============================================
  const goToNextStep = async () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1].id;
      // Use the same validation as tab click
      if (validateTab(activeTab)) {
        setActiveTab(nextTab);
        // Mark completed and auto-save
        if (activeTab === "details") {
          setCompleted((prev) => ({ ...prev, details: true }));
        } else if (activeTab === "pricing") {
          setCompleted((prev) => ({ ...prev, pricing: true }));
        }
        await saveDraft();
        setLastSaved(new Date());
        setSaveType("update");
      }
    } else {
      // On media tab, publish
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...productInfo,
      tags,
      negotiationStyle,
    };

    console.log("Publishing product:", payload);
  };

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    const categoryObj = PRODUCT_CATEGORIES.find(
      (c) => c.name === productInfo.category,
    );
    const tags = categoryObj?.requiredTags || [];
    const initialTags = tags
      .map((tag) => `${tag.name.toLowerCase()}:`)
      .join("|");
    setTags(initialTags);
  }, [productInfo.category]);

  // ============================================
  // RENDER
  // ============================================
  const requiredTags = PRODUCT_CATEGORIES.find(
    (c) => c.name === productInfo.category,
  )?.requiredTags;

  return (
    <AppShell>
      <div className="min-h-screen flex flex-col bg-transparent">
        <div className="relative flex-1 mx-auto max-w-7xl w-full px-3 py-4 lg:px-6 flex flex-col">
          {/* HEADER ROW */}
          <div className="sticky top-0 left-0 w-full py-3 px-3 bg-background/20 backdrop-blur rounded-full flex items-center justify-between mb-4 z-30">
            <div className="flex items-center gap-3">
              <Link
                href="/create"
                className="
                  rounded-full p-2
                  border border-border/80 bg-background-elevated/30
                  text-foreground/60 hover:text-foreground
                  transition-colors shadow-sm
                "
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-primary/80">
                  Upload Listings
                </span>
                <h1 className="text-2xl font-bold text-foreground mt-0.5">
                  New Product
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <SmartSaveButton
                status={draftStatus}
                onSave={() => {
                  if (validateTab(activeTab)) {
                    saveDraft();
                  } else {
                    return;
                  }
                }}
                lastSaved={lastSaved}
                setLastSaved={setLastSaved}
              />
              <Link
                href="/create"
                className="
                  rounded-full border border-border/60
                  px-4 py-2 text-sm font-medium text-muted/70
                  hover:bg-surface hover:text-foreground
                  transition shadow-sm
                "
              >
                Cancel
              </Link>
              <button
                className={`
                  rounded-full px-6 py-2.5 text-sm font-semibold text-white
                  shadow-lg shadow-primary/15
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-primary/20
                  flex items-center gap-2
                  bg-primary hover:bg-primary-strong
                  cursor-pointer
                `}
                onClick={goToNextStep}
              >
                {activeTab === "media" ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Publish Product
                  </>
                ) : (
                  <>Next: {activeTab === "details" ? "Pricing" : "Preview"} →</>
                )}
              </button>
            </div>
          </div>

          {/* COMPLETION SUMMARY */}
          <div className="mb-4 flex items-center justify-between">
            <CompletionSummary completed={completedCount} total={tabs.length} />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 grid gap-6 lg:grid-cols-2">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              <ProductMedia                
                ref={productMediaRef}
                onImagesChange={(images) => {
                  // Optionally sync images to parent state if needed
                }}
                onGalleryChange={(gallery) => {
                  setImageGallery(gallery);
                }}
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
              <div className="rounded-2xl border border-border/60 bg-background-elevated/30 p-5 backdrop-blur-sm shadow-card overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-foreground">
                            Product Details
                          </h2>
                          <p className="text-[11px] text-muted/60">
                            Tell buyers exactly what you're selling. Accurate
                            details help build trust.
                          </p>
                        </div>
                      </div>

                      <GlassyField
                        label="Product Name"
                        placeholder="e.g. Apple iPhone 14 Pro Max (128GB) • Excellent Condition"
                        prominent
                        value={productInfo.name}
                        onChange={(e) =>
                          setProductInfo({
                            ...productInfo,
                            name: e.target.value,
                          })
                        }
                        error={validationErrors.name}
                      />
                      <GlassyField
                        label="Short Description"
                        placeholder="Describe the product in warm, buyer-friendly language..."
                        multiline
                        value={productInfo.description}
                        onChange={(e) =>
                          setProductInfo({
                            ...productInfo,
                            description: e.target.value,
                          })
                        }
                        error={validationErrors.description}
                      />
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-foreground/60">
                          Classification
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <GlassySelect
                            label="Category"
                            options={PRODUCT_CATEGORIES}
                            placeholder="Select category"
                            value={productInfo.category}
                            onChange={(value) => {
                              setProductInfo({
                                ...productInfo,
                                category: value,
                                categorySlug:
                                  PRODUCT_CATEGORIES[
                                    PRODUCT_CATEGORIES.findIndex(
                                      (cat) => cat.name === value,
                                    )
                                  ].id,
                                subCategory: "",
                                subCategorySlug: "",
                              });
                              setProductSubcategories(
                                PRODUCT_CATEGORIES[
                                  PRODUCT_CATEGORIES.findIndex(
                                    (cat) => cat.name === value,
                                  )
                                ].subcategories,
                              );
                              // Clear errors for these fields
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.category;
                                delete newErrors.subCategory;
                                return newErrors;
                              });
                            }}
                            error={validationErrors.category}
                          />
                          <GlassySelect
                            label="Sub-Category"
                            options={productSubcategories}
                            value={productInfo.subCategory}
                            placeholder="Select sub-category"
                            onChange={(value) =>
                              setProductInfo({
                                ...productInfo,
                                subCategory: value,
                                subCategorySlug:
                                  productSubcategories[
                                    productSubcategories.findIndex(
                                      (sub) => sub.name === value,
                                    )
                                  ].id,
                              })
                            }
                            error={validationErrors.subCategory}
                          />
                        </div>
                      </div>
                      {productInfo.subCategory ? (
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-foreground/60">
                            Requirements
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {requiredTags?.map((item) => {
                              const currentValue = getTagValue(item.name);

                              return (
                                <React.Fragment key={item.name}>
                                  {item.type === "select" ? (
                                    <GlassySelect
                                      label={item.name}
                                      options={item?.options ?? []}
                                      placeholder={item.placeholder ?? "Select"}
                                      value={currentValue}
                                      optional={!item?.required}
                                      type="tag"
                                      onChange={(value) =>
                                        handleTagChange(item.name, value)
                                      }
                                      error={validationErrors[item.name]}
                                    />
                                  ) : (
                                    <GlassyField
                                      label={item.name}
                                      placeholder={item.placeholder ?? ""}
                                      prominent
                                      value={currentValue}
                                      optional={!item?.required}
                                      onChange={(e) =>
                                        handleTagChange(
                                          item.name,
                                          e.target.value,
                                        )
                                      }
                                      error={validationErrors[item.name]}
                                    />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}

                      {productInfo.subCategory && (
                        <div className="space-y-1.5">
                          <GlassyField
                            label="Location"
                            placeholder="Your current Location. e.g. Lagos, Nigeria"
                            prominent
                            value={productInfo.location}
                            onChange={(e) =>
                              setProductInfo({
                                ...productInfo,
                                location: e.target.value,
                              })
                            }
                            error={validationErrors.location}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "pricing" && (
                    <motion.div
                      key="pricing"
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
                            Pricing & Negotiation
                          </h2>
                          <p className="text-[11px] text-muted/60">
                            Set your negotiation boundaries to guide offers.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <PriceInput
                          label="Starting Asking Price"
                          placeholder="50,000"
                          icon={<TrendingUp className="h-3 w-3" />}
                          value={productInfo.startingPrice}
                          onChange={(value) =>
                            setProductInfo({
                              ...productInfo,
                              startingPrice: value,
                            })
                          }
                          error={validationErrors.startingPrice}
                        />
                        <PriceInput
                          label="Lowest You'll Accept"
                          placeholder="42,000"
                          optional
                          value={productInfo.lowestAcceptablePrice}
                          onChange={(value) =>
                            setProductInfo({
                              ...productInfo,
                              lowestAcceptablePrice: value,
                            })
                          }
                        />
                      </div>
                      <PriceInput
                        label="Auto Decline Below"
                        placeholder="35,000"
                        optional
                        value={productInfo.autoDeclinePrice}
                        onChange={(value) =>
                          setProductInfo({
                            ...productInfo,
                            autoDeclinePrice: value,
                          })
                        }
                      />

                      <NegotiationStylePicker
                        value={negotiationStyle}
                        onChange={setNegotiationStyle}
                      />

                      <GlassyField
                        label="Negotiation Note"
                        placeholder="Open to bundle pricing for two or more pieces..."
                        multiline
                        optional
                        value={productInfo.negotiationNote}
                        onChange={(e) =>
                          setProductInfo({
                            ...productInfo,
                            negotiationNote: e.target.value,
                          })
                        }
                      />
                    </motion.div>
                  )}

                  {activeTab === "media" && (
                    <motion.div
                      key="media"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-secondary/10 p-1.5 text-secondary">
                          <ImagePlus className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-foreground">
                            Media & Preview
                          </h2>
                          <p className="text-[11px] text-muted/60">
                            See how your listing will appear to buyers.
                          </p>
                        </div>
                      </div>

                      <ProductCardPreview
                        productName={productInfo.name || "Your Product Name"}
                        price={productInfo.startingPrice || "₦50,000"}
                        negotiationStyle={negotiationStyle}
                        imageGallery={imageGallery}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default PostProductPage;
