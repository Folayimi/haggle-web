"use client";

// components/product-offers.tsx
// REPLACES the old version, which generated fake offers with Math.random()
// and redirected into /negotiation-room (a frozen, post-MVP page). This
// version calls the real backend and stays on the product page.

import { useState } from "react";
import { createOffer } from "@/services/negotiation";
import { useHaggleStore } from "@/lib/app-store";
import type { SellerProduct } from "@/types";

export default function OfferArea({ product }: { product: SellerProduct }) {
  const currentUserId = useHaggleStore((state) => state.userData?.id);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  if (!product.negotiationNote) {
    return null;
  }

  async function submitOffer() {
    if (!currentUserId || !amount.trim()) return;

    setSubmitting(true);
    try {
      await createOffer({
        listing_id: product.id,
        buyer_id: currentUserId,
        seller_id: product.sellerId,
        amount: amount.trim(),
      });
      setConfirmation(`Offer of ₦${Number(amount).toLocaleString()} sent to the seller.`);
      setAmount("");
      window.setTimeout(() => setConfirmation(null), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel rounded-[30px] p-6">
      <p className="text-sm font-semibold">Make an offer</p>
      <p className="mt-1 text-xs text-muted">
        Asking price: ₦{product.price.toLocaleString()}
      </p>
      <div className="mt-4 flex gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Your offer"
          className="flex-1 rounded-[22px] border border-border bg-background-elevated px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          disabled={submitting || !amount.trim() || !currentUserId}
          onClick={submitOffer}
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send offer"}
        </button>
      </div>
      {!currentUserId && (
        <p className="mt-2 text-xs text-danger">Sign in to make an offer.</p>
      )}
      {confirmation && (
        <p className="mt-3 text-sm font-medium text-success">{confirmation}</p>
      )}
    </div>
  );
}
