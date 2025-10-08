import type { OrderItem, Product, Variant } from "@data/index";
import { productsData } from "@data/products"; // sesuaikan path data produkmu

export function resolveVariantName(item: OrderItem): string {
  const variantId = item.variantId;
  if (typeof variantId !== "number") return "Default";

  // cari product master by slug atau id
  const master: Product | undefined =
    productsData.find((p) => p.slug === item.product.slug) ??
    productsData.find((p) => p.id === item.product.id);

  if (!master || !Array.isArray(master.variants)) {
    return `Var #${variantId}`;
  }
  const v: Variant | undefined = master.variants.find(
    (x) => x.id === variantId
  );
  return v ? v.name : `Var #${variantId}`;
}

/** Harga per unit untuk ditampilkan. Sekarang cukup baca dari OrderItem. */
export function resolveUnitPrice(item: OrderItem): number {
  return item.unitPrice;
}
