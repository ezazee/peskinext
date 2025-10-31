"use server";

import { redirect } from "next/navigation";
import {
  createSessionFromBuyNow,
  createSessionFromCart,
} from "@server/checkout";
import { getCurrentUser } from "@features/auth/action";


export async function createCheckoutFromCart(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || null;

    // Get cart items from formData
    const cartItemsJson = formData.get("cartItems") as string;

    if (!cartItemsJson) {
      throw new Error("No cart items provided");
    }

    const sessionId = await createSessionFromCart(userId, cartItemsJson);

    if (!sessionId) {
      throw new Error("Failed to create checkout session");
    }

    redirect(`/checkout?cs=${sessionId}`);
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).startsWith('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors
    }

    // Redirect to cart with error message
    redirect("/cart?error=checkout_failed");
  }
}

export async function createCheckoutFromBuyNow(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || null;

    const productId = String(formData.get("productId"));
    const variantId = String(formData.get("variantId"));
    const qty = Number(formData.get("qty") ?? 1);

    // Validate input
    if (!productId || !variantId || qty < 1) {
      throw new Error("Invalid product data");
    }

    const sessionId = await createSessionFromBuyNow({
      userId,
      productId,
      variantId,
      qty,
    });

    if (!sessionId) {
      throw new Error("Failed to create checkout session");
    }

    redirect(`/checkout?cs=${sessionId}`);
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).startsWith('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors
    }

    // Redirect back to product with error message
    redirect("/?error=checkout_failed");
  }
}
