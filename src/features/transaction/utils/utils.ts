import type { OrderItem } from "@shared/types/types";
// import { productsData } from "@data/products"; // sesuaikan path data produkmu

export function resolveVariantName(item: OrderItem): string {
  const variantId = item.variantId;
  if (typeof variantId !== "number") return "Default";
  return `Var #${variantId}`;
}

/** Harga per unit untuk ditampilkan. Sekarang cukup baca dari OrderItem. */
export function resolveUnitPrice(item: OrderItem): number {
  return item.unitPrice;
}
