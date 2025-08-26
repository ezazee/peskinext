"use client";
import { useEffect, useMemo, useState } from "react";
import type { ShippingDetailData } from "@shared/types/types";
import { fetchShippingQuotes, type ShippingQueryParams } from "../api/fetchQuotes";

export function useShippingQuotes(
  open: boolean,
  params?: ShippingQueryParams | null,
  initialData?: ShippingDetailData
) {
  const [data, setData] = useState<ShippingDetailData | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(!!open);
  const [error, setError] = useState<Error | null>(null);

  const paramsKey = useMemo(
    () => `${params?.origin ?? ""}|${params?.destination ?? ""}|${params?.weightGram ?? 0}`,
    [params?.origin, params?.destination, params?.weightGram]
  );

  const refetch = async () => {
    if (!params) {
      setError(new Error("Parameter ongkir belum lengkap"));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchShippingQuotes(params);
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !params) {
      setLoading(false);
      return;
    }
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchShippingQuotes(params);
        if (alive) setData(res);
      } catch (e) {
        if (alive) setError(e as Error);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [open, params, paramsKey]);

  return { data, loading, error, refetch };
}
