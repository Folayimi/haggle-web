"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Bookmark,
  Home,
  Menu,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  User,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

import { currentUser } from "@/lib/mock-data";
import { useHaggleStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/market", label: "Market", icon: Search },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
];

const secondaryNav = [
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/saved", label: "Saved deals", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useHaggleStore((state) => state.theme);
  const toggleTheme = useHaggleStore((state) => state.toggleTheme);
  const reservedCount = useHaggleStore((state) => state.reservedLiveIds.length);
  const savedCount = useHaggleStore((state) => state.savedItemIds.length);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 flex-col justify-between border-r border-border bg-background-elevated/85 px-5 py-5 backdrop-blur xl:flex">
          <div className="space-y-6">
            <div className="panel rounded-[28px] px-5 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                    Haggle
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold">Live marketplace</h1>
                </div>
                <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  Beta
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">
                Discover rooms, reserve drops, and keep your buyer energy high.
              </p>
              <Link
                href="/negotiation-room"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-strong"
              >
                <Video className="h-4 w-4" />
                Start a room
              </Link>
            </div>

            <nav className="space-y-2">
              {mainNav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium",
                      isActive(item.href)
                        ? "bg-primary text-white shadow-[0_14px_40px_rgba(244,77,36,0.28)]"
                        : "panel-muted text-foreground hover:-translate-y-0.5 hover:bg-surface-strong",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-2 rounded-[24px] border border-border bg-surface/70 p-3">
              {secondaryNav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-[18px] px-3 py-3 text-sm font-medium",
                      isActive(item.href)
                        ? "bg-background-elevated text-foreground"
                        : "text-muted hover:bg-background-elevated/70 hover:text-foreground",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5" />
                      {item.label}
                    </span>
                    {item.href === "/reminders" ? (
                      <span className="rounded-full bg-primary/12 px-2 py-1 text-xs font-semibold text-primary">
                        {reservedCount}
                      </span>
                    ) : null}
                    {item.href === "/saved" ? (
                      <span className="rounded-full bg-secondary/12 px-2 py-1 text-xs font-semibold text-secondary">
                        {savedCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="panel rounded-[28px] px-4 py-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="h-12 w-12 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{currentUser.fullName}</p>
                <p className="text-xs text-muted">{currentUser.businessName}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-surface px-2 py-3">
                <p className="text-lg font-semibold">{currentUser.metrics.savedDeals}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Saved
                </p>
              </div>
              <div className="rounded-2xl bg-surface px-2 py-3">
                <p className="text-lg font-semibold">{currentUser.metrics.upcomingLives}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Tickets
                </p>
              </div>
              <div className="rounded-2xl bg-surface px-2 py-3">
                <p className="text-lg font-semibold">{currentUser.metrics.roomsJoined}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  Rooms
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="mt-4 flex w-full items-center justify-between rounded-full border border-border bg-background-elevated px-4 py-3 text-sm font-medium hover:border-primary/35"
            >
              <span className="flex items-center gap-2">
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-warning" />
                ) : (
                  <Moon className="h-4 w-4 text-secondary" />
                )}
                Theme
              </span>
              <span className="rounded-full bg-surface px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted">
                {theme}
              </span>
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur xl:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                  Haggle
                </p>
                <p className="text-lg font-semibold">Marketplace live</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="rounded-full border border-border bg-background-elevated p-2"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-warning" />
                  ) : (
                    <Moon className="h-4 w-4 text-secondary" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(true)}
                  className="rounded-full border border-border bg-background-elevated p-2"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <AnimatePresence>
            {isOpen ? (
              <motion.div
                className="fixed inset-0 z-50 xl:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  className="absolute inset-0 bg-black/45"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                />
                <motion.div
                  className="absolute right-0 top-0 h-full w-[86%] max-w-[340px] bg-background-elevated px-4 py-5 shadow-2xl"
                  initial={{ x: 40 }}
                  animate={{ x: 0 }}
                  exit={{ x: 40 }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                        Navigation
                      </p>
                      <p className="text-lg font-semibold">Move fast</p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-full border border-border bg-surface p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[...mainNav, ...secondaryNav].map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-medium",
                            isActive(item.href)
                              ? "bg-primary text-white"
                              : "panel-muted text-foreground",
                          )}
                        >
                          <Icon className="h-4.5 w-4.5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <main className="flex-1 pb-24 xl:pb-0">{children}</main>

          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/92 px-3 py-3 backdrop-blur xl:hidden">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold",
                      active ? "bg-primary text-white" : "text-muted",
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
