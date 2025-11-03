/**
 * Consolidated Pricing Utilities
 * Menggabungkan semua fungsi price formatting dan parsing yang tersebar
 */

// ============= FORMATTING =============

/**
 * Format number to Rupiah currency string
 * @example formatRupiah(150000) => "Rp150.000"
 */
export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// ============= PARSING =============

/**
 * Parse Rupiah string to number
 * @example parseRupiahToNumber("Rp136.900") => 136900
 * @example parseRupiahToNumber("150.000") => 150000
 */
export const parseRupiahToNumber = (v?: string): number => {
  return v ? Number(v.replace(/[^\d]/g, "")) : 0;
};

/**
 * Parse flexible Rupiah formats (handles "150rb", "1jt", "15k", etc)
 * @example parseRupiahFlexible("150rb") => 150000
 * @example parseRupiahFlexible("1jt") => 1000000
 * @example parseRupiahFlexible("Rp 15.000") => 15000
 */
export function parseRupiahFlexible(text?: string): number {
  if (!text) return 0;
  const s = text.replace(/\s+/g, " ").trim().toLowerCase();

  // "rp 150rb" / "rp150.000" / "150rb" / "150.000"
  let m = s.match(/(?:rp)?\s*([\d.]+)\s*(rb|ribu|k|jt|juta)?/i);
  if (m) {
    const base = parseInt(m[1].replace(/\./g, ""), 10) || 0;
    const suf = (m[2] || "").toLowerCase();
    if (suf === "rb" || suf === "ribu" || suf === "k") return base * 1_000;
    if (suf === "jt" || suf === "juta") return base * 1_000_000;
    return base;
  }

  // "25rb" / "1jt" tanpa "rp" di depan
  m = s.match(/(\d+)\s*(rb|ribu|k|jt|juta)/i);
  if (m) {
    const n = parseInt(m[1], 10) || 0;
    const suf = m[2].toLowerCase();
    return suf === "rb" || suf === "ribu" || suf === "k"
      ? n * 1_000
      : n * 1_000_000;
  }
  return 0;
}

/**
 * Alias for parseRupiahToNumber for backward compatibility
 */
export const parsePriceString = parseRupiahToNumber;

// ============= CALCULATIONS =============

/**
 * Calculate discount percentage
 * @example discountPercent(100000, 75000) => 25
 */
export function discountPercent(oldPrice?: number, price?: number): number {
  if (!oldPrice || !price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/**
 * Calculate final price after discount
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number {
  return Math.round(originalPrice * (1 - discountPercent / 100));
}

/**
 * Calculate total price
 */
export function calculateTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}
