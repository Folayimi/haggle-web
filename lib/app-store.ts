"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ThemeMode } from "@/lib/types";

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

  // ====== NEW: USER & AUTH ======
  userData: any; // Consider typing this properly: UserProfile | null
  activateAuth: boolean;
  setUserData: (data: any) => void;
  setActivateAuth: (value: boolean) => void;
  clearUserData: () => void; // For logout
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
          if (!trimmed) {
            return state;
          }

          const deduped = state.recentSearches.filter(
            (entry) => entry.toLowerCase() !== trimmed.toLowerCase(),
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

      // ====== NEW STATE ======
      userData: null,
      activateAuth: false,

      // ====== NEW ACTIONS ======
      setUserData: (data) => set({ userData: data }),
      setActivateAuth: (value) => set({ activateAuth: value }),
      clearUserData: () => set({ userData: null, activateAuth: false }),
    }),
    {
      name: "haggle-web-store",
      // 👇 Optional: Exclude userData from persistence (recommended for security)
      partialize: (state) => {
        // Exclude userData and activateAuth from persistence
        const { userData, activateAuth, ...rest } = state;
        return rest; // Only persist non-auth data
      },
    },
  ),
);
