import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHaggleStore } from "@/lib/app-store";

export const notify = (text:string)=>{
    toast.success(text)
}

export const notifyError = (text:string)=>{
    toast.error(text)
}

export function notifyApiError(error: unknown, message: string) {
    const unauthenticated = typeof window !== "undefined" &&
        (!window.localStorage.getItem("haggleAccessToken") ||
         !window.localStorage.getItem("haggleRefreshToken"));
    const unauthorized = axios.isAxiosError(error) &&
        error.response?.status === 401;

    if (unauthenticated || unauthorized) {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("activateAuth", "true");
        }
        useHaggleStore.getState().setActivateAuth(true);
        return;
    }

    notifyError(message);
}
