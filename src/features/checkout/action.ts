"use server";

import { redirect } from "next/navigation";
import {
  createSessionFromBuyNow,
  createSessionFromCart,
} from "@server/checkout";


export async function createCheckoutFromCart() {
  const sessionId = await createSessionFromCart(null); // pasang userId jika sudah ada auth
  redirect(`/checkout?cs=${sessionId}`);
}

export async function createCheckoutFromBuyNow(formData: FormData) {
  const productId = String(formData.get("productId"));
  const variantId = String(formData.get("variantId"));
  const qty = Number(formData.get("qty") ?? 1);

  const sessionId = await createSessionFromBuyNow({
    userId: null, // pasang userId jika sudah login
    productId,
    variantId,
    qty,
  });

  redirect(`/checkout?cs=${sessionId}`);
}
