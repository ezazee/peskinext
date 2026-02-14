// Product Domain Types
// Consolidated from scattered Product type variants

import type { PriceString } from '../primitives/common';

/**
 * Product variant (size, color, etc.)
 */
export interface Variant {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    stock: number;
    weight?: number;
}

/**
 * Base single product
 */
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    ingredients: string[];
    howToUse: string[];
    category: string;
    sku: string;
    price: string;
    oldPrice?: string;
    img: string;
    imgHover: string;
    galleryImages: string[];
    isFlashSale: boolean;
    isEvent: boolean;
    type: 'single' | 'bundle';
    variants: Variant[];
    weightGr: number;
    soldCount?: number;
}

/**
 * Bundle variant (different from single product variant)
 */
export interface BundleVariant {
    id: number;
    name: string;
    price: number;
    oldPrice: number;
    stock: number;
}

/**
 * Bundle product (different structure from single)
 */
export interface BundleProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    img: string;
    imgHover?: string;
    price: PriceString;
    oldPrice?: PriceString;
    isFlashSale?: boolean;
    isEvent?: boolean;
    type: 'bundle';
    weightGr?: number;
    variants?: BundleVariant[];
    galleryImages?: string[];
    sku?: string;
    category?: string;
    ingredients?: string[];
    howToUse?: string[];
}

/**
 * Product with shipping-specific fields
 * Replaces local type in MobileDetail.tsx
 */
export type ProductForShipping = Product & {
    weight: number;
    destinationCity?: string;
};

/**
 * Product with explicit images array
 * Replaces local type in SellerCartCard.tsx
 */
export type ProductWithImages = Product & {
    images: string[];
};

/**
 * Minimal product subset for cart display
 * Replaces local type in CartDesktop.tsx
 */
export type MinimalProduct = Pick<Product, 'id' | 'name' | 'slug' | 'img' | 'price'>;

/**
 * Product snapshot for orders (readonly)
 */
export type OrderProductSnapshot = Pick<
    Product,
    'id' | 'name' | 'slug' | 'img' | 'type' | 'weightGr'
>;
