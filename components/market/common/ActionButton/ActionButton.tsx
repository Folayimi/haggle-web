"use client";

import { cloneElement, isValidElement, ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import { ActionButtonProps } from "./types";

const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary-strong",

  secondary: "bg-secondary text-white hover:opacity-90",

  danger: "bg-danger text-white hover:bg-danger/90",

  outline: "border border-border bg-background-elevated hover:bg-surface",

  ghost: "hover:bg-surface",
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",

  md: "px-4 py-3 text-sm",

  lg: "px-6 py-4 text-base",
};

export function ActionButton({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  asChild = false,
  onClick,
}: ActionButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<any>, {
      className: cn(
        classes,
        (children.props as { className?: string }).className,
      ),
    });
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
