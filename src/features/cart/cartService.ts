"use client";

import type { CartItem, Product } from "@shared/types/types";

const CART_STORAGE_KEY = "pe_skinpro_cart";

/**
 * Cart Service for managing cart items in localStorage
 * This is a dummy implementation for development/testing
 */

export interface CartData {
  items: CartItem[];
}

/**
 * Get cart from localStorage
 */
export function getCart(): CartData {
  if (typeof window === "undefined") {
    return { items: [] };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading cart:", error);
  }

  return { items: [] };
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: CartData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch event for other components to listen
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

/**
 * Add item to cart
 */
export function addToCart(
  product: Product,
  variantId: number,
  qty: number = 1
): { success: boolean; message: string } {
  const cart = getCart();

  // Check if item already exists
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.id === product.id && item.variantId === variantId
  );

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) {
    return {
      success: false,
      message: "Varian tidak ditemukan",
    };
  }

  if (existingItemIndex >= 0) {
    // Update quantity
    const existingItem = cart.items[existingItemIndex];
    if (!existingItem) {
      return {
        success: false,
        message: "Item tidak ditemukan",
      };
    }

    const newQty = existingItem.qty + qty;

    // Check stock
    if (newQty > variant.stock) {
      return {
        success: false,
        message: `Stok tidak mencukupi. Tersedia ${variant.stock} item`,
      };
    }

    cart.items[existingItemIndex] = {
      ...existingItem,
      qty: newQty,
    };
  } else {
    // Check stock for new item
    if (qty > variant.stock) {
      return {
        success: false,
        message: `Stok tidak mencukupi. Tersedia ${variant.stock} item`,
      };
    }

    // Add new item
    const newItem: CartItem = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      product,
      variantId,
      qty,
      selected: true,
    };

    cart.items.push(newItem);
  }

  saveCart(cart);

  return {
    success: true,
    message: "Produk berhasil ditambahkan ke keranjang",
  };
}

/**
 * Remove item from cart
 */
export function removeFromCart(lineId: string): void {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.id !== lineId);
  saveCart(cart);
}

/**
 * Update item quantity
 */
export function updateCartItemQty(lineId: string, qty: number): void {
  const cart = getCart();
  const itemIndex = cart.items.findIndex((item) => item.id === lineId);

  if (itemIndex >= 0) {
    const item = cart.items[itemIndex];
    if (!item) return;

    const variant = item.product.variants.find((v) => v.id === item.variantId);

    if (variant) {
      const clampedQty = Math.min(Math.max(1, qty), variant.stock);
      cart.items[itemIndex] = {
        ...item,
        qty: clampedQty,
      };
      saveCart(cart);
    }
  }
}

/**
 * Toggle item selection
 */
export function toggleCartItemSelection(lineId: string): void {
  const cart = getCart();
  const itemIndex = cart.items.findIndex((item) => item.id === lineId);

  if (itemIndex >= 0) {
    const item = cart.items[itemIndex];
    if (!item) return;

    cart.items[itemIndex] = {
      ...item,
      selected: !item.selected,
    };
    saveCart(cart);
  }
}

/**
 * Clear cart
 */
export function clearCart(): void {
  saveCart({ items: [] });
}

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.items.reduce((total, item) => total + item.qty, 0);
}

/**
 * Get selected items count
 */
export function getSelectedItemsCount(): number {
  const cart = getCart();
  return cart.items.filter((item) => item.selected).length;
}
