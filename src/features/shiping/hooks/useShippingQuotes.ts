// src/features/shiping/hooks/useShippingQuotes.ts
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { ShippingDetailData, ShippingGroup, ShippingOption } from "@shared/types/types";
import type { ShippingQueryParams } from "./useShippingParamsForProduct";

export function useShippingQuotes(
  enable: boolean,
  params: ShippingQueryParams | null,
  userId?: string,
  items?: Array<Record<string, unknown>>
) {
  const [data, setData] = useState<ShippingDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async (p: ShippingQueryParams, uid: string, itemList?: Array<Record<string, unknown>>, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        user_id: uid,
        items: itemList?.map(i => ({
          name: (i.name as string) || "Product",
          variant_name: ((i.variant as Record<string, unknown>)?.name as string) || "Standard",
          price: (i.price as number) || 0,
          weight: (i.weight as number) || 0,
          quantity: (i.quantity as number) || 1
        }))
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/check-ongkir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Shipping API Error:", res.status, errData);
        throw new Error(errData.message || `Gagal memuat ongkir (${res.status})`);
      }

      const json = await res.json();

      // Transform Biteship response to ShippingDetailData
      const courierMap = new Map<string, ShippingOption[]>();

      if (json.available_couriers && Array.isArray(json.available_couriers)) {
        json.available_couriers.forEach((c: Record<string, unknown>) => {
          const groupName = (c.courier_name || c.company) as string;
          if (!courierMap.has(groupName)) courierMap.set(groupName, []);

          courierMap.get(groupName)!.push({
            id: `${c.company as string}-${c.courier_service_code as string}-${c.price as number}`,
            courier: c.courier_name as string,
            service: c.courier_service_name as string,
            eta: (c.duration as string) || "",
            price: c.price as number,
            badges: c.service_type === "instant" ? ["Instant"] : []
          });
        });
      }

      const groups: ShippingGroup[] = [];
      courierMap.forEach((items, label) => {
        groups.push({ label, items });
      });

      setData({
        origin: "Store Location", // You might want to map origin_area_id to a name if possible or use static
        destination: typeof json.destination === 'object' ? `${json.destination.districts}, ${json.destination.postal_code}` : "Alamat Tujuan",
        weightGr: json.totalWeight,
        groups
      });

    } catch (_err) {
      if (_err instanceof Error && _err.name === 'AbortError') return;
      console.error(_err);
      setError("Gagal memuat ongkir");
      setData(null);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!enable || !params || !userId) {
      setData(null);
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    run(params, userId, items, abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [enable, params, userId, items, run]);

  const refetch = useCallback(() => {
    if (params && userId) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      run(params, userId, items, abortController.signal);
    }
  }, [params, userId, items, run]);

  return { data, loading, error, refetch };
}

