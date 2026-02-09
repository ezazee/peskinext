import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import TransactionDetailPageClient from "./TransactionDetailPageClient";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/account/transaction");
  }

  return <TransactionDetailPageClient params={params} />;
}
