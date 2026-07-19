// lib/types.ts

export type ThemeMode = "light" | "dark";

export type SellerSummary = {
  id: string;
  name: string;
  username: string;
  businessName: string;
  avatarUrl: string;
  rating: string;
  responseTime: string;
  followers: string;
  badge: string;
  isVerified: boolean;
};

export type SellerProduct = {
  id: string;
  sellerId: string;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  description: string;
  features: string[];
  stockStatus: string;
  negotiationNote: string;
};

export type MarketService = {
  id: string;
  sellerId: string;
  name: string;
  category: string;
  description: string;
  price: string;
  deliveryTime: string;
  includes: string[];
  audience: string;
  imageUrl: string;
};

export type LiveSessionStatus =
  | "Ongoing"
  | "Scheduled"
  | "Upcoming"
  | "Live now";

export type SellerLiveSession = {
  id: string;
  sellerId: string;
  title: string;
  schedule: string;
  status: LiveSessionStatus;
  preview: string;
  category: string;
  buyerBenefits: string[];
  coverImageUrl: string;
  participantCount: number;
  offerCount: number;
  saveCount: number;
  featuredItem: string;
  reminderMessage: string;
};

export type ChatMessage = {
  id: string;
  sender: "buyer" | "seller" | "system";
  type: "text" | "voice" | "product" | "system" | "screenshot";
  text?: string;
  createdAt: string;
  waveform?: number[];
  productId?: string;
  screenshotLabel?: string;
  screenshotId?: string;
  screenshotUrl?: string;
  audioId?: string;
  audioUrl?: string;
};

export type Conversation = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerTagline: string;
  isOnline: boolean;
  unreadCount: number;
  updatedAt: string;
  messages: ChatMessage[];
};

export interface Review {
  id: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  content: string;
  createdAt: string;
  verifiedPurchase: boolean;
  images?: string[];
  sellerResponse?: {
    content: string;
    createdAt: string;
  };
  helpfulCount?: number;
  sellerId: string;
}

export type NegotiationParticipant = {
  id: string;
  name: string;
  imageUrl: string;
  offer: number;
  isMuted: boolean;
  isHandRaised: boolean;
  isPinned?: boolean;
};

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  category?:string;
  caption?: string;
  createdAt: string;
}

export type ReminderTicket = {
  id: string;
  sellerId: string;
  liveId: string;
  reservedAt: string;
};

export type SearchResult = {
  id: string;
  type: "product" | "service" | "seller" | "live";
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  pill: string;
};

export type RoomPreset = {
  id: string;
  name: string;
  mood: string;
  headline: string;
  previewColors: string[];
};

export interface LiveSession {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  date: string;
  time?: string;
  status: "live" | "upcoming" | "past";
  viewers?: number;
  orders?: number;
  watchTime?: string;
  conversion?: number;
  replayUrl?: string;
  sellerId: string;
  totalViewers?: number; // lifetime viewers
  topViewed?: boolean;
  upcomingCountdown?: string;
}

export interface BroadcastActivity {
  id: string;
  buyerName: string;
  buyerAvatar: string;
  requestTitle: string;
  category: string;
  budget: string;
  status: "responded" | "accepted" | "completed" | "declined";
  respondedAt: string;
  sellerId: string;
  revenue?: number; // money earned from this activity
  responseTime?: number; // in hours
  location?: string; // nearby opportunity
  isNearby?: boolean;
}

// ============================================
// NEW TYPES FOR BUSINESS WEBSITE
// ============================================

export type StoryBlockType =
  | "mission"
  | "story"
  | "team"
  | "values"
  | "timeline"
  | "why";

export interface StoryBlock {
  id: string;
  type: StoryBlockType;
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface HeroSettings {
  slogan?: string;
  category?: string;
  status?: "open" | "closed" | "live" | "away" | "holiday";
  location?: string;
  yearsInBusiness?: number;
  businessHours?: BusinessHours[];
  deliveryRadius?: number;
  averageResponseTime?: string;
  verifiedBadge?: boolean;
}

export interface CompletionStatus {
  logo: boolean;
  cover: boolean;
  story: boolean;
  contact: boolean;
  hours: boolean;
  delivery: boolean;
  gallery: boolean;
  social: boolean;
  team: boolean;
}

export interface AnalyticsData {
  visitors: number;
  profileViews: number;
  clicks: number;
  followers: number;
  productViews: number;
  messages: number;
  broadcastResponses: number;
  conversionRate: number;
  revenue: number;
  topProducts: { name: string; sales: number }[];
  returningCustomers: number;
  nearbyAudience: number;
}

export type AchievementId =
  | "top-seller"
  | "100-sales"
  | "verified-business"
  | "fast-responder"
  | "trusted"
  | "wholesale-partner"
  | "community-favorite"
  | "early-adopter"
  | "live-star"
  | "review-champion";

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface Preferences {
  accentColor?: string;
  sectionOrder?: string[];
  hiddenSections?: string[];
  heroLayout?: "default" | "centered" | "compact";
  buttonStyle?: "rounded" | "pill" | "sharp";
  galleryStyle?: "grid" | "masonry" | "carousel";
  theme?: ThemeMode;
}

// ============================================
// EXTENDED SELLER PROFILE
// ============================================

export interface SellerProfile extends SellerSummary {
  tradeMark: string;
  coverImageUrl: string;
  bio: string;
  sellsSummary: string;
  trustPills: string[];
  whatTheyOffer: string[];
  products: SellerProduct[];
  services: MarketService[];
  ongoingLives: SellerLiveSession[];
  upcomingLives: SellerLiveSession[];
  gallery?: GalleryItem[];

  // NEW FIELDS
  storyBlocks?: StoryBlock[];
  hero?: HeroSettings;
  completion?: CompletionStatus;
  analytics?: AnalyticsData;
  achievements?: Achievement[];
  preferences?: Preferences;
}

export type UserProfile = {
  id: string;
  fullName: string;
  username: string;
  businessName: string;
  avatarUrl: string;
  bio: string;
  role: "buyer" | "seller" | "both";
  metrics: {
    savedDeals: number;
    upcomingLives: number;
    roomsJoined: number;
  };
  sellerId?: string;
};
