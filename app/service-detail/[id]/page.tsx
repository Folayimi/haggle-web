import MarketPage from "@/appPages/MarketPage";

export default async function ServiceDetailByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MarketPage initialServiceId={id} />;
}
