"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Store,
} from "lucide-react";

import { ActionButton } from "@/components/market/common/ActionButton";
import { MarketService, Seller } from "@/types";

interface ServiceActionsProps {
  service: MarketService;
  seller: Seller;
}

export function ServiceActions({
  service,
  seller,
}: ServiceActionsProps) {
  return (
    <div className="space-y-3">
      {/* Primary CTA */}

      <ActionButton
        asChild
        variant="secondary"
        className="group w-full"
      >
        <Link href={`/services/${service.id}/book`}>
          <Calendar className="h-4 w-4" />

          Request Service

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </ActionButton>

      {/* Secondary Actions */}

      <div className="grid grid-cols-2 gap-3">

        <ActionButton
          asChild
          variant="outline"
          className="w-full"
        >
          <Link href={`/services/${service.id}`}>
            Details
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