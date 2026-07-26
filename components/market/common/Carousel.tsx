"use client";

import {
  Key,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { CarouselProps } from "./types";

export function Carousel<T>({
  items,
  renderItem,
  getKey,
  itemWidth = 280,
  gap = 16,
  className,
  showControls = true,
}: CarouselProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  const [leftVisible, setLeftVisible] =
    useState(false);

  const [rightVisible, setRightVisible] =
    useState(false);

  const updateButtons = useCallback(() => {
    if (!ref.current) return;

    const {
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = ref.current;

    setLeftVisible(scrollLeft > 5);

    setRightVisible(
      scrollLeft <
        scrollWidth - clientWidth - 5
    );
  }, []);

  useEffect(() => {
    updateButtons();
  }, [items, updateButtons]);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    el.addEventListener(
      "scroll",
      updateButtons
    );

    window.addEventListener(
      "resize",
      updateButtons
    );

    return () => {
      el.removeEventListener(
        "scroll",
        updateButtons
      );

      window.removeEventListener(
        "resize",
        updateButtons
      );
    };
  }, [updateButtons]);

  const scroll = useCallback(
    (direction: number) => {
      if (!ref.current) return;

      ref.current.scrollBy({
        left:
          direction *
          ref.current.clientWidth *
          0.85,
        behavior: "smooth",
      });
    },
    []
  );

  return (
    <div className="group relative">

      {showControls && leftVisible && (
        <button
          onClick={() => scroll(-1)}
          className="
            absolute
            left-3
            top-1/2
            z-20
            -translate-y-1/2
            rounded-full
            bg-black/60
            p-2
            text-white
            opacity-0
            backdrop-blur
            transition
            duration-200
            group-hover:opacity-100
            hover:scale-110
          "
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        ref={ref}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar",
          className
        )}
        style={{ gap }}
      >
        {items.map((item, index) => (
          <div
            key={
              getKey
                ? getKey(item, index)
                : index
            }
            style={{
              minWidth: itemWidth,
            }}
            className="flex-shrink-0 snap-start"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {showControls && rightVisible && (
        <button
          onClick={() => scroll(1)}
          className="
            absolute
            right-3
            top-1/2
            z-20
            -translate-y-1/2
            rounded-full
            bg-black/60
            p-2
            text-white
            opacity-0
            backdrop-blur
            transition
            duration-200
            group-hover:opacity-100
            hover:scale-110
          "
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}