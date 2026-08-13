// types/conversation.ts
// Matches backend messaging.repository.ts / conversations.ts route shapes.

export interface Conversation {
  id: string;
  conversationType: "direct" | "support" | "session_sidechat";
  sellerId?: string;
  listingId?: string;
  sessionId?: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderUserId: string;
  messageType: "text" | "voice" | "image" | "product_share" | "system";
  textBody?: string;
  voiceUrl?: string;
  voiceDurationSeconds?: number;
  sharedListingId?: string;
  createdAt: string;
  editedAt?: string;
}
