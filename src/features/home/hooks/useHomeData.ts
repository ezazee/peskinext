"use client";
import { useEffect, useState } from "react";
import { getProducts } from "@features/product/services/productService";
import { getBanners } from "@features/home/services/bannerService";
import type { Product, Banner } from "@shared/types/types";

type HomeData = {
  products: Product[];
  main: Banner[];
  carousel: Banner[];
  tiles: Banner[];
};

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        const [productRes, bannerData] = await Promise.all([
          fetch("/api/products").then(r => {
            if (!r.ok) throw new Error("Failed to fetch products");
            return r.json();
          }),
          getBanners().catch(err => {
            console.error("Banner fetch failed, using fallback", err);
            return { main: [], carousel: [], tiles: [] };
          })
        ]);

        if (!alive) return;
        setData({
          products: productRes,
          main: bannerData.main || [],
          carousel: bannerData.carousel,
          tiles: bannerData.tiles,
        });
      } catch (e) {
        if (!alive) return;
        setError(e as Error);
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}
