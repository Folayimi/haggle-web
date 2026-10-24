import PostProductPage from "@/appPages/PostProductPage";

export default async function Page({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  return <PostProductPage listingId={listingId} />;
}
