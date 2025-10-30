// src/features/shiping/hooks/useShippingParamsForProduct.ts
import { useMemo } from "react";
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
    "Kota Administrasi Jakarta Pusat";

  const destination = (() => {
    if (typeof window === "undefined") return "Alamatmu";
    try {
      return localStorage.getItem("defaultDestination") || "Alamatmu";
    } catch {
      return "Alamatmu";
    }
  })();

  const weightGr = useMemo(() => {
    const perItem = (variant as unknown as MaybeWeight).weight ?? 500;
    const total = perItem * Math.max(1, qty);
    return Math.max(1, Math.round(total));
  }, [variant, qty]);

  const params: ShippingQueryParams = useMemo(
    () => ({ origin, destination, weightGr }),
    [origin, destination, weightGr]
  );

  return { params, origin };
}
