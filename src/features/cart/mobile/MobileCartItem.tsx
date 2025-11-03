"use client";

import Image from "next/image";
import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import { formatRupiah } from "@shared/helpers/pricing";
import { IconTrash } from "@shared/components/icons";
import QtyStepper from "@shared/components/ui/QtyStepper";
import type { CartData } from "@shared/types/types";
import { getVariantPricing } from "../utils/getVariantPricing";

type Line = CartData["items"][number];

export default function MobileCartItem({
  line,
  onToggle,
  onQty,
  onRemove,
}: {
  line: Line;
  onToggle: (checked: boolean) => void;
  onQty: (qty: number) => void;
  onRemove: () => void;
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
    <div className="rounded-xl bg-white border border-gray-200 p-3">
      <div className="flex items-start gap-3">
        <BrandCheckbox
          checked={line.selected}
          onChange={onToggle}
          ariaLabel="Pilih item"
          size={16}
          className="mt-2"
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
          {variantName && (
            <div className="text-xs text-gray-500 mt-0.5">{variantName}</div>
          )}

          {/* Harga */}
          <div className="mt-1 flex items-center gap-1.5">
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
          </div>
          <div className="text-[15px] font-bold text-gray-900">
            {formatRupiah(price)}
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-100 text-red-100"
              aria-label="Hapus"
              onClick={onRemove}
            >
              <IconTrash />
            </button>
            <QtyStepper value={line.qty} max={stock} onChange={onQty} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
