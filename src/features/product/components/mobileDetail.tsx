// File: src/features/product/components/MobileDetail.tsx
"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, Variant } from "@data/types";
import { IoStar } from "react-icons/io5";
import { formatRupiah } from "@shared/libs/format";
import {
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@shared/components/icons";

// --- Ikon pengiriman (dipakai seperti di desktop) ---
const TruckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-9m17.25 9v-9m-17.25-2.25H21m-17.25 0V6.75A2.25 2.25 0 015.25 4.5h9.75a2.25 2.25 0 012.25 2.25v4.5m-17.25 0h-1.125a1.125 1.125 0 00-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125H3.375"
    />
  </svg>
);

// --- Info Pengiriman ringkas (mirip desktop) ---
const ShippingInfo = () => (
  <div className="border-t pt-4 mt-4">
    <h3 className="font-bold text-base mb-3">Pengiriman</h3>
    <div className="flex items-start gap-3">
      <TruckIcon />
      <p className="text-sm text-base-text">
        Dikirim dari{" "}
        <span className="font-bold">Kota Administrasi Jakarta</span>
      </p>
      <a
        href="#"
        className="ml-auto text-primary font-bold text-xs whitespace-nowrap"
      >
        Lihat Kurir Lainnya
      </a>
    </div>
  </div>
);

export interface MobileDetailProps {
  product: Product;
  hasDiscount: boolean;
  priceNumber: number;
  oldPriceNumber: number;
}

export default function MobileDetail({ product }: MobileDetailProps) {
  // --- STATE YANG SAMA DENGAN DESKTOP ---
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0]
  );
  const [qty, setQty] = useState(1);

  // gallery
  const images = product.galleryImages?.length
    ? product.galleryImages
    : [product.img];
  const [imageIndex, setImageIndex] = useState(0);
  const nextImage = useCallback(
    () => setImageIndex((i) => (i + 1) % images.length),
    [images.length]
  );
  const prevImage = useCallback(
    () => setImageIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  useEffect(() => {
    const t = setInterval(nextImage, 4000);
    return () => clearInterval(t);
  }, [nextImage]);

  // reset saat product ganti
  useEffect(() => {
    setSelectedVariant(product.variants[0]);
    setQty(1);
    setImageIndex(0);
  }, [product]);

  // --- DERIVED ---
  const hasDiscount = !!selectedVariant.oldPrice;
  const discountPercent = useMemo(() => {
    if (!hasDiscount) return 0;
    return Math.round(
      ((selectedVariant.oldPrice! - selectedVariant.price) /
        selectedVariant.oldPrice!) *
        100
    );
  }, [hasDiscount, selectedVariant]);

  const subtotal = selectedVariant.price * qty;

  // --- HANDLERS ---
  const clampQty = (v: number) =>
    Math.min(Math.max(1, v), selectedVariant.stock);

  const handleAddToCart = () => {
    console.log(
      `Menambahkan ${qty} x ${product.name} (${selectedVariant.name}) ke keranjang`
    );
  };
  const handleBuyNow = () => {
    console.log(`Membeli ${qty} x ${product.name} (${selectedVariant.name})`);
  };

  return (
    <div className="md:hidden">
      {/* GALLERY: slider dengan tombol kiri/kanan + badge diskon */}
      <div className="relative w-full aspect-square bg-white overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${imageIndex * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              <Image
                src={src}
                alt={`${product.name} – gambar ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow"
          aria-label="Sebelumnya"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow"
          aria-label="Berikutnya"
        >
          <ChevronRightIcon />
        </button>

        {hasDiscount && (
          <span className="absolute left-3 top-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercent}%
          </span>
        )}
      </div>

      {/* KONTEN */}
      <div className="p-4 bg-white rounded-t-2xl -mt-4 relative z-10">
        {/* HARGA */}
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold text-gray-900">
            {formatRupiah(selectedVariant.price)}
          </div>
          {hasDiscount && (
            <>
              <div className="text-sm text-gray-400 line-through">
                {formatRupiah(selectedVariant.oldPrice!)}
              </div>
              <div className="text-sm text-red-600 font-semibold">
                {discountPercent}%
              </div>
            </>
          )}
        </div>

        {/* NAMA + AKSI */}
        <div className="mt-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-base font-semibold leading-snug">
              {product.name} – {selectedVariant.name}
            </h1>
            <div className="flex items-center gap-3 text-xl text-gray-700">
              <button aria-label="Wishlist" className="p-1">
                <HeartIcon />
              </button>
              <button aria-label="Share" className="p-1">
                <ShareIcon />
              </button>
            </div>
          </div>

          {/* rating & terjual (mock sederhana supaya mirip gambar) */}
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center">
              <IoStar className="text-yellow-400 mr-1" />
              4.8 (4)
            </span>
            <span>•</span>
            <span>
              Terjual <strong>1.150</strong>
            </span>
          </div>
        </div>

        {/* VARIASI */}
        <div className="mt-4 border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">
            Pilih variasi:{" "}
            <span className="font-bold">{selectedVariant.name}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const active = selectedVariant.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`cursor-pointer px-3 py-1.5 rounded-full text-sm border transition
                  ${
                    active
                      ? "bg-primary/10 text-primary border-primary font-bold"
                      : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                  }`}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
        <ShippingInfo />
      </div>

      {/* spacer agar konten tidak ketutup action bar */}
      <div className="md:hidden h-[116px]" />

      {/* ACTION BAR */}
      <div
        className="fixed inset-x-0 bottom-0 md:hidden
            z-[20] bg-white border-t border-gray-200
            px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]
            shadow-[0_-6px_24px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Subtotal</span>
            <p className="font-bold text-lg">{formatRupiah(subtotal)}</p>
          </div>

          {/* Qty */}
          <div className="flex items-stretch border rounded-lg overflow-hidden">
            <button
              className="h-9 w-9 grid place-items-center hover:bg-gray-50"
              onClick={() => setQty((q) => clampQty(q - 1))}
              aria-label="Kurangi jumlah"
            >
              −
            </button>
            <input
              value={qty}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                const v = Number(e.target.value) || 1;
                setQty(clampQty(v));
              }}
              className="h-9 w-12 text-center outline-none"
            />
            <button
              className="h-9 w-9 grid place-items-center hover:bg-gray-50"
              onClick={() => setQty((q) => clampQty(q + 1))}
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={handleBuyNow}
            className="h-11 rounded-lg border border-primary text-primary font-medium"
          >
            Beli Langsung
          </button>
          <button
            onClick={handleAddToCart}
            className="h-11 rounded-lg bg-primary text-white font-semibold"
          >
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
