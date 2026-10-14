"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  Camera,
  Clock3,
  ImagePlus,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Package,
  Radio,
  Star,
  Store,
  Wrench,
} from "lucide-react";
import { useHaggleStore } from "@/lib/app-store";
import { allLiveSessions, marketServices, sellerProducts } from "@/lib/mock-data";
import { getSellerListings, confirmUpload, updateUserProfile, uploadImage } from "@/services/request";
import type { BackendListing } from "@/services/mappers";

type ImageSlot = "avatar" | "cover";
type ProfileMedia = { avatar: string; cover: string };
type ProfileTab = "Products" | "Services" | "Liked" | "Scheduled lives";
const emptyMedia: ProfileMedia = { avatar: "", cover: "" };
const tabs: { label: ProfileTab; icon: typeof Package }[] = [
  { label: "Products", icon: Package },
  { label: "Services", icon: Wrench },
  { label: "Liked", icon: Star },
  { label: "Scheduled lives", icon: Radio },
];

function toPublicImageUrl(key: string) {
  if (/^https?:\/\//i.test(key)) return key;
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!publicBase) return "";
  return new URL(key.replace(/^\/+/, ""), `${publicBase.replace(/\/+$/, "")}/`).toString();
}

function asListings(result: any): BackendListing[] {
  const rows = Array.isArray(result) ? result : result?.data;
  return Array.isArray(rows) ? rows : [];
}

export default function ProfileWorkspacePage({ username }: { username: string }) {
  const userData = useHaggleStore((state) => state.userData);
  const setUserData = useHaggleStore((state) => state.setUserData);
  const savedItemIds = useHaggleStore((state) => state.savedItemIds);
  const accountProfile = userData?.profile ?? {};
  const accountUsername = String(userData?.username || accountProfile.username || "").replace(/^@/, "");
  const routeUsername = String(username || "").replace(/^@/, "");
  const isOwner = Boolean(accountUsername && accountUsername === routeUsername);
  const profile = isOwner ? accountProfile : {};
  const ownerData = isOwner ? userData : null;
  const [media, setMedia] = useState<ProfileMedia>(emptyMedia);
  const [uploading, setUploading] = useState<ImageSlot | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [activeTab, setActiveTab] = useState<ProfileTab>("Products");
  const [listings, setListings] = useState<BackendListing[]>([]);

  useEffect(() => {
    if (!routeUsername) return;
    try {
      const saved = localStorage.getItem(`haggle-profile-media:${routeUsername}`);
      setMedia(saved ? { ...emptyMedia, ...JSON.parse(saved) } : emptyMedia);
    } catch {
      setMedia(emptyMedia);
    }
  }, [routeUsername]);

  useEffect(() => {
    const sellerId = ownerData?.id || ownerData?.user_id || accountProfile.user_id;
    if (!isOwner || !sellerId) return;
    let active = true;
    void getSellerListings(String(sellerId)).then((result) => {
      if (active) setListings(asListings(result));
    });
    return () => { active = false; };
  }, [accountProfile.user_id, isOwner, ownerData?.id, ownerData?.user_id]);

  const displayName = profile.business_name || ownerData?.business_name || profile.full_name || ownerData?.full_name || (routeUsername ? `@${routeUsername}` : "Your business");
  const fullName = profile.full_name || ownerData?.full_name || displayName;
  const bio = profile.bio || ownerData?.bio || "Tell customers what you offer and what makes your business special.";
  const avatarUrl = media.avatar || profile.avatar_url || ownerData?.avatar_url || "";
  const coverUrl = media.cover || profile.cover_url || profile.cover_image_url || ownerData?.cover_url || "";
  const verified = Boolean(profile.is_verified || ownerData?.is_verified || profile.verified);
  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(", ") || profile.location || "";
  const sellerId = String(ownerData?.id || ownerData?.user_id || accountProfile.user_id || "");
  const ownerListings = useMemo(() => listings.filter((item) => !sellerId || item.seller_id === sellerId), [listings, sellerId]);
  const products = ownerListings.filter((item) => (item.listing_type || "product").toLowerCase() === "product");
  const services = ownerListings.filter((item) => (item.listing_type || "").toLowerCase() === "service" || (item.listing_type || "").toLowerCase() === "services");
  const likedItems = isOwner ? [
    ...sellerProducts.map((item) => ({ id: item.id, title: item.name, description: item.description, image: item.imageUrl, kind: "Product" })),
    ...marketServices.map((item) => ({ id: item.id, title: item.name, description: item.description, image: item.imageUrl, kind: "Service" })),
    ...allLiveSessions.map((item) => ({ id: item.id, title: item.title, description: item.preview, image: item.coverImageUrl, kind: "Live" })),
  ].filter((item) => savedItemIds.includes(item.id)) : [];

  const handleImageUpload = async (slot: ImageSlot, file?: File) => {
    if (!file || !isOwner) return;
    setUploadMessage("");
    if (!file.type.startsWith("image/")) { setUploadMessage("Choose an image file to continue."); return; }
    if (file.size > 8 * 1024 * 1024) { setUploadMessage("Please choose an image smaller than 8 MB."); return; }
    const previewUrl = URL.createObjectURL(file);
    setMedia((current) => ({ ...current, [slot]: previewUrl }));
    setUploading(slot);
    try {
      const upload = await uploadImage(file);
      if (!upload.key) throw new Error("The image upload did not return a file key.");
      await confirmUpload({ key: upload.key });
      const uploadedUrl = toPublicImageUrl(upload.key);
      if (!uploadedUrl) { setUploadMessage("The image uploaded, but the public image URL is not configured yet."); return; }
      const field = slot === "avatar" ? "avatar_url" : "cover_url";
      const nextMedia = { ...media, [slot]: uploadedUrl };
      setMedia(nextMedia);
      localStorage.setItem(`haggle-profile-media:${routeUsername}`, JSON.stringify(nextMedia));
      setUserData({ ...userData, [field]: uploadedUrl, profile: { ...profile, [field]: uploadedUrl } });
      try {
        await updateUserProfile({ [field]: uploadedUrl });
        setUploadMessage(slot === "cover" ? "Cover image updated." : "Profile photo updated.");
      } catch {
        setUploadMessage("Image uploaded. Profile sync is temporarily unavailable.");
      }
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "We couldn’t upload that image. Please try again.");
    } finally { setUploading(null); }
  };

  const tabListings = activeTab === "Products" ? products : activeTab === "Services" ? services : [];
  const emptyCopy: Record<ProfileTab, string> = {
    Products: isOwner ? "Your listed products will appear here." : "No products have been posted yet.",
    Services: isOwner ? "Your listed services will appear here." : "No services have been added yet.",
    Liked: "Items you like will appear here.",
    "Scheduled lives": "Scheduled live sessions will appear here.",
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[minmax(230px,0.82fr)_minmax(300px,1.35fr)_minmax(245px,0.83fr)] lg:items-stretch" aria-label="Business profile">
          <div className="relative min-h-[340px] overflow-hidden rounded-3xl border border-border/50 bg-background-elevated/40 sm:min-h-[400px] lg:min-h-[440px]">
            {coverUrl ? <img src={coverUrl} alt={`${displayName} cover image`} className="absolute inset-0 h-full w-full object-cover" /> : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/15 via-background-elevated/50 to-secondary/15 px-6 text-center">
                <ImagePlus className="mb-3 h-9 w-9 text-primary" />
                <p className="max-w-xs text-base font-semibold">Upload your business cover image or an elegant picture of yourself</p>
                {isOwner && <p className="mt-2 text-sm text-muted">This image introduces your business.</p>}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
            {isOwner && <label className="absolute left-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3.5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-black/60">
              {uploading === "cover" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}{coverUrl ? "Change cover" : "Upload cover"}
              <input type="file" accept="image/*" className="sr-only" disabled={uploading !== null} onChange={(event) => { void handleImageUpload("cover", event.target.files?.[0]); event.currentTarget.value = ""; }} />
            </label>}
            <div className="absolute bottom-5 right-5 h-24 w-24 rounded-full border-4 border-background bg-background-elevated shadow-xl sm:h-28 sm:w-28">
              <div className="h-full w-full overflow-hidden rounded-full bg-background-elevated">
                {avatarUrl ? <img src={avatarUrl} alt={`${fullName} profile`} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/15 text-muted"><Store className="h-9 w-9" /></div>}
              </div>
              {isOwner && <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-white shadow-md">
                {uploading === "avatar" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}<span className="sr-only">Edit profile photo</span>
                <input type="file" accept="image/*" className="sr-only" disabled={uploading !== null} onChange={(event) => { void handleImageUpload("avatar", event.target.files?.[0]); event.currentTarget.value = ""; }} />
              </label>}
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center rounded-3xl border border-border/50 bg-background-elevated/20 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{displayName}</h1>
              {verified && <BadgeCheck className="h-5 w-5 text-secondary" aria-label="Verified business" />}
            </div>
            <p className="mt-1 text-sm text-muted">@{routeUsername}{fullName !== displayName ? ` · ${fullName}` : ""}</p>
            {profile.primary_role && <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{String(profile.primary_role)}</p>}
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base">{bio}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{location}</span>}
              {(profile.average_response_time || profile.response_time) && <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-primary" />Replies {String(profile.average_response_time || profile.response_time)}</span>}
              {(profile.rating || profile.average_rating) && <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 text-primary" />{String(profile.rating || profile.average_rating)} rating</span>}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {isOwner ? <Link href="/post-product" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"><Package className="h-4 w-4" />Add a product</Link> : <Link href="/conversation" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"><MessageCircle className="h-4 w-4" />Message</Link>}
              {!isOwner && <button type="button" className="rounded-xl border border-border/60 px-5 py-3 text-sm font-semibold transition hover:bg-background-elevated/50">Follow</button>}
            </div>
          </div>

          <aside className="rounded-3xl border border-border/50 bg-background-elevated/25 p-5 sm:p-6" aria-label="Business details">
            <h2 className="text-lg font-bold">Business details</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-background/60 p-4"><p className="text-xs text-muted">Rating</p><p className="mt-2 flex items-center gap-1.5 font-bold"><Star className="h-4 w-4 fill-primary text-primary" />{profile.rating || profile.average_rating || "—"}</p></div>
              <div className="rounded-2xl bg-background/60 p-4"><p className="text-xs text-muted">Reviews</p><p className="mt-2 font-bold">{profile.review_count ?? profile.reviews_count ?? "—"}</p></div>
              <div className="rounded-2xl bg-background/60 p-4"><p className="text-xs text-muted">Response time</p><p className="mt-2 truncate font-bold">{profile.average_response_time || profile.response_time || "—"}</p></div>
              <div className="rounded-2xl bg-background/60 p-4"><p className="text-xs text-muted">Followers</p><p className="mt-2 font-bold">{profile.followers ?? profile.follower_count ?? "—"}</p></div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border/50 px-4 py-3 text-sm">
              {verified ? <BadgeCheck className="h-4 w-4 text-secondary" /> : <Store className="h-4 w-4 text-primary" />}
              <span>{verified ? "Verified business" : "Business profile"}</span>
            </div>
            {uploadMessage && <p className="mt-4 text-xs leading-5 text-muted" role="status">{uploadMessage}</p>}
          </aside>
        </section>

        <section className="mt-8" aria-label="Business content">
          <div className="flex gap-2 overflow-x-auto border-b border-border/60" role="tablist" aria-label="Profile content">
            {tabs.map(({ label, icon: Icon }) => <button key={label} type="button" role="tab" aria-selected={activeTab === label} onClick={() => setActiveTab(label)} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === label ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground"}`}><Icon className="h-4 w-4" />{label}{label === "Products" && products.length > 0 ? <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs">{products.length}</span> : null}{label === "Services" && services.length > 0 ? <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs">{services.length}</span> : null}</button>)}
          </div>
          <div className="min-h-44 py-6" role="tabpanel">
            {activeTab === "Liked" && likedItems.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{likedItems.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-border/50 bg-background-elevated/20">
              {item.image ? <img src={item.image} alt="" className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center bg-background-elevated/50 text-muted"><Star className="h-8 w-8" /></div>}
              <div className="p-4"><p className="text-xs font-semibold text-primary">{item.kind}</p><h3 className="mt-1 font-semibold">{item.title}</h3><p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p></div>
            </article>)}</div> : tabListings.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{tabListings.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-border/50 bg-background-elevated/20">
              {item.thumbnail_url ? <img src={item.thumbnail_url} alt="" className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center bg-background-elevated/50 text-muted">{activeTab === "Services" ? <Wrench className="h-8 w-8" /> : <Package className="h-8 w-8" />}</div>}
              <div className="p-4"><h3 className="font-semibold">{item.title}</h3><p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>{item.starting_amount && <p className="mt-3 text-sm font-bold">{item.price_currency || "₦"} {Number(item.starting_amount).toLocaleString()}</p>}</div>
            </article>)}</div> : <div className="rounded-2xl border border-dashed border-border/60 bg-background-elevated/10 px-5 py-10 text-center">
              {activeTab === "Scheduled lives" ? <CalendarDays className="mx-auto h-7 w-7 text-muted" /> : activeTab === "Services" ? <Wrench className="mx-auto h-7 w-7 text-muted" /> : activeTab === "Liked" ? <Star className="mx-auto h-7 w-7 text-muted" /> : <Package className="mx-auto h-7 w-7 text-muted" />}
              <p className="mt-3 text-sm font-medium">{emptyCopy[activeTab]}</p>
              {isOwner && activeTab === "Products" && <Link href="/post-product" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">Post a product</Link>}
              {isOwner && activeTab === "Services" && <Link href="/add-service" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">Add a service</Link>}
              {isOwner && activeTab === "Scheduled lives" && <Link href="/schedule-live" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">Schedule a live</Link>}
              {isOwner && activeTab === "Liked" && savedItemIds.length > 0 && <p className="mt-2 text-xs text-muted">Your saved items are available from your saved list.</p>}
            </div>}
          </div>
        </section>
      </div>
    </main>
  );
}
