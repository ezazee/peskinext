import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import CheckoutClient from "@features/checkout/CheckoutClient";
import { getSession } from "@server/checkout";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cs?: string; tx?: string }>;
}) {
  // Check if user is logged in
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login with callback URL
    redirect("/login?callbackUrl=/checkout");
  }

  // Check if we have a checkout session ID
  const params = await searchParams;
  const sessionId = params.cs;

  // If we have a session ID, fetch the session
  let checkoutSession = null;
  if (sessionId) {
    try {
      checkoutSession = await getSession(sessionId);
    } catch (error) {
      console.error(error);
      // If session not found or expired, redirect to cart
      redirect("/cart?error=session_expired");
    }
  } else {
    // Check if we have transaction ID (re-payment flow)
    const txId = params.tx;
    if (txId && typeof txId === "string") {
      const { getSessionFromTransaction } = await import("@server/checkout");
      const restoredSession = await getSessionFromTransaction(txId);
      if (restoredSession) {
        checkoutSession = restoredSession;
      } else {
        // creating empty session or fallback?
        // console.warn("Could not restore session from txId", txId);
      }
    }
  }

  return <CheckoutClient checkoutSession={checkoutSession} />;
}
