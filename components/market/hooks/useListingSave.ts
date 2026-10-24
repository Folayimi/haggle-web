"use client";

import { useCallback, useState } from "react";

import { useHaggleStore } from "@/lib/app-store";
import { getCatalogErrorStatus, saveListing, unsaveListing } from "@/services/catalog";
import { notifyError } from "@/services/toastify";

export function useListingSave(listingId: string) {
  const saved = useHaggleStore((state) => state.savedItemIds.includes(listingId));
  const setSavedItem = useHaggleStore((state) => state.setSavedItem);
  const setActivateAuth = useHaggleStore((state) => state.setActivateAuth);
  const [pending, setPending] = useState(false);

  const toggle = useCallback(async () => {
    if (pending) return;
    if (!localStorage.getItem("haggleAccessToken")) {
      setActivateAuth(true);
      notifyError("Sign in to save listings.");
      return;
    }
    setPending(true);
    try {
      if (saved) {
        await unsaveListing(listingId);
        setSavedItem(listingId, false);
      } else {
        await saveListing(listingId);
        setSavedItem(listingId, true);
      }
    } catch (error) {
      const status = getCatalogErrorStatus(error);
      if (status === 401) setActivateAuth(true);
      notifyError(status === 401
        ? "Sign in to save listings."
        : status === 403
          ? "You do not have permission to save this listing."
          : status === 404
            ? "This listing is no longer available."
            : "Could not update saved listings. Please try again.");
    } finally {
      setPending(false);
    }
  }, [listingId, pending, saved, setActivateAuth, setSavedItem]);

  return { saved, pending, toggle };
}
