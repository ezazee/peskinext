"use client";

import { useEffect, useRef, useState } from "react";
import type { Review } from "@shared/types/types";

type Key = { sku?: string; slug?: string };

export type ReviewsList = {
  items: Review[];
  total: number;
  average: number;
  count: number;
  page: number;
  pageSize: number;
};

function keyToQS(k: Key) {
  // ⬅️ kirim KEDUA-NYA juga di list
  const qp = new URLSearchParams();
  if (k.sku) qp.set("sku", k.sku);
  if (k.slug) qp.set("slug", k.slug);
  return qp;
}

/** Ambil daftar review per produk (pagination), prioritas SKU, fallback slug */
export function useProductReviews(key: Key, page = 1, pageSize = 10) {
  const [data, setData] = useState<ReviewsList | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!key.sku && !key.slug) return;
    let mounted = true;

    async function load() {
      setLoading(true);
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const qs = keyToQS(key);
        qs.set("page", String(page));
        qs.set("pageSize", String(pageSize));

        const res = await fetch(`/api/reviews?${qs.toString()}`, {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("bad status");
        const json = (await res.json()) as ReviewsList;
        if (mounted) setData(json);
      } catch {
        if (mounted)
          setData({
            items: [],
            total: 0,
            average: 0,
            count: 0,
            page,
            pageSize,
          });
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
  }, [key.sku, key.slug, page, pageSize]);

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    average: data?.average ?? 0,
    count: data?.count ?? 0,
    page: data?.page ?? page,
    pageSize: data?.pageSize ?? pageSize,
    loading,
  };
}
