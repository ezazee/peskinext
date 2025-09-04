"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, easeInOut } from "framer-motion";
import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import VoucherModalSkeleton from "../desktop/skeleton/VoucherModal.skeleton";
import { useToast } from "@shared/components/ui/Toaster";
import type {
  Voucher,
  VoucherSelection,
  RedeemResult,
} from "@shared/types/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (payload: VoucherSelection) => void;
  shipping: Array<Voucher & { _reason?: string }>;
  promos: Array<Voucher & { _reason?: string }>;
  initialSelected?: VoucherSelection;
  loading?: boolean;
  onRedeemCode?: (codeUpper: string) => Promise<RedeemResult>;
};

export default function VoucherModalMobile({
  open,
  onClose,
  onApply,
  shipping,
  promos,
  initialSelected,
  loading = false,
  onRedeemCode,
}: Props) {
  const toast = useToast();

  const [tab, setTab] = useState<"shipping" | "promo">("shipping");
  const [code, setCode] = useState(initialSelected?.code ?? "");
  const [codeApplied, setCodeApplied] = useState<boolean>(
    Boolean(initialSelected?.code)
  );
  const [shippingId, setShippingId] = useState<string | null>(
    initialSelected?.shippingId ?? null
  );
  const [promoId, setPromoId] = useState<string | null>(
    initialSelected?.promoId ?? null
  );
  const [redeemBusy, setRedeemBusy] = useState(false);

  const selectedCount = useMemo(
    () => (shippingId ? 1 : 0) + (promoId ? 1 : 0) + (codeApplied ? 1 : 0),
    [shippingId, promoId, codeApplied]
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  // kunci scroll dsb.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // sync saat modal dibuka
  useEffect(() => {
    if (!open) return;
    setCode(initialSelected?.code ?? "");
    setCodeApplied(Boolean(initialSelected?.code));
    setShippingId(initialSelected?.shippingId ?? null);
    setPromoId(initialSelected?.promoId ?? null);
  }, [open, initialSelected]);

  async function handleRedeem() {
    const raw = code.trim();
    if (!raw) return;
    const upper = raw.toUpperCase();

    if (!onRedeemCode) {
      setCodeApplied(true);
      onApply({ code: upper, shippingId, promoId });
      toast.success("Kode berhasil diterapkan.");
      return;
    }

    setRedeemBusy(true);
    const res = await onRedeemCode(upper);
    setRedeemBusy(false);

    if (!res.ok) {
      toast.error(res.reason ?? "Kode tidak valid", "Gagal menerapkan kode");
      return;
    }

    setCodeApplied(true);
    toast.success("Kode berhasil diterapkan.");
    onApply({ code: upper, shippingId, promoId });
  }

  function handleCancelCode() {
    const last = code;
    setCodeApplied(false);
    setCode("");
    onApply({ code: undefined, shippingId, promoId });
    toast.info(
      last ? `Kode ${last.toUpperCase()} dibatalkan.` : "Kode dibatalkan."
    );
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.15, ease: easeInOut },
          }}
          exit={{ opacity: 0, transition: { duration: 0.14, ease: easeInOut } }}
          onClick={onClose}
        >
          <motion.div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pakai promo"
            onClick={(e) => e.stopPropagation()}
            className="relative z-[201] w-full h-[86vh] rounded-t-2xl bg-white shadow-2xl flex flex-col"
            initial={{ y: 28, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { type: "spring", stiffness: 340, damping: 28 },
            }}
            exit={{ y: 24, opacity: 0, transition: { duration: 0.16 } }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-white/80 backdrop-blur-sm">
              <h3 className="text-base font-semibold">Pakai promo</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-primary text-sm font-semibold"
              >
                Selesai
              </button>
            </div>

            {loading ? (
              <VoucherModalSkeleton />
            ) : (
              <>
                {/* Kode promo */}
                <div className="px-4 pt-3">
                  <div className="flex items-stretch gap-2">
                    <input
                      ref={inputRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Kode promo"
                      className={`flex-1 h-11 rounded-lg px-3 text-sm outline-none ring-1 ${
                        codeApplied
                          ? "bg-gray-50 ring-gray-200 text-gray-500"
                          : "ring-gray-300 focus:ring-2 focus:ring-primary/70"
                      }`}
                      disabled={codeApplied || redeemBusy}
                      aria-disabled={codeApplied || redeemBusy}
                    />

                    {!codeApplied ? (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="h-11 px-4 rounded-lg bg-primary text-white text-sm font-semibold disabled:bg-gray-200 disabled:text-gray-500"
                        disabled={!code.trim() || redeemBusy}
                        onClick={handleRedeem}
                      >
                        {redeemBusy ? "Memakai..." : "Pakai"}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="h-11 px-4 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        onClick={handleCancelCode}
                        aria-label="Batalkan kode voucher"
                      >
                        Batalkan
                      </motion.button>
                    )}
                  </div>
                  {codeApplied && (
                    <div className="mt-2 text-[12px] text-emerald-700">
                      Kode terpasang: <b>{code.toUpperCase()}</b>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="px-4 mt-4">
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
                    <motion.div
                      className="absolute bottom-0 h-0.5 bg-primary rounded"
                      initial={false}
                      animate={{
                        left: tab === "shipping" ? "0%" : "50%",
                        width: "50%",
                      }}
                      transition={{ duration: 0.22, ease: easeInOut }}
                    />
                  </div>
                </div>

                {/* List konten */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                  {tab === "shipping" ? (
                    <SectionList
                      title="Gratis Ongkir"
                      items={shipping}
                      selectedId={shippingId}
                      onSelect={(id) =>
                        setShippingId((prev) => (prev === id ? null : id))
                      }
                    />
                  ) : (
                    <SectionList
                      title="Voucher & Promo"
                      items={promos}
                      selectedId={promoId}
                      onSelect={(id) =>
                        setPromoId((prev) => (prev === id ? null : id))
                      }
                    />
                  )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 px-4 py-3 border-t bg-white/85 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="text-[13px] text-gray-600">
                      <span className="font-semibold">
                        {selectedCount} promo
                      </span>{" "}
                      terpilih.
                    </div>
                    <button
                      type="button"
                      className="ml-auto h-10 px-5 rounded-full bg-primary text-white font-semibold disabled:bg-gray-200 disabled:text-gray-500"
                      onClick={() =>
                        onApply({
                          code: codeApplied
                            ? code.trim().toUpperCase()
                            : undefined,
                          shippingId,
                          promoId,
                        })
                      }
                    >
                      Pakai
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- List Voucher (mobile) ---------- */
function SectionList({
  title,
  items,
  selectedId,
  onSelect,
}: {
  title: string;
  items: Array<Voucher & { _reason?: string }>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <section>
      <h4 className="text-base font-semibold">{title}</h4>
      {items.length === 0 ? (
        <p className="mt-1 text-sm text-gray-500">Belum tersedia.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((v, i) => {
            const active = selectedId === v.id;
            const disabled = !v.enabled;
            return (
              <motion.li
                key={v.id}
                initial={{ y: 6, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { delay: i * 0.02, duration: 0.18 },
                }}
              >
                <div
                  className={[
                    "w-full text-left cursor-pointer rounded-xl p-3 flex items-start gap-3 transition",
                    disabled
                      ? "bg-gray-50 opacity-60 pointer-events-none"
                      : "bg-white hover:bg-gray-50 ring-1 ring-gray-200",
                    active ? "ring-2 ring-primary/70" : "",
                  ].join(" ")}
                  onClick={() => !disabled && onSelect(active ? null : v.id)}
                  role="button"
                >
                  <BrandCheckbox
                    checked={active}
                    onChange={(checked) => {
                      if (disabled) return;
                      onSelect(checked ? v.id : null);
                    }}
                    ariaLabel={`Pilih ${v.title}`}
                    className="mt-1"
                    size={16}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{v.title}</div>
                    <div className="text-xs text-gray-600">
                      {v.enabled
                        ? v.subtitle ?? ""
                        : v._reason ?? v.subtitle ?? "Tidak memenuhi syarat"}
                    </div>
                    {v.savingLabel && v.enabled && (
                      <div className="mt-1 inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                        {v.savingLabel}
                      </div>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
