"use client";

import Image from "next/image";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import type { CartItem, Product, Variant } from "@shared/types/types";
import type { ShippingOption } from "@data/shipingData";
import { formatRupiah } from "@shared/libs/format";

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

type Props = {
  items: CartItem[];
  current: ShippingOption | null; // layanan terpilih
  loading: boolean; // skeleton saat fetch ongkir
  openShipping: () => void; // buka modal shipping
};

export default function SellerCartCardMobile({
  items,
  current,
  loading,
  openShipping,
}: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      {/* List items */}
      <div className="px-4 py-3 border-b">
        <div className="text-sm font-semibold">Keranjang ({items.length})</div>
      </div>

      <div className="p-4 space-y-4">
        {items.map((line) => {
          const v = line.product.variants.find((x) => x.id === line.variantId);
          const unit = priceFrom(line.product, v);
          const img = pickImage(
            line.product as ProductWithImgs,
            v as VariantWithImg
          );
          return (
            <div key={line.id} className="flex gap-3">
              <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {img ? (
                  <Image
                    src={img}
                    alt={line.product.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium line-clamp-2">
                  {line.product.name}
                </div>
                <div className="mt-0.5 text-[12px] text-gray-500">
                  Varian: {v?.name ?? line.variantId} • Qty: {line.qty}
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {formatRupiah(unit)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipping picked */}
      <div className="px-4 py-3 border-t">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-medium">
              {loading ? (
                <Skeleton.Text lines={1} />
              ) : current ? (
                <>
                  {current.courier} • {current.service} —{" "}
                  <span className="font-semibold">
                    {formatRupiah(current.price)}
                  </span>
                </>
              ) : (
                "Tidak ada layanan"
              )}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              {loading ? (
                <Skeleton.Text lines={1} widths={["50%"]} />
              ) : (
                current?.eta ?? "—"
              )}
            </div>
          </div>

          <button
            onClick={openShipping}
            className="text-sm font-semibold cursor-pointer text-primary"
          >
            Ubah
          </button>
        </div>
      </div>
    </section>
  );
}
