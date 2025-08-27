// File: src/features/product/components/mobile/mobileDetail.tsx
"use client";

import { useMemo, useState } from "react";
import type { MobileDetailProps, Product, Variant } from "@shared/types/types";
import { IoStar } from "react-icons/io5";
import { formatRupiah } from "@shared/libs/format";
import {
  BusIcon,
  ChevronRightIcon,
  HeartIcon,
  ShareIcon,
} from "@shared/components/icons";
import ShippingModal from "@shared/components/ui/ShipingModal/ShippingModal";
import MobileReviews from "../review/MobileReviews";
import { reviewsData } from "@data/review";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import { productsData } from "@data/products";

import { MobileGallery } from "@features/product/components/mobile/MobileGallery";
import { VariantChips } from "@features/product/components/mobile/VariantChips";
import { MobileActionBar } from "@features/product/components/mobile/MobileActionBar";
import { Card, Divider, DetailRow } from "@shared/components/ui/Card";
import { CollapseCard } from "@shared/components/ui/ExpandableCard";
import { ProductDescriptionCard } from "@shared/components/ui/ProductDescriptionCard";

import { discountPercent } from "@shared/helpers/price";
import { motion } from "framer-motion";
import { MobileDetailSkeleton } from "./skeleton/MobileDetailSkeleton";

// ⬇️ data ongkir dinamis (tanpa mengubah UI)
import { useShippingParamsForProduct } from "@features/shiping/hooks/useShippingParamsForProduct";
import { useShippingQuotes } from "@features/shiping/hooks/useShippingQuotes";
import type { ShippingDetailData } from "@shared/types/types";

/** adaptor tipe agar tidak pakai `any` */
type ProductForShipping = Product &
  Partial<{ originCode: string; origin: string; weight: number }>;
type VariantForShipping = Variant & Partial<{ weight: number }>;

export default function MobileDetail({
  product,
  isLoading,
}: MobileDetailProps) {
  const [open, setOpen] = useState(false);

  // state
  const [variant, setVariant] = useState<Variant>(product.variants[0]);
  const [qty, setQty] = useState(1);

  const images = product.galleryImages?.length
    ? product.galleryImages
    : [product.img];

  const priceNum = variant.price;
  const oldPriceNum = variant.oldPrice ?? null;
  const hasDiscount = oldPriceNum !== null;
  const disc = discountPercent(oldPriceNum ?? undefined, priceNum);
  const subtotal = priceNum * qty;
  const maxStock = variant.stock ?? 99;

  // ====== DINAMIS: params & quotes ongkir ======
  const { params } = useShippingParamsForProduct(
    product as ProductForShipping,
    variant as VariantForShipping,
    qty
  );
  const { data: quotes } = useShippingQuotes(Boolean(params), params ?? null);

  // Ambil layanan termurah dari hasil quotes (untuk pill info)
  const cheapest = useMemo(() => {
    if (!quotes) return null;
    let min = Infinity;
    let eta = "";
    quotes.groups.forEach((g) =>
      g.items.forEach((it) => {
        if (it.price < min) {
          min = it.price;
          eta = it.eta;
        }
      })
    );
    return isFinite(min) ? { price: min, eta } : null;
  }, [quotes]);

  if (isLoading) return <MobileDetailSkeleton />;

  return (
    <>
      <div className="md:hidden">
        {/* GALLERY */}
        <MobileGallery
          name={product.name}
          images={images}
          discountPercent={disc}
        />

        {/* KONTEN */}
        <div className="p-4 bg-white rounded-t-2xl -mt-4 relative z-10 shadow-sm">
          {/* HARGA */}
          <div className="flex items-end gap-2">
            <motion.div
              key={variant.id}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-gray-900"
            >
              {formatRupiah(priceNum)}
            </motion.div>
            {hasDiscount && (
              <>
                <div className="text-sm text-gray-400 line-through">
                  {formatRupiah(oldPriceNum!)}
                </div>
                <div className="text-sm text-red-600 font-semibold">
                  {disc}%
                </div>
              </>
            )}
          </div>

          {/* NAMA + AKSI */}
          <div className="mt-3">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-base font-semibold leading-snug">
                {product.name} – {variant.name}
              </h1>
              <div className="flex items-center gap-3 text-xl text-gray-700">
                <motion.button whileTap={{ scale: 0.9 }} className="p-1">
                  <HeartIcon />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} className="p-1">
                  <ShareIcon />
                </motion.button>
              </div>
            </div>

            {/* rating & terjual (dummy) */}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center">
                <IoStar className="text-yellow-400 mr-1" /> 4.8 (4)
              </span>
              <span>•</span>
              <span>
                Terjual <strong>1.150</strong>
              </span>
            </div>
          </div>

          {/* Shipping Info — UI sama, datanya kini dari quotes */}
          {cheapest && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpen(true)}
                aria-label="Lihat detail kurir dan opsi pengiriman"
                className="w-full cursor-pointer flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white shadow-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <BusIcon className="w-5 h-5 text-gray-500" />
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-semibold text-xs text-gray-800 whitespace-nowrap">
                      Ongkir mulai {formatRupiah(cheapest.price)}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      Est. tiba {cheapest.eta}
                    </span>
                  </div>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-gray-500 shrink-0" />
              </motion.button>
            </motion.div>
          )}

          <div className="h-px bg-gray-100 my-4" />

          {/* VARIASI */}
          <p className="text-sm text-gray-600 mb-3">
            Pilih variasi: <span className="font-bold">{variant.name}</span>
          </p>
          <VariantChips
            variants={product.variants}
            activeId={variant.id}
            onSelect={setVariant}
          />

          {/* DETAIL & KONTEN PRODUK */}
          <div className="mt-6 space-y-4">
            <Card title="Detail produk">
              <DetailRow label="SKU">{product.sku || "-"}</DetailRow>
              <Divider />
              <DetailRow label="Kategori">{product.category || "-"}</DetailRow>
              <Divider />
              <DetailRow label="Tipe">
                {product.type?.toUpperCase?.() || "-"}
              </DetailRow>
              <Divider />
              <DetailRow label="Varian">{variant?.name || "-"}</DetailRow>
              <Divider />
              <DetailRow label="Harga (base)">
                {formatRupiah(Number(product.price) || 0)}
              </DetailRow>
            </Card>

            <ProductDescriptionCard text={product.description ?? ""} />

            {!!product.ingredients?.length && (
              <CollapseCard title="Ingredients">
                <ul className="list-disc pl-5 space-y-1">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </CollapseCard>
            )}

            {!!product.howToUse?.length && (
              <CollapseCard title="Cara Pakai">
                <ol className="list-decimal pl-5 space-y-1">
                  {product.howToUse.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </CollapseCard>
            )}
          </div>
        </div>

        <MobileReviews
          reviews={reviewsData} // array dummy dari @data/index
          seeAllHref={`/produk/${product.slug}#ulasan`}
        />

        {/* Modal ongkir — tetap pakai komponen yang sama, tapi sekarang dinamis */}
        <ShippingModal
          open={open}
          params={params ?? null}
          initialData={quotes as ShippingDetailData | undefined}
          onClose={() => setOpen(false)}
        />

        {/* Rekomendasi */}
        <section>
          <ProductGrid products={productsData} />
        </section>

        {/* spacer action bar */}
        <div className="md:hidden h-[116px]" />

        {/* ACTION BAR */}
        <MobileActionBar
          subtotal={subtotal}
          qty={qty}
          onQtyChange={(n) => setQty(Math.min(Math.max(1, n), maxStock))}
          onAddToCart={() =>
            console.log("Add to cart", product.slug, variant.id, qty)
          }
          onBuyNow={() => console.log("Buy now", product.slug, variant.id, qty)}
          max={maxStock}
        />
      </div>
    </>
  );
}
