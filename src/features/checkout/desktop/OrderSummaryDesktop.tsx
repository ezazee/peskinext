// src/features/checkout/desktop/OrderSummaryDesktop.tsx
"use client";

import * as React from "react";

const fmt = (n: number) => `Rp ${new Intl.NumberFormat("id-ID").format(n)}`;

type Props = {
  itemsCount: number;
  subtotal: number;
  /** Ongkir dari layanan yang dipilih (sebelum diskon) */
  shippingFee?: number;
  /** Diskon ongkir (boleh kirim nilai mentah; di-cap di sini juga) */
  shippingDiscount?: number;
  /** Diskon promo dari list */
  promoDiscountList?: number;
  /** Diskon promo dari kode yang tidak ada di list */
  promoDiscountCode?: number;
  /** Total akhir yang sudah dihitung di parent */
  grandTotal: number;
  hasShippingSelected?: boolean;
  onCheckout?: () => void;
};

export default function OrderSummaryDesktop({
  itemsCount,
  subtotal,
  shippingFee = 0,
  shippingDiscount = 0,
  promoDiscountList = 0,
  promoDiscountCode = 0,
  grandTotal,
  onCheckout,
}: Props) {
  // --- Cap diskon ongkir agar tidak melebihi ongkir ---
  const shippingDiscountCapped = Math.min(Math.max(0, shippingDiscount), shippingFee);


  return (
    <div className="bg-transparent px-2 py-4">
      <div className="flex items-center gap-2 mb-6 border-l-4 border-primary pl-4">
        <h3 className="text-xl font-bold tracking-tight text-gray-900">Ringkasan Pesanan</h3>
      </div>

      <div className="space-y-4 text-sm font-medium">
        <Row label={`Subtotal (${itemsCount} produk)`} value={<span className="text-gray-900 font-bold">{fmt(subtotal)}</span>} />

        <Row
          label="Biaya Pengiriman"
          value={<span className="text-gray-900 font-bold">{fmt(shippingFee)}</span>}
        />

        {/* --- Potongan Ongkir (Always show if > 0) --- */}
        {shippingDiscountCapped > 0 && (
          <Row
            label="Potongan Ongkir"
            value={<span className="text-emerald-600 font-bold">-{fmt(shippingDiscountCapped)}</span>}
          />
        )}


        {promoDiscountList > 0 && (
          <Row
            label="Diskon Promo"
            value={<span className="text-primary font-bold">-{fmt(promoDiscountList)}</span>}
          />
        )}

        {promoDiscountCode > 0 && (
          <Row
            label="Diskon Kode"
            value={<span className="text-primary font-bold">-{fmt(promoDiscountCode)}</span>}
          />
        )}

        <div className="flex items-end justify-between pt-2">
          <span className="text-base font-bold text-gray-900">Total Pembayaran</span>
          <span className="text-2xl font-black text-primary tracking-tight">{fmt(grandTotal)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="mt-8 w-full rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-sm bg-primary text-white hover:bg-secondary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer active:scale-[0.98]"
      >
        Bayar Sekarang
      </button>

    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 font-medium">{label}</span>
      <div className="text-right">{value}</div>
    </div>
  );
}
