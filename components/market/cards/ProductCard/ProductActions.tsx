"use client";

import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Store,
} from "lucide-react";

import { ActionButton } from "@/components/market/common/ActionButton";
import { Seller, SellerProduct } from "@/types";

interface ProductActionsProps {
  product: SellerProduct;
  seller: Seller;
}

export function ProductActions({
  product,
  seller,
}: ProductActionsProps) {
  return (
    <div className="space-y-3">
      {/* Primary CTA */}

      <ActionButton
        asChild
        className="group w-full"
      >
        <Link
          href={`/products/${product.slug}/negotiate`}
        >
          <MessageCircle className="h-4 w-4" />

          Negotiate

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
          <Link href={`/products/${product.slug}`}>
            Details
          </Link>
        </ActionButton>

        <ActionButton
          asChild
          variant="outline"
          className="w-full"
        >
          <Link
            href={`/business/${seller.username}`}
          >
            <Store className="h-4 w-4" />

            Store
          </Link>
        </ActionButton>

      </div>
    </div>
  );
}