import type { ShippingDetailData } from "@shared/types/types";

export const mockShippingData: ShippingDetailData = {
  origin: "Kota Administrasi Jakarta Pusat",
  destination: "Rumah Garut Reza",
  weightGr: 800,
  note: "Total ongkir dihitung saat checkout",
  groups: [
    {
      label: "Standard",
      items: [
        {
          id: "std-1",
          courier: "Standard",
          eta: "Estimasi tiba 23 Aug - 2 Sep",
          price: 20000,
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
          eta: "Estimasi tiba 24 - 27 Aug",
          price: 15900,
          badges: ["Rekomendasi"],
        },
        {
          id: "reg-anteraja",
          courier: "AnterAja",
          eta: "Estimasi tiba 24 - 27 Aug",
          price: 16200,
        },
        {
          id: "reg-jnt",
          courier: "J&T",
          eta: "Estimasi tiba 23 - 25 Aug",
          price: 17000,
        },
        {
          id: "reg-jne",
          courier: "JNE",
          eta: "Estimasi tiba 23 - 25 Aug",
          price: 18000,
        },
      ],
    },
    { label: "Kargo", items: [] },
    { label: "Instan", items: [] },
    { label: "gOJEK", items: [] },
    { label: "Gosend", items: [] },
    { label: "Shopee", items: [] },
  ],
};
