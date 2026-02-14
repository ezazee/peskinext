// Checkout Domain Types

/**
 * Where the checkout session originated from
 */
export type CheckoutSource = 'cart' | 'buy_now';

/**
 * Individual line item in checkout
 */
export interface CheckoutLine {
    productId: string;
    variantId: string;
    name: string;
    image: string;
    qty: number;
    price: number; // snapshot per unit
    weight?: number; // gram
}

/**
 * Complete checkout session
 */
export interface CheckoutSession {
    id: string;
    orderId?: string; // Backend order ID created when session is created
    source: CheckoutSource;
    userId?: string | null;
    anonId?: string | null;
    currency: 'IDR';
    lines: CheckoutLine[];
    vouchers: string[];
    subtotal: number;
    discount: number;
    shipping: number;
    grandTotal: number;
    createdAt: string;
    expiresAt: string; // Session expiry
    orderExpiresAt?: string; // Order expiry (for payment timer)
}
