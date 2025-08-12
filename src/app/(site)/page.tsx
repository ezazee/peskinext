"use client";

import { useState, useEffect } from "react";

import { WelcomeBanner } from "@/components/ui/WelcomeBanner";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { CategorySection } from "@/components/CategorySection";
import { ProductGrid } from "@/components/Product/ProductGrid";
import { MobileFooter } from "@/components/Footer/MobileFooter";
import {
  desktopCategoriesData,
  mobileCategoriesData,
  productsData,
  bottomNavItemsData,
} from "@/data/";
import { Footer } from "@/components/Footer/DekstopFooter";
import { SpecialDiscount } from "@/components/Section/SpecialDiscount";

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
          {/* <CategorySection
            desktopCategories={desktopCategoriesData}
            mobileCategories={mobileCategoriesData}
          /> */}

          <SpecialDiscount />

          <div className="h-2 bg-white md:hidden my-2"></div>
          <ProductGrid products={productsData} />
        </main>

        <Footer />
        <MobileFooter navItems={bottomNavItemsData} />
      </div>
    </>
  );
}
