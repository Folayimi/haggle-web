"use client";

import type { LucideIcon } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  targetId: string;
}

export function ActionCard({ icon: Icon, title, targetId }: ActionCardProps) {
  function scrollToSection() {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <button
      type="button"
      onClick={scrollToSection}
      className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-background-elevated text-left transition-colors hover:border-primary/30 hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`Go to ${title}`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary/15 text-primary sm:h-14 sm:w-14">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      </span>
      <span className="min-w-0 truncate pr-3 text-sm font-semibold text-foreground">
        {title}
      </span>
    </button>
  );
}
