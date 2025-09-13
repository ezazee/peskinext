"use client";

import { totals } from "@data/checkoutMock";
import Image from "next/image";

const fmt = (n: number) => `Rp ${new Intl.NumberFormat("id-ID").format(n)}`;

export default function OrderSummaryDesktop() {
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
      <h3 className="font-semibold mb-3">Detail pembayaran</h3>

      <div className="space-y-2 text-sm">
        <Row
          label={`Total harga (${totals.items} produk)`}
          value={fmt(totals.subtotal)}
        />
        <Row
          label="Ongkos kirim"
          value={
            totals.shipping === 0 ? (
              <span>
                <span className="mr-2 text-gray-400 line-through">
                  {fmt(totals.shippingBefore)}
                </span>
                <span className="text-primary font-medium">Gratis</span>
              </span>
            ) : (
              fmt(totals.shipping)
            )
          }
        />
        <Row
          label="Biaya penanganan"
          value={<span className="text-primary font-medium">Gratis</span>}
        />
        <Row label="Biaya platform" value={fmt(totals.platformFee)} />

        <hr className="my-2 border-gray-200/70" />

        <Row
          label="Total pembayaran"
          value={
            <span className="font-semibold">{fmt(totals.grandTotal)}</span>
          }
        />
        <div className="text-xs text-gray-600">
          Poin yang didapat:{" "}
          <span className="font-medium">{totals.points}</span>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-xl px-5 py-3 font-medium bg-primary text-white hover:bg-secondary transition-colors cursor-pointer active:scale-[.99]"
      >
        Bayar Sekarang
      </button>

      <div className="mt-4 pt-3">
        <p className="text-center text-xs text-gray-500 mb-5">
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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}
