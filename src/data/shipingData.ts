// src/data/shipingData.ts
import type { ShippingDetailData, ShippingGroup } from "@shared/types/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatEtaRange(minOffsetDays: number, maxOffsetDays: number, ref = new Date()): string {
  const s = new Date(ref); s.setDate(s.getDate() + minOffsetDays);
  const e = new Date(ref); e.setDate(e.getDate() + maxOffsetDays);
  const sDay = s.getDate(), eDay = e.getDate();
  const sMon = MONTHS[s.getMonth()], eMon = MONTHS[e.getMonth()];
  return sMon === eMon
    ? `Estimasi tiba ${sDay} - ${eDay} ${sMon}`
    : `Estimasi tiba ${sDay} ${sMon} - ${eDay} ${eMon}`;
}

function calcPrice(basePerKg: number, weightGr: number): number {
  const kg = Math.ceil(Math.max(1, weightGr) / 1000); // min 1kg
  return basePerKg * kg;
}

export function buildMockShippingData(params: {
  origin: string;
  destination: string;
  weightGr: number;
  note?: string;
}): ShippingDetailData {
  const { origin, destination, weightGr, note } = params;

  const etaStd = formatEtaRange(3, 7);
  const eta2_5 = formatEtaRange(2, 5);
  const eta1_3 = formatEtaRange(1, 3);

  const groups: ShippingGroup[] = [
    {
      label: "Standard",
      items: [
        {
          id: "std-1",
          courier: "Standard",
          service: "Economy",
          eta: etaStd,
          price: calcPrice(10000, weightGr),
          badges: ["Hemat"],
        },
      ],
    },
    {
      label: "Reguler",
      items: [
        {
          id: "reg-sicepat",
          courier: "SiCepat",
          service: "REG",
          eta: eta2_5,
          price: calcPrice(12000, weightGr),
          badges: ["Rekomendasi"],
        },
        {
          id: "reg-anteraja",
          courier: "AnterAja",
          service: "REG",
          eta: eta2_5,
          price: calcPrice(12500, weightGr),
        },
        {
          id: "reg-jnt",
          courier: "J&T",
          service: "EZ",
          eta: eta1_3,
          price: calcPrice(13500, weightGr),
          badges: ["Cepat"],
        },
        {
          id: "reg-jne",
          courier: "JNE",
          service: "REG",
          eta: eta1_3,
          price: calcPrice(14000, weightGr),
        },
      ],
    },
    { label: "Kargo", items: [] },
    { label: "Instan", items: [] },
    { label: "GoJek", items: [] },
    { label: "GoSend", items: [] },
    { label: "Shopee", items: [] },
  ];

  return {
    origin,
    destination,
    weightGr,
    note: note ?? "Total ongkir dihitung saat checkout",
    groups,
  };
}

export const mockShippingData: ShippingDetailData = buildMockShippingData({
  origin: "Kota Administrasi Jakarta Pusat",
  destination: "Rumah Garut Reza",
  weightGr: 800,
});
