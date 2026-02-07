// src/features/checkout/desktop/OrderSummaryDesktop.tsx
"use client";

import Image from "next/image";
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
  hasShippingSelected = true,
  onCheckout,
}: Props) {
  // --- Cap diskon ongkir agar tidak melebihi ongkir ---
  const shippingDiscountCapped = Math.min(
    Math.max(0, shippingDiscount),
    shippingFee
  );
  const shippingAfter = Math.max(0, shippingFee - shippingDiscountCapped);

  const totalDiscount =
    Math.max(0, shippingDiscountCapped) +
    Math.max(0, promoDiscountList) +
    Math.max(0, promoDiscountCode);

  const logos: ReadonlyArray<{
    src: string;
    alt: string;
    w: number;
    h: number;
  }> = [
      { src: "/images/paymentlogo/bca.svg", alt: "BCA", w: 62, h: 22 },
      { src: "/images/paymentlogo/mandiri.png", alt: "Mandiri", w: 70, h: 20 },
      { src: "/images/paymentlogo/kredivo.png", alt: "Kredivo", w: 72, h: 22 },
      { src: "/images/paymentlogo/ovo.png", alt: "OVO", w: 44, h: 22 },
      { src: "/images/paymentlogo/qris.png", alt: "QRIS", w: 56, h: 22 },
    ];

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
      <h3 className="font-semibold mb-3">Detail pesanan</h3>

      <div className="space-y-2 text-sm">
        <Row label={`Subtotal (${itemsCount} produk)`} value={fmt(subtotal)} />

        {/* Ongkir: tampil "Gratis" jika after=0, dan coret harga awal jika ada */}
        <Row
          label="Ongkir"
          value={
            !hasShippingSelected ? (
              <span className="text-gray-400 italic">Pilih pengiriman</span>
            ) : shippingAfter === 0 ? (
              <span>
                {shippingFee > 0 && (
                  <span className="mr-2 text-gray-400 line-through">
                    {fmt(shippingFee)}
                  </span>
                )}
                <span className="text-primary font-medium">Gratis</span>
              </span>
            ) : (
              fmt(shippingAfter)
            )
          }
        />

        {/* Diskon-diskon */}
        {shippingDiscountCapped > 0 && (
          <Row
            label="Diskon ongkir"
            value={
              <span className="text-primary">
                - {fmt(shippingDiscountCapped)}
              </span>
            }
          />
        )}

        {promoDiscountList > 0 && (
          <Row
            label="Diskon promo"
            value={
              <span className="text-primary">- {fmt(promoDiscountList)}</span>
            }
          />
        )}

        {promoDiscountCode > 0 && (
          <Row
            label="Diskon kode"
            value={
              <span className="text-primary">- {fmt(promoDiscountCode)}</span>
            }
          />
        )}

        <div className="my-2 h-px bg-gray-200/70" />

        <Row
          label="Total"
          value={<span className="font-semibold">{fmt(grandTotal)}</span>}
        />

        {totalDiscount > 0 && (
          <div className="text-xs text-primary">
            Kamu hemat {fmt(totalDiscount)}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="mt-4 w-full rounded-xl px-5 py-3 font-medium bg-primary text-white hover:bg-secondary transition-colors cursor-pointer active:scale-[.99]"
      >
        Checkout
      </button>

      <div className="mt-4 pt-3">
        <p className="text-center text-xs text-gray-500">
          Pembayaranmu aman di website kami.
        </p>
        <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {logos.map((l) => (
            <li key={l.src} className="shrink-0">
              <div className="relative" style={{ width: l.w, height: l.h }}>
                <Image
                  src={l.src}
                  alt={l.alt}
                  fill
                  sizes={`${l.w}px`}
                  className="object-contain"
                  unoptimized // opsional (bagus untuk SVG)
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}
