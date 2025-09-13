"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@shared/libs/format";
import type { Voucher, VoucherSelection } from "@shared/types/types";
import { createCheckoutFromCart } from "@features/checkout/action";

/* ================= Parser & util ================= */

function parseRupiahFlexible(text?: string): number {
  if (!text) return 0;
  const s = text.replace(/\s+/g, " ").trim().toLowerCase();

  let m = s.match(/(?:rp)?\s*([\d.]+)\s*(rb|ribu|k|jt|juta)?/i);
  if (m) {
    const base = parseInt(m[1].replace(/\./g, ""), 10) || 0;
    const suf = (m[2] || "").toLowerCase();
    if (suf === "rb" || suf === "ribu" || suf === "k") return base * 1_000;
    if (suf === "jt" || suf === "juta") return base * 1_000_000;
    return base;
  }
  m = s.match(/(\d+)\s*(rb|ribu|k|jt|juta)/i);
  if (m) {
    const n = parseInt(m[1], 10) || 0;
    const suf = m[2].toLowerCase();
    return suf === "rb" || suf === "ribu" || suf === "k"
      ? n * 1_000
      : n * 1_000_000;
  }
  return 0;
}

function parsePercent(text?: string): number | null {
  if (!text) return null;
  const m = text.match(/(\d{1,3})\s*%/);
  return m ? Math.min(100, Math.max(0, parseInt(m[1], 10))) : null;
}

const looksLikeDiscount = (t?: string) =>
  !!t && /(hemat|potong|s\/d|sd|gratis|ongkir|diskon)/i.test(t);

function computeShippingDiscountFrom(v?: Voucher | null): number {
  if (!v) return 0;
  const tryTexts: (string | undefined)[] = [
    v.savingLabel,
    v.title,
    looksLikeDiscount(v.subtitle) ? v.subtitle : undefined,
  ];
  for (const t of tryTexts) {
    const n = parseRupiahFlexible(t);
    if (n > 0) return n;
  }
  return 0;
}

function computePromoDiscountFrom(
  v: Voucher | null | undefined,
  subtotal: number
): number {
  if (!v) return 0;
  const pct =
    parsePercent(v.title) ??
    parsePercent(v.subtitle) ??
    parsePercent(v.savingLabel) ??
    0;
  const cap =
    parseRupiahFlexible(v.subtitle) ||
    parseRupiahFlexible(v.savingLabel) ||
    Number.POSITIVE_INFINITY;
  if (pct <= 0) return 0;
  const raw = Math.floor((subtotal * pct) / 100);
  return Math.max(0, Math.min(raw, cap, subtotal));
}

/* ================= UI ================= */

type Props = {
  subtotal: number;
  canCheckout: boolean;
  shippingFee?: number;
  selected: VoucherSelection;
  shipping: Voucher[];
  promos: Voucher[];
  redeemedVoucher: Voucher | null; // kode voucher hasil redeem (bisa tidak ada di list)
};

export default function SummaryCard({
  subtotal,
  canCheckout,
  shippingFee = 0,
  selected,
  shipping,
  promos,
  redeemedVoucher,
}: Props) {
  const router = useRouter();
  const disabled = !canCheckout;

  const { shippingDiscount, promoDiscountList, promoDiscountCode, grandTotal } =
    useMemo(() => {
      /* --- SHIPPING --- (list atau kode) */
      let ship: Voucher | null = null;
      if (selected.shippingId) {
        ship =
          shipping.find((x) => x.id === selected.shippingId) ??
          (redeemedVoucher?.type === "shipping" &&
          redeemedVoucher.id === selected.shippingId
            ? redeemedVoucher
            : null);
      }
      if (!ship && selected.code && redeemedVoucher?.type === "shipping") {
        // user hanya memasukkan kode ongkir
        ship = redeemedVoucher;
      }
      const shipDiscRaw = computeShippingDiscountFrom(ship);
      // kalau ingin hanya mengurangi biaya ongkir, batasi dengan shippingFee:
      // const shippingDiscount = Math.min(shipDiscRaw, shippingFee);
      const shippingDiscount = shipDiscRaw;

      /* --- PROMO LIST --- */
      const promoFromList = selected.promoId
        ? promos.find((x) => x.id === selected.promoId) ?? null
        : null;
      const promoDiscountList = computePromoDiscountFrom(
        promoFromList,
        subtotal
      );

      /* --- PROMO KODE (TIDAK ADA DI LIST) --- */
      const codeIsPromoNotInList =
        !!selected.code &&
        redeemedVoucher?.type === "promo" &&
        !promos.some((p) => p.id === redeemedVoucher.id);

      const promoDiscountCode = codeIsPromoNotInList
        ? computePromoDiscountFrom(redeemedVoucher, subtotal)
        : 0;

      /* --- GRAND TOTAL --- */
      const totalDisc = Math.min(
        subtotal,
        Math.max(0, shippingDiscount) +
          Math.max(0, promoDiscountList) +
          Math.max(0, promoDiscountCode)
      );
      const grandTotal = Math.max(0, subtotal - totalDisc);

      return {
        shippingDiscount,
        promoDiscountList,
        promoDiscountCode,
        grandTotal,
      };
    }, [subtotal, shippingFee, selected, shipping, promos, redeemedVoucher]);

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

  const totalSaving = shippingDiscount + promoDiscountList + promoDiscountCode;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold mb-2">Detail pesanan</h3>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span className="font-semibold text-gray-900">
          {formatRupiah(subtotal)}
        </span>
      </div>

      {shippingDiscount > 0 && (
        <div className="mt-1 flex justify-between text-sm text-primary">
          <span>Diskon ongkir</span>
          <span>- {formatRupiah(shippingDiscount)}</span>
        </div>
      )}

      {promoDiscountList > 0 && (
        <div className="mt-1 flex justify-between text-sm text-primary">
          <span>Diskon promo</span>
          <span>- {formatRupiah(promoDiscountList)}</span>
        </div>
      )}

      {/* >>> Tambahan: Diskon KODE (hanya bila kodenya tidak ada di list) */}
      {promoDiscountCode > 0 && (
        <div className="mt-1 flex justify-between text-sm text-primary">
          <span>Diskon kode</span>
          <span>- {formatRupiah(promoDiscountCode)}</span>
        </div>
      )}

      <div className="mt-2 h-px bg-gray-200" />

      <div className="mt-2 flex justify-between text-sm text-gray-900">
        <span>Total</span>
        <span className="font-bold">{formatRupiah(grandTotal)}</span>
      </div>

      {totalSaving > 0 && (
        <div className="mt-1 text-[12px] text-primary">
          Kamu hemat {formatRupiah(totalSaving)}
        </div>
      )}

      <form action={createCheckoutFromCart} className="mt-3">
        <button
          type="submit"
          disabled={disabled}
          className={`w-full h-11 rounded-lg transition text-white ${
            disabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
              : "bg-primary hover:bg-secondary cursor-pointer"
          }`}
        >
          Checkout
        </button>
      </form>

      <div className="mt-4 pt-3">
        <p className="text-center text-xs text-gray-500">
          Pembayaranmu aman di website kami.
        </p>
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
    </div>
  );
}
