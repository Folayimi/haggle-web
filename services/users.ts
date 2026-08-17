// services/users.ts
import apiClient from "./client";
import { notifyError } from "./toastify";

export const getUserById = async (id: string) => {
  let result: any = null;
  await apiClient
    .get(`/users/${id}`)
    .then((response: any) => {
      result = response?.data?.data ?? response?.data ?? null;
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error ?? "Failed to load seller");
      throw err;
    });
  return result;
};
