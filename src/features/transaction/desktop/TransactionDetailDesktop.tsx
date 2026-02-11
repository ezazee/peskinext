"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { OrderItem, UserTransaction } from "@shared/types/types";
import { resolveUnitPrice, resolveVariantName } from "../utils/utils";
import TrackingTimeline from "../components/TrackingTimeline";
import { PaymentTimer } from "../components/PaymentTimer";

// sumber data untuk Info Pengiriman
// import { addressBook } from "@data/address";
// import { shippingByTx } from "@data/shippingOrder";

/* ================= helpers ================= */

function currency(n: number): string {
  return `Rp ${n.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
}

function fmtFull(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} pukul ${time}`;
}

function fmtDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type ShippingInfo = {
  courier: string;
  awb?: string;
  recipient: string;
  address: string;
  phone?: string;
  eta?: string;
  shippedAt?: string;
  deliveredAt?: string;
};


function buildShippingInfo(tx: UserTransaction): ShippingInfo | undefined {
  // Use mapped shippingAddress if available
  if (tx.shippingAddress) {
    return {
      courier: tx.courier || "",
      awb: tx.trackingNumber,
      recipient: tx.shippingAddress.recipient,
      phone: tx.shippingAddress.phone,
      address: `${tx.shippingAddress.addressLine}, ${tx.shippingAddress.city}, ${tx.shippingAddress.province} ${tx.shippingAddress.postalCode}`,
      eta: undefined,
      shippedAt: undefined,
      deliveredAt: undefined,
    };
  }

  if (!tx.addressId) return undefined;

  // Fallback if addressBook is empty or not found (since we don't have full address book in context yet)
  return {
    courier: tx.courier || "",
    awb: tx.trackingNumber,
    recipient: "Penerima",
    phone: "",
    address: "Alamat pengiriman",
    eta: undefined,
    shippedAt: undefined,
    deliveredAt: undefined,
  };
}

/* ================= main ================= */

export default function TransactionDetailDesktop({
  tx,
}: {
  tx: UserTransaction;
}) {
  // State for Tracking Modal
  const [showTrackingModal, setShowTrackingModal] = React.useState(false);
  const [trackingHistory, setTrackingHistory] = React.useState<any[]>([]);
  const [loadingTracking, setLoadingTracking] = React.useState(false);

  // Calculate breakdown
  const itemsSubtotal = tx.items.reduce((s, it) => s + it.subtotal, 0);
  const originalShipping = tx.originalShippingCost ?? tx.shippingCost ?? 0;
  const shippingDiscount = Math.max(0, (tx.originalShippingCost ?? 0) - (tx.shippingCost ?? 0));
  const promoDiscount = tx.discount ?? 0;
  const grandTotal = tx.total;

  // Fallback for old transactions: if math doesn't add up, show total discount
  const expectedTotal = itemsSubtotal + (tx.shippingCost ?? 0);
  const mathGap = expectedTotal - grandTotal;
  const hasOldData = !tx.originalShippingCost && mathGap > 0;
  const fallbackTotalDiscount = hasOldData ? mathGap : 0;

  const firstSlug = tx.items[0]?.product.slug ?? "";

  // info pengiriman + aturan tampil
  const shipping = buildShippingInfo(tx);
  const showCourier =
    tx.status === "shipped" ||
    tx.status === "delivered" ||
    tx.status === "processing" ||
    (tx.status === "paid" && Boolean(shipping?.courier));
  const showAwb = (tx.status === "shipped" || tx.status === "delivered") && Boolean(shipping?.awb);

  const infoNote: string | undefined =
    tx.status === "pending"
      ? "Menunggu pembayaran"
      : tx.status === "paid"
        ? "Pesanan menunggu diproses"
        : tx.status === "processing"
          ? "Pesanan sedang diproses"
          : tx.status === "shipped"
            ? "Pesanan sedang dalam perjalanan"
            : tx.status === "delivered"
              ? "Pesanan telah diterima"
              : "Pesanan dibatalkan";

  const fetchTracking = async () => {
    if (trackingHistory.length > 0) {
      setShowTrackingModal(true);
      return;
    }

    setLoadingTracking(true);
    setShowTrackingModal(true);

    try {
      // Use internal API which calls Biteship
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/tracking/${tx.id}`);
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

  const handleComplete = async () => {
    if (!confirm("Apakah Anda yakin sudah menerima pesanan dengan baik?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${tx.id}/complete`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Gagal update status");
      window.location.reload(); // Refresh to see new status
    } catch (err) {
      console.error(err);
      alert("Gagal memproses permintaan");
    }
  };

  const renderActions = () => {
    if (tx.status === "pending") {
      return (
        <div className="flex flex-col items-center gap-2">
          <Link
            href={`/checkout?tx=${encodeURIComponent(tx.id)}`}
            className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 inline-flex items-center justify-center"
          >
            Bayar Sekarang
          </Link>
          {tx.expiresAt && <PaymentTimer expiresAt={tx.expiresAt} />}
        </div>
      );
    }
    if (tx.status === "paid") {
      return (
        <Link
          href={`/account/transaction`}
          className="h-10 px-3 rounded-lg border text-sm hover:bg-gray-50 inline-flex items-center justify-center"
        >
          Kembali ke Riwayat
        </Link>
      );
    }
    if (tx.status === "shipped") {
      return (
        <div className="flex gap-2">
          {tx.trackingNumber && (
            <button
              onClick={fetchTracking}
              className="h-10 px-3 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 text-sm hover:bg-blue-100 inline-flex items-center justify-center"
            >
              Lacak Paket
            </button>
          )}
          <button
            onClick={handleComplete}
            className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 inline-flex items-center justify-center"
          >
            Pesanan Diterima
          </button>
        </div>
      );
    }
    if (tx.status === "delivered") {
      // Check if all items have been reviewed
      const allItemsReviewed = tx.items.every(item => item.review);
      const hasAnyReview = tx.items.some(item => item.review);

      return (
        <>
          <Link
            href={`/product/${firstSlug}`}
            className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 inline-flex items-center justify-center"
          >
            Beli Lagi
          </Link>
          <Link
            href={`/account/transaction/${tx.id}?tab=review`}
            className={`h-10 px-3 rounded-lg text-sm hover:opacity-90 inline-flex items-center justify-center ${hasAnyReview
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'border hover:bg-gray-50'
              }`}
          >
            {allItemsReviewed ? 'Lihat Review' : hasAnyReview ? 'Lihat/Beri Nilai' : 'Beri Nilai'}
          </Link>
        </>
      );
    }
    return (
      <Link
        href={`/account/transaction`}
        className="h-10 px-3 rounded-lg border text-sm hover:bg-gray-50 inline-flex items-center justify-center"
      >
        Kembali ke Riwayat
      </Link>
    );
  };

  return (
    <div className="space-y-4">
      {/* === Pesanan (mirip mobile) === */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Pesanan</h2>
          <StatusBadge status={tx.status} />
        </div>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">No. Invoice</span>
            <span className="font-medium">{tx.invoiceNumber || tx.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Tanggal Pembelian</span>
            <span className="font-medium">{fmtFull(tx.dateISO)}</span>
          </div>

          <div className="pt-1">
            <Link
              href={`/account/transaction/${tx.id}/invoice`}
              className="inline-flex items-center gap-1 text-xs text-primary"
            >
              Lihat Invoice
            </Link>
          </div>
        </div>
      </motion.section>

      {/* === Detail Produk (mirip mobile) === */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, delay: 0.05 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold">Detail Produk</h2>

        <div className="mt-3 space-y-3">
          {tx.items.map((it: OrderItem) => {
            const variantName = resolveVariantName(it);
            const unitPrice = resolveUnitPrice(it);
            return (
              <div
                key={it.product.id + String(it.variantId)}
                className="flex items-start gap-3"
              >
                <Image
                  width={100}
                  height={100}
                  src={it.product.img}
                  alt={it.product.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 line-clamp-1">
                    {it.product.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {variantName} · {it.quantity} x {currency(unitPrice)}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {currency(unitPrice)}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* === Info Pengiriman (logika sama dengan mobile) === */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, delay: 0.1 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold">Info Pengiriman</h2>

        <div className="mt-3 grid grid-cols-2 gap-6">
          <div className="space-y-2 text-sm">
            <Row
              label="Kurir"
              value={showCourier ? shipping?.courier ?? "—" : "—"}
            />
            <Row label="No Resi" value={showAwb ? shipping?.awb ?? "—" : "—"} />
            {shipping?.shippedAt &&
              (tx.status === "shipped" || tx.status === "delivered") && (
                <Row
                  label="Dikirim"
                  value={fmtDate(shipping.shippedAt) ?? "—"}
                />
              )}
          </div>

          <div className="text-sm">
            <div className="text-gray-500">Alamat</div>
            <div className="mt-1 whitespace-pre-line">
              {shipping ? (
                <>
                  <div className="font-medium">{shipping.recipient}</div>
                  {shipping.phone && <div>{shipping.phone}</div>}
                  <div className="text-gray-700">
                    {[
                      tx.shippingAddress?.addressLine,
                      tx.shippingAddress?.city,
                      tx.shippingAddress?.province,
                      tx.shippingAddress?.postalCode
                    ].filter(Boolean).join(", ") || shipping.address}
                  </div>
                </>
              ) : (
                "—"
              )}
            </div>
            {infoNote && (
              <div className="mt-2 text-xs text-gray-500">{infoNote}</div>
            )}
            {tx.status === "pending" && (
              <div className="mt-3">
                <Link
                  href={`/checkout?oid=${tx.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-xs font-medium hover:bg-gray-50 text-primary border-primary/20 bg-primary/5"
                >
                  Ubah Alamat & Bayar
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* === Rincian Pembayaran (copy dari mobile) === */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, delay: 0.15 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        {/* Rincian Pembayaran */}
        <section className="space-y-3">
          <h3 className="font-semibold">Rincian Pembayaran</h3>
          <Row label="Subtotal Harga Barang" value={currency(itemsSubtotal)} />
          <Row label="Total Ongkos Kirim" value={currency(originalShipping)} />

          {/* Always show discount lines if there's any discount */}
          {(shippingDiscount > 0 || (hasOldData && fallbackTotalDiscount > 0)) && (
            <Row
              label="Diskon Ongkir"
              value={`- ${currency(hasOldData ? 0 : shippingDiscount)}`}
            />
          )}
          {(promoDiscount > 0 || (hasOldData && fallbackTotalDiscount > 0)) && (
            <Row
              label="Diskon Promo"
              value={`- ${currency(hasOldData ? fallbackTotalDiscount : promoDiscount)}`}
            />
          )}

          <div className="border-t pt-2" />
          <Row label="Total Belanja" value={currency(grandTotal)} />
        </section>

        {/* Aksi bawah – disamakan dengan mobile */}
        <div className="mt-4 flex items-center justify-end gap-2">
          {renderActions()}
        </div>
      </motion.section>

      {/* === TRACKING MODAL === */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-800">Status Pengiriman</h3>
              <button onClick={() => setShowTrackingModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-0 overflow-y-auto flex-1">
              <TrackingTimeline
                history={trackingHistory}
                loading={loadingTracking}
                trackingNumber={tx.trackingNumber}
                courier={tx.courier}
              />
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

/* ---------- sub components & helpers ---------- */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: UserTransaction["status"] }) {
  const map: Record<
    UserTransaction["status"],
    { bg: string; fg: string; text: string }
  > = {
    pending: {
      bg: "bg-amber-50 border-amber-200",
      fg: "text-amber-700",
      text: "Menunggu Pembayaran",
    },
    paid: {
      bg: "bg-blue-50 border-blue-200",
      fg: "text-blue-700",
      text: "Menunggu Konfirmasi",
    },
    processing: {
      bg: "bg-orange-50 border-orange-200",
      fg: "text-orange-700",
      text: "Sedang Dikemas",
    },
    shipped: {
      bg: "bg-sky-50 border-sky-200",
      fg: "text-sky-700",
      text: "Sedang Dikirim",
    },
    delivered: {
      bg: "bg-green-50 border-green-200",
      fg: "text-green-700",
      text: "Selesai",
    },
    cancelled: {
      bg: "bg-rose-50 border-rose-200",
      fg: "text-rose-700",
      text: "Dibatalkan",
    },
  };
  const s = map[status];
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.fg}`}
    >
      {s.text}
    </span>
  );
}
