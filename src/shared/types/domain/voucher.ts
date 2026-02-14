// Voucher Domain Types
// Consolidated from scattered definitions

/**
 * Voucher type classification
 */
export type VoucherType = 'shipping' | 'promo';

/**
 * Voucher eligibility conditions
 */
export interface VoucherConditions {
    minSubtotal?: number;
    minSelectedItems?: number;
    regions?: string[];
    requirePackage?: boolean;
    validFrom?: string;
}

/**
 * Base voucher model
 */
export interface Voucher {
    id: string;
    title: string;
    subtitle?: string;
    type: VoucherType;
    enabled: boolean;
    savingLabel?: string;
    code?: string;
    validTo?: string;
    conditions?: VoucherConditions;
}

/**
 * Extended voucher with evaluated conditions
 * Used in cart/checkout components
 */
export type VoucherWithConditions = Voucher & {
    conditions?: VoucherConditions;
};

/**
 * User's selected vouchers
 */
export interface VoucherSelection {
    code?: string;
    shippingId?: string | null;
    promoId?: string | null;
}

/**
 * Result of voucher redemption attempt
 */
export type RedeemResult =
    | { ok: true; voucher: Voucher }
    | { ok: false; reason: string };

/**
 * Voucher evaluation result
 * Consolidated from:
 * - src/features/cart/desktop/CartDesktop.tsx:76
 * - src/features/cart/lib/voucher.ts:12
 */
export interface EvalResult {
    enabled: boolean;
    reason?: string;
}
