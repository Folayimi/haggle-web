import type {
  Conversation,
  MarketService,
  NegotiationParticipant,
  RoomPreset,
  SearchResult,
  SellerLiveSession,
  SellerProduct,
  SellerProfile,
  UserProfile,
} from "@/lib/types";

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
    features: ["Five-piece set", "Sensitive-skin friendly", "Creator tutorial included"],
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
    reminderMessage: "Your ticket saves your queue position for the first buyer round.",
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
    reminderMessage: "Bring your skin tone reference in chat for the best match.",
  },
];

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
    trustPills: ["Priority support", "Verified warranty", "High return buyer rate"],
    whatTheyOffer: [
      "Room-ready creator stacks",
      "Live tech demos with offer rounds",
      "Apartment automation consults",
    ],
    products: products.filter((product) => product.sellerId === "seller-james"),
    services: services.filter((service) => service.sellerId === "seller-james"),
    ongoingLives: [],
    upcomingLives: liveSessions.filter((session) => session.id === "live-tech"),
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
    trustPills: ["Portfolio verified", "Repeat seller clients", "Fast concept delivery"],
    whatTheyOffer: [
      "Brand systems for storefront launches",
      "Atmosphere presets for live rooms",
      "Creative direction for social-first sellers",
    ],
    products: products.filter((product) => product.sellerId === "seller-zara"),
    services: services.filter((service) => service.sellerId === "seller-zara"),
    ongoingLives: [],
    upcomingLives: [],
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
  },
];

export const featuredProduct = products[0];
export const featuredService = services[0];
export const featuredSeller = sellerProfiles[0];

export const currentUser: UserProfile = {
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

export const sellerProducts = products;
export const marketServices = services;
export const allLiveSessions = liveSessions;

export function getSellerById(id: string) {
  return sellerProfiles.find((seller) => seller.id === id) ?? sellerProfiles[0];
}

export function getProductById(id: string) {
  return sellerProducts.find((product) => product.id === id) ?? sellerProducts[0];
}

export function getServiceById(id: string) {
  return marketServices.find((service) => service.id === id) ?? marketServices[0];
}
