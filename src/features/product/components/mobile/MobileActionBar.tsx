"use client";
import { motion } from "framer-motion";
import { formatRupiah } from "@shared/libs/format";

export function MobileActionBar({
  subtotal,
  qty,
  onQtyChange,
  onAddToCart,
  onBuyNow,
  max = 99,
}: {
  subtotal: number;
  qty: number;
  onQtyChange: (n: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  max?: number;
}) {
  const clamp = (v: number) => Math.min(Math.max(1, v), max);

  return (
    <div className="fixed inset-x-0 bottom-0 md:hidden z-[20] bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">Subtotal</span>
          <p className="font-bold text-lg">{formatRupiah(subtotal)}</p>
        </div>

        <div className="flex items-stretch rounded-lg overflow-hidden shadow-sm">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="h-9 w-9 grid place-items-center"
            onClick={() => onQtyChange(clamp(qty - 1))}
            aria-label="Kurangi jumlah"
          >
            −
          </motion.button>
          <input
            value={qty}
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={(e) => onQtyChange(clamp(Number(e.target.value) || 1))}
            className="h-9 w-12 text-center outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="h-9 w-9 grid place-items-center"
            onClick={() => onQtyChange(clamp(qty + 1))}
            aria-label="Tambah jumlah"
          >
            +
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onBuyNow}
          className="h-11 rounded-lg text-primary font-medium shadow-sm bg-white"
        >
          Beli Langsung
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onAddToCart}
          className="h-11 rounded-lg bg-primary text-white font-semibold shadow-sm"
        >
          + Keranjang
        </motion.button>
      </div>
    </div>
  );
}
