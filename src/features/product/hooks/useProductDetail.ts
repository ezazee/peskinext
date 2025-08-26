"use client";
import { useEffect, useState } from "react";
import type { Product } from "@shared/types/types";
import { fetchProductBySlug } from "../api/fake";

export function useProductDetail(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchProductBySlug(slug)
      .then((p) => {
        if (!alive) return;
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
