"use client";

import ProductCard from "@/components/market/cards/ProductCard";
import ServiceCard from "@/components/market/cards/ServiceCard";
import { LiveSessionCard } from "@/components/market/cards/LiveSessionCard";
import { CollectionCard } from "@/components/market/sections/CollectionCard";
import type {
  FeaturedCollection,
  MarketService,
  SellerLiveSession,
  SellerProduct,
} from "@/types";

type MarketBrowseViewProps =
  | {
      type: "products";
      title: string;
      description: string;
      items: SellerProduct[];
      onProductSelect: (product: SellerProduct) => void;
    }
  | {
      type: "collections";
      title: string;
      description: string;
      items: FeaturedCollection[];
    }
  | {
      type: "services";
      title: string;
      description: string;
      items: MarketService[];
    }
  | {
      type: "live";
      title: string;
      description: string;
      items: SellerLiveSession[];
    };

export function MarketBrowseView(props: MarketBrowseViewProps) {
  return (
    <section aria-labelledby="market-browse-title" className="space-y-6">
      <header>
        <h1 id="market-browse-title" className="text-xl font-bold sm:text-2xl">
          {props.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{props.description}</p>
      </header>

      {props.items.length === 0 ? (
        <p className="rounded-xl bg-background p-8 text-center text-sm text-muted">
          Nothing to show here yet.
        </p>
      ) : (
        <div className="grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(100%,260px),280px))] justify-start gap-x-4 gap-y-6">
          {props.type === "products" &&
            props.items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={props.onProductSelect}
              />
            ))}
          {props.type === "collections" &&
            props.items.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          {props.type === "services" &&
            props.items.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          {props.type === "live" &&
            props.items.map((session) => (
              <LiveSessionCard key={session.id} session={session} />
            ))}
        </div>
      )}
    </section>
  );
}
