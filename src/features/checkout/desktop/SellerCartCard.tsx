// src/features/checkout/desktop/SellerCartCard.tsx
"use client";

import { useMemo, useState } from "react";
import type { CartItem, Product, Variant } from "@shared/types/types";

type VariantWithImg = Variant & { img?: string };
type ProductWithImgs = Product & {
  img?: string;
  images?: ReadonlyArray<string>;
};

function priceFrom(p: Product, v?: Variant) {
  const unit =
    typeof v?.price === "number"
      ? v.price
      : Number((p.price || "0").replace(/[^\d]/g, "")) || 0;
  return unit;
}

function pickImage(p: ProductWithImgs, v?: VariantWithImg): string | undefined {
  return v?.img ?? p.img ?? (Array.isArray(p.images) ? p.images[0] : undefined);
}

export default function SellerCartCard({ items }: { items: CartItem[] }) {
  const [serviceLabel] = useState("Standard");
  const [eta] = useState("10–12 September 2025");

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
                  <img
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
                    Rp {new Intl.NumberFormat("id-ID").format(unit)}
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      /produk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="rounded-xl border border-gray-200/70">
          <div className="border-t border-gray-200/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm">
                  <span className="rounded bg-sky-50 px-2 py-0.5 text-primary ring-1 ring-sky-200 text-xs mr-2">
                    Pilihan terbaik
                  </span>
                  <span className="font-medium">{serviceLabel}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Dijamin tiba {eta}</p>
                <p className="text-xs text-primary">
                  Gratis ongkir proteksi pengiriman.
                </p>
              </div>
              <button className="text-sm font-medium text-primary cursor-pointer hover:underline">
                Ubah
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 text-sm">
          <span>Total</span>
          <span className="font-semibold">
            Rp {new Intl.NumberFormat("id-ID").format(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
