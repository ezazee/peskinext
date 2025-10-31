// src/server/checkout.ts
import "server-only";
import { cookies } from "next/headers";
import { randomUUID as nodeUUID } from "crypto";
import type { CheckoutLine, CheckoutSession } from "@data/index";
import { productsData } from "@data/products";

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
    console.log("=== INITIALIZING NEW CHECKOUT STORE ===");
    global.__checkoutStore = new Map<string, CheckoutSession>();
  }
  console.log("Current store size:", global.__checkoutStore.size);
  return global.__checkoutStore;
};
const store = getStore();

export async function createSessionFromCart(
  userId?: string | null,
  cartItemsJson?: string | null
) {
  console.log("=== SERVER: createSessionFromCart ===");
  console.log("userId:", userId);
  console.log("cartItemsJson length:", cartItemsJson?.length);

  let lines: CheckoutLine[] = [];

  // Parse cart items if provided
  if (cartItemsJson) {
    try {
      console.log("Parsing cart items JSON...");
      const cartItems = JSON.parse(cartItemsJson);
      console.log("Parsed cart items count:", cartItems?.length);
      console.log("First item:", JSON.stringify(cartItems?.[0]));

      // Convert cart items to checkout lines
      lines = cartItems
        .filter((item: Record<string, unknown>) => {
          console.log("Item selected:", item.selected, "productId:", (item.product as Record<string, unknown>)?.id);
          return item.selected;
        }) // Only selected items
        .map((item: Record<string, unknown>) => {
          const product = item.product as Record<string, unknown>;
          const variants = product.variants as Array<Record<string, unknown>>;
          const variant = variants.find((v) => v.id === item.variantId);
          console.log("Mapping item:", product.id, "variant:", variant?.id, variant?.name);
          return {
            productId: String(product.id),
            variantId: String(item.variantId),
            name: `${product.name} - ${variant?.name || ''}`,
            image: String(product.img),
            qty: Number(item.qty),
            price: Number(variant?.price || 0),
          };
        });

      console.log("Mapped lines count:", lines.length);
    } catch (error) {
      console.error("Error parsing cart items:", error);
      throw new Error("Invalid cart data");
    }
  } else {
    console.error("No cartItemsJson provided");
  }

  if (lines.length === 0) {
    console.error("No items in cart after filtering");
    throw new Error("No items in cart");
  }

  console.log("Calculating totals...");
  const { subtotal, discount, shipping, grandTotal } = calc(lines);
  console.log("Totals:", { subtotal, discount, shipping, grandTotal });

  const id = randomId();
  const anon = userId ? null : await getOrSetAnonId();

  const session: CheckoutSession = {
    id,
    source: "cart",
    userId: userId ?? null,
    anonId: anon, // string | null (bukan Promise)
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
  console.log("Storing session with ID:", id);
  console.log("Session object to store:", JSON.stringify(session, null, 2));
  store.set(id, session);
  console.log("Session stored successfully. Store size:", store.size);
  console.log("Store keys after save:", Array.from(store.keys()));

  // Verify it was saved
  const verification = store.get(id);
  console.log("Verification - can retrieve immediately:", !!verification);

  console.log("Session created:", { id, source: session.source, lines: session.lines.length });
  return id;
}

export async function createSessionFromBuyNow(input: {
  userId?: string | null;
  productId: string;
  variantId: string;
  qty: number;
}) {
  console.log("=== SERVER: createSessionFromBuyNow ===");
  console.log("Input:", JSON.stringify(input));

  // Find the product
  console.log("Looking for product:", input.productId);
  console.log("Available products:", productsData.length);
  const product = productsData.find(p => p.id === input.productId);

  if (!product) {
    console.error("ERROR: Product not found:", input.productId);
    console.error("Available product IDs:", productsData.map(p => p.id));
    throw new Error(`Product not found: ${input.productId}`);
  }
  console.log("Found product:", product.name);

  // Find the variant
  console.log("Looking for variant:", input.variantId, "type:", typeof input.variantId);
  console.log("Available variants:", product.variants.map(v => ({ id: v.id, name: v.name })));
  const variant = product.variants.find(v => v.id === Number(input.variantId));

  if (!variant) {
    console.error("ERROR: Variant not found:", input.variantId);
    console.error("Available variant IDs:", product.variants.map(v => v.id));
    throw new Error(`Variant not found: ${input.variantId}`);
  }
  console.log("Found variant:", variant.name, "price:", variant.price);

  const line: CheckoutLine = {
    productId: input.productId,
    variantId: input.variantId,
    name: `${product.name} - ${variant.name}`,
    image: product.img,
    qty: input.qty,
    price: variant.price,
  };
  console.log("Created checkout line:", line);

  const { subtotal, discount, shipping, grandTotal } = calc([line]);
  console.log("Totals:", { subtotal, discount, shipping, grandTotal });

  console.log("Generating session ID...");
  const id = randomId();
  const anon = input.userId ? null : await getOrSetAnonId();
  console.log("Session ID:", id);

  const session: CheckoutSession = {
    id,
    source: "buy_now",
    userId: input.userId ?? null,
    anonId: anon, // string | null (bukan Promise)
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
  console.log("Storing buy now session with ID:", id);
  console.log("Session object to store:", JSON.stringify(session, null, 2));
  store.set(id, session);
  console.log("Buy now session stored. Store size:", store.size);
  console.log("Store keys after save:", Array.from(store.keys()));

  // Verify it was saved
  const verification = store.get(id);
  console.log("Verification - can retrieve immediately:", !!verification);

  console.log("Session created:", { id, source: session.source, lines: session.lines.length });
  return id;
}

export async function getSession(id: string) {
  console.log("=== SERVER: getSession ===");
  console.log("Looking for session ID:", id);
  console.log("Store size:", store.size);
  console.log("Store keys:", Array.from(store.keys()));

  const s = store.get(id);
  if (!s) {
    console.error("ERROR: Session not found:", id);
    throw new Error("Checkout session not found");
  }

  console.log("Session found:", { id: s.id, source: s.source, lines: s.lines.length });
  return s;
}
