"use client";

import React from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import type { UserTransaction } from "@shared/types/types";
import TransactionDetailMobile from "./mobile/TransactionDetailMobile";
import TransactionDetailDesktop from "./desktop/TransactionDetailDesktop";
import TransactionDetailSkeleton from "./skeleton/TransactionDetailSkeleton";
import ReviewForm from "../review/components/ReviewForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TransactionDetailClient({
  id,
}: {
  id: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const [tx, setTx] = React.useState<UserTransaction | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [reviewingItemIndex, setReviewingItemIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/detail/${id}`, {
      cache: 'no-store', // Prevent caching to get fresh review data
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Order not found");
        return res.json();
      })
      .then(data => {

        // Map data to UserTransaction
        const mapped: UserTransaction = {
          id: data.id,
          invoiceNumber: data.invoiceNumber || data.invoice_number,
          dateISO: data.created_at,
          status: data.status,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: data.items?.map((item: any) => {
            return {
              product: {
                id: item.product?.id,
                name: item.product?.name || "Unknown Product",
                slug: item.product?.slug,
                img: item.product?.front_image,
                type: item.product?.type,
                weightGr: item.product?.weight_gr,
              },
              variantId: item.variant_id,
              quantity: item.quantity,
              unitPrice: parseFloat(item.price),
              subtotal: parseFloat(item.price) * item.quantity,
              variant: item.variant,
              review: item.review,
            };
          }) || [],
          total: parseFloat(data.total_amount || 0),
          addressId: data.address_id,
          courier: data.courier,
          shippingCost: parseFloat(data.shipping_cost || 0),
          originalShippingCost: parseFloat(data.original_shipping_cost || data.shipping_cost || 0),
          discount: parseFloat(data.discount || 0),
          trackingNumber: data.tracking_number,
          shippingAddress: data.shippingAddress || (data.address ? {
            recipient: data.address.recipient || data.address.recipient_name || '',
            phone: data.address.phone || '',
            addressLine: data.address.address || data.address.address_line || '',
            city: data.address.regencies || data.address.city || '',
            province: data.address.province || '',
            postalCode: data.address.postal_code || ''
          } : undefined),
          expiresAt: data.expires_at,
        };

        setTx(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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

  // Review Tab
  if (tab === "review" && tx.status === "delivered") {
    return (
      <div className="container mx-auto px-3 md:px-6 py-4">
        <div className="mb-4">
          <Link
            href={`/account/transaction/${id}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Kembali ke Detail Transaksi
          </Link>
        </div>

        <div className="bg-white rounded-lg border p-4 md:p-6 mb-4">
          <h2 className="text-lg font-semibold mb-2">Beri Nilai Produk</h2>
          <p className="text-sm text-gray-600">
            Berikan ulasan untuk produk yang sudah kamu terima
          </p>
        </div>

        {reviewingItemIndex !== null ? (
          <ReviewForm
            orderId={tx.id}
            productName={tx.items[reviewingItemIndex].product.name}
            productSlug={tx.items[reviewingItemIndex].product.slug}
            productImage={tx.items[reviewingItemIndex].product.img}
            variantName={tx.items[reviewingItemIndex].variant?.variant_name}
            variantId={tx.items[reviewingItemIndex].variantId}
            existingReview={tx.items[reviewingItemIndex].review}
            onSuccess={() => {
              setReviewingItemIndex(null);
              router.refresh(); // Refresh to get updated review data
              router.push(`/account/transaction/${id}`);
            }}
            onCancel={() => setReviewingItemIndex(null)}
          />
        ) : (
          <div className="space-y-3">
            {tx.items.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 md:p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.product.img}
                      alt={item.product.name}
                      fill
                      sizes="(max-width: 768px) 64px, 80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900">{item.product.name}</h4>
                    {item.variant?.variant_name && item.variant.variant_name !== "Default" && (
                      <p className="text-xs md:text-sm text-gray-600 mt-1">{item.variant.variant_name}</p>
                    )}
                  </div>
                </div>
                {(() => {
                  return item.review ? (
                    <button
                      onClick={() => setReviewingItemIndex(idx)}
                      className="px-4 md:px-5 py-2.5 md:py-3 bg-blue-50 text-blue-600 border border-blue-200 text-sm font-semibold rounded-lg hover:bg-blue-100 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap"
                    >
                      Lihat Review Saya
                    </button>
                  ) : (
                    <button
                      onClick={() => setReviewingItemIndex(idx)}
                      className="px-4 md:px-5 py-2.5 md:py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap"
                    >
                      Beri Nilai
                    </button>
                  );
                })()}
              </div>
            ))}
          </div>
        )}
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
