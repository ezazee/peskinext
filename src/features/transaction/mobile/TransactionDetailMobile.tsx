"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import * as React from "react";
import Image from "next/image";

import type { OrderItem, UserTransaction } from "@shared/types/types";
import { resolveUnitPrice, resolveVariantName } from "../utils/utils";

// sumber data
// import { addressBook } from "@data/address";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addressBook: Array<{ id: string;[key: string]: any }> = [];
// import { shippingByTx } from "@data/shippingOrder";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shippingByTx: Record<string, { [key: string]: any }> = {};

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
  paid: "Terbayar",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_BADGE: Record<UserTransaction["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
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
function buildShippingInfo(tx: UserTransaction): ShippingInfo | undefined {
  if (!tx.addressId) return undefined;
  const addr = addressBook.find((a) => a.id === tx.addressId);
  if (!addr) return undefined;

  const meta = shippingByTx[tx.id]; // bisa undefined utk pending/paid/cancelled

  const courierText =
    meta?.courier && meta?.service
      ? `${meta.courier} ${meta.service}`
      : meta?.courier
        ? meta.courier
        : ""; // kosong = belum ada

  return {
    courier: courierText,
    awb: meta?.trackingNumber,
    recipient: addr.recipient,
    phone: addr.phone,
    address: `${addr.line1}, ${addr.city}, ${addr.province} ${addr.postalCode}`,
    eta: meta?.eta,
    shippedAt: meta?.shippedAt,
    deliveredAt: meta?.deliveredAt,
  };
}

export default function TransactionDetailMobile({
  tx,
  onBack,
  shipping: shippingProp,
  onBuyAgain,
  onReview,
}: Props) {
  const itemsSubtotal = React.useMemo(
    () => tx.items.reduce((acc, it) => acc + it.subtotal, 0),
    [tx.items]
  );

  // sumber shipping: prop > rakitan otomatis
  const shipping = React.useMemo<ShippingInfo | undefined>(
    () => shippingProp ?? buildShippingInfo(tx),
    [shippingProp, tx]
  );

  // breakdown dummy (belum ada ongkir/diskon riil)
  const shippingCost = 0;
  const discountSeller = 0;
  const discountPlatform = 0;
  const paymentDiscount = 0;
  const grandTotal = tx.total ?? itemsSubtotal;

  // flag tampilan kurir/resi mengikuti status
  const showCourier =
    tx.status === "shipped" ||
    tx.status === "delivered" ||
    (tx.status === "paid" && Boolean(shipping?.courier));
  const showAwb = tx.status === "shipped" || tx.status === "delivered";

  // catatan status di blok “Info Pengiriman”
  const infoNote: string | undefined =
    tx.status === "pending"
      ? "Menunggu pembayaran"
      : tx.status === "paid"
        ? "Pesanan menunggu diproses"
        : tx.status === "shipped"
          ? shipping?.eta
            ? `Estimasi: ${shipping.eta}`
            : undefined
          : tx.status === "delivered"
            ? shipping?.deliveredAt
              ? `Sampai di tujuan • ${fmtDate(shipping.deliveredAt)}`
              : "Sampai di tujuan"
            : "Pesanan dibatalkan";

  return (
    <div className="min-h-[100dvh] bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="flex items-center gap-3 px-4 h-12">
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="p-1 -ml-1 rounded-md hover:bg-gray-100 active:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      {/* Ringkasan & status */}
      <section className="mx-3 mt-3">
        <div className="rounded-xl border bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-sm font-medium">Pesanan</div>
            <span
              className={`text-xs px-2 py-1 rounded ${STATUS_BADGE[tx.status]}`}
            >
              {STATUS_LABEL[tx.status]}
            </span>
          </div>
          <div className="px-4 py-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">No. Invoice</span>
              <span className="font-medium">{tx.id}</span>
            </div>
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
        <div className="rounded-xl border bg-white">
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
        <div className="rounded-xl border bg-white">
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

            {/* Resi hanya pada shipped/delivered */}
            {showAwb ? (
              <Row label="No Resi" value={shipping?.awb || "—"} />
            ) : (
              <Row label="No Resi" value="—" />
            )}

            <div>
              <div className="text-gray-500">Alamat</div>
              <div className="mt-1 whitespace-pre-line">
                {shipping ? (
                  <>
                    <div className="font-medium">{shipping.recipient}</div>
                    {shipping.phone && <div>{shipping.phone}</div>}
                    <div className="text-gray-700">{shipping.address}</div>
                  </>
                ) : (
                  "—"
                )}
              </div>

              {/* Catatan status di bawah alamat */}
              {infoNote && (
                <div className="mt-2 text-xs text-gray-500">{infoNote}</div>
              )}

              {/* (Opsional) Ubah alamat saat pending */}
              {tx.status === "pending" && (
                <div className="mt-3">
                  <Link
                    href="/account/address"
                    className="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-xs font-medium hover:bg-gray-50"
                  >
                    Ubah Alamat
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
        <div className="rounded-xl border bg-white">
          <div className="px-4 py-3 border-b text-sm font-medium">
            Rincian Pembayaran
          </div>
          <div className="px-4 py-3 text-sm space-y-2">
            <Row
              label="Subtotal Harga Barang"
              value={currency(itemsSubtotal)}
            />
            <Row
              label="Diskon Barang dari Penjual"
              value={currency(discountSeller)}
            />
            <Row label="Total Ongkos Kirim" value={currency(shippingCost)} />
            <Row
              label="Kupon/Diskon Platform"
              value={currency(discountPlatform)}
            />
            <Row
              label="Diskon Metode Pembayaran"
              value={currency(paymentDiscount)}
            />
            <div className="border-t pt-2" />
            <Row label="Total" value={currency(grandTotal)} strong />
          </div>
        </div>
      </motion.section>

      {/* Sticky footer sesuai status */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t px-3 py-3">
        {tx.status === "delivered" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onReview?.(tx.id)}
              className="flex-1 h-11 rounded-lg border text-sm font-semibold hover:bg-gray-50 active:bg-gray-50 flex items-center justify-center"
            >
              Beri Ulasan
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
        ) : tx.status === "pending" ? (
          <Link
            href={`/payment/${tx.id}`}
            className="block w-full h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
          >
            Bayar Sekarang
          </Link>
        ) : tx.status === "cancelled" ? (
          <button
            type="button"
            onClick={() => {
              const first = tx.items[0];
              if (first) onBuyAgain?.(first.product.slug);
            }}
            className="w-full h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 active:opacity-90 flex items-center justify-center"
          >
            Beli Lagi
          </button>
        ) : (
          <Link
            href="/account/transaction"
            className="block w-full h-11 rounded-lg border text-sm font-semibold hover:bg-gray-50 active:bg-gray-50 flex items-center justify-center"
          >
            Kembali ke Riwayat
          </Link>
        )}
      </div>
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
