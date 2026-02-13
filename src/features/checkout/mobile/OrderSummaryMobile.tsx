"use client";

import * as React from "react";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { formatRupiah } from "@shared/helpers/pricing";

type Props = {
  itemsCount: number;
  subtotal: number;

  shippingFee?: number;
  shippingLoading?: boolean;
  shippingDiscount: number;        // bisa sudah dicapped dari parent

  promoDiscountList: number;
  promoDiscountCode: number;

  grandTotal: number;
  onCheckout?: () => void;
};

export default function OrderSummaryMobile({
  itemsCount,
  subtotal,
  shippingFee = 0,
  shippingLoading = false,
  shippingDiscount,
  promoDiscountList,
  promoDiscountCode,
  grandTotal,
  onCheckout,
}: Props) {
  // safety: cap lagi di sini supaya robust
  const shippingDiscountCapped = Math.min(Math.max(0, shippingDiscount), shippingFee);

  const totalDiscount =
    Math.max(0, shippingDiscountCapped) + Math.max(0, promoDiscountList) + Math.max(0, promoDiscountCode);

  return (
    <section className="bg-transparent px-2 py-4">
      <div className="flex items-center gap-2 mb-6 border-l-4 border-primary pl-4">
        <h3 className="text-xl font-bold tracking-tight text-gray-900">Ringkasan Pesanan</h3>
      </div>

      <div className="space-y-4">
        <Row label={`Subtotal (${itemsCount} produk)`} value={<span className="text-gray-900 font-bold">{formatRupiah(subtotal)}</span>} />

        {/* Ongkir */}
        <Row
          label="Biaya Pengiriman"
          value={
            shippingLoading ? (
              <Skeleton width={80} height={14} />
            ) : (
              <span className="text-gray-900 font-bold">{formatRupiah(shippingFee)}</span>
            )
          }
        />

        {/* --- Potongan Ongkir (Always show if > 0) --- */}
        {shippingDiscountCapped > 0 && (
          <Row
            label="Potongan Ongkir"
            value={<span className="text-emerald-600 font-bold">-{formatRupiah(shippingDiscountCapped)}</span>}
          />
        )}

        {/* Diskon-diskon */}
        {promoDiscountList > 0 && (
          <Row
            label="Diskon Promo"
            value={<span className="text-primary font-bold">-{formatRupiah(promoDiscountList)}</span>}
          />
        )}
        {promoDiscountCode > 0 && (
          <Row
            label="Diskon Kode"
            value={<span className="text-primary font-bold">-{formatRupiah(promoDiscountCode)}</span>}
          />
        )}

        <div className="my-6 h-px bg-gray-50" />

        <div className="flex items-end justify-between">
          <span className="text-[14px] font-bold text-gray-600">Total Pembayaran</span>
          <span className="text-2xl font-black text-primary tracking-tight">{formatRupiah(grandTotal)}</span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex items-center gap-2 bg-primary/5 rounded-xl px-4 py-3 border border-primary/10 mt-4">
            <div className="text-[12px] font-bold text-primary">
              Hemat {formatRupiah(totalDiscount)} untuk pesanan ini!
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="mt-8 w-full rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-sm bg-primary text-white hover:bg-secondary shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
      >
        Bayar Sekarang
      </button>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-gray-500 font-medium">{label}</span>
      <div className="text-right">{value}</div>
    </div>
  );
}
