// app/profile/[username]/layout.tsx
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `${params.username} | Haggle Business Profile`,
    description: `View ${params.username}'s business profile on Haggle`,
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}