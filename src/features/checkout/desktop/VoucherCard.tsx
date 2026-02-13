"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { motion, easeInOut } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  selectable: boolean;
  onOpen: () => void;
  loading?: boolean;
  summaryText?: string;
  appliedCount?: number;
  savingText?: string;
  bannerIcon?: ReactNode;
};

export default function VoucherCard({
  selectable,
  onOpen,
  loading = false,
  summaryText,
  appliedCount = 0,
  savingText,
  bannerIcon,
}: Props) {
  if (loading) return <VoucherCardSkeleton />;

  const disabled = !selectable;
  const hasApplied = appliedCount > 0 || Boolean(summaryText?.trim());

  // label yang konsisten untuk kondisi apa pun
  const appliedLabel =
    appliedCount > 0
      ? `${appliedCount} voucher ongkir terpakai`
      : summaryText?.trim() || "Voucher terpakai";

  const pillText = hasApplied
    ? appliedLabel
    : disabled
      ? "Pilih produk sebelum pakai promo"
      : "Pilih voucher / masukkan kode";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, ease: easeInOut },
      }}
      className="overflow-hidden"
    >
      {/* INFO / BANNER */}
      <div className="p-4">
        {disabled ? (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 grid place-items-center">
              <TruckIcon className="text-gray-500" />
            </div>
            <p className="text-sm text-gray-700">
              Pilih produk dari Bag untuk dapatkan voucher gratis ongkir.
            </p>
          </div>
        ) : hasApplied ? (
          <div className="relative w-full rounded-xl bg-sky-50 text-primary px-4 py-3 flex items-start gap-3">
            <div className="shrink-0">
              {bannerIcon ?? <TruckIcon className="text-emerald-800" />}
            </div>
            <p className="text-sm font-semibold leading-5">
              Yay, hemat {savingText ?? "promo"}! Yuk, belanja lagi biar hemat
              lebih banyak.
            </p>
            <button
              type="button"
              onClick={onOpen}
              className="ml-auto h-8 w-8 grid place-items-center rounded-full text-emerald-900/70 hover:bg-emerald-100"
              aria-label="Lihat promo"
              title="Lihat promo"
            >
              <ChevronRight />
            </button>
            <div
              className="pointer-events-none absolute inset-0 opacity-[.12]
              [background-image:radial-gradient(circle_at_12%_18%,#ef4444_2px,transparent_3px),
              radial-gradient(circle_at_78%_22%,#f59e0b_2px,transparent_3px),
              radial-gradient(circle_at_35%_85%,#3b82f6_2px,transparent_3px)]
              [background-size:26px_26px]"
            />
          </div>
        ) : null}
      </div>


      {/* TITLE */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-semibold">Voucher &amp; promo</h3>
      </div>

      {/* PILL — SELALU DIRENDER */}
      <div className="px-4 pb-4">
        <button
          type="button"
          aria-disabled={disabled}
          disabled={disabled}
          onClick={!disabled ? onOpen : undefined}
          className={`h-11 w-full rounded-xl px-3 text-sm flex items-center cursor-pointer justify-between transition
            ${disabled
              ? "bg-gray-100 text-gray-600 cursor-not-allowed"
              : "bg-white border border-gray-100 hover:bg-gray-50"
            }`}
          data-state={
            disabled
              ? "disabled"
              : hasApplied
                ? "enabled-applied"
                : "enabled-empty"
          }
        >
          <div className="flex items-center gap-2 min-w-0">
            <TicketIcon
              className={disabled ? "text-gray-500/90" : "text-gray-600"}
            />
            <div className="truncate">
              <span className={hasApplied ? "font-medium" : "text-gray-700"}>
                {pillText}
              </span>
              {/* badge hemat hanya saat aktif */}
              {!disabled && hasApplied && savingText && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-primary text-xs font-semibold">
                  <span className="-ml-0.5">🏷️</span>
                  {savingText}
                </span>
              )}
            </div>
          </div>
          <ChevronRight />
        </button>
      </div>
    </motion.div>
  );
}

function VoucherCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-200">
      <Skeleton.Text lines={1} lineHeight={16} widths={["45%"]} />
      <div className="border-t border-gray-200 my-3" />
      <Skeleton.Block height={44} radius={12} />
    </div>
  );
}

/* ===== Icons ===== */
function TicketIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7z"
        fill="currentColor"
        fillOpacity=".18"
      />
      <path
        d="M8 7h8M8 17h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M7.5 4.5L12.5 10L7.5 15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"
        fill="currentColor"
        fillOpacity=".18"
      />
      <circle cx="7" cy="18" r="2" fill="currentColor" />
      <circle cx="19" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}
