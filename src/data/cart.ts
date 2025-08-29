import type { CartData, Product } from "@shared/types/types";
import { productsData } from "@data/products"; // sesuaikan alias/path: "src/data/products"

function bySlug(slug: string): Product {
  const p = productsData.find((x) => x.slug === slug);
  if (!p) throw new Error(`Product not found for slug: ${slug}`);
  return p;
}

export const cartMock: CartData = {
  items: [
    {
      id: "line-1",
      product: bySlug("paket-acne-defense-pad-toner"),
      variantId: bySlug("paket-acne-defense-pad-toner").variants[0].id,
      qty: 1,
      selected: true,
    },
    {
      id: "line-2",
      product: bySlug("paket-brightening-power-serum-toner-daycream"),
      variantId: bySlug("paket-brightening-power-serum-toner-daycream")
        .variants[1].id,
      qty: 1,
      selected: true,
    },
  ],
};
