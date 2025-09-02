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
  },
  {
    id: "ship-ongkir-25",
    title: "Gratis Ongkir s/d Rp25.000",
    subtitle: "Min. belanja Rp150.000",
    type: "shipping",
    enabled: false, // contoh: belum memenuhi syarat
    savingLabel: "Hemat s/d Rp25rb",
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
  },
  {
    id: "promo-20",
    title: "Diskon 20% untuk pembelian paket",
    subtitle: "Min. belanja Rp200.000",
    type: "promo",
    enabled: false,
    savingLabel: "Hemat s/d Rp50rb",
  },
];
