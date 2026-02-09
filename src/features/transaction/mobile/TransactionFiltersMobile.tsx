"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { TxFilter } from "@features/transaction/TransactionFilters";

/* -------------------- Types -------------------- */

export type DateFilter =
  | { kind: "all" }
  | { kind: "last"; days: 30 | 90 }
  | { kind: "range"; from: string; to: string };

type Props = {

  status: TxFilter;
  onStatusChange: (v: TxFilter) => void;

  product: string | "all";
  onProductChange: (v: string | "all") => void;

  date: DateFilter;
  onDateChange: (v: DateFilter) => void;
};

type SheetKind = "status" | "product" | "date" | null;

/* -------------------- Component -------------------- */

export default function TransactionFiltersMobile({
  status,
  onStatusChange,
  product,
  onProductChange,
  date,
  onDateChange,
}: Props) {
  const [open, setOpen] = React.useState<SheetKind>(null);

  return (
    <>
      {/* Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <PillButton
          label={statusLabel(status)}
          onClick={() => setOpen("status")}
        />
        <PillButton
          label={product === "all" ? "Semua Produk" : product}
          onClick={() => setOpen("product")}
        />
        <PillButton label={dateLabel(date)} onClick={() => setOpen("date")} />
      </div>

      {/* STATUS SHEET */}
      <BottomSheet
        open={open === "status"}
        onClose={() => setOpen(null)}
        title="Mau lihat status apa?"
      >
        <div className="divide-y">
          <SheetSection title="Semua Status Transaksi">
            <RadioRow
              name="status"
              checked={status === "all"}
              label="Semua Status"
              onChange={() => {
                onStatusChange("all");
                setOpen(null);
              }}
            />
          </SheetSection>

          <SheetSection title="Semua Transaksi Berlangsung">
            <RadioRow
              name="status"
              checked={status === "pending"}
              label="Menunggu Pembayaran"
              onChange={() => {
                onStatusChange("pending");
                setOpen(null);
              }}
            />
            <RadioRow
              name="status"
              checked={status === "paid"}
              label="Terbayar"
              onChange={() => {
                onStatusChange("paid");
                setOpen(null);
              }}
            />
            <RadioRow
              name="status"
              checked={status === "shipped"}
              label="Dikirim"
              onChange={() => {
                onStatusChange("shipped");
                setOpen(null);
              }}
            />
          </SheetSection>

          <SheetSection title="Berhasil">
            <RadioRow
              name="status"
              checked={status === "delivered"}
              label="Sampai / Delivered"
              onChange={() => {
                onStatusChange("delivered");
                setOpen(null);
              }}
            />
          </SheetSection>

          <SheetSection title="Tidak Berhasil">
            <RadioRow
              name="status"
              checked={status === "cancelled"}
              label="Dibatalkan"
              onChange={() => {
                onStatusChange("cancelled");
                setOpen(null);
              }}
            />
          </SheetSection>
        </div>
      </BottomSheet>

      {/* PRODUCT SHEET */}
      <BottomSheet
        open={open === "product"}
        onClose={() => setOpen(null)}
        title="Pilih kategori"
      >
        <SheetSection title="">
          <RadioRow
            name="product"
            checked={product === "all"}
            label="Semua Kategori"
            onChange={() => {
              onProductChange("all");
              setOpen(null);
            }}
          />
          <RadioRow
            name="product"
            checked={product === "single"}
            label="Single Product"
            onChange={() => {
              onProductChange("single");
              setOpen(null);
            }}
          />
          <RadioRow
            name="product"
            checked={product === "bundle"}
            label="Bundle Product"
            onChange={() => {
              onProductChange("bundle");
              setOpen(null);
            }}
          />
        </SheetSection>
      </BottomSheet>

      {/* DATE SHEET */}
      <DateSheet
        open={open === "date"}
        value={date}
        onClose={() => setOpen(null)}
        onApply={(v) => {
          onDateChange(v);
          setOpen(null);
        }}
      />
    </>
  );
}

/* -------------------- Sub components -------------------- */

function PillButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 active:bg-gray-200 transition-colors"
    >
      <span className="truncate max-w-[200px]">{label}</span>
      <ChevronDown className="h-4 w-4 text-gray-400" />
    </button>
  );
}

function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <div className="mx-auto max-w-screen-sm rounded-t-2xl bg-white shadow-xl">
              <div className="p-4 border-b">
                <div className="mx-auto h-1 w-10 rounded-full bg-gray-200 mb-3" />
                <h3 className="text-base font-semibold">{title}</h3>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">{children}</div>
              <div className="h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-2">
      {title ? (
        <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500">
          {title}
        </div>
      ) : null}
      <div className="mt-1">{children}</div>
    </section>
  );
}

function RadioRow({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between px-4 py-3 active:bg-gray-50">
      <span className="text-sm">{label}</span>
      <input
        type="radio"
        name={name}
        className="h-5 w-5 accent-primary"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}

/* ---- Date sheet (dengan custom range + Terapkan) ---- */

function DateSheet({
  open,
  value,
  onClose,
  onApply,
}: {
  open: boolean;
  value: DateFilter;
  onClose: () => void;
  onApply: (v: DateFilter) => void;
}) {
  const [mode, setMode] = React.useState<DateFilter["kind"]>(value.kind);
  const [from, setFrom] = React.useState<string>(
    value.kind === "range" ? value.from : ""
  );
  const [to, setTo] = React.useState<string>(
    value.kind === "range" ? value.to : ""
  );

  React.useEffect(() => {
    if (!open) return;
    setMode(value.kind);
    setFrom(value.kind === "range" ? value.from : "");
    setTo(value.kind === "range" ? value.to : "");
  }, [open, value]);

  function handleApply() {
    if (mode === "all") return onApply({ kind: "all" });
    if (mode === "last") return onApply({ kind: "last", days: 30 }); // tidak dipakai, di-set di radio
    // mode === "range"
    if (!from || !to) return;
    if (new Date(from) > new Date(to)) return; // guard sederhana
    onApply({ kind: "range", from, to });
  }

  const isValidRange =
    mode !== "range" || (!!from && !!to && new Date(from) <= new Date(to));

  return (
    <BottomSheet open={open} onClose={onClose} title="Pilih tanggal">
      <div className="divide-y">
        <SheetSection title="">
          <RadioRow
            name="date"
            checked={mode === "all"}
            label="Semua Tanggal Transaksi"
            onChange={() => setMode("all")}
          />
          <RadioRow
            name="date"
            checked={mode === "last" && isLast(value, 30)}
            label="30 Hari Terakhir"
            onChange={() => onApply({ kind: "last", days: 30 })}
          />
          <RadioRow
            name="date"
            checked={mode === "last" && isLast(value, 90)}
            label="90 Hari Terakhir"
            onChange={() => onApply({ kind: "last", days: 90 })}
          />
          <RadioRow
            name="date"
            checked={mode === "range"}
            label="Pilih Tanggal Sendiri"
            onChange={() => setMode("range")}
          />
        </SheetSection>

        {mode === "range" && (
          <div className="px-4 py-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Mulai dari</div>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Sampai</div>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="col-span-2 mt-2">
              <button
                type="button"
                disabled={!isValidRange}
                onClick={handleApply}
                className="w-full h-11 rounded-lg bg-primary text-white font-semibold disabled:opacity-60"
              >
                Terapkan
              </button>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

/* -------------------- Helpers -------------------- */

function statusLabel(v: TxFilter): string {
  switch (v) {
    case "pending":
      return "Pending";
    case "paid":
      return "Paid";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Semua Status";
  }
}

function dateLabel(v: DateFilter): string {
  if (v.kind === "all") return "Semua Tanggal";
  if (v.kind === "last") return `${v.days} Hari Terakhir`;
  // range
  return `${fmtDate(v.from)} — ${fmtDate(v.to)}`;
}

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function isLast(v: DateFilter, days: 30 | 90): boolean {
  return v.kind === "last" && v.days === days;
}
