import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import AddressListClient from "@features/address/AddressListClient";

export const dynamic = "force-dynamic";

export default async function AddressListPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/account/address");
  }

  return <AddressListClient />;
}
