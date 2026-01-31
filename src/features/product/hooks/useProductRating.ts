"use client";

import { useEffect, useRef, useState } from "react";

export type AggregateRating = { average: number; count: number };

type Key = { sku?: string; slug?: string };

const cache = new Map<string, AggregateRating>();

function keyToQS(k: Key) {
  // ⬅️ kirim KEDUA-NYA agar cocok dg mock (slug) dan future-proof (sku)
  const qp = new URLSearchParams();
  if (k.sku) qp.set("sku", k.sku);
  if (k.slug) qp.set("slug", k.slug);
  return qp.toString();
}
function keyToCacheKey(k: Key) {
  return k.sku ? `sku:${k.sku}` : `slug:${k.slug ?? ""}`;
}

/** Ambil ringkasan rating per produk; prioritas SKU, fallback slug */
export function useProductRating(key: Key, seed?: AggregateRating) {
  const cacheKey = keyToCacheKey(key);
  const [data, setData] = useState<AggregateRating | undefined>(
    seed ?? cache.get(cacheKey)
  );
  const [loading, setLoading] = useState(!cache.has(cacheKey) && !seed);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!key.sku && !key.slug) return;
    let mounted = true;

    async function load() {
      setLoading(!cache.has(cacheKey) && !seed);
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const res = await fetch(`/api/reviews/summary?${keyToQS(key)}`, {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("bad status");
        const json = (await res.json()) as AggregateRating;
        cache.set(cacheKey, json);
        if (mounted) setData(json);
      } catch {
        /* noop */
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, key.sku, key.slug, seed]);

  return {
    average: data?.average ?? 0,
    count: data?.count ?? 0,
    loading,
  };
}
