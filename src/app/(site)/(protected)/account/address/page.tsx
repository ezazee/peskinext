import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import AddressListClient from "@features/address/AddressListClient";

export default async function AddressListPage() {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/account/address");
  }

  return <AddressListClient />;
}
