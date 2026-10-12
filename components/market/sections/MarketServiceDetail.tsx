"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, MessageCircle, Users } from "lucide-react";

import { formatPrice } from "@/lib/formatters";
import type { MarketService } from "@/types";

function ServiceFact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  if (!value) return null;

  return (
    <div className="rounded-xl bg-background-elevated p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function MarketServiceDetail({ service }: { service: MarketService }) {
  const price =
    service.price === "" ? Number.NaN : Number(String(service.price).replace(/[^\d.-]/g, ""));
  const gallery = Array.from(
    new Set([service.imageUrl, ...(service.gallery ?? [])].filter(Boolean)),
  );

  return (
    <section
      aria-labelledby="selected-service-title"
      className="space-y-6 rounded-2xl bg-background p-4 sm:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-background-elevated">
            {gallery[0] && (
              <Image
                src={gallery[0]}
                alt={service.name}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                priority
              />
            )}
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.slice(1).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-background-elevated"
                >
                  <Image
                    src={image}
                    alt={`${service.name} portfolio sample ${index + 1}`}
                    fill
                    sizes="(min-width: 640px) 20vw, 30vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <p className="text-sm font-medium text-muted">Professional service</p>
          <p className="mt-2 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {service.category}
          </p>
          <h1
            id="selected-service-title"
            className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl"
          >
            {service.name}
          </h1>
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Base package price
            </p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {Number.isFinite(price)
                ? `Starting at ${formatPrice(price, service.priceCurrency)}`
                : "Price unavailable"}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {service.negotiable ? "Negotiable" : "Fixed price"}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ServiceFact
              label="Delivery time"
              value={service.deliveryTime}
              icon={<Clock3 className="h-4 w-4" />}
            />
            <ServiceFact
              label="Work arrangement"
              value={
                service.workPlace === "On-site" && service.workAddress
                  ? `${service.workPlace} · ${service.workAddress}`
                  : service.workPlace ?? ""
              }
              icon={<MapPin className="h-4 w-4" />}
            />
            <ServiceFact
              label="Ideal for"
              value={service.audience
                .toLowerCase()
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}
              icon={<Users className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.55fr)]">
        <div>
          <h2 className="text-base font-semibold">About this service</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">
            {service.description || "No description provided."}
          </p>

          {service.includes.length > 0 && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold">Service details</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-background-elevated px-3 py-1.5 text-xs text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.negotiationNote && (
            <div className="mt-5 rounded-xl border border-border/60 p-4">
              <h2 className="text-sm font-semibold">Negotiation note</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                {service.negotiationNote}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end">
          <Link
            href={`/services/${encodeURIComponent(service.id)}/book`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Request Service
          </Link>
        </div>
      </div>
    </section>
  );
}
