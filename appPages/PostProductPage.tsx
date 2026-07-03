"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductMedia } from "@/components/ProductMedia";
import { useState, useEffect } from "react";
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

import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";

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
            border border-border/60 bg-[#2b2127] dark:bg-[#2b2127]
            px-4 py-3 text-sm text-foreground
            placeholder:text-muted/40
            backdrop-blur-sm
            transition-all duration-200
            focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30
            resize-none
            shadow-sm
          `,
            prominent && "text-base py-3.5",
          )}
          {...props}
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            `
            w-full rounded-xl
            border border-border/60 bg-[#2b2127] dark:bg-[#2b2127]
            px-4 py-3 text-sm text-foreground
            placeholder:text-muted/40
            backdrop-blur-sm
            transition-all duration-200
            focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30
            shadow-sm
          `,
            prominent && "text-base py-3.5",
          )}
          {...props}
        />
      )}
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
}: {
  label: string;
  options: string[];
  placeholder: string;
  optional?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

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
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-full rounded-xl
            border border-border/60 bg-[#2b2127] dark:bg-[#2b2127]
            px-4 py-3 text-sm text-foreground
            backdrop-blur-sm
            transition-all duration-200
            focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30
            text-left flex items-center justify-between
            shadow-sm
          `}
        >
          <span className={selected ? "text-foreground" : "text-muted/40"}>
            {selected || placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted/40 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-background-elevated/90 backdrop-blur-xl py-1 shadow-soft">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-primary/5 transition"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
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
// SMART SAVE DRAFT BUTTON
// ============================================
function SmartSaveButton() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = () => {
    setStatus("saving");
    setTimeout(() => {
      setStatus("saved");
      setLastSaved(new Date());
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }, 1000);
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
// NEGOTIATION STYLE PICKER (Emotional)
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
}: {
  productName?: string;
  price?: string;
  negotiationStyle?: NegotiationStyle;
}) {
  const styleMap = {
    flexible: { label: "Flexible", icon: <Handshake className="h-3 w-3" /> },
    moderate: { label: "Moderate", icon: <Scale className="h-3 w-3" /> },
    firm: { label: "Firm", icon: <Shield className="h-3 w-3" /> },
  };

  const style = styleMap[negotiationStyle];

  return (
    <div className="rounded-xl border border-border/40 bg-background-elevated/20 overflow-hidden shadow-sm">
      {/* Image area */}
      <div className="aspect-video bg-gradient-to-br from-primary/10 via-background/20 to-secondary/10 flex items-center justify-center relative">
        <div className="absolute top-2 left-2">
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[8px] font-medium text-primary border border-primary/20">
            Live
          </span>
        </div>
        <div className="text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-muted/20" />
          <p className="text-xs text-muted/40 mt-1">Product Image</p>
        </div>
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
// MAIN PAGE
// ============================================
const PostProductPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [negotiationStyle, setNegotiationStyle] =
    useState<NegotiationStyle>("flexible");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [completed, setCompleted] = useState({
    details: false,
    pricing: false,
    media: false,
  });

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Product Details" },
    { id: "pricing", label: "Pricing & Negotiation" },
    { id: "media", label: "Media & Preview" },
  ];

  const categoryOptions = [
    
  ]

  const completedCount = Object.values(completed).filter(Boolean).length;

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === "pricing") {
      setCompleted((prev) => ({ ...prev, details: true }));
    } else if (tab === "media") {
      setCompleted((prev) => ({ ...prev, pricing: true }));
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen flex flex-col bg-[#F2EDE8] dark:bg-[#190C05]">
        <div className="flex-1 mx-auto max-w-7xl w-full px-3 py-4 lg:px-6 flex flex-col">
          {/* HEADER ROW */}
          <div className="flex items-center justify-between mb-4">
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
              <SmartSaveButton />
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
                  shadow-lg shadow-primary/25
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-primary/35
                  flex items-center gap-2
                  bg-primary hover:bg-primary-strong
                `}
              >
                {activeTab === "pricing" ? (
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
                onImagesChange={(images) => {
                  // Optionally sync images to parent state if needed
                  console.log("Images updated:", images);
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
              <div className="rounded-2xl border border-border/60 bg-background-elevated/30 p-5 backdrop-blur-sm shadow-card">
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
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-foreground/60">
                          Classification
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <GlassySelect
                            label="Category"
                            options={[
                              "Electronics",
                              "Fashion",
                              "Home Decor",
                              "Phones",
                              "Cars",
                              "Services",
                            ]}
                            placeholder="Select category"
                          />
                          <GlassySelect
                            label="Condition"
                            options={["New", "Like New", "Used", "Refurbished"]}
                            placeholder="Select condition"
                          />
                        </div>
                      </div>
                      <GlassyField
                        label="Short Description"
                        placeholder="Describe the product in warm, buyer-friendly language..."
                        multiline
                      />
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
                        <GlassyField
                          label="Starting Asking Price"
                          placeholder="₦50,000"
                          icon={<TrendingUp className="h-3 w-3" />}
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        <GlassyField
                          label="Lowest You'll Accept"
                          placeholder="₦42,000"
                          optional
                        />
                      </div>
                      <GlassyField
                        label="Auto Decline Below"
                        placeholder="₦35,000"
                        optional
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
                        productName={productName || "Your Product Name"}
                        price={price || "₦50,000"}
                        negotiationStyle={negotiationStyle}
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
