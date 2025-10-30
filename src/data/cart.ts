import type { CartData, Product, Variant } from "@shared/types/types";
import { productsData } from "@data/products";

function bySlug(slug: string): Product {
  const p = productsData.find((x) => x.slug === slug);
  if (!p) throw new Error(`Product not found for slug: ${slug}`);
  return p;
}

function getVariantIdBySlug(slug: string, index = 0): Variant["id"] {
  const product = bySlug(slug);
  const v = product.variants?.[index];
  if (!v) {
    throw new Error(
      `Variant index ${index} not found for product slug: ${slug}`
    );
  }
  return v.id;
}

export const cartMock: CartData = {
  items: [
    {
      id: "line-1",
      product: bySlug("paket-acne-defense-pad-toner"),
      variantId: getVariantIdBySlug("paket-acne-defense-pad-toner", 0),
      qty: 1,
      selected: true,
    },
    {
      id: "line-2",
      product: bySlug("paket-brightening-power-serum-toner-daycream"),
      variantId: getVariantIdBySlug(
        "paket-brightening-power-serum-toner-daycream",
        1
      ),
      qty: 1,
      selected: true,
    },
  ],
};
