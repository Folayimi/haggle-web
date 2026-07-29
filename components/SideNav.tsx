// components/SideNav.tsx
"use client";

import { useEffect, useState } from "react";
import {
  HomeIcon,
  ShoppingBag,
  PlusCircle,
  MessageCircle,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useHaggleStore } from "@/lib/app-store";
import { usePathname } from "next/navigation";

const SideNav = ({ userData }: { userData: any }) => {
  const [tab, setTab] = useState("home");
  const [collapsed, setCollapsed] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("sideNavCollapsed") === "true"
      : false,
  );
  const theme = useHaggleStore((state) => state.theme);
  const toggleTheme = useHaggleStore((state) => state.toggleTheme);
  const pathname = usePathname();

  // Base nav items (without profile)
  const baseNavItems = [
    { id: "for-you", label: "Home", icon: HomeIcon, path: "/for-you" },
    { id: "market", label: "Market", icon: ShoppingBag, path: "/market" },
    { id: "create", label: "Add", icon: PlusCircle, path: "/create" },
    {
      id: "message",
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
  ];

  // Profile nav item
  const profileNavItem = {
    id: "profile",
    label: userData?.profile?.full_name || "Profile",
    icon: User,
    path: `/profile/${userData?.username || userData?.profile?.username || ""}`,
  };

  // Combine: all nav items including profile at the end
  const navItems = [...baseNavItems, profileNavItem];

  const isActive = (path: string) => {
    if (path === "/create") {
      return (
        pathname === "/post-product" ||
        pathname === "/add-service" ||
        pathname === "/create"
      );
    }
    if (path.startsWith("/profile")) {
      return pathname.startsWith("/profile");
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Handle collapse persistence
  useEffect(() => {
    localStorage.setItem("sideNavCollapsed", collapsed.toString());
  }, [collapsed]);

  return (
    <aside
      className={`z-50 hidden xl:flex relative h-screen bg-background-elevated/10 backdrop-blur-sm
        border-r border-border/40 shadow-sm
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[80px]" : "w-[220px]"}
        flex-col
      `}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-50 w-6 h-6 rounded-full 
          bg-primary text-white
          hover:bg-primary-600
          flex items-center justify-center
          shadow-md hover:shadow-lg
          transition-all duration-200 hover:scale-105
          border border-white/20"
      >
        {collapsed ? (
          <ChevronRight size={14} strokeWidth={2.5} />
        ) : (
          <ChevronLeft size={14} strokeWidth={2.5} />
        )}
      </button>

      {/* Logo Section */}
      <div
        className={`
          flex items-center gap-3 px-4 pt-6 pb-6
          transition-all duration-300
          ${collapsed ? "justify-center px-2" : ""}
        `}
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-lg">H</span>
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
          `}
        >
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Haggle
          </h1>
          <p className="text-[10px] text-muted font-medium uppercase tracking-wider -mt-0.5">
            Marketplace
          </p>
        </div>
      </div>

      {/* Navigation Tabs (including profile) */}
      <div className="flex-1 px-3 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link href={item.path} key={item.id}>
                <button
                  onClick={() => setTab(item.id)}
                  className={`
                    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
                    transition-all duration-200
                    ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-background-elevated/20 hover:text-foreground"
                    }
                    ${collapsed ? "justify-center px-0" : ""}
                  `}
                >
                  {/* Active Indicator */}
                  {active && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 
                      bg-primary rounded-r-full"
                    />
                  )}

                  <div
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-lg
                      transition-all duration-200
                      ${
                        active
                          ? "bg-primary text-white shadow-sm shadow-primary/20"
                          : "text-current"
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.5 : 2}
                      className={active ? "text-white" : "text-current"}
                    />
                  </div>

                  <span
                    className={`
                      font-medium text-sm transition-all duration-300
                      ${active && "text-primary"}
                      ${collapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100"}
                    `}
                  >
                    {item.label}
                  </span>

                  {/* Notification badge on Messages - only if not profile */}
                  {item.id === "message" && !collapsed && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      3
                    </span>
                  )}
                  {item.id === "message" && collapsed && (
                    <span className="absolute -top-0.5 right-0 w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Theme, Notifications, Settings, Logout */}
      <div className="px-3 pb-4 border-t border-border/30 pt-3 mt-auto">
        <div
          className={`
            flex items-center gap-1
            flex-col
          `}
        >
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
              transition-all duration-200
              text-foreground/70 hover:bg-background-elevated/20 hover:text-foreground
              ${collapsed ? "justify-center px-0" : ""}
            `}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg">
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-warning" />
              ) : (
                <Moon className="h-4 w-4 text-secondary" />
              )}
            </div>
            <span
              className={`
                font-medium text-sm transition-all duration-300
                ${collapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100"}
              `}
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          {/* Notifications */}
          <button
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
              transition-all duration-200
              text-foreground/70 hover:bg-background-elevated/20 hover:text-foreground
              ${collapsed ? "justify-center px-0" : ""}
            `}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg relative">
              <Bell size={18} />
              {!collapsed && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span
              className={`
                font-medium text-sm transition-all duration-300
                ${collapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100"}
              `}
            >
              Notifications
            </span>
          </button>

          {/* Settings */}
          <button
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
              transition-all duration-200
              text-foreground/70 hover:bg-background-elevated/20 hover:text-foreground
              ${collapsed ? "justify-center px-0" : ""}
            `}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg">
              <Settings size={18} />
            </div>
            <span
              className={`
                font-medium text-sm transition-all duration-300
                ${collapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100"}
              `}
            >
              Settings
            </span>
          </button>

          {/* Logout */}
          <button
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
              transition-all duration-200
              text-danger/70 hover:bg-danger/10 hover:text-danger
              ${collapsed ? "justify-center px-0" : ""}
            `}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg">
              <LogOut size={18} />
            </div>
            <span
              className={`
                font-medium text-sm transition-all duration-300
                ${collapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100"}
              `}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
