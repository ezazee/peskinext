"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { UserTransaction } from "@shared/types/types";

type TxStatus = UserTransaction["status"];

export default function TransactionListDesktop({
  data,
}: {
  data: ReadonlyArray<UserTransaction>;
}) {
  return (
    <section className="space-y-3">
      {data.map((t, i) => {
        const first = t.items[0];
        const title = first ? first.product.name : "—";
        const thumb =
          first?.product.img ?? "https://placehold.co/80x80?text=IMG";
        const slug = first?.product.slug ?? "";
        const qty = t.items.reduce((n, it) => n + it.quantity, 0);

        // Label aman tanpa mengandalkan field 'category'
        const productTypeLabel: string = (() => {
          const p = first?.product as
            | Partial<{ type: "single" | "bundle" }>
            | undefined;
          return p?.type === "bundle" ? "Bundle" : "Produk";
        })();

        return (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, delay: i * 0.03 }}
            className="bg-white border rounded-2xl p-4 shadow-sm"
          >
            {/* Head: 'Pembelian' + icon di ujung */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-gray-900">Pembelian</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{fmtDate(t.dateISO)}</span>
                <span className="text-gray-400">•</span>
                {badge(t.status)}
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{t.id}</span>
              </div>
              <span className="grid place-content-center w-6 h-6 rounded-full border">
                👜
              </span>
            </div>

            {/* Body */}
            <div className="mt-3 grid grid-cols-[1fr_auto] gap-4">
              <div className="flex gap-3">
                <Image
                  src={thumb}
                  alt={title}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-md object-cover border"
                />
                <div className="min-w-0">
                  <div className="text-xs text-primary font-medium">
                    {productTypeLabel}
                  </div>
                  <div className="font-medium text-sm line-clamp-1">
                    {title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {qty} barang · Rp {t.total.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              <div className="w-48 text-right">
                <div className="text-xs text-gray-500">Total Belanja</div>
                <div className="text-base font-semibold">
                  Rp {t.total.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {/* Footer actions per status */}
            <div className="mt-3 flex items-center justify-between">
              <Link
                href={`/account/transaction/${t.id}`}
                className="text-primary text-sm font-medium hover:underline"
              >
                Lihat Detail Transaksi
              </Link>

              <div className="flex items-center gap-2">
                {renderActions(t.status, t.id, slug)}
              </div>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}

function renderActions(status: TxStatus, id: string, slug: string) {
  // Pending → Bayar Sekarang
  const base =
    "inline-flex items-center justify-center h-5 rounded-lg px-4 text-sm font-semibold leading-none text-center transition";
  if (status === "pending") {
    return (
      <Link
        href={`/checkout?tx=${encodeURIComponent(id)}`}
        className={`${base} h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90`}
      >
        Bayar Sekarang
      </Link>
    );
  }

  // Berlangsung → Detail (paid, shipped)
  if (status === "paid" || status === "shipped") {
    return (
      <Link
        href={`/account/transaction/${id}`}
        className={`${base} h-9 px-3 rounded-lg border text-sm hover:bg-gray-50`}
      >
        Detail
      </Link>
    );
  }

  // Berhasil → Beli Lagi + Beri Nilai (delivered)
  if (status === "delivered") {
    return (
      <>
        <Link
          href={`/product/${slug}`}
          className={`${base} h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90`}
        >
          Beli Lagi
        </Link>
        <Link
          href={`/account/transaction/${id}?tab=review`}
          className={`${base} h-9 px-3 rounded-lg border text-sm hover:bg-gray-50`}
        >
          Beri Nilai
        </Link>
      </>
    );
  }

  // Cancelled / lainnya → Detail saja
  return (
    <Link
      href={`/account/transaction/${id}`}
      className={`${base} h-9 px-3 rounded-lg border text-sm hover:bg-gray-50`}
    >
      Detail
    </Link>
  );
}

function badge(s: TxStatus) {
  const styles: Record<TxStatus, string> = {
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    paid: "bg-blue-50 text-blue-700 border border-blue-200",
    shipped: "bg-sky-50 text-sky-700 border border-sky-200",
    delivered: "bg-green-50 text-green-700 border border-green-200",
    cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
  };
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[s]}`}
    >
      {label}
    </span>
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
