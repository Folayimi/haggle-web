"use client";

import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import ProfileWorkspacePage from "@/components/pages/ProfileWorkspacePage";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();

  return (
    <AppShell>
      <ProfileWorkspacePage username={username} />
    </AppShell>
  );
}
