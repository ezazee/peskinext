"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { CartItem, Product, Variant } from "@shared/types/types";
import type { ShippingOption } from "@data/shipingData";
import { formatRupiah } from "@shared/libs/format";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

type VariantWithImg = Variant & { img?: string };
type ProductWithImgs = Product & {
  img?: string;
  images?: ReadonlyArray<string>;
};

function priceFrom(p: Product, v?: Variant) {
  return typeof v?.price === "number"
    ? v.price
    : Number((p.price || "0").replace(/[^\d]/g, "")) || 0;
}

function pickImage(p: ProductWithImgs, v?: VariantWithImg): string | undefined {
  return v?.img ?? p.img ?? (Array.isArray(p.images) ? p.images[0] : undefined);
}

type Props = {
  items: CartItem[];
  /** pilihan ongkir yang sedang dipakai (opsional) */
  current?: ShippingOption | null;
  /** true = tampilkan skeleton pada blok ongkir */
  loading?: boolean;
  /** buka modal pemilihan ongkir */
  openShipping?: () => void;
};

export default function SellerCartCard({
  items,
  current,
  loading,
  openShipping,
}: Props) {
  const itemTotal = useMemo(() => {
    return items.reduce((sum, line) => {
      const v = line.product.variants.find((x) => x.id === line.variantId);
      return sum + priceFrom(line.product, v) * line.qty;
    }, 0);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="p-6 text-sm text-gray-600">
        Tidak ada item yang dipilih dari keranjang.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200/70 px-6 py-4">
        <div className="text-sm font-medium">
          Belanja ({items.length} produk)
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">
        {items.map((line) => {
          const v = line.product.variants.find((x) => x.id === line.variantId);
          const unit = priceFrom(line.product, v);
          const img = pickImage(
            line.product as ProductWithImgs,
            v as VariantWithImg
          );

          return (
            <div key={line.id} className="flex gap-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {img ? (
                  <Image
                    width={80}
                    height={80}
                    src={img}
                    alt={line.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium line-clamp-2">
                  {line.product.name}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Varian: {v?.name ?? line.variantId} • Qty: {line.qty}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-base font-semibold">
                    {formatRupiah(unit)}
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      /produk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Blok layanan pengiriman */}
        <div className="rounded-xl ring-1 ring-gray-100">
          <div className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm">
                  <span className="font-medium">
                    {loading ? (
                      // inline skeleton → render sebagai <span>, aman di dalam <span>
                      <Skeleton.Block
                        as="span"
                        inline
                        width={140}
                        height={14}
                        radius={4}
                      />
                    ) : current ? (
                      `${current.courier} • ${current.service}`
                    ) : (
                      "Memuat layanan…"
                    )}
                  </span>

                  {/* pemisah spasi */}
                  {" — "}

                  <span className="text-gray-600">
                    {loading ? (
                      <Skeleton.Block
                        as="span"
                        inline
                        width={72}
                        height={12}
                        radius={4}
                      />
                    ) : current ? (
                      formatRupiah(current.price)
                    ) : null}
                  </span>
                </div>

                {/* JANGAN pakai <p> kalau di dalamnya ada Skeleton.Text (yang berisi <div>) */}
                <div className="text-xs text-gray-600 mt-1">
                  {loading ? (
                    <Skeleton.Block width="40%" height={16} radius={4} />
                  ) : current ? (
                    current.eta
                  ) : (
                    "Mengambil estimasi…"
                  )}
                </div>
              </div>

              <button
                onClick={openShipping}
                className="text-sm font-medium text-primary cursor-pointer hover:underline"
              >
                Ubah
              </button>
            </div>
          </div>
        </div>

        {/* Total per toko */}
        <div className="flex items-center justify-end gap-3 text-sm">
          <span>Total</span>
          <span className="font-semibold">{formatRupiah(itemTotal)}</span>
        </div>
      </div>
    </div>
  );
}
