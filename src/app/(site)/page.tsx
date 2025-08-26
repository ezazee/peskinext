"use client";

import { useState, useEffect } from "react";
import { WelcomeBanner } from "@shared/components/ui/WelcomeBanner";
import { PromoBanner } from "@shared/components/ui/PromoBanner";
import { FlashSaleDiscount } from "@shared/components/sections/FlashSaleDiscount";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import PromoShowcase from "@shared/components/sections/PromoShowcase";
import { EventPromo } from "@shared/components/sections/EventPromo";
import { BundleSection } from "@shared/components/sections/BundleSection";

import { useHomeData } from "@features/home/hooks/useHomeData";
import { HomePageSkeleton } from "@features/home/skeleton/HomePageSkeleton";

export default function HomePage() {
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const { data, loading, error } = useHomeData();

  useEffect(() => {
    const hasSeenBanner = sessionStorage.getItem("hasSeenWelcomeBanner");
    if (!hasSeenBanner) {
      setIsBannerOpen(true);
      sessionStorage.setItem("hasSeenWelcomeBanner", "true");
    }
  }, []);

  const handleCloseBanner = () => setIsBannerOpen(false);

  // Saat loading, tampilkan skeleton full landing
  if (loading) {
    return (
      <>
        <WelcomeBanner isOpen={isBannerOpen} onClose={handleCloseBanner} />
        <HomePageSkeleton />
      </>
    );
  }

  // Error sederhana
  if (error || !data) {
    return (
      <>
        <WelcomeBanner isOpen={isBannerOpen} onClose={handleCloseBanner} />
        <div className="max-w-screen-xl mx-auto p-6 text-red-600">
          Gagal memuat data beranda.
        </div>
      </>
    );
  }

  // Data siap — render konten asli
  return (
    <>
      <WelcomeBanner isOpen={isBannerOpen} onClose={handleCloseBanner} />

      <div className="max-w-screen-xl mx-auto bg-white md:bg-white">
        <main className="p-0 md:px-8 md:py-6 bg-white md:bg-white">
          <PromoBanner />
          <EventPromo />
          <FlashSaleDiscount />
          <PromoShowcase carousel={data.carousel} tiles={data.tiles} />
          <BundleSection />
          <div className="h-2 bg-white md:hidden my-2" />
          <ProductGrid products={data.products} />
        </main>
      </div>
    </>
  );
}
