// services/negotiation.ts
import apiClient from "./client";
import { notifyApiError } from "./toastify";

export const createOffer = async (data: {
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: string;
  currency?: string;
}) => {
  let result: any = null;
  await apiClient
    .post(`/offers`, data)
    .then((response: any) => {
      result = response?.data;
    })
    .catch((err) => {
      notifyApiError(err, err?.response?.data?.error ?? "Failed to make offer");
      throw err;
    });
  return result;
};

export const counterOffer = async (
  offerId: string,
  data: { amount: string; currency?: string },
) => {
  let result: any = null;
  await apiClient
    .put(`/offers/${offerId}/counter`, data)
    .then((response: any) => {
      result = response?.data;
    })
    .catch((err) => {
      notifyApiError(err, err?.response?.data?.error ?? "Failed to send counter offer");
      throw err;
    });
  return result;
};

export const acceptOffer = async (offerId: string) => {
  let result: any = null;
  await apiClient
    .put(`/offers/${offerId}/accept`)
    .then((response: any) => {
      result = response?.data;
    })
    .catch((err) => {
      notifyApiError(err, err?.response?.data?.error ?? "Failed to accept offer");
      throw err;
    });
  return result;
};

export const rejectOffer = async (offerId: string) => {
  let result: any = null;
  await apiClient
    .put(`/offers/${offerId}/reject`)
    .then((response: any) => {
      result = response?.data;
    })
    .catch((err) => {
      notifyApiError(err, err?.response?.data?.error ?? "Failed to reject offer");
      throw err;
    });
  return result;
};
