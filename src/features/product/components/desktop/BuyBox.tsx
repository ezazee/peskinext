"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="sticky top-40 rounded-2xl border border-gray-200 p-6 bg-white shadow-lg"
    >
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
          <div className="text-sm text-gray-600 space-y-1">
            <div className="font-bold text-gray-800 line-clamp-1">
              {variant.name}
            </div>
            <div>
              {isCalculating ? (
                <div className="h-4 w-20 bg-gray-100 animate-pulse rounded-md" />
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 font-medium"
                >
                  Stok: {(currentStock ?? variant.stock).toLocaleString("id-ID")}
                </motion.span>
              )}
            </div>
          </div>
        </div>

        {/* salin link */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleCopyLink}
          aria-label="Salin link produk"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
          title="Salin link"
        >
          <ShareIcon className="text-sm" />
        </motion.button>
      </div>

      {/* Qty */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Atur jumlah</span>
        <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50/30">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="px-3 py-2 hover:bg-white disabled:opacity-50 transition-colors"
            onClick={() => setQty(clamp(qty - 1))}
            aria-label="Kurangi jumlah"
            disabled={qty <= 1 || isCalculating}
          >
            −
          </motion.button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={maxQty}
            value={qty}
            onChange={(e) => setQty(clamp(Number(e.target.value) || 1))}
            className="w-14 text-center outline-none py-2 bg-transparent font-medium"
            aria-label="Jumlah"
            disabled={isCalculating}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="px-3 py-2 hover:bg-white disabled:opacity-50 transition-colors"
            onClick={() => setQty(clamp(qty + 1))}
            aria-label="Tambah jumlah"
            disabled={qty >= maxQty || isCalculating}
          >
            +
          </motion.button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center bg-gray-50/50 p-3 rounded-lg">
        <span className="text-sm text-gray-500">Subtotal</span>
        <div className="text-right">
          <AnimatePresence mode="wait">
            {isCalculating ? (
              <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-8 w-32 bg-gray-200 animate-pulse rounded" 
              />
            ) : (
              <motion.span
                key={subtotal}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold block"
              >
                {formatRupiah(subtotal)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <form ref={buyNowFormRef} action={createCheckoutFromBuyNow}>
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="variantId" value={variant.id} />
        <input type="hidden" name="qty" value={qty} />
      </form>

      <div className="mt-6 space-y-3">
        {/* + Keranjang tetap memanggil handler lokal */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <AuthActionButton
            isLoggedIn={isLoggedIn}
            openAuthModal={onAuthRequired}
            onClick={() => onAdd(qty)}
            className="w-full bg-primary cursor-pointer text-white py-3.5 rounded-xl hover:opacity-90 font-bold shadow-md transition-all flex items-center justify-center gap-2"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menghitung...</span>
              </>
            ) : "+ Keranjang"}
          </AuthActionButton>
        </motion.div>

        {/* Beli Langsung → submit form ke server action */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <AuthActionButton
            isLoggedIn={isLoggedIn}
            openAuthModal={onAuthRequired}
            onClick={() => {
              buyNowFormRef.current?.requestSubmit();
            }}
            className="w-full border-2 cursor-pointer border-primary/20 text-primary py-3.5 rounded-xl hover:bg-primary/5 font-bold transition-all"
            disabled={isCalculating}
          >
            {isCalculating ? "Menghitung..." : "Beli Langsung"}
          </AuthActionButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
