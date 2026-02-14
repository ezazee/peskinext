// Transaction Domain Types

import type { OrderProductSnapshot } from './product';

/**
 * Order/transaction status
 */
export type TransactionStatus =
    | 'pending'
    | 'paid'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

/**
 * Individual item in an order
 */
export interface OrderItem {
    product: OrderProductSnapshot;
    variantId?: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    variant?: {
        id: number;
        variant_name: string;
        price?: number;
    } | null;
    review?: {
        id: number;
        rating: number;
        comment: string;
        images: string[];
        created_at: string;
    };
}

/**
 * Complete user transaction/order
 */
export interface UserTransaction {
    id: string;
    invoiceNumber?: string;
    dateISO: string;
    status: TransactionStatus;
    items: OrderItem[];
    total: number;
    addressId?: string;
    courier?: string;
    trackingNumber?: string;
    shippingCost?: number;
    originalShippingCost?: number; // Base shipping cost before discount
    discount?: number;
    shippingAddress?: {
        recipient: string;
        phone: string;
        addressLine: string;
        city: string;
        province: string;
        postalCode: string;
    };
    expiresAt?: string;
}
