"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
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
  Plus,
  GripVertical,
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

// ============================================
// TYPES
// ============================================
type FixedSlotId = "front" | "back" | "left" | "right" | "accessories" | "packaging";
type SlotId = FixedSlotId | string; // allow dynamic "moreX"

type ConnectionStatus = "idle" | "scanning" | "connected" | "uploading";
type Mode = "choose" | "upload" | "connect";

interface Slot {
  id: SlotId;
  label: string;
  starred?: boolean;
  isFixed?: boolean;
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
  key: string;
  previewUrl: string;
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
const FIXED_SLOTS: Slot[] = [
  { id: "front", label: "Front", starred: true, isFixed: true },
  { id: "back", label: "Back", starred: false, isFixed: true },
  { id: "left", label: "Left", starred: false, isFixed: true },
  { id: "right", label: "Right", starred: false, isFixed: true },
  { id: "accessories", label: "Accessories", starred: false, isFixed: true },
  { id: "packaging", label: "Packaging", starred: false, isFixed: true },
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
  const [images, setImages] = useState<Record<SlotId, string>>({});
  const [imageGallery, setImageGallery] = useState<GalleryImage[]>([]);
  const [extraSlots, setExtraSlots] = useState<Slot[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [guidedStep, setGuidedStep] = useState<number>(0);
  const [mode, setMode] = useState<Mode>("choose");
  const [tipIndex, setTipIndex] = useState(0);
  const [draggedSlotId, setDraggedSlotId] = useState<SlotId | null>(null);
  const extraCounter = useRef<number>(1);

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
  // COMPUTED SLOTS (fixed + extra)
  // ============================================
  const allSlots = [...FIXED_SLOTS, ...extraSlots];

  // ============================================
  // CORE: FILL SLOTS WITH MULTIPLE FILES
  // ============================================
  const fillSlotsWithFiles = (files: FileList | File[], startSlotId?: SlotId) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Get current occupied slot IDs
    const occupiedSlotIds = new Set(imageGallery.map(item => item.slotId));

    // Determine the order of slots to fill
    let slotsToFill = [...allSlots];
    let startIndex = 0;
    if (startSlotId) {
      const idx = slotsToFill.findIndex(s => s.id === startSlotId);
      if (idx !== -1) startIndex = idx;
    }
    // Reorder slots to start from startIndex
    slotsToFill = slotsToFill.slice(startIndex);

    let fileIndex = 0;
    let newExtraCount = 0;

    // Helper to assign a file to a specific slot
    const assignFileToSlot = (slot: Slot, file: File) => {
      const previewUrl = URL.createObjectURL(file);
      const newGalleryItem: GalleryImage = {
        mediaId: "",
        slotId: slot.id,
        file,
        key: "",
        previewUrl,
        status: "pending",
      };
      // Remove any existing image in that slot (replace)
      setImageGallery((prev) => {
        const filtered = prev.filter((item) => item.slotId !== slot.id);
        return [...filtered, newGalleryItem];
      });
      // Update images state for preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => ({
          ...prev,
          [slot.id]: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    };

    // First, iterate over existing slots
    for (let i = 0; i < slotsToFill.length && fileIndex < fileArray.length; i++) {
      const slot = slotsToFill[i];
      // If slot already has an image, we skip it (keep existing)
      if (occupiedSlotIds.has(slot.id)) continue;
      assignFileToSlot(slot, fileArray[fileIndex]);
      fileIndex++;
      // Mark as occupied for future checks
      occupiedSlotIds.add(slot.id);
    }

    // If there are remaining files, create new extra slots
    while (fileIndex < fileArray.length) {
      newExtraCount++;
      const newSlotId = `more${extraSlots.length + newExtraCount}`;
      const newSlot: Slot = {
        id: newSlotId,
        label: `More ${extraSlots.length + newExtraCount}`,
        starred: false,
        isFixed: false,
      };
      // Add to extraSlots state
      setExtraSlots((prev) => [...prev, newSlot]);
      // Assign file to this new slot
      assignFileToSlot(newSlot, fileArray[fileIndex]);
      fileIndex++;
    }

    // Update guided step if connected
    if (connectionStatus === "connected") {
      const firstEmpty = allSlots.findIndex((slot) => !imageGallery.some((g) => g.slotId === slot.id));
      setGuidedStep(firstEmpty >= 0 ? firstEmpty : allSlots.length - 1);
    }
  };

  // ============================================
  // ADD EXTRA SLOT (single empty)
  // ============================================
  const addExtraSlot = (file?: File) => {
    const count = extraSlots.length + 1;
    const newSlot: Slot = {
      id: `more${count}`,
      label: `More ${count}`,
      starred: false,
      isFixed: false,
    };
    setExtraSlots((prev) => [...prev, newSlot]);
    if (file) {
      // Assign file to this new slot
      const previewUrl = URL.createObjectURL(file);
      const newGalleryItem: GalleryImage = {
        mediaId: "",
        slotId: newSlot.id,
        file,
        key: "",
        previewUrl,
        status: "pending",
      };
      setImageGallery((prev) => [...prev, newGalleryItem]);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => ({
          ...prev,
          [newSlot.id]: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ============================================
  // REMOVE EXTRA SLOT
  // ============================================
  const removeExtraSlot = (slotId: SlotId) => {
    const hasImage = imageGallery.some((item) => item.slotId === slotId);
    if (hasImage) {
      const item = imageGallery.find((g) => g.slotId === slotId);
      if (item) removeImage(slotId);
    }
    setExtraSlots((prev) => prev.filter((slot) => slot.id !== slotId));
  };

  // ============================================
  // UPLOAD FUNCTIONS
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
    const pendingItems = imageGallery.filter((item) => item.status === "pending");

    if (pendingItems.length === 0) {
      console.log("✅ No pending images to upload.");
      return imageGallery.filter((item) => item.status === "uploaded");
    }

    setImageGallery((prev) =>
      prev.map((item) =>
        item.status === "pending" ? { ...item, status: "uploading" } : item,
      ),
    );

    for (const item of pendingItems) {
      try {
        const presign: Presign = await uploadImage(item.file);
        const uploadResponse = await fetch(presign.uploadUrl, {
          method: "PUT",
          body: item.file,
          headers: { "Content-Type": item.file.type },
        });
        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }
        await confirmUpload({ key: presign.key });
        const response = await createListingMedia(
          {
            media_type: "IMAGE",
            url: presign.key,
          },
          listingId,
        );

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

  const uploadSingleImage = async (slotId: SlotId) => {
    const item = imageGallery.find((g) => g.slotId === slotId);
    if (!item || item.status !== "error") return;
    setImageGallery((prev) =>
      prev.map((g) =>
        g.slotId === slotId ? { ...g, status: "pending", error: undefined } : g,
      ),
    );
    console.log(`🔄 Retrying upload for ${slotId}`);
  };

  const getUploadedKeys = (): { slotId: SlotId; key: string }[] => {
    return imageGallery
      .filter((item) => item.status === "uploaded" && item.key)
      .map((item) => ({
        slotId: item.slotId,
        key: item.key,
      }));
  };

  const getGallery = (): GalleryImage[] => imageGallery;

  useImperativeHandle(ref, () => ({
    uploadGalleryImages: (listingId: string) =>
      uploadGalleryImages({ listingId }),
    getUploadedKeys,
    getGallery,
  }));

  // ============================================
  // FILE HANDLING (Multi-file support)
  // ============================================
  const handleFileSelect = (slotId: SlotId) => {
    document.getElementById(`file-upload-${slotId}`)?.click();
  };

  const handleFileChange = (
    slotId: SlotId,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // Use the multi-file fill function starting from the clicked slot
    fillSlotsWithFiles(files, slotId);
    // Clear the input value to allow re-selection of same files
    e.target.value = '';
  };

  const removeImage = async (slotId: SlotId) => {
    const imageDeleted = imageGallery.find((item) => item.slotId === slotId);
    setImageGallery((prev) => prev.filter((item) => item.slotId !== slotId));
    const newImages = { ...images };
    delete newImages[slotId];
    setImages(newImages);

    if (imageDeleted?.key) {
      await deleteUpload({ key: imageDeleted.key });
    }
    if (imageDeleted?.mediaId) {
      await deleteListingMedia(imageDeleted.mediaId);
    }

    // If it's an extra slot and now empty, remove it
    const isExtra = extraSlots.some((s) => s.id === slotId);
    if (isExtra) {
      const stillHasImage = imageGallery.some((g) => g.slotId === slotId);
      if (!stillHasImage) {
        setExtraSlots((prev) => prev.filter((s) => s.id !== slotId));
      }
    }
  };

  // ============================================
  // DRAG AND DROP HANDLERS (unchanged)
  // ============================================
  const handleDragStart = (e: React.DragEvent, slotId: SlotId) => {
    setDraggedSlotId(slotId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", slotId);
  };

  const handleDragEnd = () => {
    setDraggedSlotId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetSlotId: SlotId) => {
    e.preventDefault();
    const sourceSlotId = e.dataTransfer.getData("text/plain") as SlotId;

    if (!sourceSlotId || sourceSlotId === targetSlotId) return;

    const sourceItem = imageGallery.find((item) => item.slotId === sourceSlotId);
    const targetItem = imageGallery.find((item) => item.slotId === targetSlotId);

    if (!sourceItem) return;

    // Swap images between source and target slots
    const updatedGallery = imageGallery.map((item) => {
      if (item.slotId === sourceSlotId) {
        return { ...item, slotId: targetSlotId };
      }
      if (item.slotId === targetSlotId) {
        return { ...item, slotId: sourceSlotId };
      }
      return item;
    });

    setImageGallery(updatedGallery);

    const newImages: Record<SlotId, string> = {};
    updatedGallery.forEach((item) => {
      newImages[item.slotId] = item.previewUrl;
    });
    setImages(newImages);

    setDraggedSlotId(null);
  };

  const handleAddMoreDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      fillSlotsWithFiles(files);
    } else {
      addExtraSlot();
    }
  };

  // ============================================
  // PHONE CONNECTION (unchanged)
  // ============================================
  const startPhoneConnection = () => {
    setMode("connect");
    setConnectionStatus("scanning");
    setTimeout(() => {
      setConnectionStatus("connected");
      setDeviceName("Ridwan's iPhone 15 Pro");
      const firstEmpty = allSlots.findIndex((slot) => !images[slot.id]);
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
      const slot = allSlots[guidedStep];
      if (slot && !images[slot.id]) {
        const placeholderImage =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50' y='110' font-family='Arial' font-size='20' fill='%23999'%3E📸%3C/text%3E%3C/svg%3E";
        setImages((prev) => ({ ...prev, [slot.id]: placeholderImage }));
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
        setGuidedStep((prev) => Math.min(prev + 1, allSlots.length - 1));
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
  const uploadedCount = imageGallery.length;
  const isAllUploaded = imageGallery.every((item) => item.status === "uploaded");

  return (
    <div className="space-y-4">
      {/* Pro Seller Tip */}
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
            {uploadedCount} images
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
              {allSlots.map((slot) => {
                const image = imageGallery.find((item) => item.slotId === slot.id);
                const hasImage = !!image;
                const isUploading = image?.status === "uploading";
                const hasError = image?.status === "error";
                const isDragged = draggedSlotId === slot.id;

                return (
                  <div
                    key={slot.id}
                    onClick={() => handleFileSelect(slot.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, slot.id)}
                    className={`
                      relative rounded-lg aspect-square
                      border-2 transition-all duration-200
                      ${hasImage ? "border-border/40 bg-background-elevated/30" : "border-border/30 bg-background-elevated/10 hover:border-primary/30"}
                      ${hasError ? "border-danger/50 bg-danger/5" : ""}
                      ${isDragged ? "opacity-50" : ""}
                      flex items-center justify-center
                      overflow-hidden
                      cursor-grab
                      group
                    `}
                  >
                    {hasImage ? (
                      <>
                        <img
                          src={image.previewUrl}
                          alt={slot.label}
                          className="w-full h-full object-cover"
                          draggable
                          onDragStart={(e) => handleDragStart(e, slot.id)}
                          onDragEnd={handleDragEnd}
                        />
                        {/* Upload status overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          </div>
                        )}
                        {hasError && (
                          <div className="absolute inset-0 bg-danger/20 flex flex-col items-center justify-center">
                            <span className="text-xs text-danger font-medium">Failed</span>
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
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute top-0.5 right-0.5 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(slot.id);
                            }}
                            className="rounded-full bg-danger/90 p-0.5 text-white hover:bg-danger transition"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        {!slot.isFixed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeExtraSlot(slot.id);
                            }}
                            className="absolute bottom-0.5 right-0.5 rounded-full bg-black/40 p-0.5 text-white/60 hover:text-white transition"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        )}
                        <div className="absolute bottom-0.5 left-0.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] text-white/80">
                          {slot.label}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <Upload className="mx-auto h-4 w-4 text-muted/30" />
                          <p className="mt-0.5 text-[9px] text-muted/40">{slot.label}</p>
                          {slot.starred && (
                            <Star className="mx-auto mt-0.5 h-2.5 w-2.5 text-yellow-400/60" />
                          )}
                        </div>
                        <div className="absolute bottom-0.5 left-0.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] text-white/80">
                          {slot.label}
                        </div>
                      </>
                    )}
                    <input
                      id={`file-upload-${slot.id}`}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(slot.id, e)}
                    />
                  </div>
                );
              })}

              {/* "Add More" slot card */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleAddMoreDrop}
                onClick={() => document.getElementById('file-upload-add-more')?.click()}
                className="
                  relative rounded-lg aspect-square
                  border-2 border-dashed border-border/40
                  bg-background-elevated/5
                  hover:border-primary/30 hover:bg-primary/5
                  transition-all duration-200
                  flex items-center justify-center
                  cursor-pointer
                "
              >
                <div className="text-center">
                  <Plus className="mx-auto h-5 w-5 text-muted/40" />
                  <p className="mt-1 text-[9px] text-muted/40">Add more</p>
                </div>
                <input
                  id="file-upload-add-more"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      fillSlotsWithFiles(files);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Phone connection (unchanged) */}
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
                        : `📸 ${allSlots[guidedStep]?.label || "Done"}`}
                    </span>
                    <span className="text-[10px] text-muted/40">
                      {uploadedCount} images
                    </span>
                  </div>
                  {!isAllUploaded && (
                    <div className="mt-1 h-1 w-full rounded-full bg-border/40 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${(uploadedCount / Math.max(1, allSlots.length)) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                  <button
                    onClick={simulatePhoneUpload}
                    className="mt-2 w-full rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary hover:bg-primary/20 transition"
                    disabled={isAllUploaded}
                  >
                    {isAllUploaded ? "All done! 🎉" : "📱 Simulate Phone Upload"}
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
                <span className="text-[8px] text-muted/40">⭐ = Recommended</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

ProductMedia.displayName = "ProductMedia";