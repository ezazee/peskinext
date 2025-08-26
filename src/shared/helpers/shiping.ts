// src/shared/helpers/shiping.ts
import type { ShippingDetailData } from "@shared/types/types";

export function getCheapestShipping(data?: ShippingDetailData | null) {
  if (!data) return null;
  let min = Infinity, eta = "", group = "";
  data.groups.forEach((g) => {
    g.items.forEach((it) => {
      if (it.price < min) { min = it.price; eta = it.eta; group = g.label; }
    });
  });
  return isFinite(min) ? { price: min, eta, group } : null;
}
