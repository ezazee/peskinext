import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import TransactionPageClient from "./TransactionPageClient";

export default async function TransactionPage() {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/account/transaction");
  }

  return <TransactionPageClient />;
}
