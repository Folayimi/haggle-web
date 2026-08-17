// services/catalog.ts
import apiClient from "./client";
import { notifyError } from "./toastify";

export const getListing = async (id: string) => {
  let result: any = null;
  await apiClient
    .get(`/catalog/listings/${id}`)
    .then((response: any) => {
      result = response?.data?.data ?? response?.data ?? null;
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error ?? "Failed to load product");
      throw err;
    });
  return result;
};
