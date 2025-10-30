"use server";

import { redirect } from "next/navigation";
import {
  createSessionFromBuyNow,
  createSessionFromCart,
} from "@server/checkout";


export async function createCheckoutFromCart() {
  try {
    const sessionId = await createSessionFromCart(null); // pasang userId jika sudah ada auth

    if (!sessionId) {
      throw new Error("Failed to create checkout session");
    }

    redirect(`/checkout?cs=${sessionId}`);
  } catch (error) {
    console.error("Error creating checkout from cart:", error);
    // Redirect to cart with error message
    redirect("/cart?error=checkout_failed");
  }
}

export async function createCheckoutFromBuyNow(formData: FormData) {
  try {
    const productId = String(formData.get("productId"));
    const variantId = String(formData.get("variantId"));
    const qty = Number(formData.get("qty") ?? 1);

    // Validate input
    if (!productId || !variantId || qty < 1) {
      throw new Error("Invalid product data");
    }

    const sessionId = await createSessionFromBuyNow({
      userId: null, // pasang userId jika sudah login
      productId,
      variantId,
      qty,
    });

    if (!sessionId) {
      throw new Error("Failed to create checkout session");
    }

    redirect(`/checkout?cs=${sessionId}`);
  } catch (error) {
    console.error("Error creating checkout from buy now:", error);
    // Redirect back to product with error message
    redirect("/?error=checkout_failed");
  }
}
