// Safe Parser Utilities
// Runtime-safe parsing with null guards

/**
 * Safely parse Indonesian price strings
 * 
 * Examples:
 * - "Rp 50.000" → 50000
 * - "50rb" → 50000
 * - "1jt" → 1000000
 * - "25.5ribu" → 25500
 * 
 * @param input - Price string in various formats
 * @returns Parsed number or 0 if invalid
 */
export function parsePrice(input: string | null | undefined): number {
    if (!input) return 0;

    const cleaned = input.toLowerCase().replace(/[^\d.,a-z]/g, '');
    const match = cleaned.match(/(\d+(?:[.,]\d+)?)(rb|ribu|k|jt|juta)?/);

    if (!match || !match[1]) return 0;

    const base = parseFloat(match[1].replace(',', '.'));
    const multiplier = match[2];

    if (multiplier === 'rb' || multiplier === 'ribu' || multiplier === 'k') {
        return Math.round(base * 1000);
    }
    if (multiplier === 'jt' || multiplier === 'juta') {
        return Math.round(base * 1000000);
    }

    return Math.round(base);
}

/**
 * Safely parse percentage strings
 * 
 * Examples:
 * - "25%" → 25
 * - "10 persen" → 10
 * - "100%" → 100
 * 
 * @param input - Percentage string
 * @returns Parsed percentage (0-100) or 0 if invalid
 */
export function parsePercent(input: string | null | undefined): number {
    if (!input) return 0;

    const match = input.match(/(\d{1,3})\s*%/);
    const value = match?.[1] ? parseInt(match[1], 10) : 0;

    // Clamp to 0-100
    return Math.min(100, Math.max(0, value));
}

/**
 * Safely parse weight strings
 * 
 * Examples:
 * - "250g" → 250
 * - "1.5kg" → 1500
 * - "500 gram" → 500
 * 
 * @param input - Weight string
 * @returns Weight in grams or 0 if invalid
 */
export function parseWeight(input: string | null | undefined): number {
    if (!input) return 0;

    const match = input.toLowerCase().match(/(\d+(?:[.,]\d+)?)\s*(g|gram|kg|kilogram)?/);

    if (!match || !match[1]) return 0;

    const value = parseFloat(match[1].replace(',', '.'));
    const unit = match[2];

    // Convert to grams
    if (unit === 'kg' || unit === 'kilogram') {
        return Math.round(value * 1000);
    }

    return Math.round(value);
}

/**
 * Safely extract number from string
 * 
 * Examples:
 * - "Total: 150000" → 150000
 * - "Qty 5 pcs" → 5
 * 
 * @param input - String containing number
 * @returns First number found or 0
 */
export function extractNumber(input: string | null | undefined): number {
    if (!input) return 0;

    const match = input.match(/(\d+(?:[.,]\d+)?)/);
    if (!match || !match[1]) return 0;

    return parseFloat(match[1].replace(',', '.'));
}

/**
 * Format number to Indonesian Rupiah
 * 
 * @param value - Number to format
 * @param showCurrency - Include "Rp" prefix
 * @returns Formatted string (e.g., "Rp 50.000")
 */
export function formatRupiah(value: number, showCurrency = true): string {
    const formatted = Math.round(value).toLocaleString('id-ID');
    return showCurrency ? `Rp ${formatted}` : formatted;
}

/**
 * Format  weight to display string
 * 
 * @param grams - Weight in grams
 * @returns Formatted string (e.g., "1.5 kg" or "250 g")
 */
export function formatWeight(grams: number): string {
    if (grams >= 1000) {
        return `${(grams / 1000).toFixed(grams % 1000 === 0 ? 0 : 1)} kg`;
    }
    return `${grams} g`;
}
