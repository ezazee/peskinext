"use client";

import { useMemo, useState, useEffect } from "react";
import type { DesktopDetailProps, Variant, Product } from "@shared/types/types";
import { formatRupiah } from "@shared/helpers/pricing";
import ProductTabs from "@shared/components/layout/header/mobile/product/productTabs";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import { getRecommendations, calculatePrice } from "@features/product/services/productService";
import { ProductGallery } from "@features/product/components/desktop/ProductGallery";
import { VariantSelector } from "@features/product/components/desktop/VariantSelector";
import { ShippingInfo } from "@features/product/components/desktop/ShippingInfo";
import { BuyBox } from "@features/product/components/desktop/BuyBox";
import { discountPercent } from "@shared/helpers/pricing";
import { useShippingParamsForProduct } from "@features/shipping/hooks/useShippingParamsForProduct";
import { useShippingQuotes } from "@features/shipping/hooks/useShippingQuotes";
import { DesktopDetailSkeleton } from "../skeleton/DesktopDetailSkeleton";
import ShippingModal from "@shared/components/ui/ShipingModal/ShippingModal";
import ProductReview from "../../review/productReview";
import { RatingBadge } from "@features/product/review/RatingBadge";
import { addToCart } from "@features/cart/cartService";
import { useToast } from "@shared/components/ui/Toaster";
import { AuthModal } from "@features/auth/components/AuthModal";
import { getCurrentUser } from "@features/auth/action";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@shared/components/ui/Skeleton";

const categoryLabels = {
  "facial-care": "Facial Care",
  "body-care": "Body Care",
  "bundles-sets": "Bundles & Promo Sets",
};

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function DesktopDetail({
  product,
  isLoading,
}: DesktopDetailProps) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
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

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  useEffect(() => {
    getRecommendations(6).then(setRecommendations);
  }, []);

  // Guard: if variants empty, create a dummy
  const defaultVariant: Variant = product.variants?.[0] || {
    id: 0,
    name: "Standard",
    price: Number((product.price || "0").replace(/\D+/g, "")) || 0, // Ensure number
    oldPrice: product.oldPrice ? Number((product.oldPrice || "0").replace(/\D+/g, "")) : 0,
    stock: 0,
  } as unknown as Variant;

  const [variant, setVariant] = useState<Variant>(defaultVariant);
  const [qty, setQty] = useState(1);
  const debouncedQty = useDebounce(qty, 300); // Shorter debounce for better feel

  // Calculation State
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedData, setCalculatedData] = useState<{
    unit_price: number;
    subtotal: number;
    product_name: string;
    variant_name: string;
    stock_available: number;
  } | null>(null);

  // Reset calculated data when variant changes immediately (to show skeleton)
  useEffect(() => {
    // Immediate skeleton
    setIsCalculating(true);
    // Don't null immediately unless actually changing complex data to avoid flickers
  }, [variant.id, qty]);

  // Trigger calculation on debounced qty or variant change
  useEffect(() => {
    let active = true;

    async function doCalculate() {
      setIsCalculating(true);
      try {
        const res = await calculatePrice({
          productId: product.id,
          variantId: variant.id,
          qty: debouncedQty,
        });
        if (active) {
          setCalculatedData(res);
        }
      } catch (e) {
        console.error("Calculation failed", e);
        // Fallback to local calculation if backend fails
        if (active) {
          setCalculatedData({
            unit_price: variant.price,
            subtotal: variant.price * debouncedQty,
            product_name: product.name,
            variant_name: variant.name,
            stock_available: variant.stock
          });
        }
      } finally {
        if (active) setIsCalculating(false);
      }
    }

    doCalculate();
    return () => { active = false; };
  }, [product.id, variant.id, variant.price, variant.name, product.name, debouncedQty, variant.stock]); // Depend on debouncedQty

  const [selectedShippingId, setSelectedShippingId] = useState<
    string | undefined
  >(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const estimateQty = qty; // Use current qty
  const { params } = useShippingParamsForProduct(
    product,
    variant,
    estimateQty
  );

  const itemsForShipping = useMemo(() => ([{
    name: product.name,
    variant_name: variant.name,
    price: variant.price,
    weight: params.weightGr,
    quantity: estimateQty,
    variant: { name: variant.name } // Match Expected structure in hook/backend
  }]), [product.name, variant.name, variant.price, params.weightGr, estimateQty]);

  // prefetch quotes supaya ShippingInfo bisa dapat "cheapest"
  const hasAddress = currentUser?.addresses && currentUser.addresses.length > 0;
  const { data: quotes, refetch: refetchQuotes } = useShippingQuotes(Boolean(params) && !!currentUser?.id && hasAddress, params ?? null, currentUser?.id, itemsForShipping);

  // Listen for address updates to refetch shipping
  useEffect(() => {
    const handleAddressUpdate = () => {
      refetchQuotes();
    };
    window.addEventListener("addressUpdated", handleAddressUpdate);
    return () => window.removeEventListener("addressUpdated", handleAddressUpdate);
  }, [refetchQuotes]);

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

  // Display values
  const displayPrice = isCalculating && !calculatedData ? 0 : (calculatedData?.unit_price ?? variant.price);
  const displaySubtotal = isCalculating && !calculatedData ? 0 : (calculatedData?.subtotal ?? (variant.price * qty));

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />

      <div className="hidden md:block container mx-auto px-4 pb-20">
        <div className="grid grid-cols-12 grid-rows-[auto_auto] gap-8">
          {/* Gallery */}
          <section className="col-span-12 lg:col-span-4 row-start-1">
            <ProductGallery
              name={product.name}
              images={product.galleryImages}
              discountPercent={disc}
            />
          </section>

          {/* Info */}
          <section className="col-span-12 lg:col-span-5 row-start-1 pt-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-slate-800 leading-tight">
                  {product.name}
                </h1>
                <p className="text-lg text-slate-500 mt-1 font-medium italic">
                   {variant.name}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-4">
              <span className="flex items-center gap-1">
                {/* Key forced refresh to simulate variant-specific rating if data exists */}
                <RatingBadge key={`rating-${variant.id}`} sku={product.sku} slug={product.slug} size="sm" />
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex gap-1">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={`sold-${variant.id}`}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    className="text-slate-900 font-bold"
                  >
                    {(variant.soldCount ?? 0).toLocaleString("id-ID")}
                  </motion.span>
                </AnimatePresence>
                <span>Terjual</span>
              </span>
            </div>

            <div className="mt-6 min-h-[48px]">
              <AnimatePresence mode="wait">
                {isCalculating ? (
                  <motion.div 
                    key="price-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Skeleton className="h-10 w-48 bg-gray-100 rounded-lg" />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`price-${variant.id}-${displayPrice}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-baseline gap-3"
                  >
                    <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {formatRupiah(displayPrice)}
                    </div>
                    {variant.oldPrice && variant.oldPrice > variant.price && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-400 line-through">
                          {formatRupiah(variant.oldPrice)}
                        </span>
                        <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-md font-bold">
                          -{Math.round(((variant.oldPrice - variant.price) / variant.oldPrice) * 100)}%
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 space-y-3">
              <VariantSelector
                variants={product.variants}
                selectedId={variant.id}
                onSelect={(v) => {
                  setVariant(v);
                  setQty(1); // Reset qty on variant change
                }}
              />
              <div className="mt-8 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-slate-700 font-bold">
                    {product.type === "bundle" 
                      ? "Bundles & Promo Sets" 
                      : (categoryLabels[product.category as keyof typeof categoryLabels] || product.category)
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">SKU:</span>
                  <span className="text-slate-700 font-bold uppercase tracking-tight">
                    {product.sku || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              {isCalculating ? (
                <Skeleton className="h-5 w-32 bg-gray-100" />
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Tersedia:</span>
                  <span className="text-slate-700 font-bold">
                    {calculatedData?.stock_available ?? variant.stock} pcs
                  </span>
                </div>
              )}
            </div>
            <div className="mt-8">
              <ProductTabs
                description={product.description}
                ingredients={product.ingredients}
                howToUse={product.howToUse}
              />
            </div>

            {/* Shipping Info - Only if logged in */}
            {isLoggedIn && (
              <ShippingInfo
                origin={quotes?.origin ?? params?.origin ?? "Store Location"}
                cheapest={cheapest}
                onOpenModal={() => setOpen(true)}
                hasAddress={hasAddress}
              />
            )}
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
              qty={qty}
              setQty={setQty}
              subtotal={displaySubtotal}
              isCalculating={isCalculating}
              onAdd={(q) => {
                const result = addToCart(product, variant.id, q);
                if (result.success) {
                  toast.success(result.message);
                } else {
                  toast.error(result.message);
                }
              }}
              onAuthRequired={() => setIsAuthModalOpen(true)}
              currentStock={calculatedData?.stock_available}
            />
          </aside>

          {/* Review */}
          <section className="col-start-1 col-span-9 row-start-2">
            <ProductReview sku={product.sku} slug={product.slug} pageSize={5} />
          </section>
        </div>

        <section className="mt-6">
          <ProductGrid products={recommendations} />
        </section>
      </div>
    </>
  );
}
