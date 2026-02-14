// File: src/app/(site)/not-found.tsx

import { bottomNavItemsData } from "@shared/constants/navigation";
import { Footer } from "@shared/components/layout/footer/DekstopFooter";
import { MobileFooter } from "@shared/components/layout/footer/MobileFooter";
import { DesktopHeader } from "@shared/components/layout/header/desktop/DekstopHeader";
import { MobileHeader } from "@shared/components/layout/header/mobile/MobileHeader";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
          <Image
            src="/images/error/404.png"
            alt="Halaman tidak ditemukan"
            fill
            sizes="(max-width: 768px) 256px, 320px"
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-base-text mb-2">
          Waduh, tujuanmu nggak ada!
        </h1>
        <p className="text-subtle-text max-w-md mb-8">
          Mungkin kamu salah jalan atau alamat. Ayo balik sebelum gelap!
        </p>

        <Link
          href="/"
          className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
        >
          Kembali
        </Link>
      </div>
      <Footer />
      <MobileFooter navItems={bottomNavItemsData} />
    </>
  );
}
