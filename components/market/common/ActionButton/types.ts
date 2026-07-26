import { ReactNode } from "react";

export type ActionButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost";

export type ActionButtonSize =
  | "sm"
  | "md"
  | "lg";

export interface ActionButtonProps {
  children: ReactNode;

  variant?: ActionButtonVariant;

  size?: ActionButtonSize;

  className?: string;

  disabled?: boolean;

  asChild?: boolean;

  onClick?: () => void;
}