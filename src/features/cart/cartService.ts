"use client";

import type { CartItem, Product } from "@shared/types/types";

const CART_STORAGE_KEY_PREFIX = "pe_skinpro_cart";

/**
 * Cart Service for managing cart items in localStorage
 * Each user has their own cart stored separately
 */

export interface CartData {
  items: CartItem[];
}

/**
 * Get storage key for a specific user (or guest)
 */
function getCartStorageKey(userId?: string | null): string {
  if (userId) {
    return `${CART_STORAGE_KEY_PREFIX}_${userId}`;
  }
  return `${CART_STORAGE_KEY_PREFIX}_guest`;
}

/**
 * Get current user ID from session storage (set by auth)
 */
function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem("current_user_id");
  } catch {
    return null;
  }
}

/**
 * Set current user ID to session storage
 */
export function setCurrentUserId(userId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (userId) {
      sessionStorage.setItem("current_user_id", userId);
    } else {
      sessionStorage.removeItem("current_user_id");
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Get cart from localStorage for specific user
 */
export function getCart(userId?: string | null): CartData {
  if (typeof window === "undefined") {
    return { items: [] };
  }

  // Use provided userId or get from session
  const effectiveUserId = userId ?? getCurrentUserId();
  const storageKey = getCartStorageKey(effectiveUserId);

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(error);
  }

  return { items: [] };
}

/**
 * Save cart to localStorage for specific user
 */
export function saveCart(cart: CartData, userId?: string | null): void {
  if (typeof window === "undefined") return;

  // Use provided userId or get from session
  const effectiveUserId = userId ?? getCurrentUserId();
  const storageKey = getCartStorageKey(effectiveUserId);

  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    // Dispatch event for other components to listen
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error(error);
  }
}

/**
 * Add item to cart
 */
export function addToCart(
  product: Product,
  variantId: number,
  qty: number = 1,
  userId?: string | null
): { success: boolean; message: string } {
  const cart = getCart(userId);

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

  saveCart(cart, userId);

  return {
    success: true,
    message: "Produk berhasil ditambahkan ke keranjang",
  };
}

/**
 * Remove item from cart
 */
export function removeFromCart(lineId: string, userId?: string | null): void {
  const cart = getCart(userId);
  cart.items = cart.items.filter((item) => item.id !== lineId);
  saveCart(cart, userId);
}

/**
 * Update item quantity
 */
export function updateCartItemQty(lineId: string, qty: number, userId?: string | null): void {
  const cart = getCart(userId);
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
      saveCart(cart, userId);
    }
  }
}

/**
 * Toggle item selection
 */
export function toggleCartItemSelection(lineId: string, userId?: string | null): void {
  const cart = getCart(userId);
  const itemIndex = cart.items.findIndex((item) => item.id === lineId);

  if (itemIndex >= 0) {
    const item = cart.items[itemIndex];
    if (!item) return;

    cart.items[itemIndex] = {
      ...item,
      selected: !item.selected,
    };
    saveCart(cart, userId);
  }
}

/**
 * Clear cart
 */
export function clearCart(userId?: string | null): void {
  saveCart({ items: [] }, userId);
}

/**
 * Get cart item count
 */
export function getCartItemCount(userId?: string | null): number {
  const cart = getCart(userId);
  return cart.items.reduce((total, item) => total + item.qty, 0);
}

/**
 * Get selected items count
 */
export function getSelectedItemsCount(userId?: string | null): number {
  const cart = getCart(userId);
  return cart.items.filter((item) => item.selected).length;
}

/**
 * Remove selected items from cart (used when entering checkout)
 */
export function removeSelectedItems(userId?: string | null): void {
  const cart = getCart(userId);
  console.log("🔍 removeSelectedItems called");
  console.log("Cart before removal:", cart);
  console.log("Selected items count:", cart.items.filter(i => i.selected).length);

  cart.items = cart.items.filter((item) => !item.selected);

  console.log("Cart after removal:", cart);
  console.log("Remaining items count:", cart.items.length);

  saveCart(cart, userId);
  console.log("✅ Cart saved to localStorage");
}
