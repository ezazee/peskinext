import type { Product } from "@shared/types/types";

export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
}

/**
 * Search products by query
 * Searches in: name, description, category, ingredients
 */
// Handle potential /api/v1 suffix in env var
const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawUrl.endsWith("/api/v1") ? rawUrl.slice(0, -"/api/v1".length) : rawUrl;

/**
 * Search products by query
 * Searches in: name, description, category, ingredients
 */
export async function searchProducts(query: string): Promise<SearchResult> {
  const normalizedQuery = query.toLowerCase().trim();

  if (!query || normalizedQuery.length === 0) {
    return {
      products: [],
      total: 0,
      query: "",
    };
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/products?search=${encodeURIComponent(normalizedQuery)}`);
    if (!res.ok) throw new Error("Search failed");

    const data = await res.json();
    // Backend returns flat array of products (formatted)
    const products: Product[] = Array.isArray(data) ? data : data.data || [];

    return {
      products,
      total: products.length,
      query: normalizedQuery,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      products: [],
      total: 0,
      query: normalizedQuery,
    };
  }
}

/**
 * Get popular search keywords
 */
export function getPopularSearches(): string[] {
  return [
    "toner",
    "sunscreen",
    "moisturizer",
    "serum",
    "cleanser",
    "vitamin c",
    "niacinamide",
    "retinol",
    "hyaluronic acid",
    "spf",
  ];
}

/**
 * Get search suggestions based on query
 */

