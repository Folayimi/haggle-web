// lib/app-store.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode, SellerProfile } from "@/lib/types";

type HaggleStore = {
  // ====== EXISTING ======
  theme: ThemeMode;
  reservedLiveIds: string[];
  savedItemIds: string[];
  recentSearches: string[];
  activeConversationId: string;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  toggleReservation: (liveId: string) => void;
  toggleSavedItem: (itemId: string) => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  setActiveConversationId: (conversationId: string) => void;

  // ====== USER & AUTH ======
  userData: any;
  activateAuth: boolean;
  productListingId: string;
  setUserData: (data: any) => void;
  setActivateAuth: (value: boolean) => void;
  setProductListingId: (value: string) => void;
  clearUserData: () => void;

  // ====== DRAFT & PUBLISH ======
  draftProfile: SellerProfile | null;
  isDraftMode: boolean;
  isPreviewMode: boolean;
  setDraftProfile: (profile: SellerProfile) => void;
  setDraftMode: (mode: boolean) => void;
  setPreviewMode: (mode: boolean) => void;
  publishDraft: () => void;
  discardDraft: () => void;
};

export const useHaggleStore = create<HaggleStore>()(
  persist(
    (set, get) => ({
      // ====== EXISTING STATE ======
      theme: "light",
      reservedLiveIds: ["live-wholesale", "live-tech"],
      savedItemIds: ["product-vase", "live-luxe"],
      recentSearches: ["ceramic drop", "studio lighting", "bridal glam"],
      activeConversationId: "conversation-maria",

      // ====== EXISTING ACTIONS ======
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({
          theme: get().theme === "dark" ? "light" : "dark",
        }),
      toggleReservation: (liveId) =>
        set((state) => ({
          reservedLiveIds: state.reservedLiveIds.includes(liveId)
            ? state.reservedLiveIds.filter((item) => item !== liveId)
            : [...state.reservedLiveIds, liveId],
        })),
      toggleSavedItem: (itemId) =>
        set((state) => ({
          savedItemIds: state.savedItemIds.includes(itemId)
            ? state.savedItemIds.filter((item) => item !== itemId)
            : [...state.savedItemIds, itemId],
        })),
      addRecentSearch: (query) =>
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;
          const deduped = state.recentSearches.filter(
            (entry) => entry.toLowerCase() !== trimmed.toLowerCase()
          );
          return {
            recentSearches: [trimmed, ...deduped].slice(0, 6),
          };
        }),
      removeRecentSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((item) => item !== query),
        })),
      setActiveConversationId: (conversationId) =>
        set({ activeConversationId: conversationId }),

      // ====== USER & AUTH ======
      userData: null,
      activateAuth: false,
      productListingId: "",
      setUserData: (data) => set({ userData: data }),
      setActivateAuth: (value) => set({ activateAuth: value }),
      setProductListingId: (value) => set({ productListingId: value }),
      clearUserData: () => set({ userData: null, activateAuth: false }),

      // ====== DRAFT & PUBLISH ======
      draftProfile: null,
      isDraftMode: false,
      isPreviewMode: false,

      setDraftProfile: (profile) => set({ draftProfile: profile, isDraftMode: true }),
      setDraftMode: (mode) => set({ isDraftMode: mode }),
      setPreviewMode: (mode) => set({ isPreviewMode: mode }),

      publishDraft: () => {
        const draft = get().draftProfile;
        if (draft) {
          // In real app: call API to update published profile
          // For now, just clear the draft
          set({ draftProfile: null, isDraftMode: false });
        }
      },

      discardDraft: () => {
        set({ draftProfile: null, isDraftMode: false });
      },
    }),
    {
      name: "haggle-web-store",
      partialize: (state) => {
        // Exclude auth and draft from persistence (optional)
        const { userData, activateAuth, draftProfile, isDraftMode, ...rest } = state;
        return rest;
      },
    }
  )
);