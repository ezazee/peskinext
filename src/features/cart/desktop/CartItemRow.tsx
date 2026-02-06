"use client";

import Image from "next/image";
import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import { formatRupiah } from "@shared/helpers/pricing";
import { IconTrash } from "@shared/components/icons";
import QtyStepper from "@shared/components/ui/QtyStepper";

import type { Variant } from "@shared/types/types";

type Props = {
  id: string;
  name: string;
  image: string;
  variantName?: string;
  price: number;
  oldPrice?: number;
  qty: number;
  stock: number;
  selected: boolean;
  variants?: Variant[];
  variantId?: number;
  onChangeVariant?: (id: number) => void;
  onToggle: (checked: boolean) => void;
  onQty: (qty: number) => void;
  onRemove: () => void;
};

export default function CartItemRow({
  name,
  image,
  variantName,
  price,
  oldPrice,
  qty,
  stock,
  selected,
  variants,
  variantId,
  onChangeVariant,
  onToggle,
  onQty,
  onRemove,
}: Props) {
  const hasDiscount = typeof oldPrice === "number" && oldPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((oldPrice! - price) / oldPrice!) * 100)
    : 0;

  return (
    <div className="flex gap-3 py-4">
      <BrandCheckbox
        checked={selected}
        onChange={onToggle}
        ariaLabel="Pilih item"
        className="mt-2"
        size={16}
      />

      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
        <Image
          src={image}
          alt={name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 line-clamp-2">
          {name}
        </div>

        {/* VARIANT SELECTOR */}
        {variants && variants.length > 1 && onChangeVariant ? (
          <div className="mt-1.5">
            <select
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white hover:border-gray-400 cursor-pointer focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={variantId}
              onChange={(e) => onChangeVariant(Number(e.target.value))}
            >
              {variants.map((v) => (
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

        <div className="mt-1 flex items-center gap-2">
          {hasDiscount && (
            <>
              <span className="text-gray-400 line-through text-sm">
                {formatRupiah(oldPrice!)}
              </span>
              <span className="text-xs font-semibold text-red-400">
                {discountPct}%
              </span>
            </>
          )}
        </div>

        <div className="text-base font-bold text-gray-900">
          {formatRupiah(price)}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          className="p-2 hover:bg-gray-100 text-red-100 cursor-pointer rounded"
          aria-label="Hapus"
          onClick={onRemove}
        >
          <IconTrash />
        </button>
        <QtyStepper value={qty} max={stock} onChange={onQty} />
      </div>
    </div>
  );
}
