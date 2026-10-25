import { ListingAnalyticsPage } from "@/components/pages/ListingAnalyticsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  return <ListingAnalyticsPage listingId={listingId} />;
}
