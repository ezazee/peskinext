"use client";

import type { CartData, Variant } from "@shared/types/types";
import CartItemRow from "./CartItemRow";

type Line = CartData["items"][number];

function getVariantPricing(variants: Variant[], variantId?: number) {
  const chosen = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = chosen?.price ?? 0;
  const oldPrice = chosen?.oldPrice;
  const stock = chosen?.stock ?? 999;
  const variantName = chosen?.name;
  return { price, oldPrice, stock, variantName };
}

type Props = {
  line: Line;
  onToggle: (checked: boolean) => void;
  onQty: (qty: number) => void;
  onRemove: () => void;
  onChangeVariant?: (id: number) => void;
};

export default function CartItemCard({
  line,
  onToggle,
  onQty,
  onRemove,
  onChangeVariant,
}: Props) {
  const { price, oldPrice, stock, variantName } = getVariantPricing(
    line.product.variants,
    line.variantId
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="px-4">
        <CartItemRow
          id={line.id}
          name={line.product.name}
          image={line.product.img}
          variantName={variantName}
          price={price}
          oldPrice={oldPrice}
          qty={line.qty}
          stock={stock}
          selected={line.selected}
          variants={line.product.variants}
          variantId={line.variantId}
          onChangeVariant={onChangeVariant}
          onToggle={onToggle}
          onQty={onQty}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}
