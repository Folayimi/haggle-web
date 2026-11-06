import { BackendListing } from "@/services/mappers";

export type ConversationType = "direct" | "support" | "session_sidechat";
export type MessageType =
  | "text"
  | "voice"
  | "image"
  | "product_share"
  | "system"
  | "offer"
  | "negotiation_event"
  | "deal_event";
export type ReceiptStatus = "sent" | "delivered" | "seen" | "read";

export interface ConversationParticipant {
  conversationId: string;
  userId: string;
  lastReadMessageId?: string | null;
  lastReadAt?: string | null;
  isArchived: boolean;
  isMuted: boolean;
}

export interface Conversation {
  id: string;
  conversationType: ConversationType;
  sellerName?: string;
  sellerId?: string;
  participantAvatarUrl?: string;
  listingId?: string;
  sessionId?: string;
  participants: ConversationParticipant[];
  unreadCount: number;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  createdAt: string;
}

export interface MessageAttachment {
  id: string;
  messageId: string;
  attachmentType: "screenshot" | "image" | "video" | "document";
  url: string;
  thumbnailUrl?: string | null;
  sizeBytes?: number | null;
}

export interface MessageReceipt {
  messageId: string;
  userId: string;
  status: ReceiptStatus;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderUserId: string;
  messageType: MessageType;
  textBody?: string | null;
  voiceUrl?: string | null;
  voiceDurationSeconds?: number | null;
  sharedListingId?: string | null;
  negotiationThreadId: string | null;
  negotiationId: string | null;
  listing: BackendListing | null;
  metadataJson?: Record<string, unknown> | null;
  attachments: MessageAttachment[];
  receipts: MessageReceipt[];
  createdAt: string;
  editedAt?: string | null;
  deletedAt?: string | null;
}
