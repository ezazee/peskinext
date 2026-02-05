// File: src/features/product/components/mobile/mobileDetail.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import type { MobileDetailProps, Product, Variant } from "@shared/types/types";
import { formatRupiah } from "@shared/helpers/pricing";
import { BusIcon, ChevronRightIcon, ShareIcon } from "@shared/components/icons";
import ShippingModal from "@shared/components/ui/ShipingModal/ShippingModal";
import MobileReviews from "../../review/MobileReviews";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
// import { productsData } from "@data/products";
const productsData: Product[] = [];

import { MobileGallery } from "@features/product/components/mobile/MobileGallery";
import { VariantChips } from "@features/product/components/mobile/VariantChips";
import { MobileActionBar } from "@features/product/components/mobile/MobileActionBar";
import { Card, Divider, DetailRow } from "@shared/components/ui/Card";
import { CollapseCard } from "@shared/components/ui/ExpandableCard";
import { ProductDescriptionCard } from "@shared/components/ui/ProductDescriptionCard";

import { discountPercent } from "@shared/helpers/pricing";
import { motion } from "framer-motion";
import { MobileDetailSkeleton } from "../skeleton/MobileDetailSkeleton";

import { useShippingParamsForProduct } from "@features/shiping/hooks/useShippingParamsForProduct";
import { useShippingQuotes } from "@features/shiping/hooks/useShippingQuotes";
import type { ShippingDetailData } from "@shared/types/types";

// util copy link
import { copyProductLink } from "@shared/libs/clipboard";
import { useProductReviews } from "../../hooks/useProductReviews";
import { RatingBadge } from "@features/product/review/RatingBadge";
import { useToast } from "@shared/components/ui/Toaster";
import { addToCart } from "@features/cart/cartService";
import { createCheckoutFromBuyNow } from "@features/checkout/action";
import { getCurrentUser } from "@features/auth/action";
import { AuthModal } from "@features/auth/components/AuthModal";

/** adaptor tipe agar tidak pakai `any` */
type ProductForShipping = Product &
  Partial<{ originCode: string; origin: string; weight: number }>;
type VariantForShipping = Variant & Partial<{ weight: number }>;

export default function MobileDetail({
  product,
  isLoading,
}: MobileDetailProps) {
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; addresses?: unknown[] } | null>(null);

  // Check auth status
  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
      setCurrentUser(user);
    }
    checkAuth();
  }, []);

  // state
  const [variant, setVariant] = useState<Variant>(product.variants?.[0] || {
    id: 0,
    name: "Standard",
    price: Number((product.price || "0").replace(/\D+/g, "")) || 0,
    oldPrice: product.oldPrice ? Number((product.oldPrice || "0").replace(/\D+/g, "")) : 0,
    stock: 0,
  } as unknown as Variant);

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

  // ====== Dinamis: params & quotes ongkir ======
  const { params } = useShippingParamsForProduct(
    product as ProductForShipping,
    variant as VariantForShipping,
    qty
  );

  const itemsForShipping = useMemo(() => ([{
    name: product.name,
    variant_name: variant.name,
    price: variant.price,
    weight: params.weightGr,
    quantity: qty,
    variant: { name: variant.name }
  }]), [product.name, variant.name, variant.price, params.weightGr, qty]);

  // Check if user has address
  const hasAddress = currentUser?.addresses && currentUser.addresses.length > 0;

  const { data: quotes } = useShippingQuotes(Boolean(params) && !!currentUser?.id && hasAddress, params ?? null, currentUser?.id, itemsForShipping);

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

  // Share (copy link) — pakai global toast
  const handleShare = async () => {
    const ok = await copyProductLink(product.slug);
    if (navigator.vibrate) navigator.vibrate(10);
    if (ok) {
      toast.success("Link produk disalin");
    } else {
      toast.error("Gagal menyalin link produk");
    }
  };

  // Rating + daftar ulasan dinamis (per sku/slug)
  const { items: productReviews } = useProductReviews(
    { sku: product.sku, slug: product.slug },
    1,
    10
  );

  if (isLoading) return <MobileDetailSkeleton />;

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />

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
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-1 cursor-pointer"
                  onClick={handleShare}
                  aria-label="Salin link produk"
                >
                  <ShareIcon />
                </motion.button>
              </div>
            </div>

            {/* RATING & TERJUAL */}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <RatingBadge sku={product.sku} slug={product.slug} size="md" />
              </span>
              <span>•</span>
              <span>
                Terjual <strong>1.150</strong>
              </span>
            </div>
          </div>

          {/* Shipping Info - Hanya tampil jika user login */}
          {/* Shipping Info - Hanya tampil jika user login */}
          {isLoggedIn && (
            hasAddress && cheapest ? (
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
            ) : (
              !hasAddress && (
                <div className="mt-4 bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm flex items-center gap-2">
                  <span>⚠️ Harap isi alamat pengiriman terlebih dahulu.</span>
                </div>
              )
            )
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

        {/* Review per produk */}
        <MobileReviews
          reviews={productReviews}
          seeAllHref={`/produk/${product.slug}#ulasan`}
        />

        {/* Modal ongkir */}
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
          onAddToCart={() => {
            if (!isLoggedIn) {
              setIsAuthModalOpen(true);
              return;
            }
            const result = addToCart(product, variant.id, qty);
            if (result.success) {
              toast.success(result.message);
            } else {
              toast.error(result.message);
            }
          }}
          onBuyNow={async () => {
            if (!isLoggedIn) {
              setIsAuthModalOpen(true);
              return;
            }
            const formData = new FormData();
            formData.append("productId", product.id);
            formData.append("variantId", variant.id.toString());
            formData.append("qty", qty.toString());
            await createCheckoutFromBuyNow(formData);
          }}
          max={maxStock}
        />
      </div>
    </>
  );
}
