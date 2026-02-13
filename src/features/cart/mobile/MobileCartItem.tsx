"use client";
// Force TS re-check

import Image from "next/image";
import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import { formatRupiah } from "@shared/helpers/pricing";
import { IconTrash } from "@shared/components/icons";
import QtyStepper from "@shared/components/ui/QtyStepper";
import type { CartData } from "@shared/types/types";
import { getVariantPricing } from "../utils/getVariantPricing";

import { Skeleton } from "@shared/components/ui/Skeleton";

type Line = CartData["items"][number];

export default function MobileCartItem({
  line,
  onToggle,
  onQty,
  onRemove,
  onChangeVariant,
  loading = false,
}: {
  line: Line;
  onToggle: (checked: boolean) => void;
  onQty: (qty: number) => void;
  onRemove: () => void;
  onChangeVariant?: (id: number) => void;
  loading?: boolean;
}) {
  const { price, oldPrice, stock, variantName } = getVariantPricing(
    line.product.variants,
    line.variantId
  );

  const hasDiscount = typeof oldPrice === "number" && oldPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((oldPrice! - price) / oldPrice!) * 100)
    : 0;

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-3 relative overflow-hidden">
      {/* Loading Overlay or Specific Skeletons */}
      {loading && (
        <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            {/* Optional text <span className="text-[10px] font-medium text-primary">Updating...</span> */}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <BrandCheckbox
          checked={line.selected}
          onChange={onToggle}
          ariaLabel="Pilih item"
          size={16}
          className="mt-2"
          disabled={loading}
        />

        <div className="relative h-16 w-16 shrink-0 rounded overflow-hidden">
          <Image
            src={line.product.img}
            alt={line.product.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-gray-800 line-clamp-2">
            {line.product.name}
          </div>

          {/* VARIANT SELECTOR */}
          {line.product.variants && line.product.variants.length > 1 && onChangeVariant ? (
            <div className="mt-1">
              <select
                className="text-xs border border-gray-300 rounded px-1.5 py-1 bg-white hover:border-gray-400 cursor-pointer focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-8"
                value={line.variantId}
                onChange={(e) => onChangeVariant(Number(e.target.value))}
                disabled={loading}
              >
                {line.product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            variantName && (
              <div className="text-xs text-gray-500 mt-0.5">{variantName}</div>
            )
          )}


          {/* Harga */}
          <div className="mt-1 flex items-center gap-1.5 min-h-[20px]">
            {loading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <>
                {hasDiscount && (
                  <>
                    <span className="text-gray-400 line-through text-[12px]">
                      {formatRupiah(oldPrice!)}
                    </span>
                    <span className="text-[10px] font-semibold text-red-400">
                      {discountPct}%
                    </span>
                  </>
                )}
                {!hasDiscount && <div className="h-4" />} {/* Spacer to keep height consistent if needed */}
              </>
            )}
          </div>
          <div className="text-[15px] font-bold text-gray-900 min-h-[24px] flex items-center">
            {loading ? <Skeleton className="h-5 w-32" /> : formatRupiah(price)}
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-100 text-red-100 disabled:opacity-50"
              aria-label="Hapus"
              onClick={onRemove}
              disabled={loading}
            >
              <IconTrash />
            </button>
            <div className="relative">
              {loading && <Skeleton className="absolute inset-0 z-10 rounded-md" />}
              <QtyStepper value={line.qty} max={stock} onChange={onQty} size="sm" disabled={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
