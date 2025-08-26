"use client";
import type { ShippingDetailData } from "@shared/types/types";

export type ShippingQueryParams = {
  origin: string;
  destination: string;
  weightGram: number; // ⬅️ ini yang dipakai hook
};

export async function fetchShippingQuotes(
  params: ShippingQueryParams,
  { delay = 900 }: { delay?: number } = {}
): Promise<ShippingDetailData> {
  await new Promise((r) => setTimeout(r, delay));
  return {
    origin: params.origin,
    destination: params.destination,
    // response boleh tetap weightGr (sesuai tipe ShippingDetailData kamu)
    weightGr: params.weightGram,
    note: "Estimasi, harga final saat checkout",
    groups: [
      {
        label: "Reguler",
        items: [
          {
            id: "JNE-REG",
            courier: "JNE",
            service: "REG",
            eta: "2–3 hari",
            price: 18000,
          },
          {
            id: "POS-KILAT",
            courier: "POS",
            service: "Kilat",
            eta: "2–4 hari",
            price: 16000,
            badges: [],
          },
        ],
      },
      {
        label: "Kilat / Next Day",
        items: [
          {
            id: "JNT-EXP",
            courier: "J&T",
            service: "EXP",
            eta: "1–2 hari",
            price: 24000,
            badges: ["Populer"],
          },
        ],
      },
    ],
  };
}
