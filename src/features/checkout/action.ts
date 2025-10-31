"use server";

import { redirect } from "next/navigation";
import {
  createSessionFromBuyNow,
  createSessionFromCart,
} from "@server/checkout";
import { getCurrentUser } from "@features/auth/action";


export async function createCheckoutFromCart(formData: FormData) {
  try {
    console.log("=== CREATE CHECKOUT FROM CART ===");

    const user = await getCurrentUser();
    const userId = user?.id || null;
    console.log("User ID:", userId);

    // Get cart items from formData
    const cartItemsJson = formData.get("cartItems") as string;
    console.log("Cart Items JSON length:", cartItemsJson?.length);
    console.log("Cart Items JSON preview:", cartItemsJson?.substring(0, 200));

    if (!cartItemsJson) {
      console.error("ERROR: No cart items provided");
      throw new Error("No cart items provided");
    }

    console.log("Creating session...");
    const sessionId = await createSessionFromCart(userId, cartItemsJson);
    console.log("Session ID created:", sessionId);

    if (!sessionId) {
      console.error("ERROR: Failed to create checkout session - no session ID returned");
      throw new Error("Failed to create checkout session");
    }

    console.log("Redirecting to checkout with session:", sessionId);
    redirect(`/checkout?cs=${sessionId}`);
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).startsWith('NEXT_REDIRECT')) {
      console.log("Redirect successful (expected error)");
      throw error; // Re-throw redirect errors
    }

    console.error("=== CHECKOUT ERROR ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    console.error("Full error:", error);

    // Redirect to cart with error message
    redirect("/cart?error=checkout_failed");
  }
}

export async function createCheckoutFromBuyNow(formData: FormData) {
  try {
    console.log("=== CREATE CHECKOUT FROM BUY NOW ===");

    const user = await getCurrentUser();
    const userId = user?.id || null;
    console.log("User ID:", userId);

    const productId = String(formData.get("productId"));
    const variantId = String(formData.get("variantId"));
    const qty = Number(formData.get("qty") ?? 1);

    console.log("Product data:", { productId, variantId, qty });

    // Validate input
    if (!productId || !variantId || qty < 1) {
      console.error("ERROR: Invalid product data", { productId, variantId, qty });
      throw new Error("Invalid product data");
    }

    console.log("Creating buy now session...");
    const sessionId = await createSessionFromBuyNow({
      userId,
      productId,
      variantId,
      qty,
    });
    console.log("Buy now session ID created:", sessionId);

    if (!sessionId) {
      console.error("ERROR: Failed to create checkout session - no session ID returned");
      throw new Error("Failed to create checkout session");
    }

    console.log("Redirecting to checkout with session:", sessionId);
    redirect(`/checkout?cs=${sessionId}`);
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).startsWith('NEXT_REDIRECT')) {
      console.log("Redirect successful (expected error)");
      throw error; // Re-throw redirect errors
    }

    console.error("=== BUY NOW CHECKOUT ERROR ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    console.error("Full error:", error);

    // Redirect back to product with error message
    redirect("/?error=checkout_failed");
  }
}
