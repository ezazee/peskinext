"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Calendar, ArrowRight } from "lucide-react";
import type { UserTransaction } from "@shared/types/types";

type TxStatus = UserTransaction["status"];

export default function TransactionListDesktop({
  data,
}: {
  data: ReadonlyArray<UserTransaction>;
}) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Belum ada transaksi</h3>
        <p className="text-gray-500 text-sm mt-1">Yuk mulai belanja produk favoritmu!</p>
        <Link href="/all-product" className="mt-6 px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-4">
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
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
                  <ShoppingBag size={14} />
                  <span>Belanja</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500 font-medium inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {fmtDate(t.dateISO)}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-400 font-mono tracking-wide">{t.invoiceNumber || t.id}</span>
              </div>
              <div>
                {badge(t.status)}
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-6 items-center">
              <div className="relative group cursor-pointer">
                <Image
                  src={thumb}
                  alt={title}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="min-w-0 pr-4">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  {productTypeLabel}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                  {title}
                </h3>
                <p className="text-sm text-gray-500">
                  {qty} Barang {t.items.length > 1 && `(+${t.items.length - 1} lainnya)`}
                </p>
              </div>

              <div className="text-right border-l border-gray-100 pl-6 h-full flex flex-col justify-center">
                <p className="text-xs text-gray-500 font-medium mb-1">Total Belanja</p>
                <p className="text-lg font-bold text-gray-900">
                  Rp {t.total.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
              <Link
                href={`/account/transaction/${t.id}`}
                className="text-gray-500 text-sm font-semibold hover:text-primary transition-colors inline-flex items-center gap-1 group"
              >
                Lihat Detail
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-3">
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
  const base = "inline-flex items-center justify-center h-10 px-5 rounded-xl text-sm font-bold transition-all active:scale-95";

  // Pending → Bayar Sekarang
  if (status === "pending") {
    return (
      <Link
        href={`/checkout?tx=${encodeURIComponent(id)}`}
        className={`${base} bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40`}
      >
        Bayar Sekarang
      </Link>
    );
  }

  // Dikirim → Lacak Pesanan
  if (status === "shipped") {
    return (
      <Link
        href={`/account/transaction/${id}`}
        className={`${base} bg-white shadow-sm text-gray-700 hover:bg-gray-50 hover:shadow-md`}
      >
        Lacak Pesanan
      </Link>
    );
  }

  // Berhasil
  if (status === "delivered") {
    return (
      <>
        <Link
          href={`/product/${slug}`}
          className={`${base} bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90`}
        >
          Beli Lagi
        </Link>
        <Link
          href={`/account/transaction/${id}?tab=review`}
          className={`${base} shadow-sm text-green-700 bg-green-50 hover:bg-green-100 hover:shadow-md`}
        >
          Beri Nilai
        </Link>
      </>
    );
  }

  // Lainnya (status === 'paid' goes here -> Detail)
  return (
    <Link
      href={`/account/transaction/${id}`}
      className={`${base} bg-white shadow-sm text-gray-700 hover:bg-gray-50 hover:shadow-md`}
    >
      Detail
    </Link>
  );
}

function badge(s: TxStatus) {
  const styles: Record<TxStatus, string> = {
    pending: "bg-amber-100/50 text-amber-700 border-amber-200",
    paid: "bg-blue-100/50 text-blue-700 border-blue-200",
    shipped: "bg-sky-100/50 text-sky-700 border-sky-200",
    delivered: "bg-green-100/50 text-green-700 border-green-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const labelMap: Record<TxStatus, string> = {
    pending: "Menunggu Pembayaran",
    paid: "Sedang Diproses",
    shipped: "Sedang Dikirim",
    delivered: "Selesai",
    cancelled: "Dibatalkan"
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${styles[s]}`}
    >
      {labelMap[s]}
    </span>
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
