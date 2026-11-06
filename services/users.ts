// services/users.ts
import apiClient from "./client";
import { notifyApiError } from "./toastify";
import type { BackendUser } from "./mappers";

function isBackendUser(value: unknown): value is BackendUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string"
  );
}

export const getUserById = async (
  id: string,
): Promise<BackendUser | null> => {
  try {
    const response = await apiClient.get<unknown>(`/users/${id}`);
    const payload = response.data;
    if (!payload || typeof payload !== "object") return null;
    const body = payload as Record<string, unknown>;
    const data =
      body.data && typeof body.data === "object"
        ? (body.data as Record<string, unknown>)
        : null;
    const user = data?.user ?? data ?? body;
    return isBackendUser(user) ? user : null;
  } catch (error) {
    notifyApiError(error, "Failed to load seller");
    throw error;
  }
};

export async function followUser(userId: string): Promise<void> {
  try {
    await apiClient.post(`/users/${encodeURIComponent(userId)}/follow`);
  } catch (error) {
    notifyApiError(error, "Unable to follow this user.");
    throw error;
  }
}

export async function unfollowUser(userId: string): Promise<void> {
  try {
    await apiClient.delete(`/users/${encodeURIComponent(userId)}/follow`);
  } catch (error) {
    notifyApiError(error, "Unable to unfollow this user.");
    throw error;
  }
}
