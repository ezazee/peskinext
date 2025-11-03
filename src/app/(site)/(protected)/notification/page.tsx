import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import NotificationsEntry from "@features/notifications/NotificationsEntry";

export default async function Page() {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/notification");
  }

  return <NotificationsEntry />;
}
