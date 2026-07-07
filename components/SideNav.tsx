"use client";

import { useState } from "react";
import {
  HomeIcon,
  Compass,
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

const SideNav = () => {
  const [tab, setTab] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
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

  return (
    <aside
      className={`
        hidden xl:block relative h-screen text-foreground border-r-[0.5px] border-neutral-200 shadow-sm
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[80px]" : "w-[220px]"}
        flex flex-col
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
          border-2 border-white"
      >
        {collapsed ? (
          <ChevronRight size={14} strokeWidth={2.5} />
        ) : (
          <ChevronLeft size={14} strokeWidth={2.5} />
        )}
      </button>

      {/* Logo Section */}
      <div
        className={`relative
        flex items-center gap-3 px-4 pt-6 pb-8
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
          <h1 className="text-xl font-bold text-dark-800 tracking-tight">
            Haggle
          </h1>
          <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider -mt-0.5">
            Marketplace
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 px-3">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;

            return (
              <Link href={item.path}>
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                  }}
                  className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary-50 text-primary"
                      : "text-foreground hover:bg-surface hover:text-dark-800"
                  }
                  ${collapsed ? "justify-center px-0" : ""}
                `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 
                    bg-primary rounded-r-full"
                    ></div>
                  )}

                  <div
                    className={`
                  flex items-center justify-center w-8 h-8 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary text-white shadow-sm shadow-primary/20"
                      : "text-current group-hover:bg-surface"
                  }
                `}
                  >
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`${isActive ? "text-white" : "text-foreground"}`}
                    />
                  </div>

                  <span
                    className={`
                  font-medium text-sm transition-all duration-300
                  ${isActive && "text-primary"}
                  ${collapsed ? "w-0 opacity-0 absolute" : "w-auto opacity-100"}
                `}
                  >
                    {item.label}
                  </span>

                  {/* Notification badge on Messages */}
                  {item.id === "message" && !collapsed && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      3
                    </span>
                  )}
                  {item.id === "message" && collapsed && (
                    <span className="absolute -top-0.5 right-0 w-2.5 h-2.5 rounded-full bg-primary"></span>
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 px-3 pb-4 mt-auto">
        <div className="border-t border-neutral-200 pt-3">
          {/* Notifications & Settings - only when expanded */}
          <div
            className={`
            flex items-center gap-2 mb-3 px-2
            ${collapsed ? "flex-col" : ""}
          `}
          >
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
              className={`
              p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 hover:text-dark-800
              transition-all duration-200
              ${collapsed ? "w-full flex justify-center" : ""}
            `}
            >
              <Bell size={18} />
            </button>
            <button
              className={`
              p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 hover:text-dark-800
              transition-all duration-200
              ${collapsed ? "w-full flex justify-center" : ""}
            `}
            >
              <Settings size={18} />
            </button>
          </div>

          {/* Profile Section */}
          <button
            className={`
            w-full flex items-center gap-3 px-2 py-2.5 rounded-xl
            hover:bg-neutral-50 transition-all duration-200
            ${collapsed ? "justify-center" : ""}
          `}
          >
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-white" />
            </div>
            <div
              className={`
              flex-1 text-left transition-all duration-300
              ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
            `}
            >
              <p className="text-sm font-medium text-dark-800">John Doe</p>
              <p className="text-xs text-neutral-500">john@haggle.com</p>
            </div>
            {!collapsed && (
              <LogOut
                size={16}
                className="text-neutral-400 hover:text-danger transition-colors"
              />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
