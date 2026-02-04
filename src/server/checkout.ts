// src/server/checkout.ts
import "server-only";
import { cookies } from "next/headers";
import { randomUUID as nodeUUID } from "crypto";
import type { CheckoutLine, CheckoutSession } from "@shared/types/types";
// import { productsData } from "@data/products"; // Removed

// -------- helpers & types --------
const randomId = () =>
  (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : nodeUUID());

type SameSiteOpt = "lax" | "strict" | "none";

// minimal readonly jar (punya get)
type ReadonlyCookieJar = {
  get(name: string): { name: string; value: string } | undefined;
};

// writable jar (punya set)
type MutableCookieJar = ReadonlyCookieJar & {
  set(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      sameSite?: SameSiteOpt;
      path?: string;
      secure?: boolean;
      maxAge?: number;
      domain?: string;
      expires?: Date;
    }
  ): void;
};

const fmtNowPlusMinutes = (min = 30) =>
  new Date(Date.now() + min * 60_000).toISOString();

// cookies(): Next 14 sync, Next 15 async → normalisasi; tetap tanpa any
async function getOrSetAnonId(): Promise<string> {
  const jar = await cookies(); // di Next 15 ini Promise<ReadonlyRequestCookies>
  const ro = jar as ReadonlyCookieJar;

  const key = "anonId";
  const existing = ro.get(key)?.value;
  if (existing) return existing;

  const id = randomId();

  // hanya set jika environment menyediakan API set (Server Action / Route Handler)
  const rw = jar as unknown as MutableCookieJar;
  if (typeof rw.set === "function") {
    rw.set(key, id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return id;
}

// kalkulasi dummy
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calc(lines: CheckoutLine[], _voucherCodes: string[] = []) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const discount = 0;
  const shipping = 0;
  const grandTotal = Math.max(0, subtotal - discount + shipping);
  return { subtotal, discount, shipping, grandTotal };
}

// -------- API --------
// Global store untuk session checkout
// Using globalThis to persist across hot reloads in dev
declare global {
  var __checkoutStore: Map<string, CheckoutSession> | undefined;
}

const getStore = () => {
  if (!global.__checkoutStore) {
    global.__checkoutStore = new Map<string, CheckoutSession>();
  }
  return global.__checkoutStore;
};
const store = getStore();

export async function createSessionFromCart(
  userId?: string | null,
  cartItemsJson?: string | null
) {
  let lines: CheckoutLine[] = [];

  // Parse cart items if provided
  if (cartItemsJson) {
    try {
      const cartItems = JSON.parse(cartItemsJson);

      // Convert cart items to checkout lines
      lines = cartItems
        .filter((item: Record<string, unknown>) => item.selected) // Only selected items
        .map((item: Record<string, unknown>) => {
          const product = item.product as Record<string, unknown>;
          const variants = product.variants as Array<Record<string, unknown>>;
          const variant = variants.find((v) => v.id === item.variantId);
          return {
            productId: String(product.id),
            variantId: String(item.variantId),
            name: `${product.name} - ${variant?.name || ''}`,
            image: String(product.img),
            qty: Number(item.qty),
            price: Number(variant?.price || 0),
          };
        });
    } catch (error) {
      console.error(error);
      throw new Error("Invalid cart data");
    }
  }

  if (lines.length === 0) {
    throw new Error("No items in cart");
  }

  const { subtotal, discount, shipping, grandTotal } = calc(lines);

  const id = randomId();
  const anon = userId ? null : await getOrSetAnonId();

  const session: CheckoutSession = {
    id,
    source: "cart",
    userId: userId ?? null,
    anonId: anon,
    currency: "IDR",
    lines,
    vouchers: [],
    subtotal,
    discount,
    shipping,
    grandTotal,
    createdAt: new Date().toISOString(),
    expiresAt: fmtNowPlusMinutes(30),
  };

  store.set(id, session);
  return id;
}

export async function createSessionFromBuyNow(input: {
  userId?: string | null;
  productId: string;
  variantId: string;
  qty: number;
}) {
  // Fetch product from Backend API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";
  const res = await fetch(`${API_URL}/products/${input.productId}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Product not found: ${input.productId}`);
  }

  const product = await res.json();

  if (!product) {
    throw new Error(`Product not found: ${input.productId}`);
  }

  // Find the variant
  // Note: Backend might return variants in a specific structure. Adjust if needed.
  // Assuming strict structure mapping from frontend types.
  const variant = product.variants?.find((v: Record<string, unknown>) => String(v.id) === String(input.variantId));

  if (!variant) {
    throw new Error(`Variant not found: ${input.variantId}`);
  }

  const line: CheckoutLine = {
    productId: input.productId,
    variantId: input.variantId,
    name: `${product.name} - ${variant.name}`,
    image: product.img,
    qty: input.qty,
    price: variant.price,
  };

  const { subtotal, discount, shipping, grandTotal } = calc([line]);

  const id = randomId();
  const anon = input.userId ? null : await getOrSetAnonId();

  const session: CheckoutSession = {
    id,
    source: "buy_now",
    userId: input.userId ?? null,
    anonId: anon,
    currency: "IDR",
    lines: [line],
    vouchers: [],
    subtotal,
    discount,
    shipping,
    grandTotal,
    createdAt: new Date().toISOString(),
    expiresAt: fmtNowPlusMinutes(30),
  };

  store.set(id, session);
  return id;
}

export async function getSession(id: string) {
  const s = store.get(id);
  if (!s) {
    throw new Error("Checkout session not found");
  }

  return s;
}
