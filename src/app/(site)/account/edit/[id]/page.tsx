// src/app/(site)/account/edit/[id]/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import EditAccountClient from "./client";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditAccountPage({ params }: PageProps) {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/account");
  }

  const { id } = await params;

  // valid jika cocok dengan user ID yang login
  const exists = id === user.id;

  const profile = {
    id: user.id,
    name: user.name,
    email: user.email || "",
    phone: user.phone || "",
    avatarUrl: "/images/avatar/default-avatar.png",
    birthDate: user.birthDate,
  };

  return <EditAccountClient exists={exists} profile={profile} />;
}
