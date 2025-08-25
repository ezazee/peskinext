// File: src/features/product/components/MobileDetail.tsx
"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, Variant } from "@shared/types/types";
import { IoStar } from "react-icons/io5";
import { formatRupiah } from "@shared/libs/format";
import {
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BusIcon,
} from "@shared/components/icons";

import ShippingModal from "@shared/components/ui/ShipingModal/ShippingModal";
import { mockShippingData } from "@data/shipingData";
import { motion, AnimatePresence } from "framer-motion";
import MobileReviews from "../review/MobileReviews";
import { reviewsData } from "@data/review";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import { productsData } from "@data/products";

type MobileDetailProps = { product: Product };

/** ---- helpers: tanpa any ---- */
type VariantExtras = {
  oldPrice?: number | string;
  stock?: number;
  price?: number | string;
};
const toNum = (v: number | string | undefined | null): number | null => {
  if (v === undefined || v === null || v === "") return null;
  return typeof v === "number" ? v : Number(v);
};

export default function MobileDetail({ product }: MobileDetailProps) {
  const [open, setOpen] = useState(false);

  // --- STATE ---
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0]
  );
  const [qty, setQty] = useState(1);

  // --- GALLERY ---
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

  /** ---- DERIVED (tanpa any) ---- */
  const vExtra = selectedVariant as unknown as Variant & VariantExtras;
  const priceNum =
    toNum(
      vExtra.price ?? (selectedVariant as unknown as { price: number }).price
    ) ?? 0;
  const oldPriceNum = toNum(vExtra.oldPrice);
  const hasDiscount = oldPriceNum !== null;
  const discountPercent = useMemo(() => {
    if (oldPriceNum === null || oldPriceNum === 0) return 0;
    return Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100);
  }, [oldPriceNum, priceNum]);

  const subtotal = priceNum * qty;
  const maxStock = useMemo(() => vExtra.stock ?? 99, [vExtra.stock]);

  // --- HANDLERS ---
  const clampQty = (v: number) => Math.min(Math.max(1, v), maxStock);

  const handleAddToCart = () => {
    console.log(
      `Menambahkan ${qty} x ${product.name} (${selectedVariant.name}) ke keranjang`
    );
  };
  const handleBuyNow = () => {
    console.log(`Membeli ${qty} x ${product.name} (${selectedVariant.name})`);
  };

  // ongkir termurah (mock)
  const cheapest = useMemo(() => {
    let min = Infinity;
    let eta = "";
    mockShippingData.groups.forEach((g) =>
      g.items.forEach((it) => {
        if (it.price < min) {
          min = it.price;
          eta = it.eta;
        }
      })
    );
    return isFinite(min) ? { price: min, eta } : null;
  }, []);

  return (
    <>
      <div className="md:hidden">
        {/* GALLERY */}
        <motion.div
          className="relative w-full aspect-square bg-white overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
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

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-sm"
            aria-label="Sebelumnya"
          >
            <ChevronLeftIcon />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-sm"
            aria-label="Berikutnya"
          >
            <ChevronRightIcon />
          </motion.button>

          {hasDiscount && (
            <motion.span
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute left-3 top-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded"
            >
              {discountPercent}%
            </motion.span>
          )}
        </motion.div>

        {/* KONTEN */}
        <motion.div
          className="p-4 bg-white rounded-t-2xl -mt-4 relative z-10 shadow-sm"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          {/* HARGA */}
          <div className="flex items-end gap-2">
            <motion.div
              key={selectedVariant.id}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-gray-900"
            >
              {formatRupiah(priceNum)}
            </motion.div>
            {hasDiscount && oldPriceNum !== null && (
              <>
                <div className="text-sm text-gray-400 line-through">
                  {formatRupiah(oldPriceNum)}
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
                <motion.button whileTap={{ scale: 0.9 }} className="p-1">
                  <HeartIcon />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} className="p-1">
                  <ShareIcon />
                </motion.button>
              </div>
            </div>

            {/* rating & terjual (dummy) */}
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

          {/* Shipping Info */}
          {cheapest && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpen(true)}
                aria-label="Lihat detail kurir dan opsi pengiriman"
                className="w-full cursor-pointer flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white shadow-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <BusIcon className="w-5 h-5 text-gray-500" />
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-semibold text-xs text-gray-800 whitespace-nowrap">
                      Ongkir mulai {formatRupiah(cheapest.price)}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      Est. tiba {cheapest.eta}
                    </span>
                  </div>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-gray-500 shrink-0" />
              </motion.button>
            </motion.div>
          )}

          {/* separator halus */}
          <div className="h-px bg-gray-100 my-4" />

          {/* VARIASI */}
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Pilih variasi:{" "}
              <span className="font-bold">{selectedVariant.name}</span>
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {product.variants.map((v) => {
                const active = selectedVariant.id === v.id;
                return (
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`cursor-pointer px-3 py-1.5 rounded-full text-sm shadow-sm shrink-0 ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {v.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ====== DETAIL & KONTEN PRODUK ====== */}
          <div className="mt-6 space-y-4">
            {/* DETAIL PRODUK */}
            <Card title="Detail produk">
              <DetailRow label="SKU">{product.sku || "-"}</DetailRow>
              <Divider />
              <DetailRow label="Kategori">{product.category || "-"}</DetailRow>
              <Divider />
              <DetailRow label="Tipe">{product.type.toUpperCase()}</DetailRow>
              <Divider />
              <DetailRow label="Varian">
                {selectedVariant?.name || "-"}
              </DetailRow>
              <Divider />
              <DetailRow label="Harga (base)">{product.price || "-"}</DetailRow>
            </Card>

            {/* DESKRIPSI */}
            <ProductDescription text={product.description ?? ""} />

            {/* INGREDIENTS */}
            {product.ingredients?.length > 0 && (
              <CollapseCard title="Ingredients">
                <ul className="list-disc pl-5 space-y-1">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </CollapseCard>
            )}

            {/* CARA PAKAI */}
            {product.howToUse?.length > 0 && (
              <CollapseCard title="Cara Pakai">
                <ol className="list-decimal pl-5 space-y-1">
                  {product.howToUse.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </CollapseCard>
            )}
          </div>
        </motion.div>

        <MobileReviews
          reviews={reviewsData}
          seeAllHref={`/produk/${product.slug}#ulasan`}
        />

        <ShippingModal
          open={open}
          data={mockShippingData}
          onClose={() => setOpen(false)}
        />

        <section>
          <ProductGrid products={productsData} />
        </section>

        {/* spacer agar konten tidak ketutup action bar */}
        <div className="md:hidden h-[116px]" />

        {/* ACTION BAR */}
        <div className="fixed inset-x-0 bottom-0 md:hidden z-[20] bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Subtotal</span>
              <p className="font-bold text-lg">{formatRupiah(subtotal)}</p>
            </div>

            {/* Qty */}
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-sm">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="h-9 w-9 grid place-items-center"
                onClick={() => setQty((q) => clampQty(q - 1))}
                aria-label="Kurangi jumlah"
              >
                −
              </motion.button>
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
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="h-9 w-9 grid place-items-center"
                onClick={() => setQty((q) => clampQty(q + 1))}
                aria-label="Tambah jumlah"
              >
                +
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="h-11 rounded-lg text-primary font-medium shadow-sm bg-white"
            >
              Beli Langsung
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="h-11 rounded-lg bg-primary text-white font-semibold shadow-sm"
            >
              + Keranjang
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ========= SMALL COMPONENTS ========= */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="rounded-xl bg-white shadow-sm"
    >
      <div className="px-4 py-3 bg-gray-50 rounded-t-xl font-semibold">
        {title}
      </div>
      <div className="px-4 py-2">{children}</div>
    </motion.div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-100 my-2" />;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="text-gray-800">{children}</div>
    </div>
  );
}

function ProductDescription({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const content = text?.trim() ? text : "Tidak ada deskripsi.";

  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="rounded-xl bg-white shadow-sm"
    >
      <div className="px-4 py-3 bg-gray-50 rounded-t-xl font-semibold">
        Deskripsi produk
      </div>

      <div className="relative px-4 pt-3 pb-2 text-sm leading-relaxed text-gray-800">
        <AnimatePresence initial={false}>
          <motion.div
            key={open ? "open" : "closed"}
            initial={{ height: 96, overflow: "hidden" }}
            animate={{ height: open ? "auto" : 96 }}
            exit={{ height: 96 }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>

        {!open && (
          <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        )}

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen((s) => !s)}
          className="mt-2 text-sm font-semibold text-primary"
        >
          {open ? "Tutup" : "Baca Selengkapnya"}
        </motion.button>
      </div>
    </motion.div>
  );
}

function CollapseCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="rounded-xl bg-white shadow-sm"
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-xl font-semibold"
      >
        <span>{title}</span>
        <span className="text-gray-500">{open ? "−" : "+"}</span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="px-4 overflow-hidden"
          >
            <div className="py-3 text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
