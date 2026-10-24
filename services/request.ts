import axios from "axios";
import apiClient from "./client";
import { notify, notifyError } from "./toastify";
import { PassThrough } from "stream";
import { Dispatch, SetStateAction } from "react";
import { useHaggleStore } from "@/lib/app-store";
import type { BackendCategory, BackendListing } from "./mappers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

interface Presign {
  expiresIn: number;
  uploadUrl: string;
  key: string;
}

const setConfig = (accessToken: string) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      withCredentials: true,
    },
  };
};

const setImageConfig = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("haggleMediaAccessToken")}`,
      // withCredentials: true,
    },
  };
};

// AXIOS INTERCEPTORS

// Add these global variables at the top of the file (outside the interceptor)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // Retry the original request with the new token
      prom.config.headers.Authorization = `Bearer ${token}`;
      prom.resolve(apiClient(prom.config));
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("haggleAccessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. 👇 Attach the current user's id on every request — offers,
    // conversations, and other authenticated routes rely on this header
    // via getRequestUserId() on the backend, not just /users/me.
    const userData = useHaggleStore.getState().userData; // 👈 Get userData from store
    const isCatalogRequest = /^\/?catalog(?:\/|$)/.test(
      config.url ?? "",
    );
    if (userData?.id && !isCatalogRequest) {
      config.headers["x-user-id"] = userData.id;
    }

    // 3. 👇 Add header only if request has FormData (multipart)
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    // Any status code within 2xx triggers this.
    // You can return just response.data to simplify your API calls.
    return response;
  },
  async (error) => {
    // Any status code outside 2xx triggers this.
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      // Start the refresh flow
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("haggleRefreshToken");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        );

        const newAccessToken = response.data.tokens?.accessToken;
        const newRefreshToken = response.data.tokens?.refreshToken;
        const newMediaAccessToken = response.data.tokens?.mediaAccessToken;

        localStorage.setItem("haggleAccessToken", newAccessToken);
        localStorage.setItem("haggleRefreshToken", newRefreshToken);
        localStorage.setItem("haggleMediaAccessToken", newMediaAccessToken);

        // Update the auth header for the current request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process all queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - reject all queued requests and log the user out
        processQueue(refreshError, null);
        // localStorage.clear();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other global errors (e.g., show a toast notification)
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  },
);

// AUTENTICATION API CALLS
export const userLogin = async (data: any) => {
  let result = {};
  await axios
    .post(`${baseUrl}/auth/login`, data)
    .then((response: any) => {
      if (response?.data?.success === true) {
        // localStorage.setItem("userData", JSON.stringify(response.data.user));
        localStorage.setItem(
          "haggleAccessToken",
          response.data.tokens?.accessToken,
        );
        localStorage.setItem(
          "haggleRefreshToken",
          response.data.tokens?.refreshToken,
        );
        localStorage.setItem(
          "haggleMediaAccessToken",
          response.data.tokens?.mediaAccessToken,
        );
        notify(response?.data?.message);
        result = response;
      }
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};

export const userSignup = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  let result = {};

  await axios
    .post(`${baseUrl}/auth/signup`, {
      full_name: data.fullName,
      email: data.email,
      password: data.password,
    })
    .then((response: any) => {
      if (response?.data?.success === true) {
        // Optionally store user data or tokens if the backend returns them
        // if (response.data.user) {
        //   localStorage.setItem("userData", JSON.stringify(response.data.user));
        // }
        if (response.data.tokens?.resetToken) {
          localStorage.removeItem("haggleAuthToken");
          localStorage.setItem(
            "haggleAuthToken",
            response.data.tokens.resetToken,
          );
        }

        notify(response?.data?.message || "Account created successfully!");
        result = response;
      } else {
        notifyError(response?.data?.message || "Signup failed");
        throw new Error(response?.data?.message || "Signup failed");
      }
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "An error occurred during signup";
      notifyError(errorMessage);
      throw err;
    });
  return result;
};

export const verifyOtp = async (data: {
  email: string;
  otp: string;
  token: string;
}) => {
  let result = {};

  await axios
    .post(
      `${baseUrl}/auth/verify-otp`,
      {
        email: data?.email,
        otp_code: data?.otp,
      },
      setConfig(data?.token),
    )
    .then((response: any) => {
      if (response?.data?.success === true) {
        notify(response?.data?.message || "Email verified successfully!");
        result = response;
      } else {
        notifyError(response?.data?.message || "Verification failed");
        throw new Error(response?.data?.message || "Verification failed");
      }
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Invalid verification code";
      notifyError(errorMessage);
      throw err;
    });

  return result;
};

export const verifyResetOtp = async (data: {
  email: string;
  otp: string;
  token: string;
}) => {
  let result = {};

  await axios
    .post(
      `${baseUrl}/auth/verify-reset-otp`,
      {
        email: data?.email,
        otp_code: data?.otp,
      },
      setConfig(data?.token),
    )
    .then((response: any) => {
      if (response?.data?.success === true) {
        notify(response?.data?.message || "Email verified successfully!");
        result = response;
      } else {
        notifyError(response?.data?.message || "Verification failed");
        throw new Error(response?.data?.message || "Verification failed");
      }
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Invalid verification code";
      notifyError(errorMessage);
      throw err;
    });

  return result;
};

export const resendOtp = async (data: { email: string }) => {
  let result = {};

  await axios
    .post(`${baseUrl}/auth/resend-otp`, data)
    .then((response: any) => {
      if (response?.data?.success === true) {
        notify(response?.data?.message || "Verification code resent!");
        result = response;
      } else {
        notifyError(response?.data?.message || "Failed to resend code");
        throw new Error(response?.data?.message || "Failed to resend code");
      }
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to resend code";
      notifyError(errorMessage);
      throw err;
    });

  return result;
};

export const sendResetOtp = async (data: { email: string }) => {
  let result = {};

  await axios
    .post(`${baseUrl}/auth/verify-email`, {
      email: data.email,
    })
    .then((response: any) => {
      if (response?.data?.success === true) {
        if (response.data.tokens?.resetToken) {
          localStorage.removeItem("haggleAuthResetToken");
          localStorage.setItem(
            "haggleAuthResetToken",
            response.data.tokens.resetToken,
          );
        }

        notify(
          response?.data?.message ||
            "Verification Code has been sent to your email!",
        );
        result = response;
      } else {
        notifyError(response?.data?.message || "Password Reset failed");
        throw new Error(response?.data?.message || "Password Reset failed");
      }
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Invalid verification code";
      notifyError(errorMessage);
      throw err;
    });

  return result;
};

export const resetPassword = async (data: {
  newPassword: string;
  confirmPassword: string;
  token: string;
}) => {
  let result = {};

  await axios
    .post(
      `${baseUrl}/auth/password-reset`,
      {
        newPassword: data?.newPassword,
        confirmPassword: data?.confirmPassword,
      },
      setConfig(data?.token),
    )
    .then((response: any) => {
      if (response?.data?.success === true) {
        notify(response?.data?.message || "Password Updated successfully!");
        result = response;
      } else {
        notifyError(response?.data?.message || "Password Reset failed");
        throw new Error(response?.data?.message || "Password Reset failed");
      }
    })
    .catch((err) => {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Invalid verification code";
      notifyError(errorMessage);
      throw err;
    });

  return result;
};

// USER API CALLS
export const getUserProfile = async (
  // accessToken: string,
  setActivateAuth: any,
) => {
  let result = {};
  await apiClient
    .get(`/users/me`) // Assumes apiClient has baseURL: "http://localhost:5000/api/v1"
    .then((response: any) => {
      if (response?.data?.success === true) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      // This catch will ONLY run if the interceptor fails to recover (e.g., refresh fails).
      // If the interceptor successfully refreshes the token and retries, this catch does NOT run.
      localStorage.setItem("activateAuth", "true");
      setActivateAuth(true);
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};

export const updateUserProfile = async (data: any) => {
  let result = "";
  await apiClient
    .put(`/users/me`, data) // Assumes apiClient has baseURL: "http://localhost:5000/api/v1"
    .then((response: any) => {
      if (response?.data?.success === true) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};

// PRODUCT/SERVICES LISTINGS API CALLS
export const getCategory = async (slug: string) => {
  let result: any = "";
  await apiClient
    .get(`/catalog/categories/${slug}`) // Assumes apiClient has baseURL: "http://localhost:5000/api/v1"
    .then((response: any) => {
      if (response?.data?.success === true) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      // notifyError(err?.response?.data?.error);
      // throw err;
    });

  return result;
};

export const createCategory = async (data: any) => {
  let result: any = "";
  await apiClient
    .post(`/catalog/categories`, data) // Assumes apiClient has baseURL: "http://localhost:5000/api/v1"
    .then((response: any) => {
      if (response?.data?.success === true) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      // notifyError(err?.response?.data?.error);
      // throw err;
    });

  return result;
};

// PRODUCT/SERVICES LISTINGS API CALLS
export const getAllCategories = async () => {
  console.log("Fetching categories from API...");
  try {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: BackendCategory[];
    }>("/catalog/categories");

    if (response.data.success === true) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Invalid categories response");
    }
  } catch (error) {
    const apiMessage = axios.isAxiosError(error)
      ? (error.response?.data?.message ?? error.response?.data?.error)
      : undefined;
    const message =
      typeof apiMessage === "string"
        ? apiMessage
        : error instanceof Error
          ? error.message
          : "Failed to load categories";
    notifyError(message);
    throw error;
  }
};

export const getAllListings = async (listingType: "product" | "services") => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: BackendListing[];
    }>(`catalog/listings/${listingType}`);

    if (response.data.success !== true || !Array.isArray(response.data.data)) {
      throw new Error(
        response.data.message || `Invalid ${listingType} listings response`,
      );
    }

    return response.data.data;
  } catch (error) {
    const apiMessage = axios.isAxiosError(error)
      ? (error.response?.data?.message ?? error.response?.data?.error)
      : undefined;
    const message =
      typeof apiMessage === "string"
        ? apiMessage
        : error instanceof Error
          ? error.message
          : `Failed to load ${listingType} listings`;
    notifyError(message);
    throw error;
  }
};

export const getListing = async (id: string): Promise<BackendListing> => {
  try {
    const response = await apiClient.get<
      | BackendListing
      | { success: boolean; message: string; data: BackendListing }
    >(`/catalog/listings/${encodeURIComponent(id)}`);
    const payload = response.data;
    const listing = "data" in payload ? payload.data : payload;

    if (
      ("data" in payload && payload.success !== true) ||
      !listing ||
      typeof listing.id !== "string" ||
      typeof listing.seller_id !== "string"
    ) {
      throw new Error(
        "data" in payload
          ? payload.message || "Invalid listing response"
          : "Invalid listing response",
      );
    }

    return listing;
  } catch (error) {
    const apiMessage = axios.isAxiosError(error)
      ? (error.response?.data?.message ?? error.response?.data?.error)
      : undefined;
    const message =
      typeof apiMessage === "string"
        ? apiMessage
        : error instanceof Error
          ? error.message
          : "Failed to load product";
    notifyError(message);
    throw error;
  }
};

export const getSellerListings = async (
  sellerId: string,
): Promise<BackendListing[]> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      message?: string;
      data: BackendListing[];
    }>(`/catalog/listings/seller/${encodeURIComponent(sellerId)}`);

    if (response.data.success !== true || !Array.isArray(response.data.data)) {
      throw new Error(response.data.message || "Invalid seller listings response");
    }

    return response.data.data;
  } catch (error) {
    const apiMessage = axios.isAxiosError(error)
      ? (error.response?.data?.message ?? error.response?.data?.error)
      : undefined;
    const message =
      typeof apiMessage === "string"
        ? apiMessage
        : error instanceof Error
          ? error.message
          : "Failed to load seller listings";
    notifyError(message);
    throw error;
  }
};

export const createListing = async (data: any) => {
  let result: any = "";
  await apiClient
    .post(`/catalog/listings`, data) // Assumes apiClient has baseURL: "http://localhost:5000/api/v1"
    .then((response: any) => {
      if (response?.data?.success === true) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};

export const updateListing = async (id: any, data: any) => {
  let result = "";
  await apiClient
    .patch(`/catalog/listings/${id}`, data) // Assumes apiClient has baseURL: "http://localhost:5000/api/v1"
    .then((response: any) => {
      if (response?.data?.success === true) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};

export const createListingMedia = async (data: any, id: string) => {
  let result: any = "";
  await apiClient
    .post(`/catalog/listings/${id}/media`, data) // Assumes apiClient has baseURL: "http://localhost:5000/api/v1"
    .then((response: any) => {
      if (response?.data?.success === true) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};

export const deleteListingMedia = async (id: string) => {
  let result = "";
  await apiClient
    .delete(`/catalog/listings-media/${id}/delete`) // Assumes apiClient has baseURL: "http://localhost:5000/api/v1"
    .then((response: any) => {
      if (response?.data?.success === true) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};

export const uploadImage = async (file: any) => {
  console.log(file);
  let result: Presign = {
    expiresIn: 0,
    uploadUrl: "",
    key: "",
  };
  const payload = {
    filename: file.name,
    fileType: file.type,
    fileSize: file.size,
  };
  await axios
    .post(
      `${process.env.NEXT_PUBLIC_WORKER_URL}/api/uploads/presign`,
      payload,
      setImageConfig(),
    )
    .then(async (response: any) => {
      console.log(response);
      if (response?.status === 200) {
        result = response?.data;

        const uploadResponse = await fetch(response?.data?.uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Upload to R2 failed");
        }
      }
    })
    .catch((err) => {
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};

export const confirmUpload = async (data: any) => {
  let result = "";

  await axios
    .post(
      `${process.env.NEXT_PUBLIC_WORKER_URL}/api/uploads/confirm`,
      data,
      setImageConfig(),
    )
    .then(async (response: any) => {
      console.log(response);
      if (response?.status === 200) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      console.log(err);
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};

export const deleteUpload = async (data: any) => {
  let result = "";

  await axios
    .post(
      `${process.env.NEXT_PUBLIC_WORKER_URL}/api/uploads/delete`,
      data,
      setImageConfig(),
    )
    .then(async (response: any) => {
      console.log(response);
      if (response?.status === 200) {
        result = response?.data;
        console.log(result);
      }
    })
    .catch((err) => {
      console.log(err);
      notifyError(err?.response?.data?.error);
      throw err;
    });

  return result;
};
