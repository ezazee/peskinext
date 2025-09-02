"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { motion } from "framer-motion";
import { easeInOut } from "framer-motion";

type Props = {
  selectable: boolean;
  onOpen: () => void;
  loading?: boolean;
  summaryText?: string;
};

export default function VoucherCard({
  selectable,
  onOpen,
  loading = false,
  summaryText,
}: Props) {
  if (loading) return <VoucherCardSkeleton />;

  const disabled = !selectable;

  return (
    <motion.div
      className="rounded-xl border border-gray-200 bg-white p-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, ease: easeInOut },
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">Voucher &amp; promo</h3>
        {!!summaryText && (
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            {summaryText}
          </span>
        )}
      </div>

      <motion.button
        type="button"
        aria-disabled={disabled}
        disabled={disabled}
        onClick={!disabled ? onOpen : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
        className={`mt-2 w-full h-11 rounded-lg border transition grid grid-cols-[1fr_auto] items-center px-3
          ${
            disabled
              ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-50 cursor-pointer"
          }`}
      >
        <span className="text-left text-sm">
          {disabled
            ? "Pilih produk sebelum pakai promo"
            : "Pilih voucher / masukkan kode"}
        </span>
        {!disabled && (
          <span className="text-primary text-sm font-semibold">Buka</span>
        )}
      </motion.button>
    </motion.div>
  );
}

/* ---------- Skeleton untuk kartu ---------- */
function VoucherCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <Skeleton.Text lines={1} lineHeight={16} widths={["45%"]} />
      <Skeleton.Block className="mt-3" height={44} radius={10} />
    </div>
  );
}
