// import { productsData } from "@data/products";
const productsData: Product[] = [];
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
export function searchProducts(query: string): SearchResult {
  if (!query || query.trim().length === 0) {
    return {
      products: productsData,
      total: productsData.length,
      query: "",
    };
  }

  const normalizedQuery = query.toLowerCase().trim();

  const results = productsData.filter((product) => {
    // Search in product name
    if (product.name.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in description
    if (product.description.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in category
    if (product.category?.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in ingredients
    if (
      product.ingredients?.some((ingredient) =>
        ingredient.toLowerCase().includes(normalizedQuery)
      )
    ) {
      return true;
    }

    // Search in SKU
    if (product.sku?.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    return false;
  });

  return {
    products: results,
    total: results.length,
    query: normalizedQuery,
  };
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
export function getSearchSuggestions(query: string): string[] {
  if (!query || query.trim().length === 0) {
    return getPopularSearches().slice(0, 5);
  }

  const normalizedQuery = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  // Add product names that match
  productsData.forEach((product) => {
    if (product.name.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.name);
    }
  });

  // Add categories that match
  productsData.forEach((product) => {
    if (
      product.category &&
      product.category.toLowerCase().includes(normalizedQuery)
    ) {
      suggestions.add(product.category);
    }
  });

  // Add ingredients that match
  productsData.forEach((product) => {
    product.ingredients?.forEach((ingredient) => {
      if (ingredient.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(ingredient);
      }
    });
  });

  return Array.from(suggestions).slice(0, 10);
}
