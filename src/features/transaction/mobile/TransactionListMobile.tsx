"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { UserTransaction } from "@shared/types/types";
import { PaymentTimer } from "../components/PaymentTimer";

const currency = (n: number) =>
  `Rp ${n.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

const STATUS_LABEL: Record<UserTransaction["status"], string> = {
  pending: "Menunggu Pembayaran",
  paid: "Menunggu Konfirmasi",
  processing: "Sedang Dikemas",
  shipped: "Sedang Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_BADGE: Record<UserTransaction["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-orange-100 text-orange-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export default function TransactionListMobile({
  data,
}: {
  data: ReadonlyArray<UserTransaction>;
}) {
  return (
    <div className="grid gap-3">
      {data.map((t) => (
        <motion.article
          key={t.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="rounded-xl bg-white overflow-hidden shadow-sm"
        >
          {/* Header ringkas */}
          <div className="px-4 py-3 border-b text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-800">Pembelian</span>
              <span>•</span>
              <span>
                {new Date(t.dateISO).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="text-gray-700">{t.invoiceNumber || t.id}</span>
            </div>

            {/* Status badge kanan atas */}
            <span
              className={`ml-auto text-[11px] font-medium px-2 py-0.5 rounded ${STATUS_BADGE[t.status]
                }`}
            >
              {STATUS_LABEL[t.status]}
            </span>
          </div>

          {/* Isi ringkasan produk */}
          <div className="px-4 py-3">
            <div className="flex items-start gap-3">
              <Image
                src={t.items[0].product.img}
                alt={t.items[0].product.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {t.items[0].product.name}
                </div>
                <div className="text-xs text-gray-500">
                  {t.items.length > 1 ? `${t.items.length} barang` : `1 barang`}{" "}
                  • Total Belanja
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Total Belanja</div>
                <div className="text-sm font-semibold">{currency(t.total)}</div>
              </div>
            </div>

            {/* Tombol aksi */}
            <div className="mt-3 flex items-center justify-end gap-2">
              {t.status === "pending" ? (
                <>
                  <Link
                    href={`/payment/${t.id}`}
                    className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
                  >
                    Bayar Sekarang
                  </Link>
                  {t.expiresAt && (
                    <div className="flex justify-center ml-3">
                      <PaymentTimer expiresAt={t.expiresAt} compact />
                    </div>
                  )}
                </>
              ) : t.status === "shipped" && t.trackingNumber ? (
                <a
                  href={`https://biteship.com/id/tracking?w=${t.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-4 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 text-sm font-semibold hover:bg-blue-100 flex items-center justify-center"
                >
                  Lacak Paket
                </a>
              ) : t.status === "delivered" ? (
                <>
                  {(() => {
                    const allItemsReviewed = t.items.every(item => item.review);
                    const hasAnyReview = t.items.some(item => item.review);

                    return (
                      <>
                        <Link
                          href={`/product/${t.items[0]?.product.slug}`}
                          className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
                        >
                          Beli Lagi
                        </Link>
                        <Link
                          href={`/account/transaction/${t.id}?tab=review`}
                          className={`h-9 px-4 rounded-lg text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center ${hasAnyReview
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'border hover:bg-gray-50'
                            }`}
                        >
                          {allItemsReviewed ? 'Lihat Review' : hasAnyReview ? 'Lihat/Beri Nilai' : 'Beri Nilai'}
                        </Link>
                      </>
                    );
                  })()}
                </>
              ) : (
                <Link
                  href={`/account/transaction/${t.id}`}
                  className="h-9 px-4 rounded-lg border text-sm font-semibold hover:bg-gray-50 active:bg-gray-50 flex items-center justify-center"
                >
                  Detail
                </Link>
              )}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
