"use client";

import React from "react";
import { Calendar, ChevronDown, Search, X } from "lucide-react";

/* ====== Types ====== */
export type TxFilter =
  | "all"
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type DateFilter =
  | { kind: "all" }
  | { kind: "last"; days: 30 | 90 }
  | { kind: "range"; from: string; to: string };

type Props = {

  // Product select
  product: string | "all";
  onProductChange: (v: string | "all") => void;

  // Search
  search: string;
  onSearchChange: (v: string) => void;

  // Date
  date: DateFilter;
  onDateChange: (v: DateFilter) => void;

  // Status (shared)
  status: TxFilter;
  onStatusChange: (v: TxFilter) => void;

  // Reset all filters
  onReset: () => void;
};

/* ====== Component ====== */
/* ====== Component ====== */
export default function TransactionFiltersDesktop({
  product,
  onProductChange,
  search,
  onSearchChange,
  date,
  onDateChange,
  status,
  onStatusChange,
  onReset,
}: Props) {
  const [dateOpen, setDateOpen] = React.useState(false);
  const [tmpDate, setTmpDate] = React.useState<DateFilter>(date);
  React.useEffect(() => setTmpDate(date), [date, dateOpen]);

  function applyDate(): void {
    onDateChange(tmpDate);
    setDateOpen(false);
  }
  function resetDate(): void {
    setTmpDate({ kind: "all" });
  }

  return (
    <div className="rounded-xl shadow-sm bg-white p-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari transaksimu di sini"
            className="h-10 w-[260px] rounded-lg border border-gray-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        {/* Product Category (Single/Bundle) */}
        <div className="relative">
          <select
            value={product}
            onChange={(e) => onProductChange(e.target.value as "all" | string)}
            className="h-10 w-[240px] appearance-none rounded-lg border border-gray-300 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Semua Kategori</option>
            <option value="single">Single Product</option>
            <option value="bundle">Bundle Product</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Date popover trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDateOpen((v) => !v)}
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm text-gray-700"
            aria-haspopup="dialog"
            aria-expanded={dateOpen}
          >
            <Calendar className="h-4 w-4" />
            <span>{dateLabel(date)}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {dateOpen && (
            <div
              className="absolute z-30 mt-2 w-[320px] rounded-xl bg-white shadow-xl ring-1 ring-black/5"
              role="dialog"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="font-semibold text-gray-900">Filter Tanggal</div>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={() => setDateOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Presets */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pilih Cepat
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <DatePresetBtn
                      label="Semua"
                      active={tmpDate.kind === "all"}
                      onClick={() => setTmpDate({ kind: "all" })}
                    />
                    <DatePresetBtn
                      label="30 Hari"
                      active={tmpDate.kind === "last" && tmpDate.days === 30}
                      onClick={() => setTmpDate({ kind: "last", days: 30 })}
                    />
                    <DatePresetBtn
                      label="90 Hari"
                      active={tmpDate.kind === "last" && tmpDate.days === 90}
                      onClick={() => setTmpDate({ kind: "last", days: 90 })}
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Manual Range */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manual
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Dari</span>
                      <input
                        type="date"
                        value={tmpDate.kind === "range" ? tmpDate.from : ""}
                        onChange={(e) =>
                          setTmpDate({
                            kind: "range",
                            from: e.target.value,
                            to: tmpDate.kind === "range" ? tmpDate.to : "",
                          })
                        }
                        className="w-full rounded-lg bg-gray-50 border-0 px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">Sampai</span>
                      <input
                        type="date"
                        value={tmpDate.kind === "range" ? tmpDate.to : ""}
                        onChange={(e) =>
                          setTmpDate({
                            kind: "range",
                            from: tmpDate.kind === "range" ? tmpDate.from : "",
                            to: e.target.value,
                          })
                        }
                        className="w-full rounded-lg bg-gray-50 border-0 px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={resetDate}
                    className="flex-1 h-9 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={applyDate}
                    className="flex-1 h-9 rounded-lg bg-primary text-xs font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="ml-auto text-sm font-semibold text-primary hover:text-secondary cursor-pointer hover:underline"
        >
          Reset Filter
        </button>
      </div>

      {/* Pills status */}
      <StatusPills status={status} onStatusChange={onStatusChange} />
    </div>
  );
}

/* ====== Sub components ====== */

function StatusPills({
  status,
  onStatusChange,
}: {
  status: TxFilter;
  onStatusChange: (s: TxFilter) => void;
}) {
  const base = "h-9 px-4 rounded-full text-sm font-medium transition-colors";
  const active = "text-sky-700 bg-sky-100 shadow-sm";
  const normal = "text-gray-600 bg-gray-100 hover:bg-gray-200";

  const tabs: { val: TxFilter; label: string }[] = [
    { val: "all", label: "Semua" },
    { val: "pending", label: "Menunggu Pembayaran" },
    { val: "paid", label: "Menunggu Konfirmasi" },
    { val: "processing", label: "Diproses" },
    { val: "shipped", label: "Dikirim" },
    { val: "delivered", label: "Selesai" },
    { val: "cancelled", label: "Dibatalkan" },
  ];

  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-semibold">Status</div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.val}
            className={`${base} ${status === tab.val ? active : normal}`}
            onClick={() => onStatusChange(tab.val)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}



/* ====== helpers ====== */
function dateLabel(v: DateFilter): string {
  if (v.kind === "all") return "Pilih Tanggal Transaksi";
  if (v.kind === "last") return `${v.days} Hari Terakhir`;
  return `${fmt(v.from)} — ${fmt(v.to)}`;
}
function fmt(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(+d)) return "—";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DatePresetBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active
        ? "bg-primary text-white shadow-md shadow-primary/20 ring-1 ring-primary/50"
        : "bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-gray-100"
        }`}
    >
      {label}
    </button>
  );
}
