// app/page.tsx (contoh landing)
"use client";

import { useState, useEffect } from "react";
import { WelcomeBanner } from "@shared/components/ui/WelcomeBanner";
import { useHomeData } from "@features/home/hooks/useHomeData";
import { HomePageSkeleton } from "@features/home/skeleton/HomePageSkeleton";

// ⬇️ cukup impor dari @shared/lazy
import {
  PromoBanner,
  EventPromo,
  FlashSaleDiscount,
  PromoShowcase,
  BundleSection,
  ProductGrid,
} from "@shared/utils";

export default function HomePage() {
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const { data, loading, error } = useHomeData();

  useEffect(() => {
    const seen = sessionStorage.getItem("hasSeenWelcomeBanner");
    if (!seen) {
      setIsBannerOpen(true);
      sessionStorage.setItem("hasSeenWelcomeBanner", "true");
    }
  }, []);

  if (loading) {
    return (
      <>
        <WelcomeBanner
          isOpen={isBannerOpen}
          onClose={() => setIsBannerOpen(false)}
        />
        <HomePageSkeleton />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <WelcomeBanner
          isOpen={isBannerOpen}
          onClose={() => setIsBannerOpen(false)}
        />
        <div className="max-w-screen-xl mx-auto p-6 text-red-600">
          Gagal memuat data beranda.
        </div>
      </>
    );
  }

  return (
    <>
      <WelcomeBanner
        isOpen={isBannerOpen}
        onClose={() => setIsBannerOpen(false)}
      />
      <div className="max-w-screen-xl mx-auto bg-white">
        <main className="p-0 md:px-8 md:py-6 bg-white">
          <PromoBanner />
          <EventPromo />
          <FlashSaleDiscount />
          <PromoShowcase
            title="Spesial untuk kamu"
            carousel={data.carousel}
            tiles={data.tiles}
            autoPlayMs={5000}
          />
          <BundleSection />
          <div className="h-2 bg-white md:hidden my-2" />
          <ProductGrid products={data.products} />
        </main>
      </div>
    </>
  );
}
