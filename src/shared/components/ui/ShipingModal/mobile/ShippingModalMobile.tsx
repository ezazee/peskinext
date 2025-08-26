// src/shared/components/ui/ShipingModal/mobile/ShippingModalMobile.tsx
"use client";

import type { ShippingDetailData, ShippingOption } from "@shared/types/types";
import { XMarkIcon } from "@shared/components/icons";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  data: ShippingDetailData;
  selectedId?: string;
  onSelect?: (opt: ShippingOption) => void;
  onClose: () => void;
};

export default function ShippingModalMobile({ open, data, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const sheetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) sheetRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            onClick={onClose}
            className="fixed inset-0 z-[89] bg-black/30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Detail Pengiriman"
            ref={sheetRef}
            tabIndex={-1}
            className="fixed inset-x-0 bottom-0 z-[90] md:hidden mx-auto w-full max-w-md rounded-t-2xl bg-white shadow-2xl flex max-h-[85vh] flex-col pointer-events-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-2">
              <div className="mx-auto mb-1 h-1.5 w-10 rounded-full bg-gray-300/80" />
            </div>

            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 pb-2">
              <div className="flex items-center gap-3 py-2">
                <button
                  aria-label="Tutup"
                  onClick={onClose}
                  className="grid cursor-pointer h-8 w-8 place-items-center rounded-full hover:bg-gray-100"
                >
                  <XMarkIcon />
                </button>
                <h3 className="text-base font-semibold">Detail Pengiriman</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-gray-50 px-3 py-2">
                  <div className="text-gray-500">Dari</div>
                  <div className="truncate font-medium">{data.origin}</div>
                </div>
                <div className="rounded-lg bg-gray-50 px-3 py-2">
                  <div className="text-gray-500">Dikirim ke</div>
                  <div className="truncate font-medium">{data.destination}</div>
                </div>
              </div>
              <p className="mb-3 mt-3 text-xs text-gray-600">
                Berat 1pcs: <b>{data.weightGr}gr</b> •{" "}
                {data.note || "Total ongkir dihitung saat checkout"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
              {data.groups.map((g) => (
                <section key={g.label} className="mb-4">
                  <div className="mb-2 text-[12px] font-semibold text-gray-800">
                    {g.label}
                  </div>

                  {g.items.length === 0 && (
                    <div className="px-1 py-3 text-xs text-gray-500">
                      Belum ada layanan tersedia.
                    </div>
                  )}

                  <ul className="divide-y overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 divide-gray-300">
                    {g.items.map((it) => (
                      <li
                        key={it.id}
                        className="flex items-center justify-between gap-3 px-3 py-3"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 self-center" />
                          <div className="leading-tight">
                            <div className="flex flex-wrap items-center gap-1 text-sm">
                              <span className="font-medium">{it.courier}</span>
                              {it.service && (
                                <span className="text-gray-500">
                                  ({it.service})
                                </span>
                              )}
                              {it.badges?.map((b) => (
                                <span
                                  key={b}
                                  className="ml-1 rounded-full bg-emerald-50 px-2 py-[2px] text-[10px] font-medium text-emerald-700"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500">
                              {it.eta}
                            </div>
                          </div>
                        </div>
                        <div className="whitespace-nowrap pl-2 text-sm font-semibold">
                          Rp{it.price.toLocaleString("id-ID")}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              <div className="h-2" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
