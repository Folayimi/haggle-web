import MarketPage from "@/appPages/MarketPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const idRaw = params.service || params.id || "";
  const serviceId = Array.isArray(idRaw) ? idRaw[0] : idRaw;

  return <MarketPage initialServiceId={serviceId || undefined} />;
}
