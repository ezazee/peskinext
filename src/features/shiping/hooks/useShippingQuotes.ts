// src/features/shiping/hooks/useShippingQuotes.ts
"use client";

import { useEffect, useState } from "react";
import type { ShippingDetailData } from "@shared/types/types";
import { buildMockShippingData } from "@data/shipingData";
import type { ShippingQueryParams } from "./useShippingParamsForProduct";

export function useShippingQuotes(
  enable: boolean,
  params: ShippingQueryParams | null
) {
  const [data, setData] = useState<ShippingDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(p: ShippingQueryParams) {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 600)); // simulasi API
      setData(buildMockShippingData(p));
    } catch {
      setError("Gagal memuat ongkir");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!enable || !params) return;
    run(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enable, params?.origin, params?.destination, params?.weightGr]);

  const refetch = () => {
    if (params) run(params);
  };

  return { data, loading, error, refetch };
}
