import { Key, ReactNode } from "react";

export interface CarouselProps<T> {
  items: T[];

  renderItem: (
    item: T,
    index: number
  ) => ReactNode;

  getKey?: (
    item: T,
    index: number
  ) => Key;

  itemWidth?: number;

  gap?: number;

  className?: string;

  showControls?: boolean;
}

export interface SectionHeaderProps {
  title: string;

  subtitle?: string;

  href?: string;

  hrefLabel?: string;

  action?: ReactNode;
}

export interface MarketSectionProps {
  title: string;

  subtitle?: string;

  href?: string;

  hrefLabel?: string;

  action?: ReactNode;

  children: ReactNode;

  className?: string;

  animate?: boolean;
}