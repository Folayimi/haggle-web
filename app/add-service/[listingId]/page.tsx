import AddServicePage from "@/appPages/AddServicePage";

export default async function Page({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  return <AddServicePage listingId={listingId} />;
}
