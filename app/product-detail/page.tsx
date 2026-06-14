import { ProductDetailPage } from "@/components/workspace-pages";

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const idRaw = searchParams?.product || searchParams?.id || searchParams?.offer || "";
  const productId = Array.isArray(idRaw) ? idRaw[0] : idRaw;
  return <ProductDetailPage productId={productId || undefined} />;
}
