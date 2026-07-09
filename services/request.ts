import axios from "axios";
import apiClient from "./client";
import { notify, notifyError } from "./toastify";
import { PassThrough } from "stream";
import { Dispatch, SetStateAction } from "react";

const baseUrl = "http://localhost:5000/api/v1";

const setConfig = (accessToken: string) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      withCredentials: true,
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
    console.log('accessToken...',token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("checking....");
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
        const response = await axios.post(`${baseUrl}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = response.data.tokens?.accessToken;
        const newRefreshToken = response.data.tokens?.refreshToken;

        localStorage.setItem("haggleAccessToken", newAccessToken);
        localStorage.setItem("haggleRefreshToken", newRefreshToken);

        console.log('new tokens: ',response.data.tokens)

        // Update the auth header for the current request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process all queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - reject all queued requests and log the user out
        processQueue(refreshError, null);
        localStorage.clear();
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
  setActivateAuth: Dispatch<SetStateAction<boolean>>,
) => {
  let result = {};
  await apiClient
    .get(`/users/me`) // Assumes apiClient has baseURL: "http://localhost:5000/api/v1"
    .then((response: any) => {
      if (response?.data?.success === true) {
        result = response?.data;
        console.log(result)
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
