import { redirect } from "next/navigation";

type ProductDetailSearchParams = {
  product?: string | string[];
  id?: string | string[];
  offer?: string | string[];
};

export default async function ProductDetailPage({
  searchParams,
}: {
  searchParams: Promise<ProductDetailSearchParams>;
}) {
  const query = await searchParams;
  const rawId = query.product ?? query.id ?? query.offer;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) redirect("/market");
  redirect(`/product-detail/${encodeURIComponent(id)}`);
}
