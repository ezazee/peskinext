import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import NewAddressClient from "./NewAddressClient";

export default async function AddressNewPage() {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/account/address/new");
  }

  return <NewAddressClient />;
}
