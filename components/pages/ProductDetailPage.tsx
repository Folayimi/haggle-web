"use client";
/* eslint-disable @next/next/no-img-element */

// components/pages/ProductDetailPage.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { GhostButton, PrimaryButton, SellerIdentity } from "@/components/haggle-ui";
import OfferArea from "@/components/product-offers";
import { getListing } from "@/services/catalog";
import { getUserById } from "@/services/users";
import { createConversation } from "@/services/conversations";
import { mapListingToProduct, mapUserToSeller } from "@/services/mappers";
import { useHaggleStore } from "@/lib/app-store";
import type { SellerProduct } from "@/types";

function ContentSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function ProductDetailPage({ productId }: { productId?: string }) {
  const router = useRouter();
  const currentUserId = useHaggleStore((state) => state.userData?.id);

  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [seller, setSeller] = useState<ReturnType<typeof mapUserToSeller> | null>(null);
  const [loading, setLoading] = useState(true);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getListing(productId)
      .then(async (listing) => {
        if (cancelled || !listing) return;
        const mapped = mapListingToProduct(listing);
        setProduct(mapped);

        const sellerRow = await getUserById(mapped.sellerId).catch(() => null);
        if (!cancelled && sellerRow) {
          setSeller(mapUserToSeller(sellerRow));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleMessageSeller() {
    if (!product || !currentUserId) return;

    setMessaging(true);
    try {
      const conversation = await createConversation({
        conversation_type: "direct",
        seller_id: product.sellerId,
        listing_id: product.id,
        participant_ids: [currentUserId, product.sellerId],
      });
      if (conversation) {
        router.push(`/conversation?id=${conversation.id}`);
      }
    } finally {
      setMessaging(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <ContentSection>
          <div className="panel rounded-[36px] p-10 text-center text-sm text-muted">
            Loading product…
          </div>
        </ContentSection>
      </AppShell>
    );
  }

  if (!product) {
    return (
      <AppShell>
        <ContentSection>
          <div className="panel rounded-[36px] p-10 text-center text-sm text-muted">
            Product not found.
          </div>
        </ContentSection>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ContentSection>
        <div className="grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">
          <div className="panel overflow-hidden rounded-[36px]">
            <div className="relative h-[420px]">
              <img
                src={product.images[0]?.url ?? "/placeholder-product.jpg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {product.category}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="panel rounded-[34px] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Product detail
              </p>
              <h1 className="mt-4 text-4xl font-semibold">{product.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-muted">
                  {product.stockStatus}
                </span>
                {product.negotiable && (
                  <span className="rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
                    Negotiable
                  </span>
                )}
              </div>
              <p className="mt-5 text-sm leading-8 text-muted">{product.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton
                  onClick={handleMessageSeller}
                  disabled={messaging || !currentUserId}
                  label={messaging ? "Opening chat…" : "Message owner"}
                  icon={<Send className="h-4 w-4" />}
                />
                <GhostButton
                  href={`/seller-profile?id=${product.sellerId}`}
                  label="Open seller profile"
                />
              </div>
            </div>

            {seller && <SellerIdentity seller={seller as any} />}

            <OfferArea product={product} />
          </div>
        </div>
      </ContentSection>
    </AppShell>
  );
}
