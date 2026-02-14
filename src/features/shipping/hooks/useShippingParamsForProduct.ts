// src/features/shiping/hooks/useShippingParamsForProduct.ts
import { useMemo, useState, useEffect } from "react";
import type { Product, Variant } from "@shared/types/types";

export type ShippingQueryParams = {
  origin: string;
  destination: string;
  weightGr: number;
};

type MaybeWeight = { weight?: number };
type MaybeShipFrom = { shipFrom?: string };

export function useShippingParamsForProduct(
  product: Product,
  variant: Variant,
  qty: number
) {
  const origin =
    (product as unknown as MaybeShipFrom).shipFrom ??
    "Store Location";

  const [destination, setDestination] = useState<string>("Alamatmu");

  useEffect(() => {
    const updateDest = () => {
      if (typeof window !== "undefined") {
        const d = localStorage.getItem("defaultDestination");
        if (d) setDestination(d);
      }
    };
    updateDest();
    window.addEventListener("addressUpdated", updateDest);
    return () => window.removeEventListener("addressUpdated", updateDest);
  }, []);

  const weightGr = useMemo(() => {
    // Safety check if variant is undefined
    const v = variant as unknown as MaybeWeight | undefined;
    // Fallback to product.weightGr if variant weight is missing, then 500
    const perItem = v?.weight ?? product.weightGr ?? 500;
    const total = perItem * Math.max(1, qty);
    return Math.max(1, Math.round(total));
  }, [variant, qty, product.weightGr]);

  const params: ShippingQueryParams = useMemo(
    () => ({ origin, destination, weightGr }),
    [origin, destination, weightGr]
  );

  return { params, origin };
}
