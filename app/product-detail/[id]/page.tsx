import MarketPage from "@/appPages/MarketPage";

export default async function ProductDetailByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MarketPage initialProductId={id} />;
}
