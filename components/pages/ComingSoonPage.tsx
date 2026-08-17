"use client";

// components/pages/ComingSoonPage.tsx
// One dummy page for every route deferred until after the core MVP loop
// (negotiation, product-detail, messages, conversation, seller-profile) is
// proven with real users. Swap a route's import to point here instead of
// the deleted components/workspace-pages.tsx.

import { AppShell } from "@/components/app-shell";
import { PrimaryButton } from "@/components/haggle-ui";
import { Construction } from "lucide-react";

export function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <AppShell>
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="panel rounded-[36px] p-10 text-center">
            <Construction className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              {description ??
                "This is coming after we've proven the core buying and negotiating loop with real sellers and buyers."}
            </p>
            <div className="mt-6 flex justify-center">
              <PrimaryButton href="/market" label="Back to Market" />
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
