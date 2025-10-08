"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { OrderItem, UserTransaction } from "@shared/types/types";
import { resolveUnitPrice, resolveVariantName } from "../utils/utils";

// sumber data untuk Info Pengiriman
import { addressBook } from "@data/address";
import { shippingByTx } from "@data/shippingOrder";

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
  if (!tx.addressId) return undefined;
  const addr = addressBook.find((a) => a.id === tx.addressId);
  if (!addr) return undefined;

  const meta = shippingByTx[tx.id];

  const courierText =
    meta?.courier && meta?.service
      ? `${meta.courier} ${meta.service}`
      : meta?.courier
      ? meta.courier
      : "";

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

/* ================= main ================= */

export default function TransactionDetailDesktop({
  tx,
}: {
  tx: UserTransaction;
}) {
  // sama seperti mobile
  const itemsSubtotal = tx.items.reduce((s, it) => s + it.subtotal, 0);
  const shippingCost = 0;
  const discountSeller = 0;
  const discountPlatform = 0;
  const paymentDiscount = 0;
  const grandTotal = tx.total ?? itemsSubtotal;

  const firstSlug = tx.items[0]?.product.slug ?? "";

  // info pengiriman + aturan tampil
  const shipping = buildShippingInfo(tx);
  const showCourier =
    tx.status === "shipped" ||
    tx.status === "delivered" ||
    (tx.status === "paid" && Boolean(shipping?.courier));
  const showAwb = tx.status === "shipped" || tx.status === "delivered";

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
    <div className="space-y-4">
      {/* === Pesanan (mirip mobile) === */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="bg-white border rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Pesanan</h2>
          <StatusBadge status={tx.status} />
        </div>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">No. Invoice</span>
            <span className="font-medium">{tx.id}</span>
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
        className="bg-white border rounded-2xl p-5 shadow-sm"
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
        className="bg-white border rounded-2xl p-5 shadow-sm"
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
                  <div className="text-gray-700">{shipping.address}</div>
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
                  href="/account/address"
                  className="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-xs font-medium hover:bg-gray-50"
                >
                  Ubah Alamat
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
        className="bg-white border rounded-2xl p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold">Rincian Pembayaran</h2>

        <div className="mt-3 space-y-2 text-sm">
          <Row label="Subtotal Harga Barang" value={currency(itemsSubtotal)} />
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
          <Row label="Total" value={currency(grandTotal)} />
        </div>

        {/* Aksi bawah – disamakan dengan mobile */}
        <div className="mt-4 flex items-center justify-end gap-2">
          {renderActions(tx.status, tx.id, firstSlug)}
        </div>
      </motion.section>
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

function renderActions(
  status: UserTransaction["status"],
  id: string,
  slug: string
) {
  if (status === "pending") {
    return (
      <Link
        href={`/checkout?tx=${encodeURIComponent(id)}`}
        className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 inline-flex items-center justify-center"
      >
        Bayar Sekarang
      </Link>
    );
  }
  if (status === "paid" || status === "shipped" || status === "cancelled") {
    return (
      <Link
        href={`/account/transaction/${id}`}
        className="h-10 px-3 rounded-lg border text-sm hover:bg-gray-50 inline-flex items-center justify-center"
      >
        Kembali ke Riwayat
      </Link>
    );
  }
  // delivered
  return (
    <>
      <Link
        href={`/product/${slug}`}
        className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 inline-flex items-center justify-center"
      >
        Beli Lagi
      </Link>
      <Link
        href={`/account/transaction/${id}?tab=review`}
        className="h-10 px-3 rounded-lg border text-sm hover:bg-gray-50 inline-flex items-center justify-center"
      >
        Beri Nilai
      </Link>
    </>
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
      text: "Pending",
    },
    paid: {
      bg: "bg-blue-50 border-blue-200",
      fg: "text-blue-700",
      text: "Paid",
    },
    shipped: {
      bg: "bg-sky-50 border-sky-200",
      fg: "text-sky-700",
      text: "Shipped",
    },
    delivered: {
      bg: "bg-green-50 border-green-200",
      fg: "text-green-700",
      text: "Delivered",
    },
    cancelled: {
      bg: "bg-rose-50 border-rose-200",
      fg: "text-rose-700",
      text: "Cancelled",
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
