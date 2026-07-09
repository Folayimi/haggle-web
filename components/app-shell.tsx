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
import { useEffect, useRef, useState } from "react";

import { currentUser } from "@/lib/mock-data";
import { useHaggleStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import SideNav from "./SideNav";
import AuthPopUp from "./AuthPopUp";
import { getUserProfile } from "@/services/request";

const mainNav = [
  { href: "/for-you", label: "Home", icon: Home },
  { href: "/market", label: "Market", icon: Search },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activateAuth, setActivateAuth] = useState(false);

  const theme = useHaggleStore((state) => state.theme);
  const toggleTheme = useHaggleStore((state) => state.toggleTheme);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const [userData, setUserData] = useState({});

  const hasFetched = useRef(false);

  const fetchUserProfile = async () => {
     const haggleAccessToken = localStorage.getItem("haggleAccessToken");
    if (localStorage.getItem("activateAuth") === "true") {
      const timer = setTimeout(() => {
        setActivateAuth(true);
      }, 10000);
      // return () => clearTimeout(timer);
    } else {
      if (haggleAccessToken) {
        // hasFetched.current = true;
        let user = await getUserProfile(setActivateAuth);
        console.log(user);
        setUserData(user);
      } else {
        localStorage.setItem("activateAuth", "true");
        const timer = setTimeout(() => {
          setActivateAuth(true);
        }, 10000);
      }
    }
  }

  useEffect(() => {
   fetchUserProfile()
  }, []);

  return (
    <div className="flex h-screen text-foreground w-full">
      {activateAuth && <AuthPopUp setActivateAuth={setActivateAuth} />}
      <SideNav userData={userData}/>
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
  );
}
