// Address Entity Types

/**
 * Complete address entity
 */
export interface AddressItem {
    id: string;
    label: string;
    recipient: string;
    phone: string;
    line1: string;
    city: string;
    district: string;
    province: string;
    postalCode: string;
    isPrimary: boolean;
}

/**
 * Simplified address for list displays
 */
export interface AddressListEntry {
    id: string;
    label: string;
    address: string; // single-line for list in modal/header
    isPrimary: boolean;
}
