"use client";

import { productsData } from "@data/products";
import DesktopDetail from "@features/product/components/dekstopDetail";
import MobileDetail from "@features/product/components/mobileDetail";
import { parseRupiahToNumber } from "@shared/libs/format";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  const hasDiscount = Boolean(product.oldPrice && product.discount);
  const priceNumber = parseRupiahToNumber(product.price);
  const oldPriceNumber = parseRupiahToNumber(product.oldPrice);

  return (
    <div className="container mx-auto p-0 md:p-6">
      {/* Mobile */}
      <MobileDetail
        product={product}
        hasDiscount={hasDiscount}
        priceNumber={priceNumber}
        oldPriceNumber={oldPriceNumber}
      />

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopDetail product={product} />
      </div>
    </div>
  );
}
