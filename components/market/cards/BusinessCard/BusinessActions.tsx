"use client";

import Link from "next/link";
import {
  Globe,
  MessageCircle,
  Share2,
} from "lucide-react";

import { ActionButton } from "@/components/market/common/ActionButton";

import { Seller } from "@/types";

interface BusinessActionsProps {
  seller: Seller;
}

export function BusinessActions({
  seller,
}: BusinessActionsProps) {
  return (
    <div className="space-y-3">
      {/* Primary CTA */}

      <ActionButton
        asChild
        className="w-full"
      >
        <Link href={`/conversation/${seller.id}`}>
          <MessageCircle className="h-4 w-4" />

          Start Negotiation
        </Link>
      </ActionButton>

      {/* Secondary Actions */}

      <div className="grid grid-cols-2 gap-3">
        <ActionButton
          asChild
          variant="outline"
          className="w-full"
        >
          <Link href={`/business/${seller.username}/website`}>
            <Globe className="h-4 w-4" />

            Website
          </Link>
        </ActionButton>

        <ActionButton
          variant="outline"
          className="w-full"
          onClick={() => {
            // TODO:
            // Share business profile
          }}
        >
          <Share2 className="h-4 w-4" />

          Share
        </ActionButton>
      </div>
    </div>
  );
}