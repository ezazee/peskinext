"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { CartItem, Product, Variant } from "@shared/types/types";
import type { ShippingOption } from "@shared/types/types";
import { formatRupiah } from "@shared/helpers/pricing";
import { getProductPrice, getProductImage } from "@shared/helpers/product";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { cn } from "@shared/libs/utils";

type VariantWithImg = Variant & { img?: string };
type ProductWithImgs = Product & {
  img?: string;
  images?: string[] | ReadonlyArray<string>;
};

type Props = {
  items: CartItem[];
  /** pilihan ongkir yang sedang dipakai (opsional) */
  current?: ShippingOption | null;
  /** true = tampilkan skeleton pada blok ongkir */
  loading?: boolean;
  /** buka modal pemilihan ongkir */
  openShipping?: () => void;
  /** Variant: "desktop" or "mobile" */
  variant?: "desktop" | "mobile";
};

export default function SellerCartCard({
  items,
  current,
  loading,
  openShipping,
  variant = "desktop",
}: Props) {
  const isMobile = variant === "mobile";

  const itemTotal = useMemo(() => {
    return items.reduce((sum, line) => {
      const v = line.product.variants.find((x) => x.id === line.variantId);
      return sum + getProductPrice(line.product, v) * line.qty;
    }, 0);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className={cn(
        "text-sm text-gray-600",
        isMobile ? "p-4" : "p-6"
      )}>
        Tidak ada item yang dipilih dari keranjang.
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-transparent",
      isMobile ? "rounded-[2.5rem] bg-white shadow-sm" : ""
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between",
        isMobile ? "px-5 py-4 border-b border-gray-50" : "px-6 py-5 border-b border-gray-100/50"
      )}>
        <div className={cn(
          "font-bold tracking-tight text-gray-900",
          isMobile ? "text-sm" : "text-xl border-l-4 border-primary pl-4"
        )}>
          {isMobile ? `Daftar Produk (${items.length})` : `Daftar Produk (${items.length})`}
        </div>
      </div>

      {/* Items List */}
      <div className={cn(
        "space-y-6",
        isMobile ? "p-5" : "px-6 py-5"
      )}>
        {items.map((line) => {
          const v = line.product.variants.find((x) => x.id === line.variantId);
          const unit = getProductPrice(line.product, v);
          const img = getProductImage(
            line.product as ProductWithImgs,
            v as VariantWithImg
          );

          return (
            <div
              key={line.id}
              className={cn("flex", isMobile ? "gap-4" : "gap-4")}
            >
              {/* Image */}
              <div className={cn(
                "flex-shrink-0 overflow-hidden bg-gray-100",
                isMobile
                  ? "h-20 w-20 rounded-2xl"
                  : "h-20 w-20 rounded-xl"
              )}>
                {img ? (
                  <Image
                    width={isMobile ? 80 : 80}
                    height={isMobile ? 80 : 80}
                    src={img}
                    alt={line.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              {/* Product Info */}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold line-clamp-2">
                  {line.product.name}
                </div>
                <div className={cn(
                  "text-gray-400 font-medium",
                  isMobile ? "mt-1 text-[11px]" : "mt-1 text-xs"
                )}>
                  Varian: {v?.name ?? line.variantId} • Qty: {line.qty}
                </div>

                {/* Price */}
                {isMobile ? (
                  <div className="mt-2 text-sm font-black text-primary">
                    {formatRupiah(unit)}
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-base font-semibold">
                      {formatRupiah(unit)}
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        /produk
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Shipping Section */}
        <div className={cn(
          "rounded-[1.5rem] mt-6 transition-all duration-300",
          isMobile ? "bg-gray-50/50 p-4" : "bg-gray-50/50 border border-gray-100/50 p-6"
        )}>
          <div className={cn(isMobile ? "" : "")}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">Opsi Pengiriman</span>
                </div>
                <div className={cn(
                  "text-sm",
                  isMobile ? "font-medium" : "font-bold text-gray-800"
                )}>
                  {loading ? (
                    isMobile ? (
                      <Skeleton.Text lines={1} />
                    ) : (
                      <Skeleton.Block
                        as="span"
                        inline
                        width={140}
                        height={14}
                        radius={4}
                      />
                    )
                  ) : current ? (
                    <>
                      {isMobile ? (
                        <>
                          {current.courier} • {current.service} —{" "}
                          <span className="font-semibold">
                            {formatRupiah(current.price)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="">
                            {current.courier} — {current.service}
                          </span>
                          {" • "}
                          <span className="text-primary font-black">
                            {formatRupiah(current.price)}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    isMobile ? "Tidak ada layanan" : "Pilih layanan pengiriman…"
                  )}
                </div>

                {/* ETA */}
                <div className={cn(
                  "text-gray-500",
                  isMobile ? "mt-1 text-xs" : "text-xs mt-1 font-medium"
                )}>
                  {loading ? (
                    isMobile ? (
                      <Skeleton.Text lines={1} widths={["50%"]} />
                    ) : (
                      <Skeleton.Block width="40%" height={16} radius={4} />
                    )
                  ) : current ? (
                    `Estimasi tiba: ${current.eta}`
                  ) : (
                    isMobile ? "—" : "Hitung estimasi pengiriman"
                  )}
                </div>
              </div>

              {/* Change Button */}
              <button
                onClick={openShipping}
                className={cn(
                  "font-bold cursor-pointer text-primary transition-all active:scale-95",
                  isMobile ? "text-sm" : "text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:border-primary"
                )}
              >
                Ubah Kurir
              </button>
            </div>
          </div>
        </div>

        {/* Total */}
        {!isMobile && (
          <div className="flex items-center justify-end gap-3 text-sm">
            <span>Total</span>
            <span className="font-semibold">{formatRupiah(itemTotal)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
