import axios from "axios";
import { notify, notifyError } from "./toastify";

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
