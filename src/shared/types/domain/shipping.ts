// Shipping Domain Types

/**
 * Individual shipping option (courier + service)
 */
export interface ShippingOption {
    id: string;
    courier: string;
    service: string;
    eta: string;
    price: number;
    badges?: string[];
}

/**
 * Grouped shipping options (by courier)
 */
export interface ShippingGroup {
    label: string;
    items: ShippingOption[];
}

/**
 * Complete shipping calculation data
 */
export interface ShippingDetailData {
    origin: string;
    destination: string;
    weightGr: number;
    note?: string;
    groups: ShippingGroup[];
}

/**
 * Shipping info for completed order
 */
export interface ShippingOrder {
    courier?: string;
    service?: string;
    trackingNumber?: string;
    eta?: string;
    shippedAt?: string;
    deliveredAt?: string;
}
