import apiClient from "./client";
import { BackendListing } from "./mappers";
import { notifyApiError } from "./toastify";
import type {
  Conversation,
  ConversationParticipant,
  Message,
  MessageAttachment,
  MessageReceipt,
  ReceiptStatus,
} from "@/types";

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value && typeof value === "object" ? (value as JsonRecord) : {};
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function normalizeParticipant(value: unknown): ConversationParticipant {
  const item = record(value);
  return {
    conversationId: String(item.conversation_id ?? item.conversationId ?? ""),
    userId: String(item.user_id ?? item.userId ?? ""),
    lastReadMessageId:
      stringValue(item.last_read_message_id ?? item.lastReadMessageId) ?? null,
    lastReadAt: stringValue(item.last_read_at ?? item.lastReadAt) ?? null,
    isArchived: Boolean(item.is_archived ?? item.isArchived),
    isMuted: Boolean(item.is_muted ?? item.isMuted),
  };
}

function normalizeConversation(value: unknown): Conversation {
  const item = record(value);
  const participant = record(
    item.participant ?? item.other_participant ?? item.otherParticipant,
  );
  const seller = record(item.seller);
  return {
    id: String(item.id ?? ""),
    conversationType: (item.conversation_type ??
      item.conversationType ??
      "direct") as Conversation["conversationType"],
    sellerName: stringValue(
      item.seller_name ??
        item.sellerName ??
        item.participant_name ??
        item.participantName ??
        item.other_participant_name ??
        item.otherParticipantName ??
        participant.full_name ??
        participant.fullName ??
        participant.name ??
        seller.full_name ??
        seller.fullName ??
        seller.name,
    ),
    sellerId: stringValue(item.seller_id ?? item.sellerId),
    participantAvatarUrl: stringValue(
      item.participant_avatar_url ??
        item.participantAvatarUrl ??
        item.seller_avatar_url ??
        item.sellerAvatarUrl ??
        participant.avatar_url ??
        participant.avatarUrl ??
        seller.avatar_url ??
        seller.avatarUrl,
    ),
    listingId: stringValue(item.listing_id ?? item.listingId),
    sessionId: stringValue(item.session_id ?? item.sessionId),
    participants: Array.isArray(item.participants)
      ? item.participants.map(normalizeParticipant)
      : [],
    unreadCount: Number(item.unread_count ?? item.unreadCount ?? 0),
    lastMessageAt: stringValue(item.last_message_at ?? item.lastMessageAt),
    lastMessagePreview: stringValue(
      item.last_message_preview ?? item.lastMessagePreview,
    ),
    createdAt: String(item.created_at ?? item.createdAt ?? ""),
  };
}

function normalizeAttachment(value: unknown): MessageAttachment {
  const item = record(value);
  return {
    id: String(item.id ?? ""),
    messageId: String(item.message_id ?? item.messageId ?? ""),
    attachmentType: (item.attachment_type ??
      item.attachmentType ??
      "document") as MessageAttachment["attachmentType"],
    url: String(item.url ?? ""),
    thumbnailUrl: stringValue(item.thumbnail_url ?? item.thumbnailUrl) ?? null,
    sizeBytes:
      typeof (item.size_bytes ?? item.sizeBytes) === "number"
        ? Number(item.size_bytes ?? item.sizeBytes)
        : null,
  };
}

function normalizeReceipt(value: unknown): MessageReceipt {
  const item = record(value);
  return {
    messageId: String(item.message_id ?? item.messageId ?? ""),
    userId: String(item.user_id ?? item.userId ?? ""),
    status: (item.status ?? "sent") as ReceiptStatus,
    updatedAt: String(item.updated_at ?? item.updatedAt ?? ""),
  };
}

export function normalizeMessage(value: unknown): Message {
  const item = record(value);
  let metadataJson: Record<string, unknown> | null = null;
  if (typeof item.metadata_json === "string") {
    try {
      const parsed: unknown = JSON.parse(item.metadata_json);
      if (parsed && typeof parsed === "object")
        metadataJson = parsed as Record<string, unknown>;
    } catch {
      metadataJson = null;
    }
  } else if (item.metadata_json && typeof item.metadata_json === "object") {
    metadataJson = item.metadata_json as Record<string, unknown>;
  }
  return {
    id: String(item.id ?? ""),
    conversationId: String(item.conversation_id ?? item.conversationId ?? ""),
    senderUserId: String(item.sender_user_id ?? item.senderUserId ?? ""),
    messageType: (item.message_type ??
      item.messageType ??
      "text") as Message["messageType"],
    textBody: stringValue(item.text_body ?? item.textBody) ?? null,
    voiceUrl: stringValue(item.voice_url ?? item.voiceUrl) ?? null,
    voiceDurationSeconds:
      typeof (item.voice_duration_seconds ?? item.voiceDurationSeconds) ===
      "number"
        ? Number(item.voice_duration_seconds ?? item.voiceDurationSeconds)
        : null,
    sharedListingId:
      stringValue(item.shared_listing_id ?? item.sharedListingId) ?? null,
    negotiationThreadId:
      stringValue(item.negotiation_thread_id ?? item.negotiationThreadId) ??
      null,
    negotiationId:
      stringValue(
        item.negotiation_id ??
          item.negotiationId ??
          metadataJson?.negotiation_id,
      ) ?? null,
    listing: item.listing ? (item.listing as unknown as BackendListing) : null,
    metadataJson,
    attachments: Array.isArray(item.attachments)
      ? item.attachments.map(normalizeAttachment)
      : [],
    receipts: Array.isArray(item.receipts)
      ? item.receipts.map(normalizeReceipt)
      : [],
    createdAt: String(item.created_at ?? item.createdAt ?? ""),
    editedAt: stringValue(item.edited_at ?? item.editedAt) ?? null,
    deletedAt: stringValue(item.deleted_at ?? item.deletedAt) ?? null,
  };
}

function apiError(error: unknown, fallback: string): never {
  const item = record(error);
  const response = record(item.response);
  const data = record(response.data);
  notifyApiError(error, String(data.error ?? data.message ?? fallback));
  throw error;
}

export async function listConversations(limit = 100): Promise<Conversation[]> {
  try {
    const response = await apiClient.get("/conversations", {
      params: { limit },
    });
    const data = Array.isArray(response.data)
      ? response.data
      : record(response.data).data;
    return Array.isArray(data) ? data.map(normalizeConversation) : [];
  } catch (error) {
    return apiError(error, "Failed to load conversations");
  }
}

export async function createConversation(data: {
  conversation_type: Conversation["conversationType"];
  seller_id?: string;
  listing_id?: string;
  session_id?: string;
  participant_ids: string[];
}): Promise<Conversation | null> {
  try {
    const response = await apiClient.post("/conversations", data);
    return response.data
      ? normalizeConversation(response.data.data ?? response.data)
      : null;
  } catch (error) {
    return apiError(error, "Failed to start conversation");
  }
}

export async function listMessages(
  conversationId: string,
  options: { limit?: number; before?: string } = {},
): Promise<Message[]> {
  try {
    const response = await apiClient.get(
      `/conversations/${encodeURIComponent(conversationId)}/messages`,
      { params: options },
    );
    const data = Array.isArray(response.data)
      ? response.data
      : record(response.data).data;

    console.log("listMessages response data:", data); // Debugging line
    const messages = Array.isArray(data) ? data.map(normalizeMessage) : [];
    return messages.sort(
      (left, right) =>
        new Date(left.createdAt).getTime() -
        new Date(right.createdAt).getTime(),
    );
  } catch (error) {
    return apiError(error, "Failed to load messages");
  }
}

export async function sendMessage(
  conversationId: string,
  data: {
    message_type: Message["messageType"];
    text_body?: string;
    negotiation_thread_id?: string;
    listing_id?: string;
    voice_url?: string;
    voice_duration_seconds?: number;
    shared_listing_id?: string;
    metadata_json?: Record<string, unknown>;
  },
): Promise<Message | null> {
  try {
    const response = await apiClient.post(
      `/conversations/${encodeURIComponent(conversationId)}/messages`,
      data,
    );
    const value = response.data?.data ?? response.data;
    return value ? normalizeMessage(value) : null;
  } catch (error) {
    return apiError(error, "Failed to send message");
  }
}

export async function editMessage(
  conversationId: string,
  messageId: string,
  textBody: string,
): Promise<Message | null> {
  try {
    const response = await apiClient.patch(
      `/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`,
      { text_body: textBody },
    );
    const value = response.data?.data ?? response.data;
    return value ? normalizeMessage(value) : null;
  } catch (error) {
    return apiError(error, "Failed to edit message");
  }
}

export async function deleteMessage(
  conversationId: string,
  messageId: string,
): Promise<void> {
  try {
    await apiClient.delete(
      `/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`,
    );
  } catch (error) {
    return apiError(error, "Failed to delete message");
  }
}

export async function markMessageReceipt(
  conversationId: string,
  messageId: string,
  status: ReceiptStatus,
): Promise<MessageReceipt | null> {
  try {
    const response = await apiClient.post(
      `/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}/receipts`,
      { status },
    );
    return response.data?.data ?? response.data ?? null;
  } catch (error) {
    return apiError(error, "Failed to update message receipt");
  }
}

export async function addMessageAttachment(
  conversationId: string,
  messageId: string,
  data: {
    attachment_type: MessageAttachment["attachmentType"];
    url: string;
    thumbnail_url?: string;
    size_bytes?: number;
  },
): Promise<MessageAttachment | null> {
  try {
    const response = await apiClient.post(
      `/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}/attachments`,
      data,
    );
    return response.data?.data ?? response.data ?? null;
  } catch (error) {
    return apiError(error, "Failed to attach media");
  }
}
