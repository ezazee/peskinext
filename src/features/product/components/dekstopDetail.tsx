"use client";

import { useMemo, useState } from "react";
import type { DesktopDetailProps, Variant } from "@shared/types/types";
import { formatRupiah } from "@shared/helpers/pricing";
import ProductTabs from "@shared/components/layout/header/mobile/product/productTabs";
import { productsData } from "@data/products";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import { ProductGallery } from "@features/product/components/desktop/ProductGallery";
import { VariantSelector } from "@features/product/components/desktop/VariantSelector";
import { ShippingInfo } from "@features/product/components/desktop/ShippingInfo";
import { BuyBox } from "@features/product/components/desktop/BuyBox";
import { discountPercent } from "@shared/helpers/pricing";
import { useShippingParamsForProduct } from "@features/shiping/hooks/useShippingParamsForProduct";
import { useShippingQuotes } from "@features/shiping/hooks/useShippingQuotes";
import { DesktopDetailSkeleton } from "./skeleton/DesktopDetailSkeleton";
import ShippingModal from "@shared/components/ui/ShipingModal/ShippingModal";
import ProductReview from "../review/productReview";
import { RatingBadge } from "@features/product/review/RatingBadge";
import { addToCart } from "@features/cart/cartService";
import { useToast } from "@shared/components/ui/Toaster";
import { AuthModal } from "@features/auth/components/AuthModal";

export default function DesktopDetail({
  product,
  isLoading,
}: DesktopDetailProps) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<Variant>(product.variants[0]!);
  const [selectedShippingId, setSelectedShippingId] = useState<
    string | undefined
  >(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const estimateQty = 1;
  const { params, origin } = useShippingParamsForProduct(
    product,
    variant,
    estimateQty
  );


  // prefetch quotes supaya ShippingInfo bisa dapat "cheapest"
  const { data: quotes } = useShippingQuotes(Boolean(params), params ?? null);

  const cheapest = useMemo(() => {
    if (!quotes) return null;
    let min = Infinity,
      eta = "",
      group = "";
    quotes.groups.forEach((g) => {
      g.items.forEach((it) => {
        if (it.price < min) {
          min = it.price;
          eta = it.eta;
          group = g.label;
        }
      });
    });
    return isFinite(min) ? { price: min, eta, group } : null;
  }, [quotes]);

  const disc = discountPercent(variant.oldPrice, variant.price);

  if (isLoading) return <DesktopDetailSkeleton />;

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />

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
        <section className="col-span-5 row-start-1 pt-5">
          <h1 className="text-2xl font-semibold leading-snug">
            {product.name} – {variant.name}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <RatingBadge sku={product.sku} slug={product.slug} size="sm" />
            </span>
            <span>•</span>
            <span>
              Terjual <strong>1.150</strong>
            </span>
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

          {/* Shipping Info */}
          <ShippingInfo
            origin={origin}
            cheapest={cheapest}
            onOpenModal={() => setOpen(true)}
          />
        </section>

        {/* Modal ongkir */}
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
            onAdd={(qty) => {
              const result = addToCart(product, variant.id, qty);
              if (result.success) {
                toast.success(result.message);
              } else {
                toast.error(result.message);
              }
            }}
            onAuthRequired={() => setIsAuthModalOpen(true)}
          />
        </aside>

        {/* Review */}
        <section className="col-start-1 col-span-9 row-start-2">
          <ProductReview sku={product.sku} slug={product.slug} pageSize={5} />
        </section>
      </div>

        <section className="mt-6">
          <ProductGrid products={productsData} />
        </section>
      </div>
    </>
  );
}
