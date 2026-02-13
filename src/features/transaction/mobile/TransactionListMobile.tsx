"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { UserTransaction } from "@shared/types/types";
import { X } from "lucide-react";
import TrackingTimeline from "../components/TrackingTimeline";
import type { TrackingHistory } from "../components/TrackingTimeline";
import { PaymentTimer } from "../components/PaymentTimer";
import React from "react";

const currency = (n: number) =>
  `Rp ${n.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

const STATUS_LABEL: Record<UserTransaction["status"], string> = {
  pending: "Menunggu Pembayaran",
  paid: "Menunggu Konfirmasi",
  processing: "Diproses",
  shipped: "Dikirim",
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

// ... existing imports

export default function TransactionListMobile({
  data,
}: {
  data: ReadonlyArray<UserTransaction>;
}) {
  const [trackingModalOpen, setTrackingModalOpen] = React.useState(false);
  const [activeTracking, setActiveTracking] = React.useState<{ id: string; number: string; courier: string } | null>(null);
  const [trackingHistory, setTrackingHistory] = React.useState<TrackingHistory[]>([]);
  const [loadingTracking, setLoadingTracking] = React.useState(false);

  const handleTrack = async (id: string, number: string, courier: string) => {
    setActiveTracking({ id, number, courier });
    setTrackingModalOpen(true);
    setLoadingTracking(true);
    setTrackingHistory([]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/tracking/${id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.history)) {
        setTrackingHistory(data.history);
      }
    } catch (err) {
      console.error("Failed to fetch tracking", err);
    } finally {
      setLoadingTracking(false);
    }
  };

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
            {(() => {
              const isExpired =
                t.status === "pending" &&
                t.expiresAt &&
                new Date(t.expiresAt).getTime() < Date.now();

              const displayStatus = isExpired ? "cancelled" : t.status;

              return (
                <span
                  className={`ml-auto text-[11px] font-medium px-2 py-0.5 rounded ${STATUS_BADGE[displayStatus]
                    }`}
                >
                  {STATUS_LABEL[displayStatus]}
                </span>
              );
            })()}
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
              <Link
                href={`/account/transaction/${t.id}`}
                className="h-9 px-4 rounded-lg border text-sm font-semibold hover:bg-gray-50 active:bg-gray-50 flex items-center justify-center"
              >
                Detail
              </Link>

              {(() => {
                const isExpired =
                  t.status === "pending" &&
                  t.expiresAt &&
                  new Date(t.expiresAt).getTime() < Date.now();

                // 1. PENDING
                if (t.status === "pending") {
                  if (isExpired) {
                    // Expired -> anggap seperti Cancelled -> Beli Lagi
                    return (
                      <Link
                        href={`/product/${t.items[0]?.product.slug}`}
                        className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
                      >
                        Beli Lagi
                      </Link>
                    );
                  }
                  // Not Expired -> Bayar
                  return (
                    <>
                      <Link
                        href={`/checkout?tx=${t.id}`}
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
                  );
                }

                // 2. DIKIRIM
                if (t.status === "shipped" && t.trackingNumber) {
                  return (
                    <button
                      onClick={() => handleTrack(t.id, t.trackingNumber!, t.courier || "")}
                      className="h-9 px-4 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 text-sm font-semibold hover:bg-blue-100 flex items-center justify-center"
                    >
                      Lacak Paket
                    </button>
                  );
                }

                // 3. SELESAI
                if (t.status === "delivered") {
                  const allItemsReviewed = t.items.every((item) => item.review);
                  const hasAnyReview = t.items.some((item) => item.review);

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
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "border hover:bg-gray-50"
                          }`}
                      >
                        {allItemsReviewed
                          ? "Lihat Review"
                          : hasAnyReview
                            ? "Lihat/Beri Nilai"
                            : "Beri Nilai"}
                      </Link>
                    </>
                  );
                }

                // 4. CANCELLED -> Beli Lagi
                if (t.status === "cancelled") {
                  return (
                    <Link
                      href={`/product/${t.items[0]?.product.slug}`}
                      className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
                    >
                      Beli Lagi
                    </Link>
                  );
                }

                return null;
              })()}
            </div>
          </div>
        </motion.article>
      ))}

      {/* TRACKING MODAL */}
      {trackingModalOpen && activeTracking && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-semibold text-gray-800">Status Pengiriman</h3>
                <div className="text-xs text-gray-500 mt-1">
                  {activeTracking.courier && <span className="uppercase font-bold">{activeTracking.courier}</span>}
                  {activeTracking.courier && " - "}
                  {activeTracking.number}
                </div>
              </div>
              <button onClick={() => setTrackingModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-0 overflow-y-auto flex-1 pb-safe">
              <TrackingTimeline
                history={trackingHistory}
                loading={loadingTracking}
                trackingNumber={activeTracking.number}
                courier={activeTracking.courier}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
