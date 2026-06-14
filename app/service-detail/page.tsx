import { ServiceDetailPage } from "@/components/workspace-pages";

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const idRaw = searchParams?.service || searchParams?.id || "";
  const serviceId = Array.isArray(idRaw) ? idRaw[0] : idRaw;
  return <ServiceDetailPage serviceId={serviceId || undefined} />;
}
