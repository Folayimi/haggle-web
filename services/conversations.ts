// services/conversations.ts
import apiClient from "./client";
import { notifyError } from "./toastify";
import { Conversation, Message } from "@/types";

export const listConversations = async (): Promise<Conversation[]> => {
  let result: Conversation[] = [];
  await apiClient
    .get(`/conversations`)
    .then((response: any) => {
      result = response?.data ?? [];
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error ?? "Failed to load conversations");
      throw err;
    });
  return result;
};

export const createConversation = async (data: {
  conversation_type: "direct" | "support" | "session_sidechat";
  seller_id?: string;
  listing_id?: string;
  participant_ids: string[];
}): Promise<Conversation | null> => {
  let result: Conversation | null = null;
  await apiClient
    .post(`/conversations`, data)
    .then((response: any) => {
      result = response?.data ?? null;
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error ?? "Failed to start conversation");
      throw err;
    });
  return result;
};

export const listMessages = async (conversationId: string): Promise<Message[]> => {
  let result: Message[] = [];
  await apiClient
    .get(`/conversations/${conversationId}/messages`)
    .then((response: any) => {
      result = response?.data ?? [];
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error ?? "Failed to load messages");
      throw err;
    });
  return result;
};

export const sendMessage = async (
  conversationId: string,
  data: {
    sender_user_id: string;
    message_type: "text" | "voice" | "image" | "product_share" | "system";
    text_body?: string;
  },
): Promise<Message | null> => {
  let result: Message | null = null;
  await apiClient
    .post(`/conversations/${conversationId}/messages`, data)
    .then((response: any) => {
      result = response?.data ?? null;
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error ?? "Failed to send message");
      throw err;
    });
  return result;
};
