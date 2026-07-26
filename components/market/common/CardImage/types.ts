import { ReactNode } from "react";

export interface CardImageProps {
  image: string;

  alt: string;

  aspectRatio?:
    | "square"
    | "portrait"
    | "landscape"
    | "banner";

  className?: string;

  overlay?: ReactNode;

  topOverlay?: ReactNode;

  bottomOverlay?: ReactNode;

  zoomOnHover?: boolean;
}