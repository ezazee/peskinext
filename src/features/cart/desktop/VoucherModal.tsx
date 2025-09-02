"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, easeInOut } from "framer-motion";
import { XMarkIcon } from "@shared/components/icons";
import type { Voucher, VoucherSelection } from "@shared/types/types";
import VoucherModalSkeleton from "./skeleton/VoucherModal.skeleton";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (payload: VoucherSelection) => void;
  shipping: Voucher[];
  promos: Voucher[];
  initialSelected?: VoucherSelection;
  loading?: boolean; // tampilkan skeleton di dalam modal
};

export default function VoucherModal({
  open,
  onClose,
  onApply,
  shipping,
  promos,
  initialSelected,
  loading = false,
}: Props) {
  const [tab, setTab] = useState<"shipping" | "promo">("shipping");
  const [code, setCode] = useState(initialSelected?.code ?? "");
  const [shippingId, setShippingId] = useState<string | null>(
    initialSelected?.shippingId ?? null
  );
  const [promoId, setPromoId] = useState<string | null>(
    initialSelected?.promoId ?? null
  );

  const selectedCount = useMemo(
    () => (shippingId ? 1 : 0) + (promoId ? 1 : 0) + (code.trim() ? 1 : 0),
    [shippingId, promoId, code]
  );

  // lock scroll + esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.15, ease: easeInOut } }}
          exit={{ opacity: 0, transition: { duration: 0.15, ease: easeInOut } }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          />

          {/* Sheet */}
          <motion.div
            className="relative z-[201] w-[min(92vw,720px)] max-h-[82vh] rounded-2xl bg-white shadow-2xl flex flex-col"
            initial={{ y: 14, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 24 } }}
            exit={{ y: 10, opacity: 0, transition: { duration: 0.12 } }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Pakai promo"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold">Pakai promo</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-primary text-sm font-semibold"
              >
                Sembunyikan
              </button>
            </div>

            {loading ? (
              <VoucherModalSkeleton />
            ) : (
              <>
                {/* Kode promo */}
                <div className="px-5 pt-4">
                  <div className="flex items-stretch gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Kode promo"
                      className="flex-1 h-10 rounded-lg border px-3 text-sm outline-none focus:border-primary"
                    />
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold disabled:bg-gray-200 disabled:text-gray-500"
                      disabled={!code.trim()}
                      onClick={() => onApply({ code: code.trim(), shippingId, promoId })}
                    >
                      Pakai
                    </motion.button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-5 mt-4">
                  <div className="relative grid grid-cols-2">
                    {(["shipping", "promo"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`pb-3 text-sm font-medium ${
                          tab === t ? "text-primary" : "text-gray-600"
                        }`}
                      >
                        {t === "shipping" ? "Gratis Ongkir" : "Voucher & Promo"}
                      </button>
                    ))}
                    {/* underline anim */}
                    <motion.div
                      className="absolute bottom-0 h-0.5 bg-primary rounded"
                      initial={false}
                      animate={{ left: tab === "shipping" ? "0%" : "50%", width: "50%" }}
                      transition={{ duration: 0.22, ease: easeInOut }}
                    />
                  </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {/* Gratis ongkir */}
                  <section className={tab !== "shipping" ? "hidden" : "block"}>
                    <h4 className="text-base font-semibold">Gratis Ongkir</h4>
                    {shipping.length === 0 ? (
                      <p className="mt-1 text-sm text-gray-500">Belum tersedia.</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {shipping.map((v, i) => (
                          <motion.li
                            key={v.id}
                            initial={{ y: 6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, transition: { delay: i * 0.02, duration: 0.18 } }}
                            className={`rounded-xl border p-3 flex items-start gap-3 ${
                              v.enabled ? "bg-white" : "bg-gray-50 opacity-60"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              className="mt-1"
                              checked={shippingId === v.id}
                              onChange={() => v.enabled && setShippingId(v.id)}
                              disabled={!v.enabled}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{v.title}</div>
                              {v.subtitle && (
                                <div className="text-xs text-gray-600">{v.subtitle}</div>
                              )}
                              {v.savingLabel && (
                                <div className="mt-1 inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                                  {v.savingLabel}
                                </div>
                              )}
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </section>

                  {/* Voucher & Promo */}
                  <section className={tab !== "promo" ? "hidden" : "block"}>
                    <h4 className="text-base font-semibold">Voucher & Promo</h4>
                    {promos.length === 0 ? (
                      <p className="mt-1 text-sm text-gray-500">Belum tersedia.</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {promos.map((v, i) => (
                          <motion.li
                            key={v.id}
                            initial={{ y: 6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, transition: { delay: i * 0.02, duration: 0.18 } }}
                            className={`rounded-xl border p-3 flex items-start gap-3 ${
                              v.enabled ? "bg-white" : "bg-gray-50 opacity-60"
                            }`}
                          >
                            <input
                              type="radio"
                              name="promo"
                              className="mt-1"
                              checked={promoId === v.id}
                              onChange={() => v.enabled && setPromoId(v.id)}
                              disabled={!v.enabled}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{v.title}</div>
                              {v.subtitle && (
                                <div className="text-xs text-gray-600">{v.subtitle}</div>
                              )}
                              {v.savingLabel && (
                                <div className="mt-1 inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                                  {v.savingLabel}
                                </div>
                              )}
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t flex items-center">
                  <div className="text-[13px] text-gray-600">
                    <span className="font-semibold">{selectedCount} promo</span> terpilih.{" "}
                    <button type="button" className="text-primary font-semibold">Lihat</button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="ml-auto h-10 px-5 rounded-full bg-primary text-white font-semibold disabled:bg-gray-200 disabled:text-gray-500"
                    onClick={() => onApply({ code: code.trim() || undefined, shippingId, promoId })}
                  >
                    Pakai
                  </motion.button>
                </div>
              </>
            )}

            {/* tombol X */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 h-8 w-8 grid place-items-center rounded-full hover:bg-gray-100"
              aria-label="Tutup"
            >
              <XMarkIcon />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
