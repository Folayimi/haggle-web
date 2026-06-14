"use client";
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Bookmark,
  Heart,
  MessageSquare,
  Play,
  Sparkles,
  Users,
} from "lucide-react";

import type {
  MarketService,
  SellerLiveSession,
  SellerProduct,
  SellerProfile,
} from "@/lib/types";
import { getSellerById } from "@/lib/mock-data";
import { useHaggleStore } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import { saveAudioBlob } from "@/lib/indexeddb";
import { useEffect, useRef, useState } from "react";

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[34px] border border-border bg-background-elevated/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">
              {description}
            </p>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="panel rounded-[28px] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-muted">{detail}</p>
    </div>
  );
}

export function LiveSessionCard({
  session,
  showReserve = true,
  compact = false,
}: {
  session: SellerLiveSession;
  showReserve?: boolean;
  compact?: boolean;
}) {
  const seller = getSellerById(session.sellerId);
  const reservedIds = useHaggleStore((state) => state.reservedLiveIds);
  const toggleReservation = useHaggleStore((state) => state.toggleReservation);
  const savedIds = useHaggleStore((state) => state.savedItemIds);
  const toggleSavedItem = useHaggleStore((state) => state.toggleSavedItem);

  const reserved = reservedIds.includes(session.id);
  const saved = savedIds.includes(session.id);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="panel overflow-hidden rounded-[30px]"
    >
      <div className={cn("relative", compact ? "h-48" : "h-64")}>
        <Image
          src={session.coverImageUrl}
          alt={session.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
              session.status === "Live now"
                ? "bg-danger text-white"
                : "bg-white/88 text-foreground",
            )}
          >
            {session.status}
          </span>
          <button
            onClick={() => toggleSavedItem(session.id)}
            className={cn(
              "rounded-full p-2 backdrop-blur",
              saved ? "bg-primary text-white" : "bg-white/88 text-foreground",
            )}
            aria-label="Save live"
          >
            <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="mb-3 flex items-center gap-2 text-white/90">
            <img
              src={seller.avatarUrl}
              alt={seller.name}
              className="h-9 w-9 rounded-full border border-white/30 object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{seller.name}</p>
              <p className="text-xs text-white/70">{session.schedule}</p>
            </div>
          </div>
          <h3 className="max-w-[90%] text-xl font-semibold text-white">
            {session.title}
          </h3>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-muted">{session.preview}</p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl bg-surface px-3 py-3 text-center">
            <Users className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-2 font-semibold">{session.participantCount}</p>
            <p className="text-xs text-muted">Viewers</p>
          </div>
          <div className="rounded-2xl bg-surface px-3 py-3 text-center">
            <MessageSquare className="mx-auto h-4 w-4 text-secondary" />
            <p className="mt-2 font-semibold">{session.offerCount}</p>
            <p className="text-xs text-muted">Offers</p>
          </div>
          <div className="rounded-2xl bg-surface px-3 py-3 text-center">
            <Sparkles className="mx-auto h-4 w-4 text-warning" />
            <p className="mt-2 font-semibold">{session.saveCount}</p>
            <p className="text-xs text-muted">Saves</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {session.buyerBenefits.slice(0, 2).map((benefit) => (
            <span
              key={benefit}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {benefit}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/negotiation-room"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-strong"
          >
            <Play className="h-4 w-4" />
            {session.status === "Live now" ? "Join live room" : "Preview room"}
          </Link>
          <Link
            href="/seller-profile"
            className="rounded-full border border-border bg-background-elevated px-4 py-3 text-sm font-semibold"
          >
            View seller
          </Link>
          {showReserve ? (
            <button
              onClick={() => toggleReservation(session.id)}
              className={cn(
                "rounded-full px-4 py-3 text-sm font-semibold",
                reserved
                  ? "bg-secondary text-white"
                  : "border border-border bg-background-elevated",
              )}
            >
              {reserved ? "Reserved" : "Reserve spot"}
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function ProductCard({ product }: { product: SellerProduct }) {
  const seller = getSellerById(product.sellerId);
  const savedIds = useHaggleStore((state) => state.savedItemIds);
  const toggleSavedItem = useHaggleStore((state) => state.toggleSavedItem);
  const saved = savedIds.includes(product.id);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="panel overflow-hidden rounded-[30px]"
    >
      <div className="relative h-56">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <button
          onClick={() => toggleSavedItem(product.id)}
          className={cn(
            "absolute right-4 top-4 rounded-full p-2 backdrop-blur",
            saved ? "bg-primary text-white" : "bg-white/88 text-foreground",
          )}
        >
          <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {product.category}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
          </div>
          <p className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
            {product.price}
          </p>
        </div>
        <p className="text-sm leading-6 text-muted">{product.description}</p>
        <div className="flex flex-wrap gap-2">
          {product.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted"
            >
              {feature}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{seller.businessName}</span>
          <span className="font-medium text-primary">{product.stockStatus}</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/product-detail"
            className="flex-1 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-strong"
          >
            Order now
          </Link>
          <Link
            href="/conversation"
            className="rounded-full border border-border bg-background-elevated px-4 py-3 text-sm font-semibold"
          >
            Message owner
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function ServiceCard({ service }: { service: MarketService }) {
  const seller = getSellerById(service.sellerId);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="panel overflow-hidden rounded-[30px]"
    >
      <div className="relative h-52">
        <Image src={service.imageUrl} alt={service.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              {service.category}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{service.name}</h3>
          </div>
          <p className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-white">
            {service.price}
          </p>
        </div>
        <p className="text-sm leading-6 text-muted">{service.description}</p>
        <div className="flex flex-wrap gap-2">
          {service.includes.map((item) => (
            <span
              key={item}
              className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="rounded-[22px] bg-surface px-4 py-3 text-sm text-muted">
          <p className="font-semibold text-foreground">Best for</p>
          <p className="mt-1">{service.audience}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>{seller.businessName}</span>
          <span className="text-muted">{service.deliveryTime}</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/service-detail"
            className="flex-1 rounded-full bg-secondary px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Request service
          </Link>
          <Link
            href="/conversation"
            className="rounded-full border border-border bg-background-elevated px-4 py-3 text-sm font-semibold"
          >
            Message owner
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function SellerIdentity({
  seller,
  compact = false,
}: {
  seller: SellerProfile;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "panel rounded-[30px]",
        compact ? "p-4" : "p-6",
      )}
    >
      <div className="flex items-center gap-4">
        <img
          src={seller.avatarUrl}
          alt={seller.name}
          className={cn(
            "rounded-[24px] object-cover",
            compact ? "h-14 w-14" : "h-[4.5rem] w-[4.5rem]",
          )}
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {seller.badge}
          </p>
          <h3 className="mt-1 text-xl font-semibold">{seller.name}</h3>
          <p className="text-sm text-muted">{seller.businessName}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {seller.trustPills.map((pill) => (
          <span
            key={pill}
            className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted"
          >
            {pill}
          </span>
        ))}
      </div>
      {!compact ? (
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-surface px-3 py-3">
            <p className="text-lg font-semibold">{seller.followers}</p>
            <p className="text-xs text-muted">Followers</p>
          </div>
          <div className="rounded-2xl bg-surface px-3 py-3">
            <p className="text-lg font-semibold">{seller.rating}</p>
            <p className="text-xs text-muted">Rating</p>
          </div>
          <div className="rounded-2xl bg-surface px-3 py-3">
            <p className="text-lg font-semibold">{seller.responseTime}</p>
            <p className="text-xs text-muted">Response</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function GhostButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-full border border-border bg-background-elevated px-4 py-3 text-sm font-semibold"
    >
      {label}
    </Link>
  );
}

export function PrimaryButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-strong"
    >
      {icon}
      {label}
    </Link>
  );
}

export function ReminderChip({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-2 text-xs font-medium text-secondary">
      <Bell className="h-3.5 w-3.5" />
      {text}
    </div>
  );
}

export function RecordingButton({ onSave }: { onSave: (info: { id: string; objectUrl: string }) => void }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        mediaRef.current.stop();
      }
    };
  }, []);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (ev) => chunksRef.current.push(ev.data);
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const { id, objectUrl } = await saveAudioBlob(blob);
      onSave({ id, objectUrl });
      // stop tracks
      stream.getTracks().forEach((t) => t.stop());
    };
    mr.start();
    setRecording(true);
  }

  function stop() {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    setRecording(false);
  }

  return (
    <button
      type="button"
      onClick={() => (recording ? stop() : start())}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold",
        recording ? "bg-danger text-white" : "border border-border bg-background-elevated",
      )}
    >
      {recording ? "Stop" : "Record"}
    </button>
  );
}
