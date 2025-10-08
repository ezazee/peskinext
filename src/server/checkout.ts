// src/server/checkout.ts
import "server-only";
import { cookies } from "next/headers";
import { randomUUID as nodeUUID } from "crypto";
import type { CheckoutLine, CheckoutSession } from "@data/index";

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
const store = new Map<string, CheckoutSession>();

export async function createSessionFromCart(userId?: string | null) {
  const lines: CheckoutLine[] = [
    { productId: "p1", variantId: "v1", name: "Sample Product", image: "/img.png", qty: 1, price: 27000 },
  ];
  const { subtotal, discount, shipping, grandTotal } = calc(lines);

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
  store.set(id, session);
  return id;
}

export async function createSessionFromBuyNow(input: {
  userId?: string | null;
  productId: string;
  variantId: string;
  qty: number;
}) {
  const line: CheckoutLine = {
    productId: input.productId,
    variantId: input.variantId,
    name: "Nama Produk (snapshot)",
    image: "/img.png",
    qty: input.qty,
    price: 27000,
  };
  const { subtotal, discount, shipping, grandTotal } = calc([line]);

  const id = randomId();
  const anon = input.userId ? null : await getOrSetAnonId();

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
  store.set(id, session);
  return id;
}

export async function getSession(id: string) {
  const s = store.get(id);
  if (!s) throw new Error("Checkout session not found");
  return s;
}
