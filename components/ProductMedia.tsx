"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Camera,
  Check,
  ChevronDown,
  ImagePlus,
  Smartphone,
  Upload,
  Star,
  X,
  QrCode,
  Link,
  Battery,
  Wifi,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================
type SlotId = "front" | "back" | "left" | "right" | "accessories" | "packaging";
type ConnectionStatus = "idle" | "scanning" | "connected" | "uploading";

interface Slot {
  id: SlotId;
  label: string;
  starred?: boolean;
}

// ============================================
// CONSTANTS
// ============================================
const UPLOAD_SLOTS: Slot[] = [
  { id: "front", label: "Front", starred: true },
  { id: "back", label: "Back", starred: false },
  { id: "left", label: "Left", starred: false },
  { id: "right", label: "Right", starred: false },
  { id: "accessories", label: "Accessories", starred: false },
  { id: "packaging", label: "Packaging", starred: false },
];

const ROTATING_TIPS = [
  { icon: "📸", text: "Add 4+ high-quality photos" },
  { icon: "⚡", text: "Respond within 1 hour" },
  { icon: "📦", text: "Show packaging in photos" },
  { icon: "🔍", text: "Mention defects honestly" },
  { icon: "💰", text: "Use a realistic asking price" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export function ProductMedia({
  onImagesChange,
}: {
  onImagesChange?: (images: Record<SlotId, string>) => void;
}) {
  const [images, setImages] = useState<Record<SlotId, string>>({} as Record<SlotId, string>);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [showQR, setShowQR] = useState(false);
  const [guidedStep, setGuidedStep] = useState<number>(0);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  // Rotating seller tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ROTATING_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Notify parent when images change
  useEffect(() => {
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  // === Handlers ===
  const handleFileSelect = (slotId: SlotId) => {
    document.getElementById(`file-upload-${slotId}`)?.click();
  };

  const handleFileChange = (slotId: SlotId, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => ({
          ...prev,
          [slotId]: ev.target?.result as string,
        }));
        // If guided mode, advance to next step after a short delay
        if (connectionStatus === "connected") {
          setTimeout(() => {
            setGuidedStep((prev) => Math.min(prev + 1, UPLOAD_SLOTS.length - 1));
          }, 500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (slotId: SlotId) => {
    const newImages = { ...images };
    delete newImages[slotId];
    setImages(newImages);
  };

  const startPhoneConnection = () => {
    setShowQR(true);
    setConnectionStatus("scanning");
    // Simulate connection after 3 seconds
    setTimeout(() => {
      setConnectionStatus("connected");
      setDeviceName("Ridwan's iPhone 15 Pro");
      // Start guided capture from first empty slot
      const firstEmpty = UPLOAD_SLOTS.findIndex((slot) => !images[slot.id]);
      setGuidedStep(firstEmpty >= 0 ? firstEmpty : 0);
    }, 3000);
  };

  const disconnectPhone = () => {
    setConnectionStatus("idle");
    setShowQR(false);
    setDeviceName(null);
    setGuidedStep(0);
  };

  const simulatePhoneUpload = () => {
    // For demo: upload a placeholder image to the current guided slot
    if (connectionStatus === "connected") {
      const slot = UPLOAD_SLOTS[guidedStep];
      if (slot && !images[slot.id]) {
        const placeholderImage =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50' y='110' font-family='Arial' font-size='20' fill='%23999'%3E📸%3C/text%3E%3C/svg%3E";
        setImages((prev) => ({
          ...prev,
          [slot.id]: placeholderImage,
        }));
        setGuidedStep((prev) => Math.min(prev + 1, UPLOAD_SLOTS.length - 1));
      }
    }
  };

  // === Render ===
  const currentTip = ROTATING_TIPS[tipIndex];
  const isAllUploaded = UPLOAD_SLOTS.every((slot) => images[slot.id]);
  const uploadedCount = UPLOAD_SLOTS.filter((slot) => images[slot.id]).length;

  return (
    <div className="space-y-4">
      {/* Pro Seller Tip - now integrated */}
      <div className="rounded-2xl border border-border/60 bg-primary/5 p-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-1.5 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Pro Seller Tip</p>
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-xs text-muted/60"
            >
              <span>{currentTip.icon}</span>
              <span>{currentTip.text}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Product Media Card */}
      <div className="rounded-2xl border border-border/60 bg-background-elevated/20 p-4 backdrop-blur-sm shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-full bg-secondary/10 p-1.5 text-secondary">
            <ImagePlus className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Product Media</h2>
          <span className="text-[10px] text-muted/40 ml-auto">
            {uploadedCount}/{UPLOAD_SLOTS.length}
          </span>
        </div>

        <div className="space-y-4">
          {/* Two equal entry points */}
          <div className="grid grid-cols-2 gap-3">
            {/* Drag & Drop */}
            <div
              className="
                rounded-xl border-2 border-dashed border-border/30
                bg-background-elevated/10 p-3
                hover:border-primary/30 transition-all cursor-pointer
                flex flex-col items-center justify-center min-h-[100px]
              "
              onClick={() => document.getElementById("file-upload-global")?.click()}
            >
              <Upload className="h-5 w-5 text-muted/30" />
              <p className="mt-1 text-xs font-medium text-foreground/60">Drag & Drop</p>
              <p className="text-[10px] text-muted/40">Browse files</p>
              <input
                id="file-upload-global"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    // Assign to first empty slots
                    const emptySlots = UPLOAD_SLOTS.filter((slot) => !images[slot.id]);
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

            {/* Connect Phone */}
            <div
              className={`
                rounded-xl border-2 transition-all cursor-pointer
                ${connectionStatus === "idle" ? "border-border/30 hover:border-primary/30" : "border-primary/40 bg-primary/5"}
                bg-background-elevated/10 p-3
                flex flex-col items-center justify-center min-h-[100px]
                relative
              `}
              onClick={() => {
                if (connectionStatus === "idle") startPhoneConnection();
              }}
            >
              {connectionStatus === "idle" ? (
                <>
                  <Smartphone className="h-5 w-5 text-muted/30" />
                  <p className="mt-1 text-xs font-medium text-foreground/60">Connect Phone</p>
                  <p className="text-[10px] text-muted/40">Scan QR to capture</p>
                </>
              ) : connectionStatus === "scanning" ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="mt-1 text-xs font-medium text-primary">Connecting...</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-success">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">{deviceName}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted/40">
                    <Battery className="h-3 w-3" />
                    <span>82%</span>
                    <Wifi className="h-3 w-3 ml-1" />
                    <span>Live</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      disconnectPhone();
                    }}
                    className="mt-1 text-[10px] text-danger/60 hover:text-danger"
                  >
                    Disconnect
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Upload Grid - always visible */}
          <div className="grid grid-cols-3 gap-2">
            {UPLOAD_SLOTS.map((slot) => {
              const image = images[slot.id];
              const isGuided = connectionStatus === "connected" && guidedStep === UPLOAD_SLOTS.indexOf(slot);
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
                        : isGuided
                        ? "border-primary/60 bg-primary/5 shadow-[0_0_0_2px_rgba(244,77,36,0.3)]"
                        : "border-border/30 bg-background-elevated/10 hover:border-primary/30"
                    }
                    flex items-center justify-center
                    overflow-hidden
                    cursor-pointer
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
                      {isGuided && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[8px] font-medium text-center py-0.5">
                          ✓ Done
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-4 w-4 text-muted/30" />
                      <p className="mt-0.5 text-[9px] text-muted/40">{slot.label}</p>
                      {slot.starred && (
                        <Star className="mx-auto mt-0.5 h-2.5 w-2.5 text-yellow-400/60" />
                      )}
                      {isGuided && (
                        <div className="absolute -top-1 -right-1">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white animate-pulse">
                            ●
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    id={`file-upload-${slot.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(slot.id, e)}
                  />
                </div>
              );
            })}
          </div>

          {/* QR Code Expansion (only when showQR is true) */}
          <AnimatePresence>
            {showQR && connectionStatus !== "idle" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-border/40 bg-background-elevated/20 p-4 mt-2">
                  <div className="flex items-center gap-6">
                    <div className="shrink-0">
                      <QRCodeSVG
                        value={`https://haggle.app/connect/${crypto.randomUUID()}`}
                        size={100}
                        level="H"
                        bgColor="transparent"
                        fgColor="#F97316"
                      />
                      <p className="mt-1 text-[8px] text-center text-muted/40">
                        Scan with Haggle app
                      </p>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Link className="h-3 w-3 text-primary" />
                        Waiting for device...
                      </p>
                      <ol className="space-y-0.5 text-[10px] text-muted/50">
                        <li className="flex items-center gap-1.5">
                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/10 text-[7px] font-bold text-primary">1</span>
                          Open Haggle app on your phone
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/10 text-[7px] font-bold text-primary">2</span>
                          Tap <strong className="text-foreground/70">Connect</strong>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/10 text-[7px] font-bold text-primary">3</span>
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Guided Capture Status */}
          {connectionStatus === "connected" && (
            <div className="mt-2 rounded-xl bg-primary/5 p-2 border border-primary/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground/70">
                  {isAllUploaded ? "✅ All photos captured!" : `📸 ${UPLOAD_SLOTS[guidedStep]?.label || "Done"}`}
                </span>
                <span className="text-[10px] text-muted/40">
                  {uploadedCount}/{UPLOAD_SLOTS.length}
                </span>
              </div>
              {!isAllUploaded && (
                <div className="mt-1 h-1 w-full rounded-full bg-border/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${(uploadedCount / UPLOAD_SLOTS.length) * 100}%` }}
                  />
                </div>
              )}
              {/* Simulate phone upload button for demo */}
              <button
                onClick={simulatePhoneUpload}
                className="mt-2 w-full rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary hover:bg-primary/20 transition"
                disabled={isAllUploaded}
              >
                {isAllUploaded ? "All done! 🎉" : "📱 Simulate Phone Upload"}
              </button>
            </div>
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
            </div>
            <span className="text-[8px] text-muted/40">⭐ = Recommended</span>
          </div>
        </div>
      </div>
    </div>
  );
}