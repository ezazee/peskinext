import type { ShippingOrder } from "@shared/types/types";

// Map: id transaksi → shipping meta
export const shippingByTx: Record<string, ShippingOrder> = {
  "INV-001": {
    courier: "J&T Express",
    service: "EZ",
    trackingNumber: "JX5777476494",
    eta: "2–3 hari",
    shippedAt: "2025-10-03T10:00:00+07:00",
  },
  "INV-002": {
    courier: "JNE",
    service: "REG",
  },
};
