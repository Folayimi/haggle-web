// components/BroadCastShowRoom.tsx
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Camera,
  Mic,
  ShoppingBag,
  Zap,
  MapPin,
  Clock,
  Flame,
  Package,
  Wrench,
  Truck,
  Calendar,
  AlertCircle,
  Sparkles,
  Send,
  MessageCircle,
  VideoOff,
  MicOff,
} from "lucide-react";
import { useHaggleStore } from "@/lib/app-store";
import { getSellerListings } from "@/services/request";
import type { BackendListing } from "@/services/mappers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ============================================
// TYPES
// ============================================
type BroadcastRequest = {
  id: string;
  buyer: {
    name: string;
    avatar: string;
    distance: string;
  };
  title: string;
  category: string;
  budget?: string;
  urgency?:
    | "urgent"
    | "immediate"
    | "wholesale"
    | "service"
    | "product"
    | "scheduled";
  quantity?: string;
  timestamp: string;
  type: "product" | "service";
};

// ============================================
// BADGE CONFIG
// ============================================
const BADGE_CONFIG = {
  urgent: {
    label: "🔥 Urgent",
    color: "bg-red-500/80 text-white border-red-400",
  },
  immediate: {
    label: "⚡ Immediate",
    color: "bg-orange-500/80 text-white border-orange-400",
  },
  wholesale: {
    label: "🛒 Wholesale",
    color: "bg-blue-500/80 text-white border-blue-400",
  },
  service: {
    label: "🛠 Service",
    color: "bg-purple-500/80 text-white border-purple-400",
  },
  product: {
    label: "📦 Product",
    color: "bg-green-500/80 text-white border-green-400",
  },
  scheduled: {
    label: "📅 Scheduled",
    color: "bg-teal-500/80 text-white border-teal-400",
  },
};

// ============================================
// MOCK DATA
// ============================================
const generateMockBroadcasts = (): BroadcastRequest[] => {
  const names = [
    "Sarah Mitchell",
    "Michael Chen",
    "Emma Watson",
    "James Rodriguez",
    "Lisa Wong",
    "Ahmed Bello",
    "Grace Okafor",
    "David Adeyemi",
    "Chioma Eze",
    "Oluwaseun Adebayo",
    "Fatima Musa",
    "Tunde Balogun",
  ];
  const categories = [
    "Fashion",
    "Furniture",
    "Art",
    "Food",
    "Services",
    "Electronics",
    "Home",
    "Automobile",
  ];
  const productTitles = [
    "Vintage Wedding Dress",
    "Handcrafted Wooden Table",
    "Custom Portrait Painting",
    "iPhone 15 Pro Max",
    "Luxury Sofa Set",
    "Toyota Camry 2022",
    "Gaming Laptop",
    "Designer Handbag",
    "Fresh Organic Vegetables",
    "Smart TV 65 Inch",
  ];
  const serviceTitles = [
    "Professional Logo Design",
    "Wedding Photography",
    "Plumbing Services",
    "Interior Design Consultation",
    "Personal Training Sessions",
    "Catering Services",
    "Web Development",
    "Digital Marketing Strategy",
    "Event Planning",
    "Home Cleaning Services",
  ];
  const urgencyList: BroadcastRequest["urgency"][] = [
    "urgent",
    "immediate",
    "wholesale",
    "service",
    "product",
    "scheduled",
  ];
  const budgets = [
    "₦120,000",
    "₦250,000",
    "₦85,000",
    "₦15,000",
    "₦50,000",
    "₦900,000",
    "₦450,000",
    "₦2,500,000",
  ];
  const quantities = ["2 units", "3 units", "5kg", "1 unit", "10kg", "4 units"];

  const productItems = Array.from({ length: 12 }, (_, i) => {
    const name = names[i % names.length];
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const distance = `${(Math.random() * 10 + 0.5).toFixed(1)} km away`;
    const urgency = urgencyList[i % urgencyList.length];
    const budget =
      Math.random() > 0.3 ? budgets[i % budgets.length] : undefined;
    const quantity =
      Math.random() > 0.6 ? quantities[i % quantities.length] : undefined;
    const category = categories[i % categories.length];
    const title = productTitles[i % productTitles.length];
    const timestamp = `${Math.floor(Math.random() * 60 + 1)} min${Math.random() > 0.5 ? "s" : ""} ago`;

    return {
      id: `product-${i + 1}`,
      buyer: {
        name,
        avatar: initials,
        distance,
      },
      title,
      category,
      budget,
      urgency,
      quantity,
      timestamp: timestamp,
      type: "product" as const,
    };
  });

  const serviceItems = Array.from({ length: 12 }, (_, i) => {
    const name = names[(i + 3) % names.length];
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const distance = `${(Math.random() * 10 + 0.5).toFixed(1)} km away`;
    const urgency = urgencyList[(i + 2) % urgencyList.length];
    const budget =
      Math.random() > 0.3 ? budgets[(i + 1) % budgets.length] : undefined;
    const quantity =
      Math.random() > 0.6 ? quantities[(i + 2) % quantities.length] : undefined;
    const category = categories[(i + 3) % categories.length];
    const title = serviceTitles[i % serviceTitles.length];
    const timestamp = `${Math.floor(Math.random() * 60 + 1)} min${Math.random() > 0.5 ? "s" : ""} ago`;

    return {
      id: `service-${i + 1}`,
      buyer: {
        name,
        avatar: initials,
        distance,
      },
      title,
      category,
      budget,
      urgency,
      quantity,
      timestamp: timestamp,
      type: "service" as const,
    };
  });

  return [...productItems, ...serviceItems].sort(() => Math.random() - 0.5);
};

// ============================================
// SINGLE BROADCAST ITEM (chat‑style)
// ============================================
function BroadcastItem({
  broadcast,
  isNew,
  onAction,
  side,
}: {
  broadcast: BroadcastRequest;
  isNew: boolean;
  onAction: (action: "respond", id: string) => void;
  side: "left" | "right";
}) {
  const badge = broadcast.urgency ? BADGE_CONFIG[broadcast.urgency] : null;

  // Chat bubble style based on side
  const bubbleClasses =
    side === "left"
      ? "rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-md"
      : "rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-md";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-3 last:mb-0 px-1 w-[250px]"
    >
      <div
        className={`${bubbleClasses} bg-white/40 backdrop-blur-sm border border-white/20 p-2.5 shadow-sm relative ${isNew ? "ring-1 ring-primary/30" : ""}`}
      >
        {isNew && (
          <div className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full shadow-lg">
            NEW
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          {/* Top row: name + distance + badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-black font-medium text-xs truncate">
              {broadcast.buyer.name}
            </span>
            <span className="text-black/40 text-[9px] flex items-center gap-0.5">
              <MapPin className="h-2.5 w-2.5" />
              {broadcast.buyer.distance}
            </span>
            {badge && (
              <span
                className={`text-[7px] font-medium px-1.5 py-0.5 rounded-full border ${badge.color} ml-auto`}
              >
                {badge.label}
              </span>
            )}
          </div>

          {/* Title & category */}
          <div className="flex items-center gap-1.5">
            <span className="text-black/50 text-[8px] uppercase tracking-wider font-medium">
              {broadcast.category}
            </span>
            <span className="text-black/80 text-xs truncate font-medium">
              {broadcast.title}
            </span>
          </div>

          {/* Details row: budget, quantity, timestamp */}
          <div className="flex items-center gap-2 text-[9px] flex-wrap text-black/50">
            {broadcast.budget && (
              <span className="flex items-center gap-0.5">
                <span className="text-primary font-medium">₦</span>
                {broadcast.budget.replace("₦", "")}
              </span>
            )}
            {broadcast.quantity && (
              <span className="flex items-center gap-0.5">
                <span className="text-black/30">Qty:</span>
                {broadcast.quantity}
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5 text-primary/60" />
              {broadcast.timestamp}
            </span>
          </div>

          <div className="flex items-center pt-0.5">
            <button
              onClick={() => onAction("respond", broadcast.id)}
              className="text-[6px] font-semibold text-orange-900 hover:text-orange-950 transition px-1.5 py-0.5 rounded-full border border-orange-300/70 bg-orange-100/90 hover:bg-orange-200 leading-tight"
            >
              Respond
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// COLUMN COMPONENT (scrollable, clean)
// ============================================
function BroadcastColumn({
  title,
  icon,
  broadcasts,
  newBroadcastId,
  onAction,
  side,
}: {
  title: string;
  icon: React.ReactNode;
  broadcasts: BroadcastRequest[];
  newBroadcastId: string | null;
  onAction: (action: "respond", id: string) => void;
  side: "left" | "right";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new items added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [broadcasts]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0">
        {icon}
        <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
          {title}
        </span>
        <span className="text-[10px] text-white/30 ml-auto">
          {broadcasts.length} live
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {broadcasts.map((broadcast) => (
            <BroadcastItem
              key={broadcast.id}
              broadcast={broadcast}
              isNew={newBroadcastId === broadcast.id}
              onAction={onAction}
              side={side}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// TOOLTIP BUTTON
// ============================================
function TooltipButton({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`
          rounded-full backdrop-blur-sm p-2.5
          text-white transition border
          ${active ? "bg-emerald-500/80 border-emerald-300/50 hover:bg-emerald-500" : "bg-white/15 border-white/10 hover:bg-white/25"}
          w-10 h-10 flex items-center justify-center
        `}
      >
        {icon}
      </button>
      <div
        className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none whitespace-nowrap
        "
      >
        <span className="bg-black/80 text-white text-[10px] px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-sm border border-white/10">
          {label}
        </span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-black/80 border-r border-b border-white/10" />
      </div>
    </div>
  );
}

export function BroadcastControls({ onCameraStream }: { onCameraStream?: (stream: MediaStream | null) => void }) {
  const userData = useHaggleStore((state) => state.userData);
  const [products, setProducts] = useState<BackendListing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [productsOpen, setProductsOpen] = useState(false);
  const [cameraState, setCameraState] = useState("Set up camera");
  const [micState, setMicState] = useState("Configure microphone");
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [deviceMessage, setDeviceMessage] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const sellerId = String(userData?.id || userData?.user_id || userData?.profile?.user_id || "");
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const requestDevice = async (kind: "video" | "audio") => {
    setDeviceMessage("");
    const isOn = kind === "video" ? cameraOn : micOn;
    const streamRef = kind === "video" ? cameraStreamRef : microphoneStreamRef;
    if (isOn) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (kind === "video") {
        onCameraStream?.(null);
        setCameraOn(false);
        setCameraState("Set up camera");
      } else {
        setMicOn(false);
        setMicState("Configure microphone");
      }
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        kind === "video" ? { video: true } : { audio: true },
      );
      if (kind === "video") {
        cameraStreamRef.current = stream;
        onCameraStream?.(stream);
        setCameraOn(true);
        setCameraState("Turn camera off");
      } else {
        microphoneStreamRef.current = stream;
        setMicOn(true);
        setMicState("Turn microphone off");
      }
    } catch {
      setDeviceMessage(`Allow ${kind === "video" ? "camera" : "microphone"} access in your browser to turn it on.`);
    }
  };

  const openProducts = async () => {
    setProductsOpen(true);
    if (!sellerId || products.length || loadingProducts) return;
    setLoadingProducts(true);
    try {
      const result = await getSellerListings(sellerId);
      const rows = Array.isArray(result) ? result : result?.data;
      setProducts((Array.isArray(rows) ? rows : []).filter(
        (item: BackendListing) => (item.listing_type || "product").toLowerCase() === "product",
      ));
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const saveProducts = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`haggle-live-products:${sellerId}`, JSON.stringify(selectedIds));
    }
    setProductsOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <TooltipButton icon={cameraOn ? <Camera className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />} label={cameraState} onClick={() => void requestDevice("video")} active={cameraOn} />
          <TooltipButton icon={micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />} label={micState} onClick={() => void requestDevice("audio")} active={micOn} />
          <TooltipButton icon={<ShoppingBag className="h-4 w-4" />} label="Manage products" onClick={() => void openProducts()} />
        </div>
        <div className="h-8 w-px bg-white/10" />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/instant-live"
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-strong hover:shadow-xl hover:shadow-primary/35 border border-primary/20"
          >
            <Zap className="h-4 w-4" />
            Go Live
          </Link>
        </motion.div>
      </div>
      {deviceMessage && <p role="status" className="mt-2 text-center text-xs text-white/70">{deviceMessage}</p>}
      <Dialog open={productsOpen} onOpenChange={setProductsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Products for your live</DialogTitle>
            <DialogDescription>Select the listings you plan to feature during your broadcast.</DialogDescription>
          </DialogHeader>
          <div className="max-h-80 space-y-2 overflow-y-auto py-2">
            {loadingProducts ? <p className="text-sm text-muted">Loading your listings…</p> : null}
            {!loadingProducts && products.length === 0 ? <p className="text-sm text-muted">No product listings found.</p> : null}
            {products.map((product) => (
              <label key={product.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 p-3 hover:bg-background-elevated/40">
                <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, product.id] : current.filter((id) => id !== product.id))} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{product.title}</span>
                <span className="text-xs text-muted">{product.starting_amount ? `${product.price_currency || "₦"} ${product.starting_amount}` : "Price on request"}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <button onClick={saveProducts} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">Save selection</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// MAIN EXPORT: BroadCastShowRoom
// ============================================
export function BroadCastShowRoom() {
  const [allBroadcasts] = useState<BroadcastRequest[]>(() =>
    generateMockBroadcasts(),
  );
  const [productQueue, setProductQueue] = useState<BroadcastRequest[]>([]);
  const [serviceQueue, setServiceQueue] = useState<BroadcastRequest[]>([]);
  const [newBroadcastId, setNewBroadcastId] = useState<string | null>(null);
  const [productPointer, setProductPointer] = useState(0);
  const [servicePointer, setServicePointer] = useState(0);
  const VISIBLE_COUNT = 20;

  const allProducts = useMemo(
    () => allBroadcasts.filter((b) => b.type === "product"),
    [allBroadcasts],
  );
  const allServices = useMemo(
    () => allBroadcasts.filter((b) => b.type === "service"),
    [allBroadcasts],
  );

  // Initialize queues
  useEffect(() => {
    const initialProducts = allProducts.slice(0, VISIBLE_COUNT);
    const initialServices = allServices.slice(0, VISIBLE_COUNT);
    setProductQueue(initialProducts);
    setServiceQueue(initialServices);
    setProductPointer(initialProducts.length);
    setServicePointer(initialServices.length);
  }, [allProducts, allServices]);

  // Product queue timer
  useEffect(() => {
    if (allProducts.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = productPointer % allProducts.length;
      const nextBroadcast = allProducts[nextIndex];
      setProductQueue((prev) => {
        let newQueue = [...prev, nextBroadcast];
        if (newQueue.length > VISIBLE_COUNT) {
          newQueue = newQueue.slice(-VISIBLE_COUNT);
        }
        return newQueue;
      });
      setNewBroadcastId(nextBroadcast.id);
      setTimeout(() => setNewBroadcastId(null), 1500);
      setProductPointer((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [productPointer, allProducts]);

  // Service queue timer
  useEffect(() => {
    if (allServices.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = servicePointer % allServices.length;
      const nextBroadcast = allServices[nextIndex];
      setServiceQueue((prev) => {
        let newQueue = [...prev, nextBroadcast];
        if (newQueue.length > VISIBLE_COUNT) {
          newQueue = newQueue.slice(-VISIBLE_COUNT);
        }
        return newQueue;
      });
      setNewBroadcastId(nextBroadcast.id);
      setTimeout(() => setNewBroadcastId(null), 1500);
      setServicePointer((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [servicePointer, allServices]);

  const handleAction = (action: "respond", id: string) => {
    console.log(`Action: ${action} on broadcast ${id}`);
  };

  return (
    <div
      className="relative flex h-full min-h-[25rem] flex-1 flex-col overflow-hidden rounded-[32px] border border-border/40 bg-black/0 xl:min-h-0"
      style={{ backgroundImage: "url('./bg2.jpg')" }}
    >
      {/* Two-Column Feed - Clean, no outlines/borders/backgrounds */}
      <div className="flex flex-row justify-center items-start gap-10 p-2 h-full">
        {/* Left Column - Products */}
        <div className="overflow-hidden h-full">
          <BroadcastColumn
            title="Products"
            icon={<Package className="h-3.5 w-3.5 text-green-400" />}
            broadcasts={productQueue}
            newBroadcastId={newBroadcastId}
            onAction={handleAction}
            side="left"
          />
        </div>

        {/* Right Column - Services */}
        <div className="overflow-hidden h-full">
          <BroadcastColumn
            title="Services"
            icon={<Wrench className="h-3.5 w-3.5 text-purple-400" />}
            broadcasts={serviceQueue}
            newBroadcastId={newBroadcastId}
            onAction={handleAction}
            side="right"
          />
        </div>
      </div>

      <div className="absolute bottom-3 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
        Live Broadcasts
      </div>

    </div>
  );
}
