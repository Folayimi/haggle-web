"use client";

import {
  Heart,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { SellerLiveSession } from "@/types";
import { cn } from "@/lib/utils";

interface LiveSessionMetaProps {
  session: SellerLiveSession;
  variant: "compact" | "default" | "expanded";
}

export function LiveSessionMeta({
  session,
  variant,
}: LiveSessionMetaProps) {
  const compact = variant === "compact";
  const expanded = variant === "expanded";

  return (
    <div className="space-y-5">
      {/* ---------- Title ---------- */}

      <div>
        <h3
          className={cn(
            "font-semibold leading-tight text-foreground line-clamp-2",
            compact && "text-lg",
            variant === "default" && "text-xl",
            expanded && "text-2xl"
          )}
        >
          {session.title}
        </h3>

        {!compact && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {session.preview}
          </p>
        )}
      </div>

      {/* ---------- Stats ---------- */}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-surface p-3 text-center">
          <MessageSquare className="mx-auto h-4 w-4 text-primary" />

          <p className="mt-2 font-semibold">
            {session.offerCount.toLocaleString()}
          </p>

          <p className="text-xs text-muted">
            Offers
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-3 text-center">
          <Heart className="mx-auto h-4 w-4 text-danger" />

          <p className="mt-2 font-semibold">
            {session.saveCount.toLocaleString()}
          </p>

          <p className="text-xs text-muted">
            Saved
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-3 text-center">
          <Sparkles className="mx-auto h-4 w-4 text-warning" />

          <p className="mt-2 font-semibold">
            {session.participantCount.toLocaleString()}
          </p>

          <p className="text-xs text-muted">
            Watching
          </p>
        </div>
      </div>

      {/* ---------- Benefits ---------- */}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Why join?
        </p>

        <div className="flex flex-wrap gap-2">
          {session.buyerBenefits
            .slice(0, compact ? 2 : expanded ? 6 : 4)
            .map((benefit) => (
              <span
                key={benefit}
                className="
                  rounded-full
                  bg-primary/10
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-primary
                "
              >
                {benefit}
              </span>
            ))}
        </div>
      </div>

      {/* ---------- Reminder ---------- */}

      {!compact && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-primary">
            {session.reminderMessage}
          </p>
        </div>
      )}
    </div>
  );
}