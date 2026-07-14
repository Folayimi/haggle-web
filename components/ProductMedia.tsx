"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
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
  ArrowLeft,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import {
  confirmUpload,
  createListingMedia,
  deleteListingMedia,
  deleteUpload,
  uploadImage,
} from "@/services/request";
import axios from "axios";

// ============================================
// TYPES
// ============================================
type SlotId = "front" | "back" | "left" | "right" | "accessories" | "packaging";
type ConnectionStatus = "idle" | "scanning" | "connected" | "uploading";
type Mode = "choose" | "upload" | "connect";

interface Slot {
  id: SlotId;
  label: string;
  starred?: boolean;
}

interface Presign {
  expiresIn: number;
  uploadUrl: string;
  key: string;
}

// ============================================
// IMAGE GALLERY ITEM
// ============================================
export interface GalleryImage {
  mediaId: string;
  slotId: SlotId;
  file: File;
  key: string; // Will be populated after upload
  previewUrl: string; // For display
  status: "pending" | "uploading" | "uploaded" | "error";
  error?: string;
}

// ============================================
// REF INTERFACE
// ============================================
export interface ProductMediaRef {
  uploadGalleryImages: (listingId: string) => Promise<GalleryImage[]>;
  getUploadedKeys: () => { slotId: SlotId; key: string }[];
  getGallery: () => GalleryImage[];
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
// MAIN COMPONENT (with ref forwarding)
// ============================================
export const ProductMedia = forwardRef<
  ProductMediaRef,
  {
    onImagesChange?: (images: Record<SlotId, string>) => void;
    onGalleryChange?: (gallery: GalleryImage[]) => void;
  }
>(({ onImagesChange, onGalleryChange }, ref) => {
  const [images, setImages] = useState<Record<SlotId, string>>(
    {} as Record<SlotId, string>,
  );
  const [imageGallery, setImageGallery] = useState<GalleryImage[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [guidedStep, setGuidedStep] = useState<number>(0);
  const [mode, setMode] = useState<Mode>("choose");
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

  // Notify parent when gallery changes
  useEffect(() => {
    onGalleryChange?.(imageGallery);
  }, [imageGallery, onGalleryChange]);

  // ============================================
  // UPLOAD GALLERY IMAGES (called from parent via ref)
  // ============================================
  const uploadGalleryImages = async ({
    listingId,
  }: {
    listingId: string;
  }): Promise<GalleryImage[]> => {
    if (!listingId) {
      console.error("❌ listingId is required for upload");
      return [];
    }

    const results: GalleryImage[] = [];

    // Get pending items
    const pendingItems = imageGallery.filter(
      (item) => item.status === "pending",
    );

    if (pendingItems.length === 0) {
      console.log("✅ No pending images to upload.");
      return imageGallery.filter((item) => item.status === "uploaded");
    }

    console.log("before uploading...");

    // Mark all pending as uploading
    setImageGallery((prev) =>
      prev.map((item) =>
        item.status === "pending" ? { ...item, status: "uploading" } : item,
      ),
    );

    console.log("after uploading...");

    for (const item of pendingItems) {
      try {
        // 1. Get presigned URL
        const presign: Presign = await uploadImage(item.file);

        // 2. Upload to Cloudflare
        const uploadResponse = await fetch(presign.uploadUrl, {
          method: "PUT",
          body: item.file,
          headers: { "Content-Type": item.file.type },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        // 3. Confirm upload with your Worker
        await confirmUpload({ key: presign.key });

        console.log("mediaUploadListingId", listingId);

        // 4. Create listing media in DB
        const response = await createListingMedia(
          {
            media_type: "IMAGE",
            url: presign.key,
          },
          listingId,
        );

        // 5. All succeeded → mark as uploaded
        const updatedItem: GalleryImage = {
          ...item,
          key: presign.key,
          status: "uploaded",
          mediaId: response?.data?.id,
        };

        setImageGallery((prev) =>
          prev.map((g) => (g.slotId === item.slotId ? updatedItem : g)),
        );

        results.push(updatedItem);
        console.log(`✅ Uploaded ${item.slotId}`);
      } catch (error) {
        console.error(`❌ Upload failed for ${item.slotId}:`, error);

        const errorItem: GalleryImage = {
          ...item,
          status: "error",
          error: (error as Error).message,
        };

        setImageGallery((prev) =>
          prev.map((g) => (g.slotId === item.slotId ? errorItem : g)),
        );

        results.push(errorItem);
      }
    }

    return results;
  };

  // ============================================
  // UPLOAD SINGLE IMAGE (for retry)
  // ============================================
  const uploadSingleImage = async (slotId: SlotId) => {
    // Find the failed item
    const item = imageGallery.find((g) => g.slotId === slotId);
    if (!item || item.status !== "error") return;

    // Reset status to pending and trigger upload
    setImageGallery((prev) =>
      prev.map((g) =>
        g.slotId === slotId ? { ...g, status: "pending", error: undefined } : g,
      ),
    );

    // The parent's saveDraft will handle the retry
    // If you want immediate retry, you can call uploadGalleryImages directly
    // But it's cleaner to let the parent handle it via saveDraft

    console.log(`🔄 Retrying upload for ${slotId}`);
  };

  // ============================================
  // GET UPLOADED KEYS
  // ============================================
  const getUploadedKeys = (): { slotId: SlotId; key: string }[] => {
    return imageGallery
      .filter((item) => item.status === "uploaded" && item.key)
      .map((item) => ({
        slotId: item.slotId,
        key: item.key,
      }));
  };

  // ============================================
  // GET FULL GALLERY
  // ============================================
  const getGallery = (): GalleryImage[] => {
    return imageGallery;
  };

  // ============================================
  // EXPOSE METHODS TO PARENT VIA REF
  // ============================================
  useImperativeHandle(ref, () => ({
    uploadGalleryImages: (listingId: string) =>
      uploadGalleryImages({ listingId }),
    getUploadedKeys,
    getGallery,
  }));

  // ============================================
  // HANDLERS
  // ============================================
  const handleFileSelect = (slotId: SlotId) => {
    document.getElementById(`file-upload-${slotId}`)?.click();
  };

  const handleFileChange = (
    slotId: SlotId,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    // Add to image gallery (pending upload)
    const newGalleryItem: GalleryImage = {
      mediaId: "",
      slotId,
      file,
      key: "",
      previewUrl,
      status: "pending",
    };

    setImageGallery((prev) => {
      // Remove existing item for this slot if any
      const filtered = prev.filter((item) => item.slotId !== slotId);
      return [...filtered, newGalleryItem];
    });

    // Also add to images state for display
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImages((prev) => ({
        ...prev,
        [slotId]: ev.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = async (slotId: SlotId) => {
    // Remove from gallery
    setImageGallery((prev) => prev.filter((item) => item.slotId !== slotId));
    const imageDeleted = imageGallery.find((item) => item.slotId === slotId);

    // Remove from images state
    const newImages = { ...images };
    delete newImages[slotId];
    setImages(newImages);
    const response = await deleteUpload({ key: imageDeleted?.key });
    console.log(response);
    const response2 = await deleteListingMedia(imageDeleted?.mediaId ?? "");
    console.log(response2);
  };

  const startPhoneConnection = () => {
    setMode("connect");
    setConnectionStatus("scanning");
    setTimeout(() => {
      setConnectionStatus("connected");
      setDeviceName("Ridwan's iPhone 15 Pro");
      const firstEmpty = UPLOAD_SLOTS.findIndex((slot) => !images[slot.id]);
      setGuidedStep(firstEmpty >= 0 ? firstEmpty : 0);
    }, 3000);
  };

  const disconnectPhone = () => {
    setConnectionStatus("idle");
    setDeviceName(null);
    setGuidedStep(0);
    setMode("choose");
  };

  const simulatePhoneUpload = () => {
    if (connectionStatus === "connected") {
      const slot = UPLOAD_SLOTS[guidedStep];
      if (slot && !images[slot.id]) {
        const placeholderImage =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50' y='110' font-family='Arial' font-size='20' fill='%23999'%3E📸%3C/text%3E%3C/svg%3E";

        setImages((prev) => ({
          ...prev,
          [slot.id]: placeholderImage,
        }));

        // Add to gallery
        const placeholderFile = new File([""], "placeholder.jpg", {
          type: "image/jpeg",
        });
        const newGalleryItem: GalleryImage = {
          mediaId: "",
          slotId: slot.id,
          file: placeholderFile,
          key: "",
          previewUrl: placeholderImage,
          status: "pending",
        };

        setImageGallery((prev) => {
          const filtered = prev.filter((item) => item.slotId !== slot.id);
          return [...filtered, newGalleryItem];
        });

        setGuidedStep((prev) => Math.min(prev + 1, UPLOAD_SLOTS.length - 1));
      }
    }
  };

  const goBack = () => {
    setMode("choose");
    if (connectionStatus !== "idle") {
      disconnectPhone();
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================
  const currentTip = ROTATING_TIPS[tipIndex];
  const uploadedCount = UPLOAD_SLOTS.filter((slot) => images[slot.id]).length;
  const isAllUploaded = UPLOAD_SLOTS.every((slot) => images[slot.id]);

  return (
    <div className="space-y-4">
      {/* Pro Seller Tip */}
      <div className="rounded-2xl border border-border/60 bg-primary/5 p-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-1.5 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Pro Seller Tip
            </p>
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
          <h2 className="text-sm font-semibold text-foreground">
            Product Media
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-1 ml-auto">
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
          <span className="text-[10px] text-muted/40 ml-auto">
            {uploadedCount}/{UPLOAD_SLOTS.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Upload grid */}
            <div className="grid grid-cols-4 gap-2">
              {UPLOAD_SLOTS.map((slot) => {
                const image = images[slot.id];
                const galleryItem = imageGallery.find(
                  (item) => item.slotId === slot.id,
                );
                const isUploading = galleryItem?.status === "uploading";
                const hasError = galleryItem?.status === "error";

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
                      ${hasError ? "border-danger/50 bg-danger/5" : ""}
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
                        {/* Upload status overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          </div>
                        )}
                        {hasError && (
                          <div className="absolute inset-0 bg-danger/20 flex flex-col items-center justify-center">
                            <span className="text-xs text-danger font-medium">
                              Failed
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                uploadSingleImage(slot.id);
                              }}
                              className="mt-1 rounded-full bg-danger/80 px-2 py-0.5 text-[8px] text-white hover:bg-danger transition"
                            >
                              Retry
                            </button>
                          </div>
                        )}
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
                        <Upload className="mx-auto h-4 w-4 text-muted/30" />
                        <p className="mt-0.5 text-[9px] text-muted/40">
                          {slot.label}
                        </p>
                        {slot.starred && (
                          <Star className="mx-auto mt-0.5 h-2.5 w-2.5 text-yellow-400/60" />
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

            {/* Drag & Drop area */}
            <div
              className="
                rounded-xl border-2 border-dashed border-border/30
                bg-background-elevated/10 p-3
                hover:border-primary/30 transition-all cursor-pointer
                flex items-center justify-center gap-3
              "
              onClick={() =>
                document.getElementById("file-upload-global")?.click()
              }
            >
              <Upload className="h-4 w-4 text-muted/30" />
              <span className="text-xs text-muted/60">
                Drop more files or click to browse
              </span>
              <input
                id="file-upload-global"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const emptySlots = UPLOAD_SLOTS.filter(
                      (slot) => !images[slot.id],
                    );
                    Array.from(files).forEach((file, index) => {
                      if (index < emptySlots.length) {
                        const slotId = emptySlots[index].id;
                        handleFileChange(slotId, {
                          target: { files: [file] },
                        } as any);
                      }
                    });
                  }
                }}
              />
            </div>
          </motion.div>

          {mode === "connect" && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-xs text-muted/60 hover:text-foreground transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to options
              </button>

              <div className="rounded-xl border border-border/40 bg-background-elevated/20 p-4">
                <div className="flex items-center gap-6">
                  <div className="shrink-0">
                    <div className="rounded-xl bg-[#1a1a1a] p-3">
                      <QRCodeSVG
                        value={`https://haggle.app/connect/${crypto.randomUUID()}`}
                        size={140}
                        level="H"
                        bgColor="#1a1a1a"
                        fgColor="#ffffff"
                      />
                    </div>
                    <p className="mt-2 text-[8px] text-center text-muted/40">
                      Scan with Haggle app
                    </p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Link className="h-3 w-3 text-primary" />
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
                        Tap{" "}
                        <strong className="text-foreground/70">Connect</strong>
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

              {connectionStatus === "connected" && (
                <div className="rounded-xl bg-primary/5 p-3 border border-primary/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground/70">
                      {isAllUploaded
                        ? "✅ All photos captured!"
                        : `📸 ${UPLOAD_SLOTS[guidedStep]?.label || "Done"}`}
                    </span>
                    <span className="text-[10px] text-muted/40">
                      {uploadedCount}/{UPLOAD_SLOTS.length}
                    </span>
                  </div>
                  {!isAllUploaded && (
                    <div className="mt-1 h-1 w-full rounded-full bg-border/40 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${(uploadedCount / UPLOAD_SLOTS.length) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                  <button
                    onClick={simulatePhoneUpload}
                    className="mt-2 w-full rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary hover:bg-primary/20 transition"
                    disabled={isAllUploaded}
                  >
                    {isAllUploaded
                      ? "All done! 🎉"
                      : "📱 Simulate Phone Upload"}
                  </button>
                </div>
              )}

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
                <span className="text-[8px] text-muted/40">
                  ⭐ = Recommended
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

ProductMedia.displayName = "ProductMedia";
