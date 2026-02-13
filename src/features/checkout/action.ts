"use server";


import { redirect } from "next/navigation";
import {
  createSessionFromCart,
  createSessionFromBuyNow,
} from "@server/checkout";
import { getCurrentUser } from "@features/auth/action";
import type { CartItem } from "@shared/types/types";


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

    // 1. Parse cart items to create order
    const cartItems = JSON.parse(cartItemsJson) as CartItem[];
    const selectedItems = cartItems.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      throw new Error("No items selected");
    }

    // 2. Prepare order payload
    const items = selectedItems.map((item) => {
      const product = item.product;
      const variants = product.variants;
      const variant = variants.find((v) => v.id === item.variantId);

      return {
        product_id: product.id,
        variant_id: item.variantId,
        quantity: item.qty,
        price: Number(variant?.price) || 0
      };
    });

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 3. Create order in backend FIRST
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

    // Generate idempotency key to prevent duplicate orders
    const idempotencyKey = `order_${user.id}_${Date.now()}`;
    console.log("Creating order with idempotency key:", idempotencyKey);

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify({
        user_id: user.id,
        address_id: "temp", // This will be updated later
        items,
        total_amount: total,
        shipping_cost: 0,
        discount: 0,
        courier: "temp" // This will be updated later
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to create order:", error);
      throw new Error("Failed to create order");
    }

    const orderData = await response.json();
    console.log("✅ Order created server-side:", orderData.order_id);

    // 4. Create checkout session
    const sessionId = await createSessionFromCart(user.id, cartItemsJson);

    if (!sessionId) {
      throw new Error("Failed to create checkout session");
    }

    // 5. Redirect to checkout page with Order ID
    redirect(`/checkout?cs=${sessionId}&oid=${orderData.order_id}`);
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

    // 1. Fetch product details to get price
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

    const productRes = await fetch(`${API_URL}/products/${productId}`);
    if (!productRes.ok) {
      throw new Error("Failed to fetch product details");
    }

    const productData = await productRes.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variant = productData.variants?.find((v: any) => String(v.id) === String(variantId));

    if (!variant) {
      throw new Error("Variant not found");
    }

    const price = Number(variant.price);
    const total = price * qty;

    console.log("💰 Price:", price, "Total:", total);

    // 2. Create order in backend FIRST (same as cart flow)
    const idempotencyKey = `order_${user.id}_${Date.now()}`;
    console.log("Creating order with idempotency key:", idempotencyKey);

    const orderResponse = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify({
        user_id: user.id,
        address_id: "temp", // Will be updated in checkout
        items: [{
          product_id: productId,
          variant_id: variantId,
          quantity: qty,
          price: price
        }],
        total_amount: total,
        shipping_cost: 0,
        discount: 0,
        courier: "temp" // Will be updated in checkout
      })
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error("Failed to create order:", error);
      throw new Error("Failed to create order");
    }

    const orderData = await orderResponse.json();
    console.log("✅ Order created server-side:", orderData.order_id);

    // 3. Create checkout session
    const sessionId = await createSessionFromBuyNow({
      userId: user.id,
      productId,
      variantId,
      qty,
    });

    if (!sessionId) {
      throw new Error("Failed to create checkout session");
    }

    // 4. Redirect to checkout with both session ID and order ID
    redirect(`/checkout?cs=${sessionId}&oid=${orderData.order_id}`);
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
