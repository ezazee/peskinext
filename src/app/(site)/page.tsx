"use client";
import { useState, useEffect } from "react";
import { WelcomeBanner } from "@shared/components/ui/WelcomeBanner";
import { PromoBanner } from "@shared/components/ui/PromoBanner";
import { FlashSaleDiscount } from "@shared/components/sections/FlashSaleDiscount";
import { ProductGrid } from "@shared/components/layout/header/mobile/product/ProductGrid";
import { productsData } from "@data/products";
import PromoShowcase from "@shared/components/sections/PromoShowcase";
import { carouselData, tilesData } from "@data/bannerPromotion";
import { EventPromo } from "@shared/components/sections/EventPromo";
import { BundleSection } from "@shared/components/sections/BundleSection";

export default function HomePage() {
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  useEffect(() => {
    const hasSeenBanner = sessionStorage.getItem("hasSeenWelcomeBanner");

    if (!hasSeenBanner) {
      setIsBannerOpen(true);
      sessionStorage.setItem("hasSeenWelcomeBanner", "true");
    }
  }, []);

  const handleCloseBanner = () => {
    setIsBannerOpen(false);
  };

  return (
    <>
      <WelcomeBanner isOpen={isBannerOpen} onClose={handleCloseBanner} />

      <div className="max-w-screen-xl mx-auto bg-white md:bg-white">
        <main className="p-0 md:px-8 md:py-6 bg-white md:bg-white">
          <PromoBanner />
          <EventPromo />
          <FlashSaleDiscount />
          <PromoShowcase carousel={carouselData} tiles={tilesData} />
          <BundleSection />
          <div className="h-2 bg-white md:hidden my-2"></div>
          <ProductGrid products={productsData} />
        </main>
      </div>
    </>
  );
}
