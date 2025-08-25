// File: src/features/product/components/DesktopDetail.tsx
"use client";

import Image from "next/image";
import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  useMemo,
} from "react";
import type { Product, Variant } from "@shared/types/types";
import { IoStar } from "react-icons/io5";
import { formatRupiah } from "@shared/libs/format";
import {
  BusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  LocationIcon,
  ShareIcon,
} from "@shared/components/icons";
import { AuthModal } from "@features/auth/components/AuthModal";
import ProductReview from "../review/productReview";
import ProductTabs from "@shared/components/layout/header/mobile/product/productTabs";
import { productsData } from "@data/products";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import ShippingModal from "@shared/components/ui/ShipingModal/ShippingModal";
import { mockShippingData } from "@data/shipingData";

// --- Tombol yang butuh login ---
const AuthActionButton = ({
  isLoggedIn,
  openAuthModal,
  onClick,
  children,
  className,
}: {
  isLoggedIn: boolean;
  openAuthModal: () => void;
  onClick: () => void;
  children: ReactNode;
  className: string;
}) => (
  <button
    onClick={() => (!isLoggedIn ? openAuthModal() : onClick())}
    className={className}
  >
    {children}
  </button>
);

type DesktopDetailProps = {
  product: Product;
};

export default function DesktopDetail({ product }: DesktopDetailProps) {
  const [open, setOpen] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0]
  );
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  const [isLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const images = product.galleryImages;

  const nextImage = useCallback(() => {
    setImageIndex((p) => (p + 1) % images.length);
  }, [images.length]);

  const prevImage = () => {
    setImageIndex((p) => (p - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const t = setInterval(nextImage, 4000);
    return () => clearInterval(t);
  }, [nextImage]);

  useEffect(() => {
    setSelectedVariant(product.variants[0]);
    setQty(1);
  }, [product]);

  const subtotal = selectedVariant.price * qty;
  const hasDiscount = !!selectedVariant.oldPrice;

  const handleAddToCart = () => {
    console.log(
      `Menambahkan ${qty} x ${product.name} (${selectedVariant.name}) ke keranjang`
    );
  };
  const handleBuyNow = () => {
    console.log(`Membeli ${qty} x ${product.name} (${selectedVariant.name})`);
  };

  const cheapest = useMemo(() => {
    let minPrice = Infinity;
    let eta = "";
    let groupLabel = "";
    mockShippingData.groups.forEach((g) => {
      g.items.forEach((it) => {
        if (it.price < minPrice) {
          minPrice = it.price;
          eta = it.eta;
          groupLabel = g.label;
        }
      });
    });
    if (!isFinite(minPrice)) return null;
    return { price: minPrice, eta, group: groupLabel };
  }, []);

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />

      <div className="hidden md:block container mx-auto">
        {/* 3 kolom × 2 baris */}
        <div className="grid grid-cols-12 grid-rows-[auto_auto] gap-6">
          {/* Kiri (gambar) — col 1..4 */}
          <section className="col-span-4 row-start-1">
            <div className="sticky top-36 rounded-xl ">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white group">
                <div
                  className="flex h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${imageIndex * 100}%)` }}
                >
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-full h-full flex-shrink-0"
                    >
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Berikutnya"
                >
                  <ChevronRightIcon />
                </button>

                {hasDiscount && (
                  <span className="absolute left-3 top-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(
                      ((selectedVariant.oldPrice! - selectedVariant.price) /
                        selectedVariant.oldPrice!) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={`relative w-full aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      imageIndex === i
                        ? "border-primary"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => setImageIndex(i)}
                    aria-label={`Pilih gambar ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`thumb-${i}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Tengah (info) — col 5..9 */}
          <section className="col-span-5 row-start-1">
            <h1 className="text-2xl font-semibold leading-snug">
              {product.name} – {selectedVariant.name}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center">
                <IoStar className="text-yellow-400 mr-1" /> 4.8 (4 rating)
              </span>
              <span>•</span>
              <span>
                Terjual <strong>1.150</strong>
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-end gap-3">
                <div className="text-3xl font-bold text-gray-900">
                  {formatRupiah(selectedVariant.price)}
                </div>
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="line-through text-gray-400">
                      {formatRupiah(selectedVariant.oldPrice!)}
                    </span>
                    <span className="text-red-600 font-semibold">
                      {Math.round(
                        ((selectedVariant.oldPrice! - selectedVariant.price) /
                          selectedVariant.oldPrice!) *
                          100
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">
                Category: <span className="font-bold">{product.category}</span>
              </p>
              <p className="text-sm text-gray-600 mb-3">
                SKU: <span className="font-bold">{product.sku}</span>
              </p>
              <p className="text-sm text-gray-600 mb-5">
                Pilih variasi:{" "}
                <span className="font-bold">{selectedVariant.name}</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`cursor-pointer px-3 py-1.5 rounded-full text-sm border transition ${
                      selectedVariant.id === variant.id
                        ? "bg-primary/10 text-primary font-bold border-primary"
                        : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <ProductTabs
                description={product.description}
                ingredients={product.ingredients}
                howToUse={product.howToUse}
              />
            </div>

            {/* Shiping Info */}
            <div className="mt-6 border-t pt-6">
              <h3 className="font-bold text-lg mb-3">Pengiriman</h3>

              <div className="space-y-2 text-sm">
                {/* alamat */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <LocationIcon className="w-4 h-4" />
                    <span>
                      Dikirim dari{" "}
                      <span className="font-semibold">
                        {mockShippingData.origin}
                      </span>
                    </span>
                  </div>
                  {/* tombol pindah ke kanan */}
                  <button
                    onClick={() => setOpen(true)}
                    className="text-primary cursor-pointer font-semibold text-sm hover:underline"
                  >
                    Lihat Kurir Lainnya
                  </button>
                </div>

                {/* ongkir */}
                {cheapest && (
                  <div className="flex items-center gap-2">
                    <BusIcon className="w-4 h-4" />
                    <div>
                      <p className="font-semibold">
                        Ongkir mulai {formatRupiah(cheapest.price)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {cheapest.group} • Estimasi tiba {cheapest.eta}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <ShippingModal
            open={open}
            data={mockShippingData}
            onClose={() => setOpen(false)}
          />

          {/* Kanan (buy) — col 10..12, span 2 baris */}
          <aside className="col-start-10 col-span-3 row-span-2">
            <div className="sticky top-36 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-14 h-14 rounded-md overflow-hidden border">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm text-gray-600 leading-tight">
                  <div className="font-medium text-gray-800 line-clamp-1">
                    {selectedVariant.name}
                  </div>
                  <div className="text-gray-500">
                    Stok: {selectedVariant.stock.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Atur jumlah</span>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    className="px-3 py-2 hover:bg-gray-50"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Kurangi jumlah"
                  >
                    −
                  </button>
                  <input
                    value={qty}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 1;
                      setQty(Math.min(Math.max(1, v), selectedVariant.stock));
                    }}
                    className="w-12 text-center outline-none py-2"
                  />
                  <button
                    className="px-3 py-2 hover:bg-gray-50"
                    onClick={() =>
                      setQty((q) => Math.min(selectedVariant.stock, q + 1))
                    }
                    aria-label="Tambah jumlah"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4">
                {selectedVariant.oldPrice && (
                  <div className="text-sm text-gray-400 line-through">
                    {formatRupiah(selectedVariant.oldPrice * qty)}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-2xl font-bold">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <AuthActionButton
                  isLoggedIn={isLoggedIn}
                  openAuthModal={() => setIsAuthModalOpen(true)}
                  onClick={handleAddToCart}
                  className="w-full bg-primary cursor-pointer text-white py-3 rounded-lg hover:opacity-90 font-semibold"
                >
                  + Keranjang
                </AuthActionButton>
                <AuthActionButton
                  isLoggedIn={isLoggedIn}
                  openAuthModal={() => setIsAuthModalOpen(true)}
                  onClick={handleBuyNow}
                  className="w-full border cursor-pointer border-primary text-primary py-3 rounded-lg hover:bg-primary/5 font-semibold"
                >
                  Beli Langsung
                </AuthActionButton>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <button className="flex items-center gap-2 hover:text-gray-800">
                  <HeartIcon /> Wishlist
                </button>
                <button className="flex items-center gap-2 hover:text-gray-800">
                  <ShareIcon /> Share
                </button>
              </div>
            </div>
          </aside>

          {/* Review — baris 2, kolom 1..9 */}
          <section className="col-start-1 col-span-9 row-start-2">
            <ProductReview />
          </section>
        </div>
        <section>
          <ProductGrid products={productsData} />
        </section>
      </div>
    </>
  );
}
