// app/(site)/(protected)/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const store = await cookies();
  const token = store.get("session_token");

  if (!token) {
    // redirect ke halaman login kalau belum login
    redirect("/(auth)/login");
  }

  return <>{children}</>;
}
