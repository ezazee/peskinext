import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import AddressEditPageClient from "./AddressEditPageClient";

export default async function AddressEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/account/address");
  }

  return <AddressEditPageClient params={params} />;
}
