"use client";
import Image from "next/image";
import { useState } from "react";
import { AuthActionButton } from "@shared/components/ui/AuthActionButton";
import { formatRupiah } from "@shared/libs/format";
import type { Product, Variant } from "@shared/types/types";

export function BuyBox({
  product, variant, onAdd, onBuy,
}: {
  product: Product;
  variant: Variant;
  onAdd: (qty: number) => void;
  onBuy: (qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const [isLoggedIn] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const subtotal = variant.price * qty;

  return (
    <div className="sticky top-36 rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-14 h-14 rounded-md overflow-hidden border">
          <Image src={product.img} alt={product.name} fill className="object-cover" />
        </div>
        <div className="text-sm text-gray-600 leading-tight">
          <div className="font-medium text-gray-800 line-clamp-1">{variant.name}</div>
          <div className="text-gray-500">Stok: {variant.stock.toLocaleString("id-ID")}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Atur jumlah</span>
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button className="px-3 py-2 hover:bg-gray-50" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Kurangi jumlah">−</button>
          <input
            value={qty}
            onChange={(e) => {
              const v = Number(e.target.value) || 1;
              setQty(Math.min(Math.max(1, v), variant.stock));
            }}
            className="w-12 text-center outline-none py-2"
          />
          <button className="px-3 py-2 hover:bg-gray-50" onClick={() => setQty((q) => Math.min(variant.stock, q + 1))} aria-label="Tambah jumlah">+</button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">Subtotal</span>
        <span className="text-2xl font-bold">{formatRupiah(subtotal)}</span>
      </div>

      <div className="mt-4 space-y-2">
        <AuthActionButton
          isLoggedIn={isLoggedIn}
          openAuthModal={() => setIsAuthOpen(true)}
          onClick={() => onAdd(qty)}
          className="w-full bg-primary cursor-pointer text-white py-3 rounded-lg hover:opacity-90 font-semibold"
        >
          + Keranjang
        </AuthActionButton>
        <AuthActionButton
          isLoggedIn={isLoggedIn}
          openAuthModal={() => setIsAuthOpen(true)}
          onClick={() => onBuy(qty)}
          className="w-full border cursor-pointer border-primary text-primary py-3 rounded-lg hover:bg-primary/5 font-semibold"
        >
          Beli Langsung
        </AuthActionButton>
      </div>
    </div>
  );
}
