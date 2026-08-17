"use client";
/* eslint-disable @next/next/no-img-element */

// components/pages/SellerPage.tsx
// Deliberately small -- matches what the backend actually models today.
// See Section 9 of the product doc: this should feel like a shareable
// storefront, not an admin dashboard, and it should NOT try to be the
// full business-profile builder from app/profile/[username]/page.tsx.

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { GhostButton } from "@/components/haggle-ui";
import { getUserById } from "@/services/users";
import { mapUserToSeller } from "@/services/mappers";

function ContentSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

export function SellerPage({ sellerId }: { sellerId?: string }) {
  const [seller, setSeller] = useState<ReturnType<typeof mapUserToSeller> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) {
      setLoading(false);
      return;
    }
    getUserById(sellerId)
      .then((user) => user && setSeller(mapUserToSeller(user)))
      .finally(() => setLoading(false));
  }, [sellerId]);

  if (loading) {
    return (
      <AppShell>
        <ContentSection>
          <div className="panel rounded-[36px] p-10 text-center text-sm text-muted">
            Loading seller…
          </div>
        </ContentSection>
      </AppShell>
    );
  }

  if (!seller) {
    return (
      <AppShell>
        <ContentSection>
          <div className="panel rounded-[36px] p-10 text-center text-sm text-muted">
            Seller not found.
          </div>
        </ContentSection>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ContentSection>
        <div className="panel overflow-hidden rounded-[38px]">
          <div className="px-6 py-8">
            <div className="flex items-end gap-4">
              <img
                src={seller.avatarUrl}
                alt={seller.name}
                className="h-24 w-24 rounded-[28px] object-cover"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  {seller.badge}
                </p>
                <h1 className="mt-2 text-3xl font-semibold">{seller.name}</h1>
                {seller.businessName && (
                  <p className="mt-1 text-sm text-muted">{seller.businessName}</p>
                )}
              </div>
            </div>
            {seller.trustPills.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {seller.trustPills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-6">
              <GhostButton href={`/conversation`} label="Message seller" />
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <p className="text-sm text-muted">
          This seller&apos;s product listings will appear here once the
          catalog-by-seller endpoint is wired (currently GET /catalog/listings
          has no seller filter yet -- flag this for the backend when ready).
        </p>
      </ContentSection>
    </AppShell>
  );
}
