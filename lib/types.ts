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

export type SellerProfile = SellerSummary & {
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

export type NegotiationParticipant = {
  id: string;
  name: string;
  imageUrl: string;
  offer: number;
  isMuted: boolean;
  isHandRaised: boolean;
  isPinned?: boolean;
};

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
};
