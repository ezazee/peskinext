// src/features/checkout/mobile/PaymentMethodsMobile.tsx
"use client";

// import Image from "next/image";
import * as React from "react";

// export type PaymentMethod = {
//   id: string;
//   title: string;
//   subtitle?: string;
//   logoSrc?: string; // opsional, kalau mau logo kecil di sisi kanan
//   logoAlt?: string;
// };

// type Props = {
//   selectedId: string | null;
//   onChange: (id: string) => void;
//   methods?: ReadonlyArray<PaymentMethod>;
//   loading?: boolean;
// };
type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedId?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading?: any;
}

// const DEFAULT_METHODS: ReadonlyArray<PaymentMethod> = [
//   {
//     id: "card",
//     title: "Kartu kredit/debit",
//     subtitle: "Bayar penuh atau cicilan 0%",
//     logoSrc: "/images/paymentlogo/bca.svg",
//     logoAlt: "Card",
//   },
//   {
//     id: "va_bca",
//     title: "Virtual Account • Bank BCA",
//     subtitle: "Bayar lewat ATM / m-banking",
//     logoSrc: "/images/paymentlogo/mandiri.png",
//     logoAlt: "VA",
//   },
//   {
//     id: "qris",
//     title: "QRIS",
//     subtitle: "Scan semua e-wallet & bank",
//     logoSrc: "/images/paymentlogo/qris.png",
//     logoAlt: "QRIS",
//   },
// ];

// // Tambahkan helper kecil di atas default export (atau di file terpisah)
// function PaymentLogo({ src, alt }: { src: string; alt: string }) {
//   const isSvg = src.endsWith(".svg");
//   const targetPx = 20; // h-5 = 20px

//   return (
//     <Image
//       src={src}
//       alt={alt}
//       width={100} // angka apa saja untuk rasio intrinsik
//       height={100}
//       sizes={`${targetPx}px`} // target lebar render ~ 20px
//       className="object-contain opacity-80"
//       style={{ height: targetPx, width: "auto" }} // << kunci: height + width:auto
//       loading="lazy"
//       unoptimized={isSvg} // SVG tak perlu dioptimasi
//     />
//   );
// }

export default function PaymentMethodsMobile({
  // selectedId,
  // onChange,
  // methods = DEFAULT_METHODS,
  // loading = false,
}: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold">Metode pembayaran</h3>
      </div>

      <div className="px-4 pb-3 space-y-2">
        <label
          className={[
            "block rounded-lg border transition cursor-pointer",
            "border-primary ring-1 ring-primary/40 bg-sky-50"
          ].join(" ")}
        >
          <input
            type="radio"
            name="pay-method"
            className="sr-only"
            checked={true}
            readOnly
          />
          <div className="px-3 py-3 flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-primary"
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">Online Payment</div>
              <div className="mt-0.5 text-xs text-gray-600">
                Virtual Account, QRIS, Kartu Kredit, E-Wallet (via DOKU)
              </div>
            </div>
          </div>
        </label>
      </div>
    </section>
  );
}
