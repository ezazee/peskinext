"use client";

import Image from "next/image";
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
  const shippingDiscountCapped = Math.min(
    Math.max(0, shippingDiscount),
    shippingFee
  );
  const shippingAfter = Math.max(0, shippingFee - shippingDiscountCapped);

  const totalDiscount =
    Math.max(0, shippingDiscountCapped) +
    Math.max(0, promoDiscountList) +
    Math.max(0, promoDiscountCode);

  const logos = [
    { src: "/images/paymentlogo/bca.svg", alt: "BCA", w: 62, h: 22 },
    { src: "/images/paymentlogo/mandiri.png", alt: "Mandiri", w: 70, h: 20 },
    { src: "/images/paymentlogo/kredivo.png", alt: "Kredivo", w: 72, h: 22 },
    { src: "/images/paymentlogo/ovo.png", alt: "OVO", w: 44, h: 22 },
    { src: "/images/paymentlogo/qris.png", alt: "QRIS", w: 56, h: 22 },
  ] as const;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold mb-2">Ringkasan</h3>

      <Row label={`Subtotal (${itemsCount} produk)`} value={formatRupiah(subtotal)} />

      {/* Ongkir */}
      <Row
        label="Ongkir"
        value={
          shippingLoading ? (
            <Skeleton width={80} height={14} />
          ) : shippingFee > 0 && shippingAfter === 0 ? (
            // Logic Free: Coret + Gratis
            <span>
              <span className="mr-2 text-gray-400 line-through">
                {formatRupiah(shippingFee)}
              </span>
              <span className="text-emerald-600 font-medium">Gratis</span>
            </span>
          ) : (
            // Logic Partial/None: Show Base Price (diskon tampil di bawah)
            formatRupiah(shippingFee)
          )
        }
      />

      {/* Diskon-diskon */}
      {shippingDiscountCapped > 0 && shippingAfter > 0 && (
        <Row
          label="Diskon ongkir"
          value={
            <span className="text-primary">
              - {formatRupiah(shippingDiscountCapped)}
            </span>
          }
        />
      )}
      {promoDiscountList > 0 && (
        <Row
          label="Diskon promo"
          value={<span className="text-primary">- {formatRupiah(promoDiscountList)}</span>}
        />
      )}
      {promoDiscountCode > 0 && (
        <Row
          label="Diskon kode"
          value={<span className="text-primary">- {formatRupiah(promoDiscountCode)}</span>}
        />
      )}

      <div className="my-2 h-px bg-gray-200" />

      <Row label="Total" value={<span className="font-bold">{formatRupiah(grandTotal)}</span>} />

      {totalDiscount > 0 && (
        <div className="text-[12px] text-primary mt-1">
          Kamu hemat {formatRupiah(totalDiscount)}
        </div>
      )}

      <button
        type="button"
        onClick={onCheckout}
        className="mt-3 w-full h-11 rounded-lg bg-primary text-white font-semibold active:scale-[.99]"
      >
        Checkout
      </button>

      <div className="mt-4">
        <p className="text-center text-[11px] text-gray-500">Pembayaranmu aman di website kami.</p>
        <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {logos.map((l) => (
            <li key={l.src} className="shrink-0">
              <Image
                src={l.src}
                alt={l.alt}
                width={l.w}
                height={l.h}
                className="object-contain"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}
