"use client";

import type { Product } from "@data/types";
import Image from "next/image";
import { useState } from "react";
import { HiOutlineHeart, HiOutlineShare } from "react-icons/hi";

type MobileDetailProps = {
  product: Product;
  hasDiscount: boolean;
  priceNumber: number;
};

export default function MobileDetail({
  product,
  hasDiscount,
  priceNumber,
}: MobileDetailProps) {
  const [qty, setQty] = useState(1);

  return (
    <div className="md:hidden">
      {/* Gambar header */}
      <div className="w-full aspect-square bg-white relative">
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Harga */}
      <div className="px-4 pt-3">
        <div className="flex items-end gap-2">
          <div className="text-[22px] font-bold text-gray-900">{product.price}</div>
          {hasDiscount && (
            <>
              <div className="text-sm text-gray-400 line-through">{product.oldPrice}</div>
              <div className="text-sm text-rose-600 font-semibold">{product.discount}</div>
            </>
          )}
        </div>
      </div>

      {/* Promo */}
      <div className="mt-2 px-4 space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <span className="mt-0.5">🔖</span>
          <p><b>Lebih hemat s.d. 5%</b> pakai bonus di checkout</p>
        </div>
        <button className="flex items-center justify-between w-full text-left text-sm">
          <div className="flex items-start gap-2">
            <span className="mt-0.5">💳</span>
            <p>
              <b>Rp{Math.round(priceNumber / 3).toLocaleString("id-ID")}</b> x 3
              bulan pakai GoPay Later
            </p>
          </div>
          <span className="text-gray-400">{">"}</span>
        </button>
      </div>

      {/* Judul */}
      <div className="px-4 mt-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-base font-semibold leading-snug">{product.name}</h1>
          <div className="flex items-center gap-3 text-xl text-gray-700">
            <button aria-label="Wishlist"><HiOutlineHeart /></button>
            <button aria-label="Share"><HiOutlineShare /></button>
          </div>
        </div>
      </div>

      {/* Spacer untuk tombol fixed */}
      <div className="h-20" />

      {/* Action bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-gray-200 px-4 py-3">
        {/* Qty */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">Jumlah</span>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              className="px-3 py-1.5"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <input
              value={qty}
              onChange={(e) => {
                const v = Number(e.target.value) || 1;
                setQty(Math.max(1, v));
              }}
              className="w-10 text-center outline-none py-1.5"
            />
            <button
              className="px-3 py-1.5"
              onClick={() => setQty((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="h-11 rounded-full border border-emerald-600 text-emerald-700 font-medium">
            Beli Langsung
          </button>
          <button className="h-11 rounded-full bg-emerald-600 text-white font-semibold">
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
