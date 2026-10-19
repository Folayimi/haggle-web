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
  Pencil,
  Radio,
  Star,
  Store,
  Wrench,
} from "lucide-react";
import { useHaggleStore } from "@/lib/app-store";
import {
  allLiveSessions,
  marketServices,
  sellerProducts,
} from "@/lib/mock-data";
import {
  getSellerListings,
  confirmUpload,
  updateUserProfile,
  uploadImage,
} from "@/services/request";
import type { BackendListing } from "@/services/mappers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ImageSlot = "avatar" | "cover";
type ProfileMedia = { avatar: string; cover: string };
type ProfileDetailsDraft = {
  full_name: string;
  business_name: string;
  bio: string;
  city: string;
  state: string;
  country: string;
};
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
  return new URL(
    key.replace(/^\/+/, ""),
    `${publicBase.replace(/\/+$/, "")}/`,
  ).toString();
}

function asListings(result: any): BackendListing[] {
  const rows = Array.isArray(result) ? result : result?.data;
  return Array.isArray(rows) ? rows : [];
}

export default function ProfileWorkspacePage({
  username,
}: {
  username: string;
}) {
  const userData = useHaggleStore((state) => state.userData);
  const setUserData = useHaggleStore((state) => state.setUserData);
  const savedItemIds = useHaggleStore((state) => state.savedItemIds);
  const accountProfile = userData?.profile ?? {};
  const accountUsername = String(
    userData?.username || accountProfile.username || "",
  ).replace(/^@/, "");
  const routeUsername = String(username || "").replace(/^@/, "");
  const isOwner = Boolean(accountUsername && accountUsername === routeUsername);
  const profile = isOwner ? accountProfile : {};
  const ownerData = isOwner ? userData : null;
  const [media, setMedia] = useState<ProfileMedia>(emptyMedia);
  const [uploading, setUploading] = useState<ImageSlot | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [profileDraft, setProfileDraft] = useState<ProfileDetailsDraft>({
    full_name: "",
    business_name: "",
    bio: "",
    city: "",
    state: "",
    country: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveMessage, setProfileSaveMessage] = useState("");
  const [activeTab, setActiveTab] = useState<ProfileTab>("Products");
  const [listings, setListings] = useState<BackendListing[]>([]);

  useEffect(() => {
    if (!isOwner) return;
    setProfileDraft({
      full_name: String(accountProfile.full_name || userData?.full_name || ""),
      business_name: String(
        accountProfile.business_name || userData?.business_name || "",
      ),
      bio: String(accountProfile.bio || userData?.bio || ""),
      city: String(accountProfile.city || accountProfile.location || ""),
      state: String(accountProfile.state || ""),
      country: String(accountProfile.country || ""),
    });
  }, [
    accountProfile.bio,
    accountProfile.business_name,
    accountProfile.city,
    accountProfile.country,
    accountProfile.full_name,
    accountProfile.location,
    accountProfile.state,
    isOwner,
    userData?.bio,
    userData?.business_name,
    userData?.full_name,
  ]);

  useEffect(() => {
    if (!routeUsername) return;
    try {
      const saved = localStorage.getItem(
        `haggle-profile-media:${routeUsername}`,
      );
      setMedia(saved ? { ...emptyMedia, ...JSON.parse(saved) } : emptyMedia);
    } catch {
      setMedia(emptyMedia);
    }
  }, [routeUsername]);

  useEffect(() => {
    const sellerId =
      ownerData?.id || ownerData?.user_id || accountProfile.user_id;
    if (!isOwner || !sellerId) return;
    let active = true;
    void getSellerListings(String(sellerId)).then((result) => {
      if (active) setListings(asListings(result));
    });
    return () => {
      active = false;
    };
  }, [accountProfile.user_id, isOwner, ownerData?.id, ownerData?.user_id]);

  const displayName =
    profile.business_name ||
    ownerData?.business_name ||
    profile.full_name ||
    ownerData?.full_name ||
    (routeUsername ? `@${routeUsername}` : "Your business");
  const fullName = profile.full_name || ownerData?.full_name || displayName;
  const bio =
    profile.bio ||
    ownerData?.bio ||
    "Tell customers what you offer and what makes your business special.";
  const avatarUrl =
    media.avatar || profile.avatar_url || ownerData?.avatar_url || "";
  const coverUrl =
    media.cover ||
    profile.cover_url ||
    profile.cover_image_url ||
    ownerData?.cover_url ||
    "";
  const verified = Boolean(
    profile.is_verified || ownerData?.is_verified || profile.verified,
  );
  const location =
    [profile.city, profile.state, profile.country].filter(Boolean).join(", ") ||
    profile.location ||
    "";
  const role = String(
    profile.primary_role || ownerData?.primary_role || ownerData?.role || "",
  ).toLowerCase();
  const isSeller = Boolean(
    profile.business_name ||
      ownerData?.business_name ||
      /seller|vendor|business|both/.test(role),
  );
  const followers =
    profile.followers ??
    profile.follower_count ??
    ownerData?.followers ??
    ownerData?.follower_count ??
    "—";
  const following =
    profile.following ??
    profile.following_count ??
    ownerData?.following ??
    ownerData?.following_count ??
    "—";
  const sellerId = String(
    ownerData?.id || ownerData?.user_id || accountProfile.user_id || "",
  );
  const ownerListings = useMemo(
    () => listings.filter((item) => !sellerId || item.seller_id === sellerId),
    [listings, sellerId],
  );
  const products = ownerListings.filter(
    (item) => (item.listing_type || "product").toLowerCase() === "product",
  );
  const services = ownerListings.filter(
    (item) =>
      (item.listing_type || "").toLowerCase() === "service" ||
      (item.listing_type || "").toLowerCase() === "services",
  );
  const likedItems = isOwner
    ? [
        ...sellerProducts.map((item) => ({
          id: item.id,
          title: item.name,
          description: item.description,
          image: item.imageUrl,
          kind: "Product",
        })),
        ...marketServices.map((item) => ({
          id: item.id,
          title: item.name,
          description: item.description,
          image: item.imageUrl,
          kind: "Service",
        })),
        ...allLiveSessions.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.preview,
          image: item.coverImageUrl,
          kind: "Live",
        })),
      ].filter((item) => savedItemIds.includes(item.id))
    : [];

  const handleImageUpload = async (slot: ImageSlot, file?: File) => {
    if (!file || !isOwner) return;
    setUploadMessage("");
    if (!file.type.startsWith("image/")) {
      setUploadMessage("Choose an image file to continue.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadMessage("Please choose an image smaller than 8 MB.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setMedia((current) => ({ ...current, [slot]: previewUrl }));
    setUploading(slot);
    try {
      const upload = await uploadImage(file);
      if (!upload.key)
        throw new Error("The image upload did not return a file key.");
      await confirmUpload({ key: upload.key });
      const uploadedUrl = toPublicImageUrl(upload.key);
      if (!uploadedUrl) {
        setUploadMessage(
          "The image uploaded, but the public image URL is not configured yet.",
        );
        return;
      }
      const field = slot === "avatar" ? "avatar_url" : "cover_url";
      const nextMedia = { ...media, [slot]: uploadedUrl };
      setMedia(nextMedia);
      localStorage.setItem(
        `haggle-profile-media:${routeUsername}`,
        JSON.stringify(nextMedia),
      );
      setUserData({
        ...userData,
        [field]: uploadedUrl,
        profile: { ...profile, [field]: uploadedUrl },
      });
      try {
        await updateUserProfile({ [field]: uploadedUrl });
        setUploadMessage(
          slot === "cover" ? "Cover image updated." : "Profile photo updated.",
        );
      } catch {
        setUploadMessage(
          "Image uploaded. Profile sync is temporarily unavailable.",
        );
      }
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      setUploadMessage(
        error instanceof Error
          ? error.message
          : "We couldn’t upload that image. Please try again.",
      );
    } finally {
      setUploading(null);
    }
  };

  const handleProfileSave = async () => {
    if (!isOwner || profileSaving) return;
    const nextProfile: ProfileDetailsDraft = {
      ...profileDraft,
      full_name: profileDraft.full_name.trim(),
      business_name: profileDraft.business_name.trim(),
      bio: profileDraft.bio.trim(),
      city: profileDraft.city.trim(),
      state: profileDraft.state.trim(),
      country: profileDraft.country.trim(),
    };
    const personalFields = {
      full_name: nextProfile.full_name,
      bio: nextProfile.bio,
      city: nextProfile.city,
      state: nextProfile.state,
      country: nextProfile.country,
    };
    const profileUpdates = isSeller
      ? nextProfile
      : personalFields;
    setProfileSaving(true);
    setProfileSaveMessage("");
    try {
      const result = await updateUserProfile(profileUpdates);
      if (!result) throw new Error("Profile update failed.");
      setUserData({
        ...userData,
        ...profileUpdates,
        profile: { ...accountProfile, ...profileUpdates },
      });
      setProfileDraft(nextProfile);
      setEditOpen(false);
    } catch {
      setProfileSaveMessage("Your changes could not be saved. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const openProfileEditor = () => {
    setProfileSaveMessage("");
    setProfileDraft({
      full_name: String(accountProfile.full_name || userData?.full_name || ""),
      business_name: String(
        accountProfile.business_name || userData?.business_name || "",
      ),
      bio: String(accountProfile.bio || userData?.bio || ""),
      city: String(accountProfile.city || accountProfile.location || ""),
      state: String(accountProfile.state || ""),
      country: String(accountProfile.country || ""),
    });
    setEditOpen(true);
  };

  const tabListings =
    activeTab === "Products"
      ? products
      : activeTab === "Services"
        ? services
        : [];
  const emptyCopy: Record<ProfileTab, string> = {
    Products: isOwner
      ? "Your listed products will appear here."
      : "No products have been posted yet.",
    Services: isOwner
      ? "Your listed services will appear here."
      : "No services have been added yet.",
    Liked: "Items you like will appear here.",
    "Scheduled lives": "Scheduled live sessions will appear here.",
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <section aria-label="Business profile">
          <div className="relative">
            <div className="relative h-[150px] overflow-hidden rounded-3xl border border-border/50 bg-background-elevated/40 sm:h-[180px] lg:h-[200px]">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={`${displayName} cover image`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/15 via-background-elevated/50 to-secondary/15 px-6 text-center">
                <ImagePlus className="mb-3 h-9 w-9 text-primary" />
                <p className="max-w-xs text-base font-semibold">
                  Upload your business cover image or an elegant picture of
                  yourself
                </p>
                {isOwner && (
                  <p className="mt-2 text-sm text-muted">
                    This image introduces your business.
                  </p>
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
            {isOwner && (
              <label className="absolute left-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3.5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-black/60">
                {uploading === "cover" ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {coverUrl ? "Change cover" : "Upload cover"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploading !== null}
                  onChange={(event) => {
                    void handleImageUpload("cover", event.target.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            )}
            </div>
            <div className="absolute -bottom-8 left-4 z-10 h-20 w-20 rounded-full border-4 border-background bg-background-elevated shadow-xl sm:-bottom-9 sm:left-8 sm:h-24 sm:w-24">
              <div className="h-full w-full overflow-hidden rounded-full bg-background-elevated">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${fullName} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/15 text-muted">
                    <Store className="h-9 w-9" />
                  </div>
                )}
              </div>
              {isOwner && (
                <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-white shadow-md">
                  {uploading === "avatar" ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  <span className="sr-only">Edit profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploading !== null}
                    onChange={(event) => {
                      void handleImageUpload("avatar", event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-border/50 bg-background-elevated/20 p-4 pt-14 sm:p-6 sm:pt-16 md:grid-cols-[minmax(0,1.6fr)_minmax(250px,0.8fr)]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {displayName}
                </h1>
                {verified && (
                  <BadgeCheck
                    className="h-5 w-5 text-secondary"
                    aria-label="Verified business"
                  />
                )}
                {isOwner && (
                  <button
                    type="button"
                    onClick={openProfileEditor}
                    aria-label="Edit profile details"
                    title="Edit profile details"
                    className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-background-elevated hover:text-foreground"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">
                @{routeUsername}
                {fullName !== displayName ? ` · ${fullName}` : ""}
              </p>
              {profile.primary_role && (
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {String(profile.primary_role)}
                </p>
              )}
              <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-muted sm:text-base">
                {bio}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {location}
                  </span>
                )}
                {(profile.average_response_time || profile.response_time) && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4 text-primary" />
                    Replies{" "}
                    {String(
                      profile.average_response_time || profile.response_time,
                    )}
                  </span>
                )}
                {(profile.rating || profile.average_rating) && (
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary" />
                    {String(profile.rating || profile.average_rating)} rating
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {isOwner ? (
                  <Link
                    href="/post-product"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
                  >
                    <Package className="h-4 w-4" />
                    Add a product
                  </Link>
                ) : (
                  <Link
                    href="/conversation"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Link>
                )}
                {!isOwner && (
                  <button
                    type="button"
                    className="rounded-xl border border-border/60 px-5 py-3 text-sm font-semibold transition hover:bg-background-elevated/50"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
            <aside
              className="rounded-3xl border border-border/50 bg-background-elevated/25 p-4 sm:p-5"
              aria-label={isSeller ? "Business details" : "Followers and following"}
            >
              <h2 className="text-base font-bold">
                {isSeller ? "Business details" : "Community"}
              </h2>
              {isSeller ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-background/60 p-4">
                  <p className="text-xs text-muted">Rating</p>
                  <p className="mt-2 flex items-center gap-1.5 font-bold">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {profile.rating || profile.average_rating || "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-background/60 p-4">
                  <p className="text-xs text-muted">Reviews</p>
                  <p className="mt-2 font-bold">
                    {profile.review_count ?? profile.reviews_count ?? "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-background/60 p-4">
                  <p className="text-xs text-muted">Response time</p>
                  <p className="mt-2 truncate font-bold">
                    {profile.average_response_time ||
                      profile.response_time ||
                      "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-background/60 p-4">
                  <p className="text-xs text-muted">Followers</p>
                  <p className="mt-2 font-bold">
                    {profile.followers ?? profile.follower_count ?? "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-background/60 p-3">
                  <p className="text-xs text-muted">Following</p>
                  <p className="mt-1 font-bold">{following}</p>
                </div>
              </div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-background/60 p-3">
                    <p className="text-xs text-muted">Followers</p>
                    <p className="mt-1 text-lg font-bold">{followers}</p>
                  </div>
                  <div className="rounded-2xl bg-background/60 p-3">
                    <p className="text-xs text-muted">Following</p>
                    <p className="mt-1 text-lg font-bold">{following}</p>
                  </div>
                </div>
              )}
              {isSeller && (
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border/50 px-3 py-2.5 text-sm">
                {verified ? (
                  <BadgeCheck className="h-4 w-4 text-secondary" />
                ) : (
                  <Store className="h-4 w-4 text-primary" />
                )}
                <span>
                  {verified ? "Verified business" : "Business profile"}
                </span>
              </div>
              )}
              {uploadMessage && (
                <p className="mt-4 text-xs leading-5 text-muted" role="status">
                  {uploadMessage}
                </p>
              )}
            </aside>
          </div>
        </section>

        {isOwner && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl gap-5 overflow-y-auto rounded-2xl p-5 sm:p-7">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Edit profile
                </DialogTitle>
                <DialogDescription>
                  Update the details people see when they visit your profile.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleProfileSave();
                }}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium">
                    <span>Your name</span>
                    <input
                      value={profileDraft.full_name}
                      onChange={(event) =>
                        setProfileDraft((draft) => ({
                          ...draft,
                          full_name: event.target.value,
                        }))
                      }
                      maxLength={100}
                      className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 font-normal outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                    />
                  </label>
                  {isSeller && (
                    <label className="space-y-1.5 text-sm font-medium">
                      <span>Business name</span>
                      <input
                        value={profileDraft.business_name}
                        onChange={(event) =>
                          setProfileDraft((draft) => ({
                            ...draft,
                            business_name: event.target.value,
                          }))
                        }
                        maxLength={120}
                        className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 font-normal outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                      />
                    </label>
                  )}
                </div>
                <label className="block space-y-1.5 text-sm font-medium">
                  <span>About you or your business</span>
                  <textarea
                    value={profileDraft.bio}
                    onChange={(event) =>
                      setProfileDraft((draft) => ({
                        ...draft,
                        bio: event.target.value.slice(0, 500),
                      }))
                    }
                    placeholder="Add a short introduction..."
                    maxLength={500}
                    rows={4}
                    className="w-full resize-y rounded-xl border border-border/60 bg-background px-3.5 py-2.5 font-normal leading-6 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                  />
                  <span className="block text-right text-xs font-normal text-muted">
                    {profileDraft.bio.length}/500
                  </span>
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  {(["city", "state", "country"] as const).map((field) => (
                    <label
                      key={field}
                      className="space-y-1.5 text-sm font-medium"
                    >
                      <span>{field[0].toUpperCase() + field.slice(1)}</span>
                      <input
                        value={profileDraft[field]}
                        onChange={(event) =>
                          setProfileDraft((draft) => ({
                            ...draft,
                            [field]: event.target.value,
                          }))
                        }
                        maxLength={80}
                        className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 font-normal outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                      />
                    </label>
                  ))}
                </div>
                {profileSaveMessage && (
                  <p className="text-sm text-destructive" role="alert">
                    {profileSaveMessage}
                  </p>
                )}
                <DialogFooter className="-mx-5 -mb-5 px-5 sm:-mx-7 sm:-mb-7 sm:px-7">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="rounded-xl border border-border/60 px-4 py-2.5 text-sm font-semibold transition hover:bg-background-elevated"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-wait disabled:opacity-60"
                  >
                    {profileSaving && (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    )}
                    {profileSaving ? "Saving..." : "Save changes"}
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}

        <section className="mt-8" aria-label="Business content">
          <div
            className="flex gap-2 overflow-x-auto border-b border-border/60"
            role="tablist"
            aria-label="Profile content"
          >
            {tabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={activeTab === label}
                onClick={() => setActiveTab(label)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === label ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground"}`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {label === "Products" && products.length > 0 ? (
                  <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs">
                    {products.length}
                  </span>
                ) : null}
                {label === "Services" && services.length > 0 ? (
                  <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs">
                    {services.length}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <div className="min-h-44 py-6" role="tabpanel">
            {activeTab === "Liked" && likedItems.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {likedItems.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-border/50 bg-background-elevated/20"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-background-elevated/50 text-muted">
                        <Star className="h-8 w-8" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-xs font-semibold text-primary">
                        {item.kind}
                      </p>
                      <h3 className="mt-1 font-semibold">{item.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : tabListings.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {tabListings.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-border/50 bg-background-elevated/20"
                  >
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt=""
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-background-elevated/50 text-muted">
                        {activeTab === "Services" ? (
                          <Wrench className="h-8 w-8" />
                        ) : (
                          <Package className="h-8 w-8" />
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {item.description}
                      </p>
                      {item.starting_amount && (
                        <p className="mt-3 text-sm font-bold">
                          {item.price_currency || "₦"}{" "}
                          {Number(item.starting_amount).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-background-elevated/10 px-5 py-10 text-center">
                {activeTab === "Scheduled lives" ? (
                  <CalendarDays className="mx-auto h-7 w-7 text-muted" />
                ) : activeTab === "Services" ? (
                  <Wrench className="mx-auto h-7 w-7 text-muted" />
                ) : activeTab === "Liked" ? (
                  <Star className="mx-auto h-7 w-7 text-muted" />
                ) : (
                  <Package className="mx-auto h-7 w-7 text-muted" />
                )}
                <p className="mt-3 text-sm font-medium">
                  {emptyCopy[activeTab]}
                </p>
                {isOwner && activeTab === "Products" && (
                  <Link
                    href="/post-product"
                    className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong"
                  >
                    Post a product
                  </Link>
                )}
                {isOwner && activeTab === "Services" && (
                  <Link
                    href="/add-service"
                    className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong"
                  >
                    Add a service
                  </Link>
                )}
                {isOwner && activeTab === "Scheduled lives" && (
                  <Link
                    href="/schedule-live"
                    className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong"
                  >
                    Schedule a live
                  </Link>
                )}
                {isOwner &&
                  activeTab === "Liked" &&
                  savedItemIds.length > 0 && (
                    <p className="mt-2 text-xs text-muted">
                      Your saved items are available from your saved list.
                    </p>
                  )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
