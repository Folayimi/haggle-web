"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GhostButton, PrimaryButton, SectionTitle } from "@/components/haggle-ui";
import { nextTick } from "process";

export default function OfferArea({ product }: { product: any }) {
  const router = useRouter();
  const base = parseInt(String(product.price).replace(/[^0-9]/g, "")) || 100;
  const [offers, setOffers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAmount, setModalAmount] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // initialize offers on client to avoid SSR randomness/hydration mismatch
    const initial = Array.from({ length: 5 }).map((_, i) => ({
      id: `offer-init-${i}-${Date.now()}`,
      amount: base - (5 - i) * 2 + Math.floor(Math.random() * 6),
      buyer: i % 2 === 0 ? "Anon buyer" : "Buyer",
      time: `${5 - i}m ago`,
    }));
    setOffers(initial);
    setModalAmount(Math.max(...initial.map((o) => o.amount)) - 1);
  }, [base]);

  function makeOffer(amount?: number) {
    const amt = amount ?? Math.max(...offers.map((o) => o.amount)) - 1;
    const newOffer = {
      id: `offer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amount: amt,
      buyer: "You",
      time: "Now",
    } as any;
    setOffers((s) => [newOffer, ...s].slice(0, 10));
    setToast(`Offer submitted: $${amt}`);
    window.setTimeout(() => setToast(null), 2500);
    // Navigate to negotiation room to continue the flow
    router.push(`/negotiation-room?offer=${amt}`);
  }

  function Sparkline({ values }: { values: number[] }) {
    const width = 120;
    const height = 36;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const points = values
      .map((v, i) => {
        const x = (i / Math.max(values.length - 1, 1)) * width;
        const y = height - ((v - min) / (max - min || 1)) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block">
        <polyline
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={2}
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <div>
      <SectionTitle title="Offer history" description="Recent anonymized offers and quick context from the last rounds." />
      <div className="panel mt-3 rounded-[20px] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-muted">Last offers</div>
          <div className="flex items-center gap-3">
            <Sparkline values={offers.map((o) => o.amount)} />
            <div className="text-xs text-muted">{offers.length} offers</div>
          </div>
        </div>

        <div className="space-y-3">
          {offers.map((offer) => {
            const max = Math.max(...offers.map((o) => o.amount));
            const pct = Math.round((offer.amount / (max || 1)) * 100);
            return (
              <div key={offer.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-white/8 flex items-center justify-center text-sm font-medium">{offer.buyer.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold">{offer.buyer}</p>
                    <p className="text-xs text-muted">{offer.time}</p>
                  </div>
                </div>
                <div className="flex-1 px-4">
                  <div className="h-2 w-full rounded-full bg-white/6">
                    <div className={`h-2 rounded-full bg-primary`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="ml-4 text-sm font-semibold">${offer.amount}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-40">
        <div className="pointer-events-auto max-w-4xl w-full px-6">
          <div className="rounded-2xl bg-white/6 backdrop-blur p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs text-muted">Offer lane</p>
              <p className="text-lg font-semibold">Offer ${Math.max(...offers.map((o) => o.amount)) - 1}</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setIsModalOpen(true)} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
                Offer now
              </button>
              <GhostButton href="/conversation" label="Chat seller" />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-60 w-full max-w-md rounded-2xl bg-background p-6">
            <h3 className="text-lg font-semibold">Place an offer</h3>
            <p className="text-sm text-muted mt-2">Suggest a price and open a negotiation with the seller.</p>
            <div className="mt-4">
              <label className="text-xs text-muted">Offer amount</label>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-semibold">$</span>
                <input
                  type="number"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm"
                />
              </div>
              {modalAmount <= 0 && <p className="mt-2 text-xs text-red-400">Enter a valid positive amount</p>}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full border border-border px-4 py-2">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  if (!modalAmount || modalAmount <= 0) return;
                  makeOffer(modalAmount);
                  setIsModalOpen(false);
                }}
                className="rounded-full bg-primary px-4 py-2 text-white"
              >
                Submit offer
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-28 right-6 z-50 rounded-lg bg-black/90 px-4 py-2 text-white">
          {toast}
        </div>
      )}
    </div>
  );
}
