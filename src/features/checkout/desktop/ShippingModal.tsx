// src/features/checkout/desktop/ShippingModal.tsx
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  XMarkIcon,
  CheckCircleIcon,
  BoltIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { ShippingDetailData, ShippingOption } from "@data/shipingData";
import { formatRupiah } from "@shared/libs/format";

type Props = {
  open: boolean;
  onClose: () => void;
  data: ShippingDetailData;
  selectedId: string | null;
  onConfirm: (opt: ShippingOption) => void;
};

const etaMinDays = (eta: string): number => {
  const m = eta.match(/(\d+)/);
  return m && m[1] ? parseInt(m[1], 10) || 0 : 0;
};

type SortBy = "cheapest" | "fastest";

export default function ShippingModal({
  open,
  onClose,
  data,
  selectedId,
  onConfirm,
}: Props) {
  const [activeGroup, setActiveGroup] = useState<string>("Semua");
  const [sortBy, setSortBy] = useState<SortBy>("cheapest");

  // Close via ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const groupsWithCount = useMemo(
    () =>
      [
        {
          label: "Semua",
          count: data.groups.reduce((n, g) => n + g.items.length, 0),
        },
        ...data.groups.map((g) => ({ label: g.label, count: g.items.length })),
      ].filter((g) => g.count > 0),
    [data]
  );

  const visibleGroups = useMemo(() => {
    if (activeGroup === "Semua") {
      return data.groups.filter((g) => g.items.length > 0);
    }
    return data.groups
      .filter((g) => g.label === activeGroup && g.items.length > 0)
      .map((g) => g);
  }, [activeGroup, data]);

  const sortOptions = (arr: ShippingOption[]): ShippingOption[] => {
    const a = [...arr];
    if (sortBy === "cheapest") a.sort((x, y) => x.price - y.price);
    else a.sort((x, y) => etaMinDays(x.eta) - etaMinDays(y.eta));
    return a;
  };

  const totalItems = visibleGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shipping-modal-title"
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl bg-white rounded-t-2xl md:rounded-2xl shadow-xl"
            initial={{ y: 40, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur px-5 pt-4 pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    id="shipping-modal-title"
                    className="text-lg font-semibold"
                  >
                    Pilih layanan pengiriman
                  </h3>
                  <p className="text-xs text-gray-500">
                    {data.origin} → {data.destination} • {data.weightGr}gr
                  </p>
                </div>
                <button
                  aria-label="Tutup"
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs group */}
              <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {groupsWithCount.map((g) => {
                  const active = activeGroup === g.label;
                  return (
                    <button
                      key={g.label}
                      onClick={() => setActiveGroup(g.label)}
                      className={[
                        "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition",
                        active
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {g.label}
                      <span className="ml-1 text-[10px] opacity-70">
                        {g.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sort controls */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-gray-500">Urutkan:</span>
                <SortPill
                  active={sortBy === "cheapest"}
                  onClick={() => setSortBy("cheapest")}
                  icon={<BoltIcon className="h-3.5 w-3.5" />}
                >
                  Termurah
                </SortPill>
                <SortPill
                  active={sortBy === "fastest"}
                  onClick={() => setSortBy("fastest")}
                  icon={<ClockIcon className="h-3.5 w-3.5" />}
                >
                  Tercepat
                </SortPill>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              {totalItems === 0 && (
                <div className="text-center text-sm text-gray-500 py-10">
                  Belum ada layanan yang tersedia.
                </div>
              )}

              {visibleGroups.map((g) => (
                <Fragment key={g.label}>
                  <div className="px-1 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    {g.label}
                  </div>

                  <div className="space-y-3">
                    {sortOptions(g.items).map((opt) => {
                      const active = selectedId === opt.id;
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          layout
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.995 }}
                          onClick={() => onConfirm(opt)}
                          className={[
                            "w-full text-left rounded-xl px-4 py-3 ring-1 transition shadow-sm",
                            active
                              ? "ring-primary bg-sky-50"
                              : "ring-gray-100 hover:bg-gray-50",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">
                                  {opt.courier}
                                </span>
                                <span className="text-xs text-gray-600">
                                  • {opt.service}
                                </span>
                              </div>
                              <div className="mt-0.5 text-xs text-gray-600">
                                {opt.eta}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-sm font-bold">
                                {formatRupiah(opt.price)}
                              </div>
                              <CheckCircleIcon
                                className={[
                                  "h-5 w-5",
                                  active ? "text-primary" : "text-gray-300",
                                ].join(" ")}
                              />
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </Fragment>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 pb-4 pt-2 border-t bg-white rounded-b-2xl">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Menampilkan {totalItems} layanan • Harga dapat berubah
                  sewaktu-waktu
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* small pill */
function SortPill({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition",
        active
          ? "bg-sky-50 text-primary border-primary"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}
