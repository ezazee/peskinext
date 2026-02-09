"use client";

import React from "react";
import type { UserTransaction } from "@shared/types/types";
import TransactionDetailMobile from "./mobile/TransactionDetailMobile";
import TransactionDetailDesktop from "./desktop/TransactionDetailDesktop";
import TransactionDetailSkeleton from "./skeleton/TransactionDetailSkeleton";

export default function TransactionDetailClient({
  id,
}: {
  id: string;
}) {



  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const [tx, setTx] = React.useState<UserTransaction | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/detail/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Order not found");
        return res.json();
      })
      .then(data => {
        // Map data to UserTransaction
        const mapped: UserTransaction = {
          id: data.id,
          invoiceNumber: `INV/${new Date(data.created_at).toISOString().slice(0, 10).replace(/-/g, "")}/${data.id.split("-")[0].toUpperCase()}`,
          dateISO: data.created_at,
          status: data.status,
          total: parseFloat(data.total_amount),
          addressId: data.address_id,
          courier: data.courier,
          trackingNumber: data.tracking_number,
          shippingAddress: data.address ? {
            recipient: data.address.recipient || data.user?.name || "Penerima",
            phone: data.address.phone || data.user?.email || "",
            addressLine: data.address.address || "",
            city: data.address.regencies || data.address.city || "",
            province: data.address.province || "",
            postalCode: data.address.postal_code || ""
          } : undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: (data.items || []).map((item: any) => {
            // Check for nested Product (from include) or direct item properties if flattened
            const product = item.product || item.Product || {};
            return {
              product: {
                id: product.id || "unknown",
                name: product.name || "Unknown Product",
                slug: product.slug || "",
                img: product.front_image || product.img || "/placeholder.jpg",
                type: product.type || "single",
                weightGr: product.weight_gr || product.weightGr || 0
              },
              quantity: item.quantity,
              unitPrice: parseFloat(item.price),
              subtotal: item.quantity * parseFloat(item.price),
              variantId: item.variant_id
            };
          }),
          shippingCost: data.shipping_cost,
          originalShippingCost: data.original_shipping_cost,
          discount: data.discount
        };
        setTx(mapped);
      })
      .catch(err => {
        console.error("Error fetching detail:", err);
        setTx(undefined);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-3 md:px-6 py-4">
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-6 items-start">
            <div className="hidden md:block">
              <div className="w-full h-64 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>
            <TransactionDetailSkeleton />
          </div>
        </div>
        <div className="block md:hidden">
          <TransactionDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="container mx-auto px-3 md:px-6 py-6">
        <div className="rounded-xl border bg-white p-10 text-center">
          <div className="text-lg font-semibold">Transaksi tidak ditemukan</div>
          <p className="text-sm text-gray-600 mt-1">
            Pastikan tautan/nomor invoice benar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-6 py-4">
      <main>
        {/* Desktop */}
        <div className="hidden md:block">
          {hydrated ? (
            <TransactionDetailDesktop tx={tx} />
          ) : (
            <TransactionDetailSkeleton />
          )}
        </div>

        {/* Mobile */}
        <div className="block md:hidden">
          {hydrated ? (
            <TransactionDetailMobile tx={tx} />
          ) : (
            <TransactionDetailSkeleton />
          )}
        </div>
      </main>
    </div>
  );
}
