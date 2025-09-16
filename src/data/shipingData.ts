// src/data/shipingData.ts
import type { ShippingDetailData, ShippingGroup } from "@shared/types/types";

// Re-export types (tanpa redefinisi)
export type {
  ShippingDetailData,
  ShippingGroup,
  ShippingOption,
} from "@shared/types/types";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
];

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

  const etaStd  = formatEtaRange(4, 7);
  const eta3_6  = formatEtaRange(3, 6);
  const eta2_5  = formatEtaRange(2, 5);
  const eta1_3  = formatEtaRange(1, 3);
  const eta0_1  = formatEtaRange(0, 1);
  const eta0_0  = formatEtaRange(0, 0);

  const groups: ShippingGroup[] = [
    /* ---------- Standard ---------- */
    {
      label: "Standard",
      items: [
        {
          id: "std-eco",
          courier: "Standard",
          service: "Economy",
          eta: etaStd,
          price: calcPrice(10000, weightGr),
          badges: ["Hemat"],
        },
        {
          id: "std-plus",
          courier: "Standard",
          service: "Plus",
          eta: eta3_6,
          price: calcPrice(11500, weightGr),
          badges: ["Hemat"],
        },
      ],
    },

    /* ---------- Reguler ---------- */
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
          id: "reg-jnt-ez",
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
        {
          id: "reg-pos",
          courier: "POS",
          service: "Reguler",
          eta: eta3_6,
          price: calcPrice(11000, weightGr),
          badges: ["Ekonomis"],
        },
        {
          id: "reg-ninja",
          courier: "NinjaXpress",
          service: "Standard",
          eta: eta2_5,
          price: calcPrice(13000, weightGr),
        },
      ],
    },

    /* ---------- Kargo ---------- */
    {
      label: "Kargo",
      items: [
        {
          id: "cargo-jtr",
          courier: "JNE",
          service: "Trucking (JTR)",
          eta: eta3_6,
          price: calcPrice(8000, weightGr),
          badges: ["Hemat", "Volume besar"],
        },
        {
          id: "cargo-gokil",
          courier: "SiCepat",
          service: "GOKIL",
          eta: eta3_6,
          price: calcPrice(9000, weightGr),
          badges: ["Hemat"],
        },
        {
          id: "cargo-wahana",
          courier: "Wahana",
          service: "Kargo",
          eta: formatEtaRange(4, 8),
          price: calcPrice(7000, weightGr),
          badges: ["Ekonomis"],
        },
      ],
    },

    /* ---------- Instan ---------- */
    {
      label: "Instan",
      items: [
        {
          id: "ins-grab",
          courier: "GrabExpress",
          service: "Instant",
          eta: eta0_0,
          price: calcPrice(20000, weightGr),
          badges: ["Cepat"],
        },
        {
          id: "ins-gojek",
          courier: "GoSend",
          service: "Instant",
          eta: eta0_0,
          price: calcPrice(18000, weightGr),
          badges: ["Cepat"],
        },
      ],
    },

    /* ---------- GoJek ---------- */
    {
      label: "GoJek",
      items: [
        {
          id: "gojek-sameday",
          courier: "GoSend",
          service: "Same Day",
          eta: eta0_1,
          price: calcPrice(15000, weightGr),
          badges: ["Rekomendasi"],
        },
        {
          id: "gojek-instant",
          courier: "GoSend",
          service: "Instant",
          eta: eta0_0,
          price: calcPrice(22000, weightGr),
          badges: ["Cepat"],
        },
      ],
    },

    /* ---------- GoSend (opsional dipisah) ---------- */
    {
      label: "GoSend",
      items: [
        {
          id: "gosend-sameday",
          courier: "GoSend",
          service: "Same Day",
          eta: eta0_1,
          price: calcPrice(15500, weightGr),
        },
        {
          id: "gosend-instant",
          courier: "GoSend",
          service: "Instant",
          eta: eta0_0,
          price: calcPrice(23000, weightGr),
        },
      ],
    },

    /* ---------- Shopee ---------- */
    {
      label: "Shopee",
      items: [
        {
          id: "spx-standard",
          courier: "Shopee Express",
          service: "Standard",
          eta: eta2_5,
          price: calcPrice(11500, weightGr),
          badges: ["Hemat"],
        },
        {
          id: "spx-sameday",
          courier: "Shopee Express",
          service: "Same Day",
          eta: eta0_1,
          price: calcPrice(18000, weightGr),
          badges: ["Cepat"],
        },
      ],
    },
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
