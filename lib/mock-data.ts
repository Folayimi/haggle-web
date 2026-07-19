// lib/mock-data.ts

import type {
  Conversation,
  GalleryItem,
  LiveSession,
  MarketService,
  NegotiationParticipant,
  Review,
  RoomPreset,
  SearchResult,
  SellerLiveSession,
  SellerProduct,
  SellerProfile,
  UserProfile,
  StoryBlock,
  BusinessHours,
  HeroSettings,
  CompletionStatus,
  AnalyticsData,
  Achievement,
  Preferences,
  BroadcastActivity,
} from "@/lib/types";

// ============================================
// EXISTING DATA (YOURS, UNCHANGED)
// ============================================

const products: SellerProduct[] = [
  {
    id: "product-vase",
    sellerId: "seller-maria",
    name: "Vintage Ceramic Story Vase",
    category: "Home Decor",
    price: "$145",
    imageUrl:
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&w=900&q=80",
    description:
      "A warm-toned ceramic vase styled for modern apartments and content-friendly shelves.",
    features: ["Hand-thrown finish", "Signed base", "Ships with care kit"],
    stockStatus: "7 left in studio stock",
    negotiationNote: "Open to bundle pricing for two or more pieces.",
  },
  {
    id: "product-headset",
    sellerId: "seller-james",
    name: "Pulse Beam Noise-Cancel Headset",
    category: "Tech",
    price: "$289",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description:
      "Studio-grade listening with deep bass tuning and creator-friendly battery life.",
    features: ["42-hour battery", "Dual device pairing", "Creator EQ profile"],
    stockStatus: "Preorder batch closes tonight",
    negotiationNote: "Best pricing lands during live bundle rounds.",
  },
  {
    id: "product-lamp",
    sellerId: "seller-zara",
    name: "Aura Desk Glow Lamp",
    category: "Lifestyle",
    price: "$98",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description:
      "A sculptural desk lamp with a soft amber wash for bedrooms, edits, and late-night work sessions.",
    features: ["Warm ambient modes", "USB-C power", "Apartment-safe footprint"],
    stockStatus: "Ships next business day",
    negotiationNote: "Ask for creator bundles during Saturday lives.",
  },
  {
    id: "product-kit",
    sellerId: "seller-ife",
    name: "Glow Session Makeup Kit",
    category: "Beauty",
    price: "$124",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    description:
      "Camera-ready makeup essentials matched for warm undertones and bridal glow routines.",
    features: [
      "Five-piece set",
      "Sensitive-skin friendly",
      "Creator tutorial included",
    ],
    stockStatus: "12 curated sets left",
    negotiationNote: "Live buyers can unlock free brush upgrades.",
  },
];

const services: MarketService[] = [
  {
    id: "service-branding",
    sellerId: "seller-zara",
    name: "Launch-ready Creator Branding",
    category: "Creative Services",
    description:
      "Brand moodboards, launch visuals, and social-ready assets for product-first sellers.",
    price: "From $420",
    deliveryTime: "4 days",
    includes: ["Moodboard", "Story templates", "Mini brand guide"],
    audience: "New sellers leveling up their storefront identity",
    imageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "service-styling",
    sellerId: "seller-ife",
    name: "Bridal Soft Glam Session",
    category: "Beauty",
    description:
      "In-studio glam prep with shade matching, skin prep, and live-ready bridal finish.",
    price: "From $160",
    deliveryTime: "Same day",
    includes: ["Shade match", "Skin prep", "Touch-up mini kit"],
    audience: "Brides and event clients who want photo-first glam",
    imageUrl:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "service-install",
    sellerId: "seller-james",
    name: "Smart Apartment Setup",
    category: "Repairs & Tech",
    description:
      "Home-office and apartment smart device installation with automation walkthroughs.",
    price: "From $210",
    deliveryTime: "2 days",
    includes: ["Device setup", "Scene automation", "Care walkthrough"],
    audience: "Renters and small studios upgrading their workflow",
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
  },
];

const liveSessions: SellerLiveSession[] = [
  {
    id: "live-luxe",
    sellerId: "seller-maria",
    title: "Ceramic Drop Room: Layered Earth Tones",
    schedule: "Today • 7:30 PM",
    status: "Live now",
    preview:
      "A warm live room for collectors chasing soft editorial home pieces with real-time offers.",
    category: "Home Decor",
    buyerBenefits: [
      "Live-only markdown ladder",
      "Bundle shipping unlocked at two items",
      "One custom engraving slot tonight",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
    participantCount: 184,
    offerCount: 39,
    saveCount: 640,
    featuredItem: "Vintage Ceramic Story Vase",
    reminderMessage: "Jump in five minutes early for the first bundle round.",
  },
  {
    id: "live-wholesale",
    sellerId: "seller-maria",
    title: "Wholesale Moodboard Negotiation Session",
    schedule: "Tomorrow • 10:00 AM",
    status: "Scheduled",
    preview:
      "Maria walks through retailer bundles, custom glaze options, and shipping for boutique owners.",
    category: "Wholesale",
    buyerBenefits: [
      "Bulk order discounts",
      "Custom glaze queue access",
      "Priority shipping list",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=1200&q=80",
    participantCount: 62,
    offerCount: 14,
    saveCount: 223,
    featuredItem: "Retailer assortment set",
    reminderMessage:
      "Your ticket saves your queue position for the first buyer round.",
  },
  {
    id: "live-tech",
    sellerId: "seller-james",
    title: "Creator Tech Stack Night",
    schedule: "Today • 9:15 PM",
    status: "Upcoming",
    preview:
      "A high-energy showroom for headphones, room audio, and smart apartment bundle deals.",
    category: "Tech",
    buyerBenefits: [
      "Bundle-first pricing",
      "Extended warranty on live checkout",
      "Members-only accessory add-ons",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
    participantCount: 129,
    offerCount: 18,
    saveCount: 490,
    featuredItem: "Pulse Beam Noise-Cancel Headset",
    reminderMessage: "Reserve now and get the room link before doors open.",
  },
  {
    id: "live-glam",
    sellerId: "seller-ife",
    title: "Soft Glam Friday With Live Shade Matching",
    schedule: "Saturday • 5:00 PM",
    status: "Scheduled",
    preview:
      "A beauty-first negotiation room with routine demos, offer rounds, and brush upgrades.",
    category: "Beauty",
    buyerBenefits: [
      "Live shade recommendations",
      "Brush upgrade for first 10 buyers",
      "Voice-note Q&A after the session",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
    participantCount: 76,
    offerCount: 11,
    saveCount: 302,
    featuredItem: "Glow Session Makeup Kit",
    reminderMessage:
      "Bring your skin tone reference in chat for the best match.",
  },
];

// ============================================
// NEW: STORY BLOCKS
// ============================================
const storyBlocks: StoryBlock[] = [
  {
    id: "block-1",
    type: "mission",
    title: "Our Mission",
    content:
      "To connect people through meaningful, handcrafted objects that tell a story. Every piece we create is designed to bring warmth and character into your space.",
    order: 1,
  },
  {
    id: "block-2",
    type: "story",
    title: "Our Story",
    content:
      "Atelier Terra was born from a love of ceramics and a belief that everyday objects should be beautiful. We started in a small Lagos studio, experimenting with local clay and traditional techniques. Today, we ship worldwide, but every piece still carries the same care and intention.",
    order: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=600&h=400&fit=crop",
  },
  {
    id: "block-3",
    type: "why",
    title: "Why Choose Us",
    content:
      "We use locally sourced clay, employ traditional hand-throwing techniques, and ensure every piece is signed by the artist. Our process is transparent, sustainable, and rooted in craft.",
    order: 3,
  },
];

// ============================================
// NEW: BUSINESS HOURS
// ============================================
const businessHours: BusinessHours[] = [
  { day: "Monday", open: "09:00", close: "18:00", isClosed: false },
  { day: "Tuesday", open: "09:00", close: "18:00", isClosed: false },
  { day: "Wednesday", open: "09:00", close: "18:00", isClosed: false },
  { day: "Thursday", open: "09:00", close: "18:00", isClosed: false },
  { day: "Friday", open: "09:00", close: "17:00", isClosed: false },
  { day: "Saturday", open: "10:00", close: "14:00", isClosed: false },
  { day: "Sunday", open: "", close: "", isClosed: true },
];

// ============================================
// NEW: HERO SETTINGS
// ============================================
const heroSettings: HeroSettings = {
  slogan: "Handcrafted ceramics for warm homes",
  category: "Home Decor",
  status: "open",
  location: "Lagos, Nigeria",
  yearsInBusiness: 5,
  businessHours,
  deliveryRadius: 15,
  averageResponseTime: "12m",
  verifiedBadge: true,
};

// ============================================
// NEW: COMPLETION STATUS
// ============================================
const completionStatus: CompletionStatus = {
  logo: true,
  cover: true,
  story: true,
  contact: false,
  hours: false,
  delivery: false,
  gallery: true,
  social: false,
  team: false,
};

// ============================================
// NEW: ANALYTICS
// ============================================
const analyticsData: AnalyticsData = {
  visitors: 2847,
  profileViews: 1892,
  clicks: 345,
  followers: 24200,
  productViews: 763,
  messages: 128,
  broadcastResponses: 45,
  conversionRate: 4.8,
  revenue: 184000,
  topProducts: [
    { name: "Vintage Ceramic Story Vase", sales: 87 },
    { name: "Aura Desk Glow Lamp", sales: 62 },
    { name: "Glow Session Makeup Kit", sales: 41 },
  ],
  returningCustomers: 23,
  nearbyAudience: 56,
};

// ============================================
// NEW: ACHIEVEMENTS
// ============================================
const achievements: Achievement[] = [
  {
    id: "top-seller",
    name: "Top Seller",
    description: "Top 5% sellers by revenue",
    icon: "Trophy",
    earned: true,
    earnedAt: "2025-12-01",
  },
  {
    id: "100-sales",
    name: "100 Sales",
    description: "Reached 100 completed orders",
    icon: "ShoppingBag",
    earned: true,
    earnedAt: "2025-11-15",
  },
  {
    id: "verified-business",
    name: "Verified Business",
    description: "Business identity verified",
    icon: "ShieldCheck",
    earned: true,
  },
  {
    id: "fast-responder",
    name: "Fast Responder",
    description: "Average response time under 15 minutes",
    icon: "Clock",
    earned: true,
  },
  {
    id: "trusted",
    name: "Trusted",
    description: "Maintained 4.8+ rating for 6 months",
    icon: "Star",
    earned: true,
  },
  {
    id: "wholesale-partner",
    name: "Wholesale Partner",
    description: "Completed 20 wholesale orders",
    icon: "Briefcase",
    earned: false,
  },
  {
    id: "community-favorite",
    name: "Community Favorite",
    description: "Most bookmarked seller",
    icon: "Heart",
    earned: false,
  },
  {
    id: "early-adopter",
    name: "Early Adopter",
    description: "Joined Haggle in first month",
    icon: "Rocket",
    earned: true,
  },
];

// ============================================
// NEW: PREFERENCES
// ============================================
const preferences: Preferences = {
  accentColor: "#f44d24",
  sectionOrder: [
    "story",
    "products",
    "services",
    "live",
    "broadcast",
    "reviews",
    "gallery",
    "information",
    "achievements",
    "analytics",
    "ai-assistant",
  ],
  hiddenSections: [],
  heroLayout: "default",
  buttonStyle: "rounded",
  galleryStyle: "grid",
};

// ============================================
// DEFAULT GALLERY
// ============================================
const defaultGallery: GalleryItem[] = [
  {
    id: "gallery-1",
    type: "image",
    url: "https://picsum.photos/seed/shop1/600/400",
    caption: "Our storefront",
    category: "store",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gallery-2",
    type: "image",
    url: "https://picsum.photos/seed/shop2/600/400",
    caption: "Behind the scenes crafting",
    category: "behind-scenes",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gallery-3",
    type: "video",
    url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnail: "https://picsum.photos/seed/video1/600/400",
    caption: "Product demo",
    category: "products",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gallery-4",
    type: "image",
    url: "https://picsum.photos/seed/team1/600/400",
    caption: "Meet the team",
    category: "team",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gallery-5",
    type: "image",
    url: "https://picsum.photos/seed/event1/600/400",
    caption: "Our last pop-up event",
    category: "events",
    createdAt: new Date().toISOString(),
  },
];
// ============================================
// SELLER PROFILES (EXTENDED)
// ============================================
export const sellerProfiles: SellerProfile[] = [
  {
    id: "seller-maria",
    name: "Maria Santos",
    username: "@mariasantos",
    businessName: "Atelier Terra",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    rating: "4.9",
    responseTime: "12m",
    followers: "24.2K",
    badge: "Collector Favorite",
    isVerified: true,
    tradeMark: "Verified Seller",
    coverImageUrl:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1400&q=80",
    bio: "Hand-finished ceramics and story-rich pieces built for warm homes and boutique spaces.",
    sellsSummary: "Ceramics, home accents, collector drops",
    trustPills: ["ID verified", "Fast dispatch", "Top seller in decor"],
    whatTheyOffer: [
      "Curated drop rooms for design lovers",
      "Boutique wholesale bundles",
      "Private sourcing for stylists",
    ],
    products: products.filter((product) => product.sellerId === "seller-maria"),
    services: [],
    ongoingLives: liveSessions.filter((session) => session.id === "live-luxe"),
    upcomingLives: liveSessions.filter((session) =>
      ["live-wholesale"].includes(session.id),
    ),
    // NEW FIELDS
    storyBlocks,
    hero: heroSettings,
    completion: completionStatus,
    analytics: analyticsData,
    achievements,
    preferences,
    gallery: defaultGallery,
  },
  {
    id: "seller-james",
    name: "James Chen",
    username: "@jamestech",
    businessName: "Signal Loft",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    rating: "4.8",
    responseTime: "8m",
    followers: "18.6K",
    badge: "Tech Room Host",
    isVerified: true,
    tradeMark: "Top Rated",
    coverImageUrl:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1400&q=80",
    bio: "Creator tech, smart apartment upgrades, and room builds that feel premium without wasting budget.",
    sellsSummary: "Audio, smart home, content setup",
    trustPills: [
      "Priority support",
      "Verified warranty",
      "High return buyer rate",
    ],
    whatTheyOffer: [
      "Room-ready creator stacks",
      "Live tech demos with offer rounds",
      "Apartment automation consults",
    ],
    products: products.filter((product) => product.sellerId === "seller-james"),
    services: services.filter((service) => service.sellerId === "seller-james"),
    ongoingLives: [],
    upcomingLives: liveSessions.filter((session) => session.id === "live-tech"),
    storyBlocks: [],
    hero: { status: "open" },
    completion: {
      logo: false,
      cover: false,
      story: false,
      contact: false,
      hours: false,
      delivery: false,
      gallery: false,
      social: false,
      team: false,
    },
    analytics: {
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
    },
    achievements: [],
    preferences: { sectionOrder: [], hiddenSections: [] },
    gallery: [],
  },
  {
    id: "seller-zara",
    name: "Zara Cole",
    username: "@zaracreates",
    businessName: "Studio Bloom",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    rating: "4.7",
    responseTime: "22m",
    followers: "9.3K",
    badge: "Brand Glow Expert",
    isVerified: true,
    tradeMark: "Creative Pro",
    coverImageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
    bio: "Editorial visuals, storefront glow-ups, and branding systems that make digital shops feel alive.",
    sellsSummary: "Branding, room styling, creator visuals",
    trustPills: [
      "Portfolio verified",
      "Repeat seller clients",
      "Fast concept delivery",
    ],
    whatTheyOffer: [
      "Brand systems for storefront launches",
      "Atmosphere presets for live rooms",
      "Creative direction for social-first sellers",
    ],
    products: products.filter((product) => product.sellerId === "seller-zara"),
    services: services.filter((service) => service.sellerId === "seller-zara"),
    ongoingLives: [],
    upcomingLives: [],
    storyBlocks: [],
    hero: { status: "open" },
    completion: {
      logo: false,
      cover: false,
      story: false,
      contact: false,
      hours: false,
      delivery: false,
      gallery: false,
      social: false,
      team: false,
    },
    analytics: {
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
    },
    achievements: [],
    preferences: { sectionOrder: [], hiddenSections: [] },
    gallery: [],
  },
  {
    id: "seller-ife",
    name: "Ife Adebayo",
    username: "@ifeglows",
    businessName: "Ife Glow Studio",
    avatarUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80",
    rating: "5.0",
    responseTime: "5m",
    followers: "31.8K",
    badge: "Beauty Room Favorite",
    isVerified: true,
    tradeMark: "Seller Verified",
    coverImageUrl:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=80",
    bio: "Soft glam routines, live shade matching, and premium beauty drops for real people, not just campaigns.",
    sellsSummary: "Beauty kits, glam services, bridal prep",
    trustPills: ["Fast replies", "5-star live host", "Trusted repeat bookings"],
    whatTheyOffer: [
      "Beauty drops with live demos",
      "Service bookings and bridal prep",
      "Voice-note support after checkout",
    ],
    products: products.filter((product) => product.sellerId === "seller-ife"),
    services: services.filter((service) => service.sellerId === "seller-ife"),
    ongoingLives: [],
    upcomingLives: liveSessions.filter((session) => session.id === "live-glam"),
    storyBlocks: [],
    hero: { status: "open" },
    completion: {
      logo: false,
      cover: false,
      story: false,
      contact: false,
      hours: false,
      delivery: false,
      gallery: false,
      social: false,
      team: false,
    },
    analytics: {
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
    },
    achievements: [],
    preferences: { sectionOrder: [], hiddenSections: [] },
    gallery: [],
  },
];

// ============================================
// EXPORTED DATA
// ============================================
export const featuredProduct = products[0];
export const featuredService = services[0];
export const featuredSeller = sellerProfiles[0];

// currentUser is now a SellerProfile, not UserProfile
export const currentUser: SellerProfile = sellerProfiles[0];

// Keep UserProfile for compatibility with existing code
export const currentUserProfile: UserProfile = {
  id: "user-ava",
  fullName: "Ava Johnson",
  username: "@avaj",
  businessName: "Ava Finds",
  avatarUrl:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  bio: "Deal hunter, room regular, and occasional seller building a cozy studio storefront.",
  role: "both",
  metrics: {
    savedDeals: 17,
    upcomingLives: 4,
    roomsJoined: 39,
  },
  sellerId: "seller-maria",
};

export const conversations: Conversation[] = [
  {
    id: "conversation-maria",
    sellerId: "seller-maria",
    sellerName: "Maria Santos",
    sellerAvatar: sellerProfiles[0].avatarUrl,
    sellerTagline: "Collector drops and boutique bundles",
    isOnline: true,
    unreadCount: 2,
    updatedAt: "2m ago",
    messages: [
      {
        id: "m1",
        sender: "seller",
        type: "text",
        text: "If you want the vase plus the tray set, I can open a bundle round for you in the room.",
        createdAt: "6:11 PM",
      },
      {
        id: "m2",
        sender: "buyer",
        type: "voice",
        createdAt: "6:14 PM",
        waveform: [6, 12, 16, 10, 20],
      },
      {
        id: "m3",
        sender: "seller",
        type: "product",
        productId: "product-vase",
        createdAt: "6:18 PM",
      },
      {
        id: "m4",
        sender: "system",
        type: "system",
        text: "Maria reserved your early access lane for tonight's room.",
        createdAt: "6:20 PM",
      },
    ],
  },
  {
    id: "conversation-james",
    sellerId: "seller-james",
    sellerName: "James Chen",
    sellerAvatar: sellerProfiles[1].avatarUrl,
    sellerTagline: "Creator stacks, audio, and smart home",
    isOnline: false,
    unreadCount: 0,
    updatedAt: "47m ago",
    messages: [
      {
        id: "j1",
        sender: "buyer",
        type: "text",
        text: "Can you include the travel case if I join tonight's live?",
        createdAt: "4:45 PM",
      },
      {
        id: "j2",
        sender: "seller",
        type: "text",
        text: "Yes, if your offer lands in the top buyer tier. I'll pin the details at the start.",
        createdAt: "4:48 PM",
      },
    ],
  },
  {
    id: "conversation-ife",
    sellerId: "seller-ife",
    sellerName: "Ife Adebayo",
    sellerAvatar: sellerProfiles[3].avatarUrl,
    sellerTagline: "Soft glam sets and beauty sessions",
    isOnline: true,
    unreadCount: 1,
    updatedAt: "1h ago",
    messages: [
      {
        id: "i1",
        sender: "seller",
        type: "text",
        text: "Send a daylight selfie and I'll prep your shade options before the live starts.",
        createdAt: "3:20 PM",
      },
    ],
  },
];

export const negotiationParticipants: NegotiationParticipant[] = [
  {
    id: "buyer-1",
    name: "Ava J.",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    offer: 128,
    isMuted: true,
    isHandRaised: false,
    isPinned: true,
  },
  {
    id: "buyer-2",
    name: "Mia K.",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    offer: 135,
    isMuted: true,
    isHandRaised: true,
  },
  {
    id: "buyer-3",
    name: "Noah T.",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    offer: 142,
    isMuted: false,
    isHandRaised: false,
  },
  {
    id: "buyer-4",
    name: "Ella R.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    offer: 146,
    isMuted: true,
    isHandRaised: true,
  },
];

export const roomPresets: RoomPreset[] = [
  {
    id: "preset-boutique",
    name: "Boutique calm",
    mood: "Soft peach lights with a gallery-style product focus.",
    headline: "For premium drops and slower, trust-building negotiations.",
    previewColors: ["#f44d24", "#f7b78a", "#fff5ee"],
  },
  {
    id: "preset-studio",
    name: "Studio focus",
    mood: "Crisp spotlighting with deep charcoal contrast.",
    headline: "For tech demos, product details, and fast moving offer rounds.",
    previewColors: ["#101318", "#6b4eff", "#f5f3ff"],
  },
  {
    id: "preset-social",
    name: "Warm social",
    mood: "Golden ambient light and community-first overlays.",
    headline: "For beauty, fashion, and highly interactive live rooms.",
    previewColors: ["#ff8b4c", "#fbd26c", "#fff1dc"],
  },
];

export const searchSuggestions = [
  "ceramic live drop",
  "creator room setup",
  "bridal glam service",
  "smart apartment bundle",
  "vintage home decor",
  "room styling preset",
];

export const marketCategories = [
  "All",
  "Home Decor",
  "Tech",
  "Beauty",
  "Creative Services",
  "Repairs & Tech",
];

export const searchResults: SearchResult[] = [
  {
    id: "sr-1",
    type: "product",
    title: products[0].name,
    subtitle: "Atelier Terra • Home Decor",
    imageUrl: products[0].imageUrl,
    href: "/product-detail",
    pill: products[0].price,
  },
  {
    id: "sr-2",
    type: "service",
    title: services[0].name,
    subtitle: "Studio Bloom • Creative Services",
    imageUrl: services[0].imageUrl,
    href: "/service-detail",
    pill: services[0].price,
  },
  {
    id: "sr-3",
    type: "seller",
    title: sellerProfiles[3].name,
    subtitle: sellerProfiles[3].businessName,
    imageUrl: sellerProfiles[3].avatarUrl,
    href: "/seller-profile",
    pill: sellerProfiles[3].badge,
  },
  {
    id: "sr-4",
    type: "live",
    title: liveSessions[2].title,
    subtitle: "Signal Loft • Tonight",
    imageUrl: liveSessions[2].coverImageUrl,
    href: "/negotiation-room",
    pill: "Reserve spot",
  },
];

// Broadcast activities
export const userBroadcastActivities: BroadcastActivity[] = [
  {
    id: "ba-1",
    buyerName: "Grace Okafor",
    buyerAvatar: "GO",
    requestTitle: "Need 30 office chairs for event",
    category: "Furniture",
    budget: "₦150,000",
    status: "completed",
    respondedAt: "2026-07-10T14:30:00Z",
    sellerId: "seller-maria",
    revenue: 150000,
    responseTime: 2.5,
    isNearby: true,
  },
  {
    id: "ba-2",
    buyerName: "Ahmed Bello",
    buyerAvatar: "AB",
    requestTitle: "Plumbing services for 3-bedroom apartment",
    category: "Services",
    budget: "₦40,000",
    status: "accepted",
    respondedAt: "2026-07-12T09:15:00Z",
    sellerId: "seller-maria",
    responseTime: 1.2,
    isNearby: false,
  },
  {
    id: "ba-3",
    buyerName: "Chioma Eze",
    buyerAvatar: "CE",
    requestTitle: "Wholesale order: 500 pieces Ankara fabric",
    category: "Wholesale",
    budget: "₦320,000",
    status: "responded",
    respondedAt: "2026-07-14T11:45:00Z",
    sellerId: "seller-maria",
    responseTime: 4.0,
    isNearby: false,
  },
  {
    id: "ba-4",
    buyerName: "David Adeyemi",
    buyerAvatar: "DA",
    requestTitle: "Need a professional photographer for wedding",
    category: "Services",
    budget: "₦80,000",
    status: "completed",
    respondedAt: "2026-07-08T16:20:00Z",
    sellerId: "seller-maria",
    revenue: 80000,
    responseTime: 0.8,
    isNearby: true,
  },
];

// Live sessions (for the LiveShoppingSection)
export const userLiveSessions: LiveSession[] = [
  {
    id: "live-1",
    title: "Summer Fashion Showcase",
    description:
      "New arrivals and exclusive discounts on our summer collection.",
    coverImage:
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400&h=300&fit=crop",
    date: "2026-07-15T18:00:00Z",
    status: "past",
    viewers: 234,
    totalViewers: 234,
    topViewed: true,
    orders: 18,
    watchTime: "12m",
    conversion: 7.7,
    replayUrl: "#",
    sellerId: "seller-maria",
  },
  {
    id: "live-2",
    title: "Vintage Denim Live",
    description: "Live auction for rare vintage denim pieces.",
    coverImage:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop",
    date: "2026-07-20T16:00:00Z",
    status: "upcoming",
    sellerId: "seller-maria",
  },
  {
    id: "live-3",
    title: "Sunday Market Live",
    description: "Fresh produce and artisanal goods from local farmers.",
    coverImage:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=400&h=300&fit=crop",
    date: "2026-07-23T14:00:00Z",
    status: "upcoming",
    sellerId: "seller-maria",
  },
];

// Reviews
export const userReviews: Review[] = [
  {
    id: "rev-1",
    buyerName: "Grace Okafor",
    buyerAvatar: "GO",
    rating: 5,
    content:
      "Excellent service! The vintage dress arrived in perfect condition and fit beautifully. Highly recommend this seller.",
    createdAt: "2026-07-15T10:30:00Z",
    verifiedPurchase: true,
    images: [
      "https://images.unsplash.com/photo-1567446537708-ac4f75e3eb5a?w=200&h=200&fit=crop&q=80",
    ],
    sellerResponse: {
      content:
        "Thank you Grace! So glad you loved it. We hope to see you again!",
      createdAt: "2026-07-16T08:00:00Z",
    },
    helpfulCount: 12,
    sellerId: "seller-maria",
  },
  {
    id: "rev-2",
    buyerName: "Ahmed Bello",
    buyerAvatar: "AB",
    rating: 4,
    content:
      "Good quality, but delivery was a bit delayed. Still happy with the product.",
    createdAt: "2026-07-12T14:20:00Z",
    verifiedPurchase: true,
    sellerId: "seller-maria",
  },
  {
    id: "rev-3",
    buyerName: "Chioma Eze",
    buyerAvatar: "CE",
    rating: 5,
    content:
      "Absolutely stunning! The craftsmanship is incredible. I'll definitely be ordering again.",
    createdAt: "2026-07-08T09:15:00Z",
    verifiedPurchase: true,
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=200&fit=crop&q=80",
    ],
    sellerResponse: {
      content: "Thank you Chioma! Your support means the world to us.",
      createdAt: "2026-07-09T12:00:00Z",
    },
    helpfulCount: 8,
    sellerId: "seller-maria",
  },
  {
    id: "rev-4",
    buyerName: "David Adeyemi",
    buyerAvatar: "DA",
    rating: 3,
    content:
      "Product was okay but didn't match the description exactly. Could be more accurate.",
    createdAt: "2026-07-05T16:45:00Z",
    verifiedPurchase: true,
    sellerId: "seller-maria",
  },
  {
    id: "rev-5",
    buyerName: "Sarah Mitchell",
    buyerAvatar: "SM",
    rating: 5,
    content:
      "Best seller on Haggle! Fast communication, beautiful packaging, and the product is top quality.",
    createdAt: "2026-07-01T11:00:00Z",
    verifiedPurchase: true,
    helpfulCount: 25,
    sellerId: "seller-maria",
  },
];

export const sellerProducts = products;
export const marketServices = services;
export const allLiveSessions = liveSessions;

export function getSellerById(id: string) {
  return sellerProfiles.find((seller) => seller.id === id) ?? sellerProfiles[0];
}

export function getProductById(id: string) {
  return (
    sellerProducts.find((product) => product.id === id) ?? sellerProducts[0]
  );
}

export function getServiceById(id: string) {
  return (
    marketServices.find((service) => service.id === id) ?? marketServices[0]
  );
}
