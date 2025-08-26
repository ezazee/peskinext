"use client";
import { productsData } from "@data/products";
import type { Product } from "@shared/types/types";

export async function fetchProductBySlug(
  slug: string,
  { delay = 800 }: { delay?: number } = {}
): Promise<Product> {
  // simulasi latency
  await new Promise((r) => setTimeout(r, delay));
  const p = productsData.find((x) => x.slug === slug);
  if (!p) throw new Error("Produk tidak ditemukan");
  return p;
}
