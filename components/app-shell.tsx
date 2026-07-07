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
  HomeIcon,
  Compass,
  ShoppingBag,
  PlusCircle,
  MessageCircle,  
  LogOut,
  ChevronLeft,
  ChevronRight,  
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

import { currentUser } from "@/lib/mock-data";
import { useHaggleStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import SideNav from "./SideNav";

const mainNav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/market", label: "Market", icon: Search },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const theme = useHaggleStore((state) => state.theme);
  const toggleTheme = useHaggleStore((state) => state.toggleTheme);

  const navItems = [
    { id: "for-you", label: "For You", icon: HomeIcon, path: "/for-you" },
    { id: "explore", label: "Explore", icon: Compass, path: "/for-you" },
    { id: "market", label: "Market", icon: ShoppingBag, path: "/market" },
    { id: "add", label: "Add", icon: PlusCircle, path: "/create" },
    {
      id: "message",
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="h-screen text-foreground">
      <div className="flex h-full w-full max-w-[1600px]">
        <SideNav />       
        <div className="flex h-full overflow-y-auto flex-1 flex-col">
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
              </div>
            </div>
          </header>

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
