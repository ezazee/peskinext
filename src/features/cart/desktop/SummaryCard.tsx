// File: src/features/cart/desktop/SummaryCard.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@shared/libs/format";
import type { Voucher, VoucherSelection } from "@shared/types/types";

/* ---------- helper hitung diskon ---------- */
function promoDiscountFromId(id: string, subtotal: number): number {
  switch (id) {
    case "promo-10": return Math.min(Math.round(subtotal * 0.1), 20_000);
    case "promo-20": return Math.min(Math.round(subtotal * 0.2), 50_000);
    case "srv-promo-rahasia50": return Math.min(Math.round(subtotal * 0.5), 100_000);
    default: return 0;
  }
}
function shippingDiscountFromId(id: string, shippingFee: number): number {
  switch (id) {
    case "ship-ongkir-10": return Math.min(10_000, shippingFee);
    case "ship-ongkir-25": return Math.min(25_000, shippingFee);
    case "srv-ship-ongkirxtra": return Math.min(25_000, shippingFee);
    default: return 0;
  }
}
function guessCap(label?: string): number {
  if (!label) return 0;
  const m = label.match(/Rp\s?([\d.]+)/i);
  if (m?.[1]) return Number(m[1].replace(/\./g, "")) || 0;
  const m2 = label.match(/Rp\s?(\d+)\s?rb/i);
  if (m2?.[1]) return (Number(m2[1]) || 0) * 1_000;
  return 0;
}
function promoDiscFallback(v: Voucher | undefined, subtotal: number) {
  if (!v) return 0;
  return Math.min(Math.round(subtotal * 0.1), guessCap(v.savingLabel));
}
function shipDiscFallback(v: Voucher | undefined, fee: number) {
  if (!v) return 0;
  return Math.min(guessCap(v.savingLabel), fee);
}

/* ---------- props ---------- */
type Props = {
  subtotal: number;
  shippingFee?: number;
  canCheckout: boolean;

  selected: VoucherSelection;
  shipping: Voucher[];
  promos: Voucher[];

  /** <— opsional. Jika ada, dipakai utk hitung diskon dari kode redeem */
  redeemedVoucher?: Voucher | null;
};

export default function SummaryCard({
  subtotal,
  shippingFee = 0,
  canCheckout,
  selected,
  shipping,
  promos,
  redeemedVoucher,
}: Props) {
  const router = useRouter();
  const disabled = !canCheckout;

  const selectedShipping = selected.shippingId
    ? shipping.find((v) => v.id === selected.shippingId)
    : undefined;
  const selectedPromo = selected.promoId
    ? promos.find((v) => v.id === selected.promoId)
    : undefined;

  const discPromoFromList =
    selectedPromo?.id
      ? promoDiscountFromId(selectedPromo.id, subtotal) ||
        promoDiscFallback(selectedPromo, subtotal)
      : 0;

  const discShipFromList =
    selectedShipping?.id
      ? shippingDiscountFromId(selectedShipping.id, shippingFee) ||
        shipDiscFallback(selectedShipping, shippingFee)
      : 0;

  let discPromoFromCode = 0;
  let discShipFromCode = 0;
  if (selected.code && redeemedVoucher) {
    if (redeemedVoucher.type === "promo") {
      discPromoFromCode =
        promoDiscountFromId(redeemedVoucher.id, subtotal) ||
        promoDiscFallback(redeemedVoucher, subtotal);
    } else if (redeemedVoucher.type === "shipping") {
      discShipFromCode =
        shippingDiscountFromId(redeemedVoucher.id, shippingFee) ||
        shipDiscFallback(redeemedVoucher, shippingFee);
    }
  }

  const totalPromoDisc = discPromoFromList + discPromoFromCode;
  const totalShipDisc = Math.min(discShipFromList + discShipFromCode, shippingFee);
  const netShipping = Math.max(0, shippingFee - totalShipDisc);
  const grandTotal = Math.max(0, subtotal - totalPromoDisc + netShipping);
  const savedTotal = totalPromoDisc + totalShipDisc;

  const logos = [
    { src: "/images/paymentlogo/bca.svg", alt: "BCA", w: 62, h: 22 },
    { src: "/images/paymentlogo/mandiri.png", alt: "Mandiri", w: 70, h: 20 },
    { src: "/images/paymentlogo/kredivo.png", alt: "Kredivo", w: 72, h: 22 },
    { src: "/images/paymentlogo/ovo.png", alt: "OVO", w: 44, h: 22 },
    { src: "/images/paymentlogo/qris.png", alt: "QRIS", w: 56, h: 22 },
  ] as const;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold mb-2">Detail pesanan</h3>

      <Row label="Subtotal" value={formatRupiah(subtotal)} />
      {totalPromoDisc > 0 && (
        <Row label="Diskon promo" value={`- ${formatRupiah(totalPromoDisc)}`} dim />
      )}

      {shippingFee > 0 && (
        <>
          <Row label="Ongkir" value={formatRupiah(shippingFee)} />
          {totalShipDisc > 0 && (
            <Row label="Diskon ongkir" value={`- ${formatRupiah(totalShipDisc)}`} dim />
          )}
        </>
      )}

      <div className="h-px my-2 bg-gray-100" />
      <Row
        label={<span className="font-semibold">Total</span>}
        value={<span className="font-semibold">{formatRupiah(grandTotal)}</span>}
      />

      {savedTotal > 0 && (
        <p className="mt-1 text-xs text-emerald-700">
          Kamu hemat <b>{formatRupiah(savedTotal)}</b>
        </p>
      )}

      <button
        type="button"
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => !disabled && router.push("/checkout")}
        className={`mt-3 w-full h-11 rounded-lg transition text-white ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
            : "bg-primary hover:bg-secondary cursor-pointer"
        }`}
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

function Row({
  label,
  value,
  dim,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  dim?: boolean;
}) {
  return (
    <div className={`flex justify-between text-sm ${dim ? "text-emerald-700" : "text-gray-600"}`}>
      <span>{label}</span>
      <span className={dim ? "font-medium" : "font-semibold text-gray-900"}>{value}</span>
    </div>
  );
}
