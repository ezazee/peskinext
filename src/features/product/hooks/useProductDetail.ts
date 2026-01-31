"use client";
import { useEffect, useState } from "react";
import type { Product } from "@shared/types/types";
// import { getProductBySlug } from "../services/productService"; // Removed unused import

export function useProductDetail(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    // Fetch from internal proxy to avoid CORS/Mixed Content issues
    fetch(`/api/products/${slug}`)
      .then(async (res) => {
        if (!alive) return;
        if (!res.ok) throw new Error("Product not found");
        const p: Product = await res.json();
        setProduct(p);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  return { product, loading, error };
}
