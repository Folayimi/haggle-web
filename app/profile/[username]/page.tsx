// app/profile/[username]/page.tsx
"use client";

import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Package,
  Sparkles,
  Store,
  Video,
  MessageSquare,
  Star,
  Camera,
  Briefcase,
  Award,
  BarChart3,
  Bot,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useHaggleStore } from "@/lib/app-store";
import {
  currentUser,
  sellerProfiles,
  sellerProducts,
  marketServices,
  userLiveSessions,
  userBroadcastActivities,
  userReviews,
} from "@/lib/mock-data";
import type { LiveSession, BroadcastActivity, Review, GalleryItem, SectionId, CompletionStatus } from "@/lib/types";
import BusinessHero from "@/components/business-profile/BusinessHero";
import SectionPlaceholder from "@/components/business-profile/SectionPlaceholder";
import BusinessStory from "@/components/business-profile/BusinessStory";
import ProductsSection from "@/components/business-profile/ProductsSection";
import ServicesSection from "@/components/business-profile/ServicesSection";
import LiveShoppingSection from "@/components/business-profile/LiveShoppingSection";
import BroadcastActivitySection from "@/components/business-profile/BroadcastActivitySection";
import ReviewsSection from "@/components/business-profile/ReviewsSection";
import GallerySection from "@/components/business-profile/GallerySection";
import BusinessInformation from "@/components/business-profile/BusinessInformation";
import AnalyticsDashboard from "@/components/business-profile/AnalyticsDashboard";
import AchievementsSection from "@/components/business-profile/AchievementsSection";
import AIAssistantWidget from "@/components/business-profile/AIAssistantWidget";
import ProfileCompletionCard from "@/components/business-profile/ProfileCompletionCard";
import SectionToolbar from "@/components/business-profile/SectionToolbar";
import EditHeroModal from "@/components/business-profile/EditHeroModal";
import EditStoryModal from "@/components/business-profile/EditStoryModal";
import EditProductModal from "@/components/business-profile/EditProductModal";
import EditServiceModal from "@/components/business-profile/EditServiceModal";
import EditLiveModal from "@/components/business-profile/EditLiveModal";
import EditGalleryModal from "@/components/business-profile/EditGalleryModal";

// ============================================
// TYPES
// ============================================
type SectionId =
  | "story"
  | "products"
  | "services"
  | "live"
  | "broadcast"
  | "reviews"
  | "gallery"
  | "information"
  | "achievements"
  | "analytics"
  | "ai-assistant";

interface NavSection {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
}

// ============================================
// NAV SECTIONS CONFIG
// ============================================
const NAV_SECTIONS: NavSection[] = [
  { id: "story", label: "Story", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "products", label: "Products", icon: <Package className="h-3.5 w-3.5" /> },
  { id: "services", label: "Services", icon: <Briefcase className="h-3.5 w-3.5" /> },
  { id: "live", label: "Live", icon: <Video className="h-3.5 w-3.5" /> },
  { id: "broadcast", label: "Broadcast", icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { id: "reviews", label: "Reviews", icon: <Star className="h-3.5 w-3.5" /> },
  { id: "gallery", label: "Gallery", icon: <Camera className="h-3.5 w-3.5" /> },
  { id: "information", label: "Info", icon: <Clock className="h-3.5 w-3.5" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { id: "achievements", label: "Achievements", icon: <Award className="h-3.5 w-3.5" /> },
  { id: "ai-assistant", label: "AI Assistant", icon: <Bot className="h-3.5 w-3.5" /> },
];

// ============================================
// SECTION NAVIGATION COMPONENT
// ============================================
function SectionNavigation({
  sections,
  activeSection,
  onSectionClick,
  isOwner,
}: {
  sections: NavSection[];
  activeSection: SectionId | null;
  onSectionClick: (id: SectionId) => void;
  isOwner: boolean;
}) {
  const filteredSections = sections.filter((s) => {
    if (s.id === "analytics" && !isOwner) return false;
    if (s.id === "ai-assistant" && !isOwner) return false;
    return true;
  });

  return (
    <motion.nav
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="hidden lg:block w-14 xl:w-16 flex-shrink-0 sticky top-24 self-start"
    >
      <div className="rounded-2xl border border-border/40 bg-background-elevated/20 backdrop-blur-md p-2 shadow-card">
        {filteredSections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`
                relative w-full flex items-center justify-center gap-2 px-2.5 py-2.5 rounded-xl
                transition-all duration-200 group
                ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted/40 hover:text-foreground hover:bg-background-elevated/30"
                }
              `}
              title={section.label}
            >
              <span className="flex-shrink-0">{section.icon}</span>
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-primary"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}

// ============================================
// CONSTANTS - Available Sections (for placeholders)
// ============================================
// This list is used to generate placeholders for sections not yet implemented.
// We exclude the ones we've already built.
const PLACEHOLDER_SECTIONS = [
  {
    id: "ai-assistant" as SectionId,
    title: "AI Business Assistant",
    description: "Smart suggestions to grow your business.",
    icon: <Bot className="h-5 w-5" />,
    isOwnerOnly: true,
  },
  // If you have more placeholder sections, add them here.
];

// ============================================
// MAIN PAGE
// ============================================
export default function BusinessProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;

  const viewParam = searchParams.get("view");

  const profileUser = sellerProfiles.find((p) => p.username === username) || currentUser;

  const isOwnerDefault = profileUser.id === currentUser.id;
  const isOwner =
    viewParam === "owner"
      ? true
      : viewParam === "visitor"
        ? false
        : isOwnerDefault;

  const userProducts = sellerProducts.filter(
    (product) => product.sellerId === profileUser.id,
  );
  const userServices = marketServices.filter(
    (service) => service.seller?.id === profileUser.id,
  );
  const userLiveSessionsFiltered = userLiveSessions.filter(
    (session) => session.sellerId === profileUser.id,
  );
  const userBroadcasts = userBroadcastActivities.filter(
    (activity) => activity.sellerId === profileUser.id,
  );
  const userReviewsFiltered = userReviews.filter(
    (review) => review.sellerId === profileUser.id,
  );

  // State
  const [user, setUser] = useState(profileUser);
  const [products, setProducts] = useState(userProducts);
  const [services, setServices] = useState(userServices);
  const [liveSessions, setLiveSessions] = useState(userLiveSessionsFiltered);
  const [broadcastActivities, setBroadcastActivities] = useState(userBroadcasts);
  const [reviews, setReviews] = useState(userReviewsFiltered);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(profileUser.gallery || []);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  // Completion & Hidden Sections
  const [completion, setCompletion] = useState<CompletionStatus>(
    profileUser.completion || { logo: false, cover: false, story: false, contact: false, hours: false, delivery: false, gallery: false, social: false, team: false }
  );
  const [hiddenSections, setHiddenSections] = useState<string[]>(
    profileUser.preferences?.hiddenSections || []
  );

  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>(
    {} as Record<SectionId, HTMLDivElement | null>,
  );

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditStoryOpen, setIsEditStoryOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isEditLiveOpen, setIsEditLiveOpen] = useState(false);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isEditGalleryOpen, setIsEditGalleryOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingLive, setEditingLive] = useState<any>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [liveModalMode, setLiveModalMode] = useState<"schedule" | "edit" | "go-live">("schedule");

  // ============================================
  // SCROLL TRACKING
  // ============================================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            setActiveSection(id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      },
    );

    const sectionIds = NAV_SECTIONS.map((s) => s.id);
    sectionIds.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ============================================
  // SCROLL TO SECTION
  // ============================================
  const scrollToSection = (id: SectionId) => {
    const el = sectionRefs.current[id] || document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    } else {
      console.warn(`Section element not found for id: ${id}`);
    }
  };

  // ============================================
  // COMPLETION HANDLER
  // ============================================
  const handleCompletionAction = (field: keyof CompletionStatus) => {
    // Toggle completion for demo; in production, open edit modal or navigate to section
    setCompletion((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    // Scroll to the relevant section
    if (field === "story") scrollToSection("story");
    else if (field === "gallery") scrollToSection("gallery");
    else if (field === "hours" || field === "delivery" || field === "contact" || field === "social") {
      scrollToSection("information");
    }
    // For logo/cover, we could scroll to hero or open edit modal
  };

  // ============================================
  // SECTION HIDE/TOGGLE
  // ============================================
  const handleToggleHide = (sectionId: SectionId) => {
    setHiddenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // ============================================
  // PRODUCT HANDLERS
  // ============================================
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsEditProductOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsEditProductOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleSaveProduct = (productData: any) => {
    if (productData.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? { ...p, ...productData } : p)),
      );
    } else {
      const newProduct = {
        ...productData,
        id: `product-${Date.now()}`,
        sellerId: user.id,
        createdAt: new Date().toISOString(),
        views: 0,
        isLive: false,
        isTrending: false,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setIsEditProductOpen(false);
  };

  // ============================================
  // SERVICE HANDLERS
  // ============================================
  const handleAddService = () => {
    setEditingService(null);
    setIsEditServiceOpen(true);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setIsEditServiceOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const handleSaveService = (serviceData: any) => {
    if (serviceData.id) {
      setServices((prev) =>
        prev.map((s) => (s.id === serviceData.id ? { ...s, ...serviceData } : s)),
      );
    } else {
      const newService = {
        ...serviceData,
        id: `service-${Date.now()}`,
        seller: { id: user.id },
        createdAt: new Date().toISOString(),
        views: 0,
        isPopular: false,
      };
      setServices((prev) => [...prev, newService]);
    }
    setIsEditServiceOpen(false);
  };

  // ============================================
  // LIVE SESSION HANDLERS
  // ============================================
  const handleScheduleLive = () => {
    setEditingLive(null);
    setLiveModalMode("schedule");
    setIsEditLiveOpen(true);
  };

  const handleEditLive = (session: any) => {
    setEditingLive(session);
    setLiveModalMode("edit");
    setIsEditLiveOpen(true);
  };

  const handleDeleteLive = (sessionId: string) => {
    setLiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleStartLive = (session: any) => {
    setEditingLive(session);
    setLiveModalMode("go-live");
    setIsGoLiveOpen(true);
  };

  const handleSaveLive = (sessionData: any) => {
    if (sessionData.id) {
      setLiveSessions((prev) =>
        prev.map((s) => (s.id === sessionData.id ? { ...s, ...sessionData } : s)),
      );
    } else {
      const newSession = {
        ...sessionData,
        id: `live-${Date.now()}`,
        sellerId: user.id,
        status: sessionData.status || "upcoming",
        viewers: 0,
        orders: 0,
      };
      setLiveSessions((prev) => [...prev, newSession]);
    }
    setIsEditLiveOpen(false);
    setIsGoLiveOpen(false);
  };

  // ============================================
  // GALLERY HANDLERS
  // ============================================
  const handleAddGallery = () => {
    setEditingGalleryItem(null);
    setIsEditGalleryOpen(true);
  };

  const handleEditGallery = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setIsEditGalleryOpen(true);
  };

  const handleDeleteGallery = (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveGallery = (itemData: GalleryItem) => {
    if (itemData.id) {
      setGalleryItems((prev) =>
        prev.map((item) => (item.id === itemData.id ? itemData : item)),
      );
    } else {
      const newItem = {
        ...itemData,
        id: `gallery-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setGalleryItems((prev) => [...prev, newItem]);
    }
    setIsEditGalleryOpen(false);
  };

  // ============================================
  // BROADCAST HANDLERS
  // ============================================
  const handleViewAllBroadcasts = () => {
    console.log("View all broadcasts");
  };

  // ============================================
  // REVIEW HANDLERS
  // ============================================
  const handleRespondToReview = (reviewId: string, response: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              sellerResponse: {
                content: response,
                createdAt: new Date().toISOString(),
              },
            }
          : review,
      ),
    );
  };

  // ============================================
  // HERO & STORY HANDLERS
  // ============================================
  const handleSaveHero = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const handleSaveStory = (updatedStory: string) => {
    setUser({ ...user, businessStory: updatedStory });
  };

  // ============================================
  // BUSINESS INFORMATION SAVE
  // ============================================
  const handleSaveBusinessInfo = (data: any) => {
    console.log("Save business info:", data);
    // In production, send to backend
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const navSections = NAV_SECTIONS.filter((s) => {
    if (s.id === "analytics" && !isOwner) return false;
    if (s.id === "ai-assistant" && !isOwner) return false;
    return true;
  });

  // Prepare business info data
  const businessInfoData = {
    businessName: user.businessName,
    hours: user.hero?.businessHours || [],
    location: user.hero?.location || "",
    phone: "",
    email: "",
    website: "",
    socialLinks: [],
    deliveryOptions: [],
    paymentMethods: [],
    returnPolicy: "",
    faqs: [],
    languages: [],
  };

  // AI Assistant suggestions (static for demo)
  const aiSuggestions = [
    {
      id: '1',
      message: 'Your profile is missing business hours. Profiles with hours receive 31% more customer messages.',
      action: () => scrollToSection('information'),
    },
    {
      id: '2',
      message: 'You have 3 products with no images. Add images to increase engagement.',
      action: () => scrollToSection('products'),
    },
    {
      id: '3',
      message: '3 buyers nearby are searching for Home Decor. Post a live session?',
      action: handleScheduleLive,
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background pb-12">
        <BusinessHero
          user={user}
          isOwner={isOwner}
          onEditHero={() => setIsEditModalOpen(true)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex gap-6">
            <div className="flex-1 min-w-0 space-y-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* 0. PROFILE COMPLETION CARD (OWNER ONLY) */}
                {isOwner && (
                  <motion.div variants={itemVariants} className="mb-6">
                    <ProfileCompletionCard
                      completion={completion}
                      onAction={handleCompletionAction}
                    />
                  </motion.div>
                )}

                {/* 1. Story */}
                <motion.div
                  ref={(el) => { sectionRefs.current["story"] = el; }}
                  id="story"
                  variants={itemVariants}
                  className="scroll-mt-20"
                >
                  {isOwner && (
                    <SectionToolbar
                      title="Story"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("story")}
                      onEdit={() => setIsEditStoryOpen(true)}
                      onHide={() => handleToggleHide("story")}
                    />
                  )}
                  {!hiddenSections.includes("story") && (
                    <BusinessStory
                      story={user.businessStory || ""}
                      isOwner={isOwner}
                      onEdit={() => setIsEditStoryOpen(true)}
                    />
                  )}
                </motion.div>

                {/* 2. Products */}
                <motion.div
                  ref={(el) => { sectionRefs.current["products"] = el; }}
                  id="products"
                  variants={itemVariants}
                  className="scroll-mt-20 mt-8"
                >
                  {isOwner && (
                    <SectionToolbar
                      title="Products"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("products")}
                      onAdd={handleAddProduct}
                      onEdit={handleAddProduct}
                      onHide={() => handleToggleHide("products")}
                    />
                  )}
                  {!hiddenSections.includes("products") && (
                    <ProductsSection
                      products={products}
                      isOwner={isOwner}
                      onAddProduct={handleAddProduct}
                      onEditProduct={handleEditProduct}
                      onDeleteProduct={handleDeleteProduct}
                    />
                  )}
                </motion.div>

                {/* 3. Services */}
                <motion.div
                  ref={(el) => { sectionRefs.current["services"] = el; }}
                  id="services"
                  variants={itemVariants}
                  className="scroll-mt-20 mt-8"
                >
                  {isOwner && (
                    <SectionToolbar
                      title="Services"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("services")}
                      onAdd={handleAddService}
                      onEdit={handleAddService}
                      onHide={() => handleToggleHide("services")}
                    />
                  )}
                  {!hiddenSections.includes("services") && (
                    <ServicesSection
                      services={services}
                      isOwner={isOwner}
                      onAddService={handleAddService}
                      onEditService={handleEditService}
                      onDeleteService={handleDeleteService}
                    />
                  )}
                </motion.div>

                {/* 4. Live Shopping */}
                <motion.div
                  ref={(el) => { sectionRefs.current["live"] = el; }}
                  id="live"
                  variants={itemVariants}
                  className="scroll-mt-20 mt-8"
                >
                  {isOwner && (
                    <SectionToolbar
                      title="Live Shopping"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("live")}
                      onAdd={handleScheduleLive}
                      onEdit={handleScheduleLive}
                      onHide={() => handleToggleHide("live")}
                    />
                  )}
                  {!hiddenSections.includes("live") && (
                    <LiveShoppingSection
                      sessions={liveSessions}
                      isOwner={isOwner}
                      onScheduleLive={handleScheduleLive}
                      onEditLive={handleEditLive}
                      onDeleteLive={handleDeleteLive}
                      onStartLive={handleStartLive}
                    />
                  )}
                </motion.div>

                {/* 5. Broadcast Activity */}
                <motion.div
                  ref={(el) => { sectionRefs.current["broadcast"] = el; }}
                  id="broadcast"
                  variants={itemVariants}
                  className="scroll-mt-20 mt-8"
                >
                  {isOwner && (
                    <SectionToolbar
                      title="Broadcast Activity"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("broadcast")}
                      onHide={() => handleToggleHide("broadcast")}
                    />
                  )}
                  {!hiddenSections.includes("broadcast") && (
                    <BroadcastActivitySection
                      activities={broadcastActivities}
                      isOwner={isOwner}
                      onViewAll={handleViewAllBroadcasts}
                    />
                  )}
                </motion.div>

                {/* 6. Reviews */}
                <motion.div
                  ref={(el) => { sectionRefs.current["reviews"] = el; }}
                  id="reviews"
                  variants={itemVariants}
                  className="scroll-mt-20 mt-8"
                >
                  {isOwner && (
                    <SectionToolbar
                      title="Reviews"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("reviews")}
                      onHide={() => handleToggleHide("reviews")}
                    />
                  )}
                  {!hiddenSections.includes("reviews") && (
                    <ReviewsSection
                      reviews={reviews}
                      isOwner={isOwner}
                      onRespond={handleRespondToReview}
                      sellerName={user.businessName}
                    />
                  )}
                </motion.div>

                {/* 7. Gallery */}
                <motion.div
                  ref={(el) => { sectionRefs.current["gallery"] = el; }}
                  id="gallery"
                  variants={itemVariants}
                  className="scroll-mt-20 mt-8"
                >
                  {isOwner && (
                    <SectionToolbar
                      title="Gallery"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("gallery")}
                      onAdd={handleAddGallery}
                      onEdit={handleAddGallery}
                      onHide={() => handleToggleHide("gallery")}
                    />
                  )}
                  {!hiddenSections.includes("gallery") && (
                    <GallerySection
                      items={galleryItems}
                      isOwner={isOwner}
                      onAddItem={handleAddGallery}
                      onEditItem={handleEditGallery}
                      onDeleteItem={handleDeleteGallery}
                    />
                  )}
                </motion.div>

                {/* 8. Business Information */}
                <motion.div
                  ref={(el) => { sectionRefs.current["information"] = el; }}
                  id="information"
                  variants={itemVariants}
                  className="scroll-mt-20 mt-8"
                >
                  {isOwner && (
                    <SectionToolbar
                      title="Business Information"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("information")}
                      onHide={() => handleToggleHide("information")}
                    />
                  )}
                  {!hiddenSections.includes("information") && (
                    <BusinessInformation
                      {...businessInfoData}
                      isOwner={isOwner}
                      onSave={handleSaveBusinessInfo}
                    />
                  )}
                </motion.div>

                {/* 9. Analytics (Owner only) */}
                {isOwner && (
                  <motion.div
                    ref={(el) => { sectionRefs.current["analytics"] = el; }}
                    id="analytics"
                    variants={itemVariants}
                    className="scroll-mt-20 mt-8"
                  >
                    <SectionToolbar
                      title="Analytics"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("analytics")}
                      onHide={() => handleToggleHide("analytics")}
                    />
                    {!hiddenSections.includes("analytics") && (
                      <AnalyticsDashboard
                        data={user.analytics || {
                          visitors: 0,
                          profileViews: 0,
                          clicks: 0,
                          followers: 0,
                          productViews: 0,
                          messages: 0,
                          broadcastResponses: 0,
                          conversionRate: 0,
                          revenue: 0,
                          topProducts: [],
                          returningCustomers: 0,
                          nearbyAudience: 0,
                        }}
                        isOwner={isOwner}
                      />
                    )}
                  </motion.div>
                )}

                {/* 10. Achievements */}
                <motion.div
                  ref={(el) => { sectionRefs.current["achievements"] = el; }}
                  id="achievements"
                  variants={itemVariants}
                  className="scroll-mt-20 mt-8"
                >
                  {isOwner && (
                    <SectionToolbar
                      title="Achievements"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("achievements")}
                      onHide={() => handleToggleHide("achievements")}
                    />
                  )}
                  {!hiddenSections.includes("achievements") && (
                    <AchievementsSection
                      achievements={user.achievements || []}
                      isOwner={isOwner}
                    />
                  )}
                </motion.div>

                {/* 11. AI Assistant (Owner only, as a section placeholder) */}
                {isOwner && (
                  <motion.div
                    ref={(el) => { sectionRefs.current["ai-assistant"] = el; }}
                    id="ai-assistant"
                    variants={itemVariants}
                    className="scroll-mt-20 mt-8"
                  >
                    <SectionToolbar
                      title="AI Assistant"
                      isOwner={isOwner}
                      isHidden={hiddenSections.includes("ai-assistant")}
                      onHide={() => handleToggleHide("ai-assistant")}
                    />
                    {!hiddenSections.includes("ai-assistant") && (
                      <SectionPlaceholder
                        title="AI Business Assistant"
                        description="Smart suggestions to grow your business. The AI assistant will appear as a floating widget."
                        icon={<Bot className="h-5 w-5" />}
                        onAction={() => console.log("AI Assistant settings")}
                        actionLabel="Configure"
                        isOwner={isOwner}
                        hasContent={false}
                      />
                    )}
                  </motion.div>
                )}

                {/* 12. Other Placeholder Sections (if any) */}
                {PLACEHOLDER_SECTIONS.filter(
                  (s) => !["story", "products", "services", "live", "broadcast", "reviews", "gallery", "information", "achievements", "analytics", "ai-assistant"].includes(s.id)
                ).map((section) => {
                  if (section.isOwnerOnly && !isOwner) return null;
                  const sectionId = section.id;
                  return (
                    <motion.div
                      key={section.id}
                      ref={(el) => { sectionRefs.current[sectionId] = el; }}
                      id={sectionId}
                      variants={itemVariants}
                      className="scroll-mt-20 mt-8"
                    >
                      {isOwner && (
                        <SectionToolbar
                          title={section.title}
                          isOwner={isOwner}
                          isHidden={hiddenSections.includes(sectionId)}
                          onHide={() => handleToggleHide(sectionId)}
                        />
                      )}
                      {!hiddenSections.includes(sectionId) && (
                        <SectionPlaceholder
                          title={section.title}
                          description={section.description}
                          icon={section.icon}
                          onAction={() => console.log(`Edit ${section.id}`)}
                          actionLabel={isOwner ? "Setup" : undefined}
                          isOwner={isOwner}
                          hasContent={false}
                        />
                      )}
                    </motion.div>
                  );
                })}

              </motion.div>
            </div>

            {/* Sidebar Navigation */}
            <SectionNavigation
              sections={navSections}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
              isOwner={isOwner}
            />
          </div>
        </div>

        <div className="h-12" />
      </div>

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}
      <EditHeroModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveHero}
      />

      <EditStoryModal
        isOpen={isEditStoryOpen}
        onClose={() => setIsEditStoryOpen(false)}
        story={user.businessStory || ""}
        onSave={handleSaveStory}
      />

      <EditProductModal
        isOpen={isEditProductOpen}
        onClose={() => setIsEditProductOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <EditServiceModal
        isOpen={isEditServiceOpen}
        onClose={() => setIsEditServiceOpen(false)}
        service={editingService}
        onSave={handleSaveService}
      />

      <EditLiveModal
        isOpen={isEditLiveOpen || isGoLiveOpen}
        onClose={() => {
          setIsEditLiveOpen(false);
          setIsGoLiveOpen(false);
        }}
        session={editingLive}
        onSave={handleSaveLive}
        mode={liveModalMode}
      />

      <EditGalleryModal
        isOpen={isEditGalleryOpen}
        onClose={() => setIsEditGalleryOpen(false)}
        item={editingGalleryItem}
        onSave={handleSaveGallery}
      />

      {/* ============================================ */}
      {/* AI ASSISTANT FLOATING WIDGET */}
      {/* ============================================ */}
      <AIAssistantWidget
        suggestions={aiSuggestions}
        isOwner={isOwner}
      />
    </>
  );
}