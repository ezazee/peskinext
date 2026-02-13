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
    // Check mute timer
    const muteUntil = localStorage.getItem("popup_mute_until");
    if (muteUntil && new Date().getTime() < parseInt(muteUntil)) {
      // Masih dalam masa mute (2 jam), jangan tampilkan
      return;
    }

    // Default: Tampilkan (karena user minta sering muncul kecuali dimute)
    setIsBannerOpen(true);
  }, []);

  const handleCloseBanner = (mute: boolean) => {
    setIsBannerOpen(false);
    if (mute) {
      // Set mute sampai 2 jam ke depan
      const twoHoursLater = new Date().getTime() + 2 * 60 * 60 * 1000;
      localStorage.setItem("popup_mute_until", twoHoursLater.toString());
    }
  };

  // Saat loading, tampilkan skeleton full landing
  if (loading) {
    return (
      <>
        <WelcomeBanner isOpen={isBannerOpen} onClose={() => handleCloseBanner(false)} />
        <HomePageSkeleton />
      </>
    );
  }

  // Error sederhana
  if (error || !data) {
    return (
      <>
        <WelcomeBanner isOpen={isBannerOpen} onClose={() => handleCloseBanner(false)} />
        <div className="max-w-screen-xl mx-auto p-6 text-red-600">
          Gagal memuat data beranda.
        </div>
      </>
    );
  }

  // Data siap — render konten asli
  return (
    <>
      <WelcomeBanner
        isOpen={isBannerOpen}
        onClose={handleCloseBanner}
        bannerData={data.popup?.[0]}
      />

      <div className="max-w-screen-xl mx-auto bg-white md:bg-white">
        <main className="p-0 md:px-8 md:py-6 bg-white md:bg-white">
          <PromoBanner banners={data.main} />
          <EventPromo
            mobileBanner={data.promo_mobile?.[0]}
            desktopBanner={data.promo_desktop?.[0]}
          />
          <FlashSaleDiscount products={data.products} />
          <PromoShowcase carousel={data.carousel} tiles={data.tiles} />
          <BundleSection products={data.products} />
          <ProductGrid products={data.products} />
        </main>
      </div>
    </>
  );
}
