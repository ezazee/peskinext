// src/features/shiping/hooks/useShippingQuotes.ts
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { ShippingDetailData } from "@shared/types/types";
// import { buildMockShippingData } from "@data/shipingData";
import type { ShippingQueryParams } from "./useShippingParamsForProduct";

export function useShippingQuotes(
  enable: boolean,
  params: ShippingQueryParams | null
) {
  const [data, setData] = useState<ShippingDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async (p: ShippingQueryParams, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 600); // simulasi API

        // Handle abort
        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new Error('Aborted'));
          });
        }
      });

      // Check if aborted before setting data
      if (signal?.aborted) return;

      // setData(buildMockShippingData(p));
      setData(null); // Mock removed
    } catch (_err) {
      // Don't set error if request was aborted
      if (_err instanceof Error && _err.message === 'Aborted') return;
      setError("Gagal memuat ongkir");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!enable || !params) {
      setData(null);
      setLoading(false);
      return;
    }

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    run(params, abortController.signal);

    // Cleanup function to abort on unmount or params change
    return () => {
      abortController.abort();
    };
  }, [enable, params, run]);

  const refetch = useCallback(() => {
    if (params) {
      // Abort any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      run(params, abortController.signal);
    }
  }, [params, run]);

  return { data, loading, error, refetch };
}
