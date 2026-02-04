import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import NotificationsEntry from "@features/notifications/NotificationsEntry";

export const dynamic = "force-dynamic";

export default async function NotificationPage() {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/notification");
  }

  return <NotificationsEntry />;
}
