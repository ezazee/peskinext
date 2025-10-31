import { redirect } from "next/navigation";
import { getCurrentUser } from "@features/auth/action";
import CheckoutClient from "@features/checkout/CheckoutClient";
import { getSession } from "@server/checkout";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cs?: string }>;
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
    console.log("=== CHECKOUT PAGE: Fetching session ===");
    console.log("Session ID from URL:", sessionId);
    try {
      checkoutSession = await getSession(sessionId);
      console.log("Session fetched successfully:", !!checkoutSession);
    } catch (error) {
      console.error("=== CHECKOUT PAGE: Error fetching session ===");
      console.error("Error:", error);
      // If session not found or expired, redirect to cart
      redirect("/cart?error=session_expired");
    }
  } else {
    console.log("=== CHECKOUT PAGE: No session ID in URL ===");
  }

  return <CheckoutClient checkoutSession={checkoutSession} />;
}
