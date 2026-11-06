import apiClient from "./client";
import type {
  CreateAddressInput,
  UpdateAddressInput,
  UserAddress,
} from "@/types/address";

function addressRequestConfig() {
  const accessToken =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem("haggleAccessToken");
  return {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
}

function unwrapAddressData<T>(data: unknown): T {
  if (
    !data ||
    typeof data !== "object" ||
    !("success" in data) ||
    data.success !== true
  ) {
    throw new Error("The address request returned an invalid response.");
  }
  const responseData = data as Record<string, unknown>;
  return responseData.data as T;
}

export async function getAddresses(): Promise<UserAddress[]> {
  const response = await apiClient.get(
    "/users/me/addresses",
    addressRequestConfig(),
  );
  const data = unwrapAddressData<unknown>(response.data);
  if (!Array.isArray(data)) {
    throw new Error("The address response did not contain a list.");
  }
  return data as UserAddress[];
}

export async function createAddress(
  input: CreateAddressInput,
): Promise<UserAddress> {
  const response = await apiClient.post(
    "/users/me/addresses",
    input,
    addressRequestConfig(),
  );
  return unwrapAddressData<UserAddress>(response.data);
}

export async function updateAddress(
  addressId: string,
  input: UpdateAddressInput,
): Promise<UserAddress> {
  const response = await apiClient.patch(
    `/users/me/addresses/${encodeURIComponent(addressId)}`,
    input,
    addressRequestConfig(),
  );
  return unwrapAddressData<UserAddress>(response.data);
}
