/**
 * Consolidated Product Utilities
 * Menggabungkan semua fungsi product-related yang tersebar
 */

import { parseRupiahToNumber } from "./pricing";

// Type definitions (pastikan sesuai dengan types di project)
type Variant = {
  id?: string | number;
  name?: string;
  price?: number | string;
  oldPrice?: number | string;
  stock?: number;
  img?: string;
};

type Product = {
  id?: string | number;
  name?: string;
  price?: number | string;
  oldPrice?: number | string;
  stock?: number;
  img?: string;
  images?: string[] | ReadonlyArray<string>;
};

// ============= PRICE RESOLUTION =============

/**
 * Get price from product or variant
 * Prioritizes variant price, falls back to product price
 * Handles both number and string price formats
 */
export function getProductPrice(product: Product, variant?: Variant): number {
  // Prioritize variant price
  if (variant?.price !== undefined) {
    return typeof variant.price === "number"
      ? variant.price
      : parseRupiahToNumber(String(variant.price));
  }

  // Fallback to product price
  return typeof product.price === "number"
    ? product.price
    : parseRupiahToNumber(String(product.price || "0"));
}

/**
 * Alias for backward compatibility
 */
export const priceFrom = getProductPrice;

/**
 * Get old price (before discount) from product or variant
 */
export function getProductOldPrice(
  product: Product,
  variant?: Variant
): number | undefined {
  const oldPrice = variant?.oldPrice ?? product.oldPrice;
  if (!oldPrice) return undefined;

  return typeof oldPrice === "number"
    ? oldPrice
    : parseRupiahToNumber(String(oldPrice));
}

/**
 * Resolve complete pricing info (unit price, old price, stock)
 */
export function resolveProductPricing(product: Product, variant?: Variant) {
  const unit = getProductPrice(product, variant);
  const old = getProductOldPrice(product, variant);
  const stock = typeof variant?.stock === "number" ? variant.stock : 999;

  return { unit, old, stock };
}

// ============= IMAGE RESOLUTION =============

/**
 * Get image from product or variant
 * Prioritizes variant image, falls back to product image or first image in array
 */
export function getProductImage(
  product: Product,
  variant?: Variant
): string | undefined {
  return (
    variant?.img ??
    product.img ??
    (Array.isArray(product.images) ? product.images[0] : undefined)
  );
}

/**
 * Alias for backward compatibility
 */
export const pickImage = getProductImage;

/**
 * Get all product images
 */
export function getProductImages(product: Product): string[] {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }
  if (product.img) {
    return [product.img];
  }
  return [];
}

// ============= STOCK RESOLUTION =============

/**
 * Get stock from product or variant
 */
export function getProductStock(product: Product, variant?: Variant): number {
  return typeof variant?.stock === "number" ? variant.stock : product.stock ?? 999;
}

/**
 * Check if product/variant is in stock
 */
export function isProductInStock(
  product: Product,
  variant?: Variant
): boolean {
  const stock = getProductStock(product, variant);
  return stock > 0;
}

/**
 * Check if requested quantity is available
 */
export function isQuantityAvailable(
  product: Product,
  quantity: number,
  variant?: Variant
): boolean {
  const stock = getProductStock(product, variant);
  return stock >= quantity;
}
