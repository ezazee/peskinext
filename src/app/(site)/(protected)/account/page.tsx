import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import AccountClient from "@features/account/AccountClient";

// SSR-safe, tidak ada any. Hanya pasang wrapper client.
export default async function AccountPage() {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/account");
  }

  // Create account data from user session
  const accountData = {
    profile: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl || "/images/avatar/default-avatar.jpg",
      email: user.email || "",
      phone: user.phone || "",
      birthDate: user.birthDate,
    },
  };

  return <AccountClient data={accountData} />;
}
