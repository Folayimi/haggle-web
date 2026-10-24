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
      isLoading?: boolean;
      error?: string;
      hasMore?: boolean;
      isLoadingMore?: boolean;
      onLoadMore?: () => void;
    }
  | {
      type: "collections";
      title: string;
      description: string;
      items: FeaturedCollection[];
      isLoading?: boolean;
      error?: string;
    }
  | {
      type: "services";
      title: string;
      description: string;
      items: MarketService[];
      onServiceSelect?: (service: MarketService) => void;
      isLoading?: boolean;
      error?: string;
      hasMore?: boolean;
      isLoadingMore?: boolean;
      onLoadMore?: () => void;
    }
  | {
      type: "live";
      title: string;
      description: string;
      items: SellerLiveSession[];
      isLoading?: boolean;
      error?: string;
    };

export function MarketBrowseView(props: MarketBrowseViewProps) {
  return (
    <section
      aria-labelledby="market-browse-title"
      className="market-browse-container space-y-6"
    >
      <header>
        <h1 id="market-browse-title" className="text-xl font-bold sm:text-2xl">
          {props.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{props.description}</p>
      </header>

      {props.isLoading && props.items.length === 0 ? (
        <p role="status" className="rounded-xl bg-background p-8 text-center text-sm text-muted">Loading listings...</p>
      ) : props.error ? (
        <p role="alert" className="rounded-xl bg-background p-8 text-center text-sm text-danger">{props.error}</p>
      ) : props.items.length === 0 ? (
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
              <div
                key={collection.id}
                className="market-browse-collection"
              >
                <CollectionCard collection={collection} />
              </div>
            ))}
          {props.type === "services" &&
            props.items.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={props.onServiceSelect}
              />
            ))}
          {props.type === "live" &&
            props.items.map((session) => (
              <LiveSessionCard key={session.id} session={session} />
            ))}
        </div>
      )}
      {(props.type === "products" || props.type === "services") && props.hasMore && (
        <button
          type="button"
          onClick={props.onLoadMore}
          disabled={props.isLoadingMore}
          className="mx-auto block rounded-lg border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {props.isLoadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </section>
  );
}
