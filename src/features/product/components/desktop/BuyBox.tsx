"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { AuthActionButton } from "@shared/components/ui/AuthActionButton";
import { formatRupiah } from "@shared/helpers/pricing";
import { copyProductLink } from "@shared/libs/clipboard";
import type { Product, Variant } from "@shared/types/types";
import { ShareIcon } from "@shared/components/icons";
import { useToast } from "@shared/components/ui/Toaster";
import { createCheckoutFromBuyNow } from "@features/checkout/action";
import { getCurrentUser } from "@features/auth/action";

export function BuyBox({
  product,
  variant,
  qty,
  setQty,
  subtotal,
  isCalculating,
  onAdd,
  onAuthRequired,
  currentStock,
}: {
  product: Product;
  variant: Variant;
  qty: number;
  setQty: (q: number) => void;
  subtotal: number;
  isCalculating: boolean;
  onAdd: (qty: number) => void;
  onAuthRequired: () => void;
  currentStock?: number;
}) {
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const buyNowFormRef = useRef<HTMLFormElement>(null);

  // Check auth status
  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
    }
    checkAuth();
  }, []);

  const maxQty = Math.max(0, variant.stock);
  const clamp = (n: number) => Math.min(Math.max(1, n), maxQty);

  const handleCopyLink = async () => {
    const ok = await copyProductLink(product.slug);
    if (ok) {
      toast.success("Link produk disalin");
    } else {
      toast.error("Gagal menyalin link produk");
    }
  };

  return (
    <div className="sticky top-40 rounded-xl border border-gray-200 p-4 bg-white">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-md overflow-hidden border">
            <Image
              src={product.img || "https://placehold.co/100x100?text=No+Image"}
              alt={product.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="text-sm text-gray-600 leading-tight">
            <div className="font-medium text-gray-800 line-clamp-1">
              {variant.name}
            </div>
            <div className="text-gray-500">
              {isCalculating ? (
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                `Stok: ${(currentStock ?? variant.stock).toLocaleString("id-ID")}`
              )}
            </div>
          </div>
        </div>

        {/* salin link */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Salin link produk"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary"
          title="Salin link"
        >
          <ShareIcon className="text-sm" />
        </button>
      </div>

      {/* Qty */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Atur jumlah</span>
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setQty(clamp(qty - 1))}
            aria-label="Kurangi jumlah"
            disabled={qty <= 1 || isCalculating}
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={maxQty}
            value={qty}
            onChange={(e) => setQty(clamp(Number(e.target.value) || 1))}
            className="w-14 text-center outline-none py-2"
            aria-label="Jumlah"
            disabled={isCalculating}
          />
          <button
            className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setQty(clamp(qty + 1))}
            aria-label="Tambah jumlah"
            disabled={qty >= maxQty || isCalculating}
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">Subtotal</span>
        <span className="text-2xl font-bold">
          {isCalculating ? (
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
          ) : (
            formatRupiah(subtotal)
          )}
        </span>
      </div>

      <form ref={buyNowFormRef} action={createCheckoutFromBuyNow}>
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="variantId" value={variant.id} />
        <input type="hidden" name="qty" value={qty} />
      </form>

      <div className="mt-4 space-y-2">
        {/* + Keranjang tetap memanggil handler lokal */}
        <AuthActionButton
          isLoggedIn={isLoggedIn}
          openAuthModal={onAuthRequired}
          onClick={() => onAdd(qty)}
          className="w-full bg-primary cursor-pointer text-white py-3 rounded-lg hover:opacity-90 font-semibold"
          disabled={isCalculating}
        >
          {isCalculating ? "Menghitung..." : "+ Keranjang"}
        </AuthActionButton>

        {/* Beli Langsung → submit form ke server action */}
        <AuthActionButton
          isLoggedIn={isLoggedIn}
          openAuthModal={onAuthRequired}
          onClick={() => {
            buyNowFormRef.current?.requestSubmit();
          }}
          className="w-full border cursor-pointer border-primary text-primary py-3 rounded-lg hover:bg-primary/5 font-semibold"
          disabled={isCalculating}
        >
          {isCalculating ? "Menghitung..." : "Beli Langsung"}
        </AuthActionButton>
      </div>
    </div>
  );
}
