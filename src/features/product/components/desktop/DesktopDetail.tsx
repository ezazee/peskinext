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
import { useShippingParamsForProduct } from "@features/shiping/hooks/useShippingParamsForProduct";
import { useShippingQuotes } from "@features/shiping/hooks/useShippingQuotes";
import { DesktopDetailSkeleton } from "../skeleton/DesktopDetailSkeleton";
import ShippingModal from "@shared/components/ui/ShipingModal/ShippingModal";
import ProductReview from "../../review/productReview";
import { RatingBadge } from "@features/product/review/RatingBadge";
import { addToCart } from "@features/cart/cartService";
import { useToast } from "@shared/components/ui/Toaster";
import { AuthModal } from "@features/auth/components/AuthModal";
import { getCurrentUser } from "@features/auth/action";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

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
  const debouncedQty = useDebounce(qty, 500); // Debounce qty change 500ms

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
    setCalculatedData(null);
  }, [variant.id]);

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

  // Handle immediate visual skeleton for qty
  useEffect(() => {
    // If qty changes but debounced hasn't yet, we are "waiting" for debounce
    // So we can show internal loading state if we want, OR just waiting is fine
    // But user requested "skeleton dlu", so we should probably set calculating true immediately on qty change
    if (qty !== debouncedQty) {
      setIsCalculating(true);
    }
  }, [qty, debouncedQty]);


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
  // prefetch quotes supaya ShippingInfo bisa dapat "cheapest"
  // Only fetch if logged in AND has address
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
  const displayPrice = isCalculating ? 0 : (calculatedData?.unit_price ?? variant.price);
  const displaySubtotal = isCalculating ? 0 : (calculatedData?.subtotal ?? (variant.price * qty));

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
            <h1 className="text-2xl font-semibold leading-snug min-h-[32px]">
              {isCalculating ? (
                <Skeleton.Text lines={1} widths={["80%"]} />
              ) : (
                `${product.name} – ${variant.name}`
              )}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <RatingBadge sku={product.sku} slug={product.slug} size="sm" />
              </span>
              <span>•</span>
              <span>
                Terjual <strong>{product.soldCount?.toLocaleString("id-ID") || 0}</strong>
              </span>
            </div>

            <div className="mt-4 flex items-end gap-3 min-h-[36px]">
              {isCalculating ? (
                <Skeleton.Block width={150} height={36} radius={4} />
              ) : (
                <>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatRupiah(displayPrice)}
                  </div>
                  {variant.oldPrice && (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-gray-400">
                        {formatRupiah(variant.oldPrice)}
                      </span>
                      <span className="text-red-600 font-semibold">{disc}%</span>
                    </div>
                  )}
                </>
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
                onSelect={(v) => {
                  setVariant(v);
                  setQty(1); // Reset qty on variant change
                }}
              />
            </div>

            {isCalculating ? (
              <Skeleton className="h-5 w-24 bg-gray-200" />
            ) : (
              <span className="text-gray-600">
                Stok: {calculatedData?.stock_available ?? variant.stock}
              </span>
            )}
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
