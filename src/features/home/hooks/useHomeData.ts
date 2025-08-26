"use client";
import { useEffect, useState } from "react";
import { productsData } from "@data/products";
import { carouselData, tilesData } from "@data/bannerPromotion";

type HomeData = {
  products: typeof productsData;
  carousel: typeof carouselData;
  tiles: typeof tilesData;
};

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        // simulasi delay API
        await new Promise((r) => setTimeout(r, 800));
        if (!alive) return;
        setData({
          products: productsData,
          carousel: carouselData,
          tiles: tilesData,
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
