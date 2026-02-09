"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function TransactionDetailSkeleton() {
  return (
    <div className="space-y-4">
      {/* 1. Pesanan */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
          <Skeleton className="h-4 w-24 mt-2 rounded-md" />
        </div>
      </div>

      {/* 2. Produk */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <Skeleton className="h-5 w-32 mb-4 rounded-md" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-16 h-16 rounded-md shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
              <Skeleton className="h-4 w-24 rounded-md mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Pengiriman */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <Skeleton className="h-5 w-32 mb-4 rounded-md" />
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between gap-4">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 rounded-md" /> {/* label alamat */}
            <Skeleton className="h-4 w-32 rounded-md" /> {/* nama */}
            <Skeleton className="h-4 w-24 rounded-md" /> {/* telp */}
            <Skeleton className="h-14 w-full rounded-md" /> {/* alamat */}
          </div>
        </div>
      </div>

      {/* 4. Pembayaran */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <Skeleton className="h-5 w-40 mb-4 rounded-md" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-1/3 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          ))}
          <div className="border-t pt-3 mt-2 flex justify-between">
            <Skeleton className="h-5 w-1/4 rounded-md" />
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
