"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import * as React from "react";
import Image from "next/image";
import ConfirmationModal from "@shared/components/ui/ConfirmationModal";

import type { OrderItem, UserTransaction } from "@shared/types/types";
import { resolveUnitPrice, resolveVariantName } from "../utils/utils";
import { PaymentTimer } from "../components/PaymentTimer";
import type { TrackingHistory } from "../components/TrackingTimeline";


/** Untuk render Info Pengiriman */
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

type Props = {
  tx: UserTransaction;
  onBack?: () => void;
  shipping?: ShippingInfo; // override manual (opsional)
  onBuyAgain?: (productSlug: string) => void;
  onReview?: (transactionId: string) => void;
};

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

/** Rakitan shipping dari addressBook + shippingByTx */
/** Rakitan shipping dari addressBook + shippingByTx */
function buildShippingInfo(tx: UserTransaction): ShippingInfo | undefined {
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

  // Fallback similar to Desktop (addressBook removed as it was empty)
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

// ... (imports)
import TrackingTimeline from "../components/TrackingTimeline";
import { X } from "lucide-react";

// ... (existing code)

import { useRouter } from "next/navigation";

// ...

export default function TransactionDetailMobile({
  tx,
  onBack,
  shipping: shippingProp,
  onBuyAgain,
  onReview,
}: Props) {
  const router = useRouter(); // Initialize router

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // State for Tracking Modal
  const [showTrackingModal, setShowTrackingModal] = React.useState(false);
  const [trackingHistory, setTrackingHistory] = React.useState<TrackingHistory[]>([]);
  const [loadingTracking, setLoadingTracking] = React.useState(false);

  // ...

  // in return
  <button
    type="button"
    onClick={handleBack}
    aria-label="Kembali"
    className="p-1 -ml-1 rounded-md hover:bg-gray-100 active:bg-gray-100"
  >
    <ArrowLeft size={20} />
  </button>

  // ... (existing helper vars)

  const itemsSubtotal = React.useMemo(
    () => tx.items.reduce((acc, it) => acc + it.subtotal, 0),
    [tx.items]
  );

  // sumber shipping: prop > rakitan otomatis
  const shipping = React.useMemo<ShippingInfo | undefined>(
    () => shippingProp ?? buildShippingInfo(tx),
    [shippingProp, tx]
  );

  // Calculate breakdown
  const originalShipping = tx.originalShippingCost ?? tx.shippingCost ?? 0;
  const shippingDiscount = Math.max(0, (tx.originalShippingCost ?? 0) - (tx.shippingCost ?? 0));
  const promoDiscount = tx.discount ?? 0;
  const grandTotal = tx.total;

  // Fallback for old transactions
  const expectedTotal = itemsSubtotal + (tx.shippingCost ?? 0);
  const mathGap = expectedTotal - grandTotal;
  const hasOldData = !tx.originalShippingCost && mathGap > 0;
  const fallbackTotalDiscount = hasOldData ? mathGap : 0;

  // flag tampilan kurir/resi
  const showCourier =
    tx.status === "shipped" ||
    tx.status === "delivered" ||
    tx.status === "processing" ||
    (tx.status === "paid" && Boolean(shipping?.courier));


  const infoNote: string | undefined =
    tx.status === "pending"
      ? "Menunggu pembayaran"
      : tx.status === "paid"
        ? "Pesanan menunggu diproses"
        : tx.status === "processing"
          ? "Pesanan sedang diproses"
          : tx.status === "shipped"
            ? "Pesanan dalam perjalanan"
            : tx.status === "delivered"
              ? "Pesanan telah diterima"
              : "Pesanan dibatalkan";

  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [isCompleting, setIsCompleting] = React.useState(false);

  const fetchTracking = async () => {
    if (trackingHistory.length > 0) {
      setShowTrackingModal(true);
      return;
    }

    setLoadingTracking(true);
    setShowTrackingModal(true);

    try {
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
    setIsCompleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${tx.id}/complete`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Gagal update status");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Gagal memproses permintaan");
      setIsCompleting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto pb-24">

      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="flex items-center gap-3 px-4 h-12">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Kembali"
            className="p-1 -ml-1 rounded-md hover:bg-gray-100 active:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      {/* Ringkasan & status */}
      <section className="mx-3 mt-3">
        <div className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-sm font-medium">Pesanan</div>
            <div className="flex flex-col items-end gap-1">
              {(() => {
                const isExpired =
                  tx.status === "pending" &&
                  tx.expiresAt &&
                  new Date(tx.expiresAt).getTime() < Date.now();
                const displayStatus = isExpired ? "cancelled" : tx.status;
                return (
                  <span
                    className={`text-xs px-2 py-1 rounded ${STATUS_BADGE[displayStatus]}`}
                  >
                    {STATUS_LABEL[displayStatus]}
                  </span>
                );
              })()}
              {tx.status === "pending" &&
                tx.expiresAt &&
                new Date(tx.expiresAt).getTime() > Date.now() && (
                  <PaymentTimer expiresAt={tx.expiresAt} compact />
                )}
            </div>
          </div>
          <div className="px-4 py-3 space-y-2 text-sm">
            <span className="font-medium">
              {tx.invoiceNumber || `INV/${tx.dateISO.slice(0, 10).replace(/-/g, "")}/${tx.id.split("-")[0].toUpperCase()}`}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Tanggal Pembelian</span>
              <span className="font-medium">{fmtDate(tx.dateISO) ?? "-"}</span>
            </div>
            <div className="pt-2">
              <Link
                href={`/account/transaction/${tx.id}/invoice`}
                className="inline-flex items-center gap-1 text-xs text-primary"
              >
                <FileText size={16} />
                Lihat Invoice
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Produk */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-3 mt-3"
      >
        <div className="rounded-xl bg-white shadow-sm">
          <div className="px-4 py-3 border-b text-sm font-medium">
            Detail Produk
          </div>

          <div className="divide-y">
            {tx.items.map((it: OrderItem) => {
              const unitPrice = resolveUnitPrice(it);
              const variantName = resolveVariantName(it);
              return (
                <div
                  key={it.product.id + String(it.variantId)}
                  className="px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <Image
                      width={100}
                      height={100}
                      src={it.product.img}
                      alt={it.product.name}
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 line-clamp-2">
                        {it.product.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {variantName} · {it.quantity} x {currency(unitPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Info Pengiriman */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="mx-3 mt-3"
      >
        <div className="rounded-xl bg-white shadow-sm">
          <div className="px-4 py-3 border-b text-sm font-medium">
            Info Pengiriman
          </div>
          <div className="px-4 py-3 text-sm space-y-2">
            {/* Kurir hanya muncul sesuai aturan */}
            {showCourier ? (
              <Row label="Kurir" value={shipping?.courier || "—"} />
            ) : (
              <Row label="Kurir" value="—" />
            )}

            {/* Resi selalu muncul, strip jika kosong */}
            <Row label="No Resi" value={shipping?.awb || "—"} />

            <div>
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

              {/* Catatan status di bawah alamat */}
              {infoNote && (
                <div className="mt-2 text-xs text-gray-500">{infoNote}</div>
              )}

              {/* (Opsional) Ubah alamat saat pending & not expired */}
              {tx.status === "pending" &&
                (!tx.expiresAt || new Date(tx.expiresAt).getTime() > Date.now()) && (
                  <div className="mt-3">
                    <Link
                      href={`/checkout?tx=${tx.id}`}
                      className="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-xs font-medium hover:bg-gray-50 text-primary border-primary/20 bg-primary/5"
                    >
                      Ubah Alamat & Bayar
                    </Link>
                  </div>
                )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Rincian Pembayaran */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="mx-3 mt-3"
      >
        <div className="rounded-xl bg-white shadow-sm">
          <div className="px-4 py-3 border-b text-sm font-medium">
            <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
              <h3 className="font-semibold mb-2">Rincian Pembayaran</h3>
              <Row
                label="Subtotal Harga Barang"
                value={currency(itemsSubtotal)}
              />
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
              <Row label="Total Belanja" value={currency(grandTotal)} strong />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Sticky footer sesuai status */}
      {/* Sticky footer sesuai status */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t px-3 py-3">
        {(() => {
          const isExpired =
            tx.status === "pending" &&
            tx.expiresAt &&
            new Date(tx.expiresAt).getTime() < Date.now();

          // 1. DELIVERED
          if (tx.status === "delivered") {
            const allItemsReviewed = tx.items.every((item) => item.review);
            const hasAnyReview = tx.items.some((item) => item.review);
            const reviewLabel = allItemsReviewed
              ? "Lihat Review"
              : hasAnyReview
                ? "Lihat/Beri Nilai"
                : "Beri Nilai";

            return (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onReview?.(tx.id)}
                  className={`flex-1 h-11 rounded-lg border text-sm font-semibold flex items-center justify-center transition-all ${hasAnyReview
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {reviewLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const first = tx.items[0];
                    if (first) onBuyAgain?.(first.product.slug);
                  }}
                  className="flex-1 h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
                >
                  Beli Lagi
                </button>
              </div>
            );
          }

          // 2. PENDING
          if (tx.status === "pending") {
            if (isExpired) {
              // Expired -> Beli Lagi
              return (
                <button
                  type="button"
                  onClick={() => {
                    const first = tx.items[0];
                    if (first) onBuyAgain?.(first.product.slug);
                  }}
                  className="block w-full h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
                >
                  Beli Lagi
                </button>
              );
            }
            // Not expired -> Bayar
            return (
              <Link
                href={`/checkout?tx=${tx.id}`}
                className="block w-full h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
              >
                Bayar Sekarang
              </Link>
            );
          }

          // 3. SHIPPED
          if (tx.status === "shipped") {
            return (
              <div className="flex gap-2">
                {shipping?.awb && (
                  <button
                    onClick={fetchTracking}
                    className="flex-1 h-11 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 text-sm font-semibold hover:bg-blue-100 flex items-center justify-center"
                  >
                    Lacak Paket
                  </button>
                )}
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="flex-1 h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
                >
                  Pesanan Diterima
                </button>
              </div>
            );
          }

          // 4. CANCELLED -> Beli Lagi
          if (tx.status === "cancelled") {
            return (
              <button
                type="button"
                onClick={() => {
                  const first = tx.items[0];
                  if (first) onBuyAgain?.(first.product.slug);
                }}
                className="block w-full h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
              >
                Beli Lagi
              </button>
            );
          }

          // DEFAULT -> Kembali
          return (
            <Link
              href="/account/transaction"
              className="block w-full h-11 rounded-lg border text-sm font-semibold hover:bg-gray-50 active:bg-gray-50 flex items-center justify-center"
            >
              Kembali ke Riwayat
            </Link>
          );
        })()}
      </div>

      {/* TRACKING MODAL (Mobile) */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-800">Status Pengiriman</h3>
              <button onClick={() => setShowTrackingModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-0 overflow-y-auto flex-1 pb-safe">
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

      {/* Confirmation Modal for Complete Order */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleComplete}
        title="Konfirmasi Selesai"
        description="Apakah Anda yakin sudah menerima pesanan dengan baik? Status pesanan akan diubah menjadi Selesai."
        confirmLabel="Ya, Selesai"
        variant="success"
        isLoading={isCompleting}
      />
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-gray-500">{label}</div>
      <div className={strong ? "font-semibold" : ""}>{value}</div>
    </div>
  );
}
