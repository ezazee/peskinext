import type { Voucher } from "@shared/types/types";

export const shippingVouchers: Voucher[] = [
  {
    id: "ship-ongkir-10",
    title: "Gratis Ongkir s/d Rp10.000",
    subtitle: "Tanpa minimum belanja, khusus Jabodetabek",
    type: "shipping",
    enabled: true,
    savingLabel: "Hemat s/d Rp10rb",
    validTo: "2025-12-31",
    conditions: { regions: ["Jabodetabek"] },
  },
  {
    id: "ship-ongkir-25",
    title: "Gratis Ongkir s/d Rp25.000",
    subtitle: "Min. belanja Rp150.000",
    type: "shipping",
    enabled: true,
    savingLabel: "Hemat s/d Rp25rb",
    conditions: { minSubtotal: 150_000 },
  },
];

export const promoVouchers: Voucher[] = [
  {
    id: "promo-10",
    title: "Diskon 10% produk skincare",
    subtitle: "Maks diskon Rp20.000",
    type: "promo",
    enabled: true,
    savingLabel: "Hemat s/d Rp20rb",
    validTo: "2025-12-31",
    conditions: { minSelectedItems: 1 },
  },
  {
    id: "promo-20",
    title: "Diskon 20% untuk pembelian paket",
    subtitle: "Min. belanja Rp500.000 & khusus paket",
    type: "promo",
    enabled: true,
    savingLabel: "Hemat s/d Rp50rb",
    conditions: { minSubtotal: 500_000, requirePackage: true },
  },
];
