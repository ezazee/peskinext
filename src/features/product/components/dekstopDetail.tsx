"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { HiOutlineHeart, HiOutlineShare } from "react-icons/hi";
import ProductTabs from "./productTabs";
import type { Product } from "@data/types";

type DesktopDetailProps = {
  product: Product;
  hasDiscount: boolean;
  priceNumber: number;
  oldPriceNumber: number;
};

export default function DesktopDetail({
  product,
  hasDiscount,
  priceNumber,
  oldPriceNumber,
}: DesktopDetailProps) {
  const variations = useMemo(
    () =>
      product?.type === "bundle"
        ? ["Bundle 2 pcs", "Bundle 3 pcs", "Bundle 5 pcs"]
        : ["Collagen set 3pcs", "Hydrating set", "Brightening set"],
    [product?.type]
  );

  const [hover, setHover] = useState(false);
  const [selectedVar, setSelectedVar] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const stock = 7654;
  const subtotal = priceNumber * qty;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-5">
        <ol className="flex flex-wrap gap-1">
          <li>Home</li>
          <li>/</li>
          <li>Kecantikan</li>
          <li>/</li>
          <li>Perawatan Wajah</li>
          <li>/</li>
          <li className="text-gray-700 font-medium truncate max-w-[50vw]">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-12 gap-6">
        {/* Kiri */}
        <section className="col-span-4">
          <div className="sticky top-4">
            <div
              className="relative w-full aspect-square rounded-lg overflow-hidden bg-white"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <Image
                src={hover && product.imgHover ? product.imgHover : product.img}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
              {hasDiscount && (
                <span className="absolute left-3 top-3 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              {[
                product.img,
                product.imgHover || product.img,
                product.img,
                product.imgHover || product.img,
                product.img,
              ].map((src, i) => (
                <button
                  key={i}
                  className="relative w-full aspect-square rounded-md overflow-hidden border border-gray-200"
                  onMouseEnter={() =>
                    i % 2 === 1 ? setHover(true) : setHover(false)
                  }
                >
                  <Image
                    src={src}
                    alt={`thumb-${i}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tengah */}
        <section className="col-span-5">
          <h1 className="text-[26px] font-semibold leading-snug">
            {product.name} – {selectedVar || variations[0]}
          </h1>

          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
            <span>Terjual 1 rb+</span>
            <span>•</span>
            <span>4.8 (4 rating)</span>
          </div>

          {/* Harga */}
          <div className="mt-4">
            <div className="flex items-end gap-3">
              <div className="text-3xl font-bold text-gray-900">
                {product.price}
              </div>
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="line-through text-gray-400">
                    {product.oldPrice}
                  </span>
                  <span className="text-rose-600 font-semibold">
                    {product.discount}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Variasi */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">
              Pilih variation: {selectedVar || variations[0]}
            </p>
            <div className="flex flex-wrap gap-2">
              {variations.map((v) => {
                const active = (selectedVar || variations[0]) === v;
                return (
                  <button
                    key={v}
                    onClick={() => setSelectedVar(v)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${
                      active
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <ProductTabs />
          </div>
        </section>

        {/* Kanan */}
        <aside className="col-span-3">
          <div className="sticky top-4 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-14 h-14 rounded-md overflow-hidden border">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="text-sm text-gray-600 leading-tight">
                <div className="font-medium text-gray-800 line-clamp-1">
                  {selectedVar || variations[0]}
                </div>
                <div className="text-gray-500">
                  Stok: {stock.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {/* Qty */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Atur jumlah</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  className="px-3 py-2 hover:bg-gray-50"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <input
                  value={qty}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 1;
                    setQty(Math.min(Math.max(1, v), stock));
                  }}
                  className="w-12 text-center outline-none py-2"
                />
                <button
                  className="px-3 py-2 hover:bg-gray-50"
                  onClick={() => setQty((q) => Math.min(stock, q + 1))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="mt-4">
              {oldPriceNumber > 0 && (
                <div className="text-sm text-gray-400 line-through">
                  Rp{(oldPriceNumber * qty).toLocaleString("id-ID")}
                </div>
              )}
              <div className="text-sm text-gray-500">Subtotal</div>
              <div className="text-2xl font-bold">
                Rp{subtotal.toLocaleString("id-ID")}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <button className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700">
                + Keranjang
              </button>
              <button className="w-full border border-emerald-600 text-emerald-700 py-3 rounded-lg hover:bg-emerald-50">
                Beli Langsung
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <button className="flex items-center gap-2 hover:text-gray-800">
                <HiOutlineHeart /> Wishlist
              </button>
              <button className="flex items-center gap-2 hover:text-gray-800">
                <HiOutlineShare /> Share
              </button>
              <button className="hover:text-gray-800">Chat</button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
