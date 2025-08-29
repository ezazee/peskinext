"use client";

import Image from "next/image";
import { useCartState } from "../hooks/useCartState";
import type { CartData, Variant } from "@shared/types/types";
import { BrandCheckbox } from "@shared/components/ui/BrandCheckbox";
import { formatRupiah } from "@shared/libs/format";
import { IconMinus, IconPlus, IconTrash } from "@shared/components/icons";

/* ---------- Qty Stepper ---------- */
function QtyStepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded border border-gray-300 overflow-hidden">
      <button
        type="button"
        className="h-9 w-9 grid place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Kurangi"
      >
        <IconMinus />
      </button>
      <input
        type="number"
        className="h-9 w-12 text-center outline-none"
        value={value}
        min={1}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button
        type="button"
        className="h-9 w-9 grid place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tambah"
      >
        <IconPlus />
      </button>
    </div>
  );
}

/* ---------- Voucher & Summary ---------- */
function VoucherCard({ selectable }: { selectable: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold mb-2">Voucher &amp; promo</h3>
      <button
        className="w-full h-11 rounded-lg border disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400"
        disabled={!selectable}
      >
        Pilih produk sebelum pakai promo
      </button>
    </div>
  );
}

function SummaryCard({
  total,
  canCheckout,
}: {
  total: number;
  canCheckout: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold mb-2">Detail pesanan</h3>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Total</span>
        <span className="font-semibold text-gray-900">
          {formatRupiah(total)}
        </span>
      </div>
      <button
        className="mt-3 w-full h-11 rounded-lg bg-primary cursor-pointer hover:bg-red-500 transition disabled:cursor-default text-white disabled:bg-gray-200 disabled:text-gray-500"
        disabled={!canCheckout}
      >
        Checkout
      </button>
      <p className="mt-3 text-center text-xs text-gray-500">
        Pembayaranmu aman di PESkinPro.
      </p>
    </div>
  );
}

/* ---------- Pricing dari Variant (fungsi biasa) ---------- */
function getVariantPricing(variants: Variant[], variantId?: number) {
  const chosen = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = chosen?.price ?? 0;
  const oldPrice = chosen?.oldPrice;
  const stock = chosen?.stock ?? 999;
  const variantName = chosen?.name;
  return { price, oldPrice, stock, variantName };
}

/* ---------- 1 Row Item ---------- */
function CartItemRow({
  id,
  name,
  image,
  variantName,
  price,
  oldPrice,
  qty,
  stock,
  selected,
  onToggle,
  onQty,
  onRemove,
}: {
  id: string;
  name: string;
  image: string;
  variantName?: string;
  price: number;
  oldPrice?: number;
  qty: number;
  stock: number;
  selected: boolean;
  onToggle: (checked: boolean) => void;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
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
        {variantName ? (
          <div className="text-xs text-gray-500 mt-0.5">{variantName}</div>
        ) : null}
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

/* ---------- Card per-Item (boxed) ---------- */
type Line = CartData["items"][number];

function CartItemCard({
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
          onToggle={onToggle}
          onQty={onQty}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}

/* ---------- Komponen utama Desktop (flat, boxed per-item) ---------- */
export function CartDesktop({ initial }: { initial: CartData }) {
  const { items, counts, totals, actions } = useCartState(initial);
  const canCheckout = totals.subtotal > 0 && counts.selectedCount > 0;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-0 my-6 grid grid-cols-12 gap-6">
      {/* left */}
      <div className="col-span-8">
        {/* Tabs */}
        <div className="mb-3 border-b border-gray-200">
          <nav className="flex gap-6">
            <div className="py-3 border-b-2 border-primary font-semibold text-primary">
              Belanja ({counts.itemCount})
            </div>
          </nav>
        </div>

        {/* select all */}
        <label className="flex items-center gap-3 mb-3">
          <BrandCheckbox
            checked={counts.allSelected}
            onChange={(checked) => actions.toggleSelectAll(checked)}
            ariaLabel="Pilih semua produk"
            size={16}
          />
          <span className="text-sm">Pilih semua produk</span>
        </label>

        {/* === LIST ITEM: sekarang boxed per-item === */}
        <div className="space-y-4">
          {items.map((line) => (
            <CartItemCard
              key={line.id}
              line={line}
              onToggle={(checked) => actions.toggleItem(line.id, checked)}
              onQty={(q) => actions.setQty(line.id, q)}
              onRemove={() => actions.removeItem(line.id)}
            />
          ))}
        </div>
      </div>

      {/* right */}
      <aside className="col-span-4">
        <div className="sticky top-20 space-y-4">
          <VoucherCard selectable={counts.selectedCount > 0} />
          <SummaryCard total={totals.subtotal} canCheckout={canCheckout} />
        </div>
      </aside>
    </div>
  );
}
