// Cart Domain Types
// Consolidated from scattered definitions across codebase

import type { Product, Variant } from './product';

/**
 * Individual item in shopping cart
 */
export interface CartItem {
    id: string;
    product: Product;
    variantId: Variant['id'];
    qty: number;
    selected: boolean;
}

/**
 * Shopping cart data structure
 */
export interface CartData {
    items: CartItem[];
}

/**
 * Cart context for voucher evaluation and calculations
 * Consolidated from:
 * - src/features/cart/desktop/CartDesktop.tsx:69
 * - src/features/cart/utils/redeemWithFallback.ts:38
 * -src/features/cart/api/voucher.ts:3 (CartCtxDTO)
 */
export interface CartContext {
    subtotal: number;
    itemCount: number;
    selectedCount: number;
    discount: number;
}

/**
 * Alias for API layer - same as CartContext
 */
export type CartContextDTO = CartContext;
