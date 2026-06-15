import axios from "axios";
import { notify, notifyError } from "./toastify";
import { PassThrough } from "stream";

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

export const userLogin = async (data: any) => {
  let result = {};
  await axios
    .post(`${baseUrl}/auth/login`, data)
    .then((response: any) => {
      if (response?.data?.success === true) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
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
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }
        if (response.data.tokens?.accessToken) {
          localStorage.setItem(
            "haggleAccessToken",
            response.data.tokens.accessToken,
          );
        }
        if (response.data.tokens?.refreshToken) {
          localStorage.setItem(
            "haggleRefreshToken",
            response.data.tokens.refreshToken,
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

export const verifyOtp = async (data: { email: string; otp: string }) => {
  let result = {};

  await axios
    .post(`${baseUrl}/auth/verify-otp`, {
      email: data?.email,
      otp_code: data?.otp,
    })
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

export const sendResetOtp = async (email: string) => {
  let result = {};

  await axios
    .post(`${baseUrl}/auth/send-verification`, {
      email,
      type: "otp",
    })
    .then((response: any) => {
      if (response?.data?.success === true) {
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
