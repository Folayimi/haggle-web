"use client";

import { useEffect } from "react";

import { useHaggleStore } from "@/lib/app-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useHaggleStore((state) => state.theme);
  const setTheme = useHaggleStore((state) => state.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("haggle-web-store");
    if (storedTheme) {
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, [setTheme]);

  return children;
}
