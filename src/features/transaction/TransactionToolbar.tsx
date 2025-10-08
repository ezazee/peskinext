"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { TxFilter } from "./TransactionFilters";
import type { UserTransaction } from "@data/index";

type Props = {
  data: ReadonlyArray<UserTransaction>;
  value: TxFilter;
  onChange: (v: TxFilter) => void;
  search: string;
  onSearch: (q: string) => void;
  onReset: () => void;
};

export default function TransactionToolbar({
  data,
  value,
  onChange,
  search,
  onSearch,
  onReset,
}: Props) {
  const count = useMemo(() => {
    const base: Record<TxFilter, number> = {
      all: data.length,
      pending: data.filter((d) => d.status === "pending").length,
      paid: data.filter((d) => d.status === "paid").length,
      shipped: data.filter((d) => d.status === "shipped").length,
      delivered: data.filter((d) => d.status === "delivered").length,
      cancelled: data.filter((d) => d.status === "cancelled").length,
    };
    return base;
  }, [data]);

  const Chip = ({ k, label }: { k: TxFilter; label: string }) => {
    const active = value === k;
    return (
      <button
        type="button"
        onClick={() => onChange(k)}
        className={[
          "h-9 px-3 rounded-full text-sm transition",
          active
            ? "bg-emerald-600 text-white shadow-sm"
            : "bg-white border text-gray-700 hover:bg-gray-50",
        ].join(" ")}
      >
        {label}{" "}
        {typeof count[k] === "number" && k !== "all" ? (
          <span
            className={active ? "ml-1 text-white/90" : "ml-1 text-gray-500"}
          >
            {count[k]}
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="bg-white border rounded-2xl p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 md:grid md:grid-cols-[1fr_auto] md:items-center">
        {/* Search + (mock) select/filter kanan */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="sr-only">Cari transaksi</label>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Cari transaksimu di sini"
                className="w-full h-10 rounded-lg border px-3 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
          <button
            type="button"
            className="h-10 px-3 rounded-lg border text-sm bg-white hover:bg-gray-50"
            onClick={onReset}
            aria-label="Reset filter"
          >
            Reset Filter
          </button>
        </div>

        {/* Chips status */}
        <div className="flex flex-wrap gap-2">
          <Chip k="all" label="Semua" />
          <Chip k="pending" label="Pending" />
          <Chip k="paid" label="Paid" />
          <Chip k="shipped" label="Shipped" />
          <Chip k="delivered" label="Delivered" />
          <Chip k="cancelled" label="Cancelled" />
        </div>
      </div>
    </motion.div>
  );
}
