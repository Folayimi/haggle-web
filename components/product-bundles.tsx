"use client";

import React from "react";
import { PrimaryButton } from "@/components/haggle-ui";

export default function BundleSuggestions({ product }: { product: any }) {
  const saveBundle = () => {
    // placeholder: in a real app this would add the bundle to cart
    window.location.href = "/checkout?bundle=true";
  };

  return (
    <div className="mt-6 panel rounded-[20px] p-4">
      <p className="text-sm font-semibold">Bundle suggestions</p>
      <p className="text-xs text-muted mt-1">Save on shipping and extras by bundling this item with a matching piece.</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold">Vase + Tray set</p>
          <p className="text-xs text-muted">Save 10% when you buy 2+</p>
        </div>
        <PrimaryButton href="/checkout?bundle=true" label="Checkout bundle" />
      </div>
    </div>
  );
}
