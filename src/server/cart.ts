"use server";

import type { CartItem } from "@shared/types/types";
import { resolveProductPricing } from "@shared/helpers/product";

export async function calculateCartAction(items: CartItem[]) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let subtotal = 0;
    let compare = 0;

    for (const line of items) {
        if (!line.selected) continue;

        // In a real app, you would fetch the product/variant from DB here to ensure price validity
        // For now, we use the passed product data but calculate totals on server

        // Fallback: if variant not found in product.variants (shouldn't happen if sync), defaults might apply
        const variant = line.product.variants.find((v) => v.id === line.variantId);

        const { unit, old } = resolveProductPricing(line.product, variant);

        subtotal += unit * line.qty;
        compare += (old ?? unit) * line.qty;
    }

    const savings = Math.max(0, compare - subtotal);

    return {
        subtotal,
        compare,
        savings,
    };
}
