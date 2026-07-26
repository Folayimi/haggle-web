"use client";

import Link from "next/link";
import {
  CalendarPlus,
  Play,
  Store,
  ArrowRight,
} from "lucide-react";

import { ActionButton } from "@/components/market/common/ActionButton";

import {
  Seller,
  SellerLiveSession,
} from "@/types";

interface LiveSessionActionsProps {
  session: SellerLiveSession;
  seller: Seller;
}

export function LiveSessionActions({
  session,
  seller,
}: LiveSessionActionsProps) {
  const isLive = session.status === "Live now";

  return (
    <div className="space-y-3">
      {/* Primary CTA */}

      {isLive ? (
        <ActionButton
          asChild
          className="group w-full bg-danger hover:bg-danger/90"
        >
          <Link href={`/live/${session.id}`}>
            <Play className="h-4 w-4 fill-current" />

            Join Live

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ActionButton>
      ) : (
        <ActionButton
          className="w-full"
        >
          <CalendarPlus className="h-4 w-4" />

          Reserve Spot
        </ActionButton>
      )}

      {/* Secondary Actions */}

      <div className="grid grid-cols-2 gap-3">
        <ActionButton
          asChild
          variant="outline"
          className="w-full"
        >
          <Link href={`/conversation/${seller.id}`}>
            Message Seller
          </Link>
        </ActionButton>

        <ActionButton
          asChild
          variant="outline"
          className="w-full"
        >
          <Link href={`/business/${seller.username}`}>
            <Store className="h-4 w-4" />

            Visit Store
          </Link>
        </ActionButton>
      </div>
    </div>
  );
}