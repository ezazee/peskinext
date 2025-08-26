"use client";

import { useMemo, useState } from "react";
import type { DesktopDetailProps, Variant } from "@shared/types/types";
import { IoStar } from "react-icons/io5";
import { formatRupiah } from "@shared/libs/format";
import ProductTabs from "@shared/components/layout/header/mobile/product/productTabs";
import { productsData } from "@data/products";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import { ProductGallery } from "@features/product/components/desktop/ProductGallery";
import { VariantSelector } from "@features/product/components/desktop/VariantSelector";
import { ShippingInfo } from "@features/product/components/desktop/ShippingInfo";
import { BuyBox } from "@features/product/components/desktop/BuyBox";
import { discountPercent } from "@shared/helpers/price";
import type { ShippingDetailData } from "@shared/types/types";
import { useShippingParamsForProduct } from "@features/shiping/hooks/useShippingParamsForProduct";
import { useShippingQuotes } from "@features/shiping/hooks/useShippingQuotes";
import { DesktopDetailSkeleton } from "./skeleton/DesktopDetailSkeleton";
import ShippingModal from "@shared/components/ui/ShipingModal/ShippingModal";
import ProductReview from "../review/productReview";

export default function DesktopDetail({ product, isLoading }: DesktopDetailProps) {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<Variant>(product.variants[0]);
  const [selectedShippingId, setSelectedShippingId] = useState<string | undefined>(undefined);

  const estimateQty = 1; // kalau mau ikut qty BuyBox, angkat state qty ke sini
  const { params, origin } = useShippingParamsForProduct(product, variant, estimateQty);

  // prefetch quotes supaya ShippingInfo bisa dapat "cheapest"
  const { data: quotes } = useShippingQuotes(Boolean(params), params ?? null);

  const cheapest = useMemo(() => {
    if (!quotes) return null;
    let min = Infinity, eta = "", group = "";
    quotes.groups.forEach((g) => {
      g.items.forEach((it) => {
        if (it.price < min) { min = it.price; eta = it.eta; group = g.label; }
      });
    });
    return isFinite(min) ? { price: min, eta, group } : null;
  }, [quotes]);

  const disc = discountPercent(variant.oldPrice, variant.price);

  if (isLoading) return <DesktopDetailSkeleton />;

  return (
    <div className="hidden md:block container mx-auto">
      <div className="grid grid-cols-12 grid-rows-[auto_auto] gap-6">
        {/* Gallery */}
        <section className="col-span-4 row-start-1">
          <ProductGallery
            name={product.name}
            images={product.galleryImages}
            discountPercent={disc}
          />
        </section>

        {/* Info */}
        <section className="col-span-5 row-start-1">
          <h1 className="text-2xl font-semibold leading-snug">
            {product.name} – {variant.name}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center">
              <IoStar className="text-yellow-400 mr-1" /> 4.8 (4 rating)
            </span>
            <span>•</span>
            <span>Terjual <strong>1.150</strong></span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <div className="text-3xl font-bold text-gray-900">
              {formatRupiah(variant.price)}
            </div>
            {variant.oldPrice && (
              <div className="flex items-center gap-2">
                <span className="line-through text-gray-400">
                  {formatRupiah(variant.oldPrice)}
                </span>
                <span className="text-red-600 font-semibold">{disc}%</span>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-600">
              Category: <span className="font-bold">{product.category}</span>
            </p>
            <p className="text-sm text-gray-600">
              SKU: <span className="font-bold">{product.sku}</span>
            </p>
            <VariantSelector
              variants={product.variants}
              selectedId={variant.id}
              onSelect={setVariant}
            />
          </div>

          <div className="mt-8">
            <ProductTabs
              description={product.description}
              ingredients={product.ingredients}
              howToUse={product.howToUse}
            />
          </div>

          {/* UI ShippingInfo — TETAP, hanya datanya yang kini dinamis */}
          <ShippingInfo
            origin={origin}
            cheapest={cheapest}
            onOpenModal={() => setOpen(true)}
          />
        </section>

        {/* Modal ongkir: wrapper akan fetch & tampilkan skeleton sendiri */}
        <ShippingModal
  open={open}
  params={params ?? null}
  initialData={quotes ?? undefined}
  selectedId={selectedShippingId}
  onSelect={(opt) => setSelectedShippingId(opt.id)}
  onClose={() => setOpen(false)}
/>


        {/* Buy Box */}
        <aside className="col-start-10 col-span-3 row-span-2">
          <BuyBox
            product={product}
            variant={variant}
            onAdd={(qty) => console.log("Add to cart", product.slug, variant.id, qty)}
            onBuy={(qty) => console.log("Buy now", product.slug, variant.id, qty)}
          />
        </aside>

        {/* Review */}
        <section className="col-start-1 col-span-9 row-start-2">
          <ProductReview />
        </section>
      </div>

      <section className="mt-6">
        <ProductGrid products={productsData} />
      </section>
    </div>
  );
}
