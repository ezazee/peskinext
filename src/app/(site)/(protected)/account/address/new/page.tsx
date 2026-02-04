import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import AddressCreateClient from "@features/address/AddressCreateClient";

export const dynamic = "force-dynamic";

export default async function NewAddressPage() {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/account/address/new");
  }

  return <AddressCreateClient />;
}
