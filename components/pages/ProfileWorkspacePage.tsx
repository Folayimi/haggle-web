"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Archive,
  BarChart3,
  CalendarDays,
  Camera,
  Clock3,
  Eye,
  ImagePlus,
  LoaderCircle,
  MoreHorizontal,
  MapPin,
  MessageCircle,
  Package,
  Pencil,
  Radio,
  Star,
  Store,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { useHaggleStore } from "@/lib/app-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  allLiveSessions,
  marketServices,
  sellerProducts,
} from "@/lib/mock-data";
import {
  archiveListing,
  deleteListing,
  getSellerListings,
  confirmUpload,
  updateUserProfile,
  uploadImage,
} from "@/services/request";
import {
  ArchiveListingError,
  replaceWithArchivedListing,
} from "@/services/archive-listing";
import { notify, notifyError } from "@/services/toastify";
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
  username: string;
  business_name: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  email: string;
  phone: string;
  website: string;
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

function listingImageUrl(listing: BackendListing) {
  const imagePath =
    listing.thumbnail_url?.trim() ||
    listing.medias?.find((media) => media.is_cover)?.url ||
    listing.media?.find((media) => media.is_cover)?.url ||
    listing.medias?.[0]?.url ||
    listing.media?.[0]?.url;
  return imagePath ? toPublicImageUrl(imagePath) || imagePath : "";
}

export default function ProfileWorkspacePage({
  username,
}: {
  username: string;
}) {
  const router = useRouter();
  const userData = useHaggleStore((state) => state.userData);
  const setUserData = useHaggleStore((state) => state.setUserData);
  const setActivateAuth = useHaggleStore((state) => state.setActivateAuth);
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
  const [imagePreview, setImagePreview] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [uploading, setUploading] = useState<ImageSlot | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [profileDraft, setProfileDraft] = useState<ProfileDetailsDraft>({
    full_name: "",
    username: "",
    business_name: "",
    bio: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    email: "",
    phone: "",
    website: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveMessage, setProfileSaveMessage] = useState("");
  const [activeTab, setActiveTab] = useState<ProfileTab>("Products");
  const [listings, setListings] = useState<BackendListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState(false);
  const [listingActionId, setListingActionId] = useState<string | null>(null);
  const [listingConfirmation, setListingConfirmation] = useState<{
    listing: BackendListing;
    action: "archive" | "delete";
  } | null>(null);
  const [listingView, setListingView] = useState<"active" | "archived" | "drafts">("active");

  useEffect(() => {
    if (!isOwner) return;
    setProfileDraft({
      full_name: String(accountProfile.full_name || userData?.full_name || ""),
      username: String(
        userData?.username || accountProfile.username || routeUsername,
      ).replace(/^@/, ""),
      business_name: String(
        accountProfile.business_name || userData?.business_name || "",
      ),
      bio: String(accountProfile.bio || userData?.bio || ""),
      city: String(accountProfile.city || accountProfile.location || ""),
      state: String(accountProfile.state || ""),
      country: String(accountProfile.country || ""),
      postal_code: String(
        accountProfile.postal_code || userData?.postal_code || "",
      ),
      email: String(accountProfile.email || userData?.email || ""),
      phone: String(accountProfile.phone || userData?.phone || ""),
      website: String(accountProfile.website || userData?.website || ""),
    });
  }, [
    accountProfile.bio,
    accountProfile.business_name,
    accountProfile.city,
    accountProfile.country,
    accountProfile.full_name,
    accountProfile.location,
    accountProfile.username,
    accountProfile.postal_code,
    accountProfile.email,
    accountProfile.phone,
    accountProfile.website,
    accountProfile.state,
    isOwner,
    userData?.bio,
    userData?.business_name,
    userData?.username,
    userData?.full_name,
    userData?.postal_code,
    userData?.email,
    userData?.phone,
    userData?.website,
  ]);

  useEffect(() => {
    setMedia(emptyMedia);
  }, [routeUsername]);

  useEffect(() => {
    const sellerId =
      ownerData?.id || ownerData?.user_id || accountProfile.user_id;
    if (!isOwner || !sellerId) {
      setListings([]);
      setListingsLoading(false);
      setListingsError(false);
      return;
    }
    let active = true;
    setListingsLoading(true);
    setListingsError(false);
    void getSellerListings(String(sellerId))
      .then((result) => {
        if (active) {
          setListings(
            result.filter((listing) => {
              const status = listing.status?.toLowerCase();
              return !status || status === "published" || status === "archived" || status === "draft";
            }),
          );
        }
      })
      .catch(() => {
        if (active) {
          setListings([]);
          setListingsError(true);
        }
      })
      .finally(() => {
        if (active) setListingsLoading(false);
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
    profile.cover_image_url ||
    ownerData?.cover_image_url ||
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
        setMedia((current) => ({ ...current, [slot]: "" }));
        URL.revokeObjectURL(previewUrl);
        setUploadMessage(
          "The image uploaded, but the public image URL is not configured yet.",
        );
        return;
      }
      const field = slot === "avatar" ? "avatar_url" : "cover_image_url";
      try {
        const result = await updateUserProfile({ [field]: uploadedUrl });
        if (!result) throw new Error("Profile image update failed.");
        setUserData({
          ...userData,
          [field]: uploadedUrl,
          profile: { ...profile, [field]: uploadedUrl },
        });
        setMedia((current) => ({ ...current, [slot]: uploadedUrl }));
        setUploadMessage(
          slot === "cover" ? "Cover image updated." : "Profile photo updated.",
        );
      } catch {
        setMedia((current) => ({ ...current, [slot]: "" }));
        URL.revokeObjectURL(previewUrl);
        setUploadMessage(
          "The image uploaded, but your profile could not be updated. Please try again.",
        );
      }
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      setMedia((current) => ({ ...current, [slot]: "" }));
      URL.revokeObjectURL(previewUrl);
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
      username: profileDraft.username.trim().replace(/^@/, ""),
      business_name: profileDraft.business_name.trim(),
      bio: profileDraft.bio.trim(),
      city: profileDraft.city.trim(),
      state: profileDraft.state.trim(),
      country: profileDraft.country.trim(),
      postal_code: profileDraft.postal_code.trim(),
      email: profileDraft.email.trim(),
      phone: profileDraft.phone.trim(),
      website: profileDraft.website.trim(),
    };
    const profileUpdates = nextProfile;
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
      if (nextProfile.username && nextProfile.username !== routeUsername) {
        router.replace(`/profile/${encodeURIComponent(nextProfile.username)}`);
      }
    } catch {
      setProfileSaveMessage(
        "Your changes could not be saved. Please try again.",
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const openProfileEditor = () => {
    setProfileSaveMessage("");
    setProfileDraft({
      full_name: String(accountProfile.full_name || userData?.full_name || ""),
      username: String(
        userData?.username || accountProfile.username || routeUsername,
      ).replace(/^@/, ""),
      business_name: String(
        accountProfile.business_name || userData?.business_name || "",
      ),
      bio: String(accountProfile.bio || userData?.bio || ""),
      city: String(accountProfile.city || accountProfile.location || ""),
      state: String(accountProfile.state || ""),
      country: String(accountProfile.country || ""),
      postal_code: String(
        accountProfile.postal_code || userData?.postal_code || "",
      ),
      email: String(accountProfile.email || userData?.email || ""),
      phone: String(accountProfile.phone || userData?.phone || ""),
      website: String(accountProfile.website || userData?.website || ""),
    });
    setEditOpen(true);
  };

  const openListingEditor = (listing: BackendListing) => {
    const type = listing.listing_type?.toLowerCase();
    router.push(`/${type === "service" || type === "services" ? "add-service" : "post-product"}/${encodeURIComponent(listing.id)}`);
  };

  const refreshSellerListings = async () => {
    if (!sellerId) return;
    try {
      const result = await getSellerListings(sellerId);
      setListings(
        result.filter((listing) => {
          const status = listing.status?.toLowerCase();
          return !status || status === "published" || status === "archived" || status === "draft";
        }),
      );
    } catch {
      // Keep the current seller view when a follow-up refresh also fails.
    }
  };

  const handleListingAction = async (
    listing: BackendListing,
    action: "archive" | "delete",
  ) => {
    if (listingActionId) return;
    setListingActionId(listing.id);
    try {
      if (action === "archive") {
        const archivedListing = await archiveListing(listing.id);
        setListings((current) =>
          replaceWithArchivedListing(current, archivedListing),
        );
        notify("Listing archived.");
      } else {
        await deleteListing(listing.id);
        notify("Listing deleted.");
        setListings((current) => current.filter((item) => item.id !== listing.id));
      }
      setListingConfirmation(null);
    } catch (error) {
      if (action === "archive" && error instanceof ArchiveListingError) {
        if (error.status === 404) {
          setListingConfirmation(null);
          notifyError("This listing is unavailable or no longer belongs to your account.");
          await refreshSellerListings();
        } else if (error.status === 401) {
          setListingConfirmation(null);
          setActivateAuth(true);
          notifyError("Your session has expired. Sign in to archive this listing.");
        } else {
          notifyError(error.message || "Unable to archive this listing.");
        }
      } else {
        notifyError(error instanceof Error ? error.message : `Unable to ${action} this listing.`);
      }
    } finally {
      setListingActionId(null);
    }
  };

  const allTabListings =
    activeTab === "Products"
      ? products
      : activeTab === "Services"
        ? services
        : [];
  const tabListings = allTabListings.filter((listing) => {
    const status = listing.status?.toLowerCase();
    if (listingView === "archived") return status === "archived";
    if (listingView === "drafts") return status === "draft";
    return status !== "archived" && status !== "draft";
  });
  const archivedListingsCount = allTabListings.filter(
    (listing) => listing.status?.toLowerCase() === "archived",
  ).length;
  const draftListingsCount = allTabListings.filter(
    (listing) => listing.status?.toLowerCase() === "draft",
  ).length;
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
    <main className="min-h-screen bg-transparent text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <section aria-label="Business profile">
          <div className="relative">
            <div className="relative h-[150px] overflow-hidden rounded-3xl border border-border/50 bg-background-elevated/40 sm:h-[180px] lg:h-[200px]">
              {coverUrl ? (
                <button
                  type="button"
                  aria-label="View cover image"
                  onClick={() =>
                    setImagePreview({
                      src: coverUrl,
                      alt: `${displayName} cover image`,
                    })
                  }
                  className="absolute inset-0 z-0 h-full w-full cursor-zoom-in"
                >
                  <img
                    src={coverUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
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
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-transparent to-black/15" />
              {isOwner && (
                <label className="absolute left-4 top-4 z-10 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3.5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-black/60">
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
                  <button
                    type="button"
                    aria-label="View profile photo"
                    onClick={() =>
                      setImagePreview({
                        src: avatarUrl,
                        alt: `${fullName} profile photo`,
                      })
                    }
                    className="h-full w-full cursor-zoom-in"
                  >
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/15 text-muted">
                    <Store className="h-9 w-9" />
                  </div>
                )}
              </div>
              {isOwner && (
                <label className="absolute bottom-0 right-0 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-white shadow-md">
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
              aria-label={
                isSeller ? "Business details" : "Followers and following"
              }
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
            <DialogContent className="flex w-[calc(100vw-2rem)] min-w-0 max-h-[min(90dvh,52rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:w-[85vw] lg:w-[65vw] lg:min-w-[65vw] lg:max-w-none">
              <DialogHeader className="shrink-0 border-b border-border/60 px-5 py-4 pr-14 sm:px-7">
                <DialogTitle className="text-xl font-bold">
                  Edit profile
                </DialogTitle>
                <DialogDescription>
                  Keep your personal and business details up to date.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleProfileSave();
                }}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-5 sm:px-7">
                  <p className="text-xs text-muted">* Indicates required</p>

                  <section
                    className="space-y-4"
                    aria-labelledby="profile-basic-info"
                  >
                    <h3
                      id="profile-basic-info"
                      className="text-base font-semibold"
                    >
                      Basic info
                    </h3>
                    <label className="block space-y-1.5 text-sm">
                      <span className="font-medium">Full name</span>
                      <input
                        value={profileDraft.full_name}
                        onChange={(event) =>
                          setProfileDraft((draft) => ({
                            ...draft,
                            full_name: event.target.value,
                          }))
                        }
                        maxLength={100}
                        autoComplete="name"
                        className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                    </label>
                    <label className="block space-y-1.5 text-sm">
                      <span className="font-medium">Username*</span>
                      <div className="flex overflow-hidden rounded-lg border border-border/70 bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                        <span className="flex items-center border-r border-border/60 px-3 text-muted">
                          @
                        </span>
                        <input
                          value={profileDraft.username}
                          onChange={(event) =>
                            setProfileDraft((draft) => ({
                              ...draft,
                              username: event.target.value.replace(/^@/, ""),
                            }))
                          }
                          maxLength={50}
                          autoComplete="username"
                          required
                          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none"
                        />
                      </div>
                      <span className="block text-xs text-muted">
                        Your profile address will use this username.
                      </span>
                    </label>
                  </section>

                  <section
                    className="space-y-4"
                    aria-labelledby="profile-business-info"
                  >
                    <div>
                      <h3
                        id="profile-business-info"
                        className="text-base font-semibold"
                      >
                        Business info
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        Help customers recognize and understand your business.
                      </p>
                    </div>
                    <label className="block space-y-1.5 text-sm">
                      <span className="font-medium">Business name</span>
                      <input
                        value={profileDraft.business_name}
                        onChange={(event) =>
                          setProfileDraft((draft) => ({
                            ...draft,
                            business_name: event.target.value,
                          }))
                        }
                        maxLength={120}
                        autoComplete="organization"
                        className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                    </label>
                    <label className="block space-y-1.5 text-sm">
                      <span className="font-medium">Bio</span>
                      <textarea
                        value={profileDraft.bio}
                        onChange={(event) =>
                          setProfileDraft((draft) => ({
                            ...draft,
                            bio: event.target.value.slice(0, 500),
                          }))
                        }
                        placeholder="Tell people what you do and what makes your business special."
                        maxLength={500}
                        rows={4}
                        className="w-full resize-y rounded-lg border border-border/70 bg-background px-3 py-2.5 leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                      <span className="block text-right text-xs text-muted">
                        {profileDraft.bio.length}/500
                      </span>
                    </label>
                  </section>

                  <section
                    className="space-y-4"
                    aria-labelledby="profile-location"
                  >
                    <h3
                      id="profile-location"
                      className="text-base font-semibold"
                    >
                      Location
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(
                        ["city", "state", "country", "postal_code"] as const
                      ).map((field) => (
                        <label
                          key={field}
                          className="block space-y-1.5 text-sm"
                        >
                          <span className="font-medium">
                            {
                              {
                                city: "City",
                                state: "State / Region",
                                country: "Country / Region",
                                postal_code: "Postal code",
                              }[field]
                            }
                          </span>
                          <input
                            value={profileDraft[field]}
                            onChange={(event) =>
                              setProfileDraft((draft) => ({
                                ...draft,
                                [field]: event.target.value,
                              }))
                            }
                            maxLength={field === "postal_code" ? 20 : 80}
                            autoComplete={
                              {
                                city: "address-level2",
                                state: "address-level1",
                                country: "country-name",
                                postal_code: "postal-code",
                              }[field]
                            }
                            className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                          />
                        </label>
                      ))}
                    </div>
                  </section>

                  <section
                    className="space-y-4"
                    aria-labelledby="profile-contact-info"
                  >
                    <div>
                      <h3
                        id="profile-contact-info"
                        className="text-base font-semibold"
                      >
                        Contact info
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        Add the best ways for customers to reach your business.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-1.5 text-sm">
                        <span className="font-medium">Email</span>
                        <input
                          type="email"
                          value={profileDraft.email}
                          onChange={(event) =>
                            setProfileDraft((draft) => ({
                              ...draft,
                              email: event.target.value,
                            }))
                          }
                          maxLength={254}
                          autoComplete="email"
                          className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                        />
                      </label>
                      <label className="block space-y-1.5 text-sm">
                        <span className="font-medium">Phone</span>
                        <input
                          type="tel"
                          value={profileDraft.phone}
                          onChange={(event) =>
                            setProfileDraft((draft) => ({
                              ...draft,
                              phone: event.target.value,
                            }))
                          }
                          maxLength={30}
                          autoComplete="tel"
                          className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                        />
                      </label>
                    </div>
                    <label className="block space-y-1.5 text-sm">
                      <span className="font-medium">Website</span>
                      <input
                        type="url"
                        value={profileDraft.website}
                        onChange={(event) =>
                          setProfileDraft((draft) => ({
                            ...draft,
                            website: event.target.value,
                          }))
                        }
                        maxLength={240}
                        placeholder="https://example.com"
                        autoComplete="url"
                        className="w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                    </label>
                  </section>

                  {profileSaveMessage && (
                    <p className="text-sm text-destructive" role="alert">
                      {profileSaveMessage}
                    </p>
                  )}
                </div>
                <DialogFooter className="mx-0 mb-0 mt-0 flex-row justify-end gap-2 rounded-none border-t border-border/60 bg-background px-5 py-3 sm:px-7">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="rounded-full border border-border/60 px-5 py-2.5 text-sm font-semibold transition hover:bg-background-elevated"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-wait disabled:opacity-60"
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
            {isOwner && (activeTab === "Products" || activeTab === "Services") && (
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex w-fit rounded-xl border border-border/60 bg-background-elevated/20 p-1" role="group" aria-label="Listing status filter">
                  <button
                    type="button"
                    aria-pressed={listingView === "active"}
                    onClick={() => setListingView("active")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${listingView === "active" ? "bg-background text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    aria-pressed={listingView === "drafts"}
                    onClick={() => setListingView("drafts")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${listingView === "drafts" ? "bg-background text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
                  >
                    Drafts <span className="ml-1 text-xs">{draftListingsCount}</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={listingView === "archived"}
                    onClick={() => setListingView("archived")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${listingView === "archived" ? "bg-background text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
                  >
                    Archived <span className="ml-1 text-xs">{archivedListingsCount}</span>
                  </button>
                </div>
                <p className="max-w-xl text-xs text-muted">
                  Archived listings are hidden from public discovery and remain available here.
                </p>
              </div>
            )}
            {listingsLoading &&
            (activeTab === "Products" || activeTab === "Services") ? (
              <p className="py-10 text-center text-sm text-muted" role="status">
                Loading your {activeTab.toLowerCase()} from the catalog...
              </p>
            ) : listingsError &&
              (activeTab === "Products" || activeTab === "Services") ? (
              <p className="py-10 text-center text-sm text-muted" role="alert">
                We couldn&apos;t load your {activeTab.toLowerCase()}. Please refresh and try again.
              </p>
            ) : activeTab === "Liked" && likedItems.length > 0 ? (
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
                    role={isOwner ? "link" : undefined}
                    tabIndex={isOwner ? 0 : undefined}
                    onClick={isOwner ? () => openListingEditor(item) : undefined}
                    onKeyDown={isOwner ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openListingEditor(item);
                      }
                    } : undefined}
                    className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-background-elevated/20 ${isOwner ? "cursor-pointer transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" : ""}`}
                  >
                    <div className="relative">
                      {listingImageUrl(item) ? (
                        <img
                          src={listingImageUrl(item)}
                          alt=""
                          className="h-40 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center bg-background-elevated/50 text-muted">
                          {activeTab === "Services" ? <Wrench className="h-8 w-8" /> : <Package className="h-8 w-8" />}
                        </div>
                      )}
                      {(item.inventory_count != null || isOwner) && (
                        <div className={`pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2 transition-opacity ${item.status?.toLowerCase() === "archived" ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"}`}>
                          <span className="rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                            {item.status?.toLowerCase() === "archived"
                              ? "Archived"
                              : item.status?.toLowerCase() === "draft"
                                ? "Draft"
                                : item.inventory_count != null
                                  ? `${item.inventory_count} left`
                                  : "Service"}
                          </span>
                          {isOwner && (
                            <div className="pointer-events-auto" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  aria-label={`Actions for ${item.title}`}
                                  onClick={(event) => event.stopPropagation()}
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                  {listingActionId === item.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuItem onClick={() => openListingEditor(item)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  {item.status?.toLowerCase() !== "archived" && (
                                    <DropdownMenuItem disabled={listingActionId === item.id} onClick={() => setListingConfirmation({ listing: item, action: "archive" })}>
                                      <Archive className="mr-2 h-4 w-4" /> Archive
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem variant="destructive" disabled={listingActionId === item.id} onClick={() => setListingConfirmation({ listing: item, action: "delete" })}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-4 pb-12">
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
                    {isOwner && (
                      <>
                        <span
                          aria-label={`${item.view_count ?? 0} views`}
                          className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/95 px-2.5 py-1.5 text-xs font-medium text-muted opacity-100 shadow-sm backdrop-blur transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          {Number(item.view_count ?? 0).toLocaleString()}
                        </span>
                        <div className="absolute bottom-3 right-3 z-10 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                          <button
                            type="button"
                            aria-label={`View analytics for ${item.title}`}
                            onClick={() => router.push(`/listing-analytics/${encodeURIComponent(item.id)}`)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background/95 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                            View analytics
                          </button>
                        </div>
                      </>
                    )}
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
                  {isOwner && (activeTab === "Products" || activeTab === "Services")
                    ? listingView === "archived"
                      ? `You have no archived ${activeTab.toLowerCase()}.`
                      : listingView === "drafts"
                        ? `You have no draft ${activeTab.toLowerCase()}.`
                        : allTabListings.length > 0
                          ? `You have no active ${activeTab.toLowerCase()}.`
                          : emptyCopy[activeTab]
                    : emptyCopy[activeTab]}
                </p>
                {isOwner && listingView === "active" && activeTab === "Products" && (
                  <Link
                    href="/post-product"
                    className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong"
                  >
                    Post a product
                  </Link>
                )}
                {isOwner && listingView === "active" && activeTab === "Services" && (
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
      <Dialog
        open={Boolean(listingConfirmation)}
        onOpenChange={(open) => {
          if (!open && !listingActionId) setListingConfirmation(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100vw-2rem)] max-w-md gap-0 overflow-hidden rounded-2xl border border-border/70 border-t-4 border-t-primary p-0 shadow-xl shadow-primary/10"
        >
          {listingConfirmation && (
            <>
              <DialogHeader className="border-b border-border/60 bg-primary/[0.03] px-6 py-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${listingConfirmation.action === "delete" ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"}`}>
                    {listingConfirmation.action === "archive" ? (
                      <Archive className="h-5 w-5" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <DialogTitle className="text-lg font-bold">
                      {listingConfirmation.action === "archive"
                        ? "Archive this listing?"
                        : "Delete this listing?"}
                    </DialogTitle>
                    <DialogDescription className="leading-relaxed">
                      {listingConfirmation.action === "archive" ? (
                        <>
                          <span className="font-medium text-foreground">
                            {listingConfirmation.listing.title}
                          </span>{" "}
                          will be hidden from public discovery and kept in your
                          archived listings. You can still manage it later.
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-foreground">
                            {listingConfirmation.listing.title}
                          </span>{" "}
                          will be permanently deleted. This action cannot be undone.
                        </>
                      )}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <DialogFooter className="mx-0 mb-0 border-0 bg-transparent px-6 pb-7 pt-5">
                <button
                  type="button"
                  disabled={Boolean(listingActionId)}
                  onClick={() => setListingConfirmation(null)}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-border/70 px-4 text-sm font-semibold text-foreground transition hover:bg-background-elevated disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={Boolean(listingActionId)}
                  onClick={() =>
                    void handleListingAction(
                      listingConfirmation.listing,
                      listingConfirmation.action,
                    )
                  }
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${listingConfirmation.action === "delete" ? "bg-danger hover:bg-danger/90" : "bg-primary hover:bg-primary-strong"}`}
                >
                  {listingActionId ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : null}
                  {listingActionId ? "Processing..." : "Proceed"}
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(imagePreview)}
        onOpenChange={(open) => {
          if (!open) setImagePreview(null);
        }}
      >
        <DialogContent
          overlayClassName="bg-black/85 supports-backdrop-filter:backdrop-blur-sm"
          showCloseButton={false}
          className="flex max-h-[92dvh] w-[min(94vw,1200px)] max-w-[94vw] flex-col items-center justify-center gap-0 border-0 bg-transparent p-0 shadow-none ring-0"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Profile image</DialogTitle>
            <DialogDescription>
              Expanded view of the profile cover or avatar image.
            </DialogDescription>
          </DialogHeader>
          {imagePreview && (
            <div className="relative flex max-h-[92dvh] w-full items-center justify-center">
              <img
                src={imagePreview.src}
                alt={imagePreview.alt}
                className="max-h-[88dvh] max-w-full rounded-lg object-contain shadow-2xl"
              />
              <button
                type="button"
                aria-label="Close image preview"
                onClick={() => setImagePreview(null)}
                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
