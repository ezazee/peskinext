"use client";

import React from "react";
import { Calendar, ChevronDown, Search, X } from "lucide-react";
import type { UserTransaction } from "@shared/types/types";

/* ====== Types ====== */
export type StatusGroup = "all" | "progress" | "success" | "failed";

export type DateFilter =
  | { kind: "all" }
  | { kind: "last"; days: 30 | 90 }
  | { kind: "range"; from: string; to: string };

type Props = {
  data: ReadonlyArray<UserTransaction>;

  // Product select
  product: string | "all";
  onProductChange: (v: string | "all") => void;

  // Search
  search: string;
  onSearchChange: (v: string) => void;

  // Date
  date: DateFilter;
  onDateChange: (v: DateFilter) => void;

  // Grouped status (desktop pills)
  group: StatusGroup;
  onGroupChange: (g: StatusGroup) => void;

  // Reset all filters
  onReset: () => void;

  status?: unknown;
  onStatusChange?: (v: unknown) => void;
};

/* ====== Component ====== */
export default function TransactionFiltersDesktop({
  data,
  product,
  onProductChange,
  search,
  onSearchChange,
  date,
  onDateChange,
  group,
  onGroupChange,
  onReset,
}: Props) {
  const productOptions = React.useMemo<ReadonlyArray<string>>(() => {
    const s = new Set<string>();
    data.forEach((t) => t.items.forEach((it) => s.add(it.product.name)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [data]);

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
    <div className="rounded-xl border bg-white p-4">
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

        {/* Product */}
        <div className="relative">
          <select
            value={product}
            onChange={(e) => onProductChange(e.target.value as "all" | string)}
            className="h-10 w-[240px] appearance-none rounded-lg border border-gray-300 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Semua Produk</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
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
              className="absolute z-30 mt-2 w-[420px] rounded-xl border bg-white shadow-xl"
              role="dialog"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="font-semibold">Pilih tanggal</div>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={() => setDateOpen(false)}
                  className="rounded p-1 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="p-3">
                <div className="space-y-2">
                  <RadioRow
                    name="date-desktop"
                    label="Semua Tanggal Transaksi"
                    checked={tmpDate.kind === "all"}
                    onChange={() => setTmpDate({ kind: "all" })}
                  />
                  <RadioRow
                    name="date-desktop"
                    label="30 Hari Terakhir"
                    checked={tmpDate.kind === "last" && tmpDate.days === 30}
                    onChange={() => setTmpDate({ kind: "last", days: 30 })}
                  />
                  <RadioRow
                    name="date-desktop"
                    label="90 Hari Terakhir"
                    checked={tmpDate.kind === "last" && tmpDate.days === 90}
                    onChange={() => setTmpDate({ kind: "last", days: 90 })}
                  />
                  <div className="rounded-lg border">
                    <RadioRow
                      name="date-desktop"
                      label="Pilih Tanggal Sendiri"
                      checked={tmpDate.kind === "range"}
                      onChange={() =>
                        setTmpDate({
                          kind: "range",
                          from: tmpDate.kind === "range" ? tmpDate.from : "",
                          to: tmpDate.kind === "range" ? tmpDate.to : "",
                        })
                      }
                      className="px-3 py-2"
                    />
                    {tmpDate.kind === "range" && (
                      <div className="grid grid-cols-2 gap-3 px-3 pb-3">
                        <DateInput
                          label="Mulai dari"
                          value={tmpDate.from}
                          onChange={(v) =>
                            setTmpDate({
                              kind: "range",
                              from: v,
                              to: tmpDate.to,
                            })
                          }
                        />
                        <DateInput
                          label="Sampai"
                          value={tmpDate.to}
                          onChange={(v) =>
                            setTmpDate({
                              kind: "range",
                              from: tmpDate.from,
                              to: v,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={resetDate}
                      className="h-10 rounded-lg border px-3 text-sm"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={applyDate}
                      className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Terapkan
                    </button>
                  </div>
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

      {/* Pills status (UI sesuai gambar-1, isi ikut grup mobile) */}
      <StatusPills group={group} onGroupChange={onGroupChange} />
    </div>
  );
}

/* ====== Sub components ====== */

function StatusPills({
  group,
  onGroupChange,
}: {
  group: StatusGroup;
  onGroupChange: (g: StatusGroup) => void;
}) {
  const base = "h-9 px-4 rounded-full border text-sm";
  const active = "border-sky-400 ring-1 ring-sky-200 text-sky-700 bg-sky-50";
  const normal = "border-gray-200 text-gray-700 hover:bg-gray-50";

  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-semibold">Status</div>
      <div className="flex flex-wrap gap-2">
        <button
          className={`${base} ${group === "all" ? active : normal}`}
          onClick={() => onGroupChange("all")}
        >
          Semua
        </button>
        <button
          className={`${base} ${group === "progress" ? active : normal}`}
          onClick={() => onGroupChange("progress")}
        >
          Berlangsung
        </button>
        <button
          className={`${base} ${group === "success" ? active : normal}`}
          onClick={() => onGroupChange("success")}
        >
          Berhasil
        </button>
        <button
          className={`${base} ${group === "failed" ? active : normal}`}
          onClick={() => onGroupChange("failed")}
        >
          Tidak Berhasil
        </button>
        <button
          className={`${base} border-gray-200 text-gray-300 cursor-not-allowed`}
          disabled
        >
          E-tiket &amp; E-voucher Aktif
        </button>
      </div>
    </div>
  );
}

function RadioRow({
  name,
  label,
  checked,
  onChange,
  className,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}) {
  return (
    <label
      className={[
        "flex items-center justify-between rounded-lg hover:bg-gray-50",
        className ?? "px-2 py-2",
      ].join(" ")}
    >
      <span className="text-sm">{label}</span>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-primary"
      />
    </label>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-gray-500">{label}</div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
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
