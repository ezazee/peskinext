"use server";


import { redirect } from "next/navigation";
import {
  createSessionFromCart,
  createSessionFromBuyNow,
} from "@server/checkout";
import { getCurrentUser } from "@features/auth/action";


/**
 * Checkout from Cart — hanya buat SESSION, BUKAN order.
 * Order baru dibuat di halaman checkout saat user klik "Bayar Sekarang"
 * setelah memilih alamat dan kurir.
 * 
 * Ini mencegah "Zombie Orders" (order pending tanpa alamat/kurir yang 
 * menumpuk di database dari user yang batal checkout).
 */
export async function createCheckoutFromCart(formData: FormData) {
  console.log("🔵 createCheckoutFromCart called at:", new Date().toISOString());

  try {
    const user = await getCurrentUser();
    if (!user) {
      redirect("/login?callbackUrl=/cart");
    }

    const cartItemsJson = formData.get("cartItems") as string;
    if (!cartItemsJson) {
      throw new Error("No cart items provided");
    }

    console.log("👤 User ID:", user.id);
    console.log("🛒 Cart items:", cartItemsJson.substring(0, 100) + "...");

    // Hanya buat checkout session — order dibuat nanti di halaman checkout
    const sessionId = await createSessionFromCart(user.id, cartItemsJson);

    if (!sessionId) {
      throw new Error("Failed to create checkout session");
    }

    console.log("✅ Checkout session created:", sessionId);

    // Redirect ke checkout TANPA oid — order belum ada
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

/**
 * Checkout from Buy Now — hanya buat SESSION, BUKAN order.
 * Sama seperti createCheckoutFromCart, order dibuat nanti saat klik "Bayar Sekarang".
 */
export async function createCheckoutFromBuyNow(formData: FormData) {
  console.log("🔵 createCheckoutFromBuyNow called at:", new Date().toISOString());

  try {
    const user = await getCurrentUser();
    if (!user) {
      redirect("/login?callbackUrl=/");
    }

    const productId = String(formData.get("productId"));
    const variantId = String(formData.get("variantId"));
    const qty = Number(formData.get("qty") ?? 1);

    // Validate input
    if (!productId || !variantId || qty < 1) {
      throw new Error("Invalid product data");
    }

    console.log("👤 User ID:", user.id);
    console.log("📦 Product:", productId, "Variant:", variantId, "Qty:", qty);

    // Hanya buat checkout session — order dibuat nanti di halaman checkout
    const sessionId = await createSessionFromBuyNow({
      userId: user.id,
      productId,
      variantId,
      qty,
    });

    if (!sessionId) {
      throw new Error("Failed to create checkout session");
    }

    console.log("✅ Checkout session created:", sessionId);

    // Redirect ke checkout TANPA oid — order belum ada
    redirect(`/checkout?cs=${sessionId}`);
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).startsWith('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors
    }

    console.error("Error in createCheckoutFromBuyNow:", error);
    // Redirect back to product with error message
    redirect("/?error=checkout_failed");
  }
}
