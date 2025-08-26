// src/shared/components/ui/ShipingModal/desktop/ShippingModalDesktop.tsx
"use client";

import type { ShippingDetailData, ShippingOption } from "@shared/types/types";
import { XMarkIcon } from "@shared/components/icons";

type Props = {
  open: boolean;
  data: ShippingDetailData;
  selectedId?: string;
  onSelect?: (opt: ShippingOption) => void;
  onClose: () => void;
};

export default function ShippingModalDesktop({ open, data, onClose }: Props) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[89] hidden md:block bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={[
          "fixed left-1/2 top-1/2 z-[90] hidden md:block",
          "w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl",
          "transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-lg font-semibold">Detail Pengiriman</h3>
          <button
            aria-label="Tutup"
            onClick={onClose}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md hover:bg-gray-100"
          >
            <XMarkIcon />
          </button>
        </div>

        <div className="px-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
            <div className="text-gray-600">Dari</div>
            <div className="truncate font-medium">{data.origin}</div>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
            <div className="text-gray-600">Dikirim ke</div>
            <div className="truncate font-medium">{data.destination}</div>
          </div>
          <p className="mb-3 text-xs text-gray-600">
            Berat 1pcs: <b>{data.weightGr}gr</b> • {data.note || "Total ongkir dihitung saat checkout"}
          </p>
        </div>

        <div className="mt-4 h-px w-full bg-gray-100" />

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {data.groups.map((g) => (
            <section key={g.label} className="mb-5">
              <header className="mb-2 text-[13px] font-semibold text-gray-800">{g.label}</header>

              {g.items.length === 0 && (
                <div className="px-1 py-3 text-xs text-gray-500">Belum ada layanan tersedia.</div>
              )}

              <ul className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 divide-y divide-gray-300">
                {g.items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="flex flex-1 items-start gap-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary self-center shrink-0" />
                      <div className="text-sm leading-tight">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="font-medium">{it.courier}</span>
                          {it.service && <span className="text-gray-500">({it.service})</span>}
                          {it.badges?.map((b) => (
                            <span
                              key={b}
                              className="ml-1 rounded-full bg-emerald-50 px-2 py-[2px] text-[10px] font-medium text-emerald-700"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">{it.eta}</div>
                      </div>
                    </div>
                    <div className="whitespace-nowrap text-sm font-semibold">
                      Rp{it.price.toLocaleString("id-ID")}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
