// File: src/app/components/Footer/Footer.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// --- Ikon-ikon untuk Footer ---
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className={`w-4 h-4 transition-transform ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);
const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.54-.18-6.69-1.86-8.79-4.46-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.58-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.14 2.94 4.03 2.97-1.47 1.15-3.32 1.83-5.33 1.83-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.56 1.93 7.88 0 12.2-6.54 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
  </svg>
);
const PinterestIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.763 7.825 6.505 9.155.021-.29.035-.58.056-.875.06-.27.375-1.58.375-1.58s-.094-.188-.094-.469c0-.438.25-.766.563-.766.266 0 .39.2.39.438 0 .265-.17.656-.265 1.015-.078.313.155.578.468.578.562 0 1-.594 1-1.438 0-1.218-.875-2.062-2.188-2.062-1.547 0-2.625 1.156-2.625 2.5 0 .312.11.656.25.844.03.046.046.078.03.125-.017.062-.063.25-.078.312-.032.11-.078.14-.14.062-.516-.28-1.047-1.03-1.047-1.75 0-1.312.968-2.812 3.125-2.812 1.656 0 2.937.938 2.937 2.312 0 1.657-1.047 2.907-2.485 2.907-.484 0-.937-.25-.109-.531.156-.297.468-.938.593-1.25.172-.39.297-.578.468-.578.188 0 .313.094.313.219 0 .5-.938 2.344-1.125 2.719-.219.42-.015.78.375.78.468 0 .843-.578.984-.828.11-.187.594-2.437.594-2.437.14-.594.78-1.125 1.5-1.125.812 0 1.437.625 1.437 1.5 0 .812-.297 1.718-.688 2.656-.312.75-.234 1.625.219 2.188.516.594 1.312.718 2.015.312 1.094-.625 1.594-1.937 1.594-3.25 0-2.5-1.53-4.625-4.5-4.625-3.03 0-5.312 2.218-5.312 5.03 0 .5.125.906.297 1.25.062.125.062.266.016.422L7.36 19.34c-.047.203-.14.28-.312.156-1.125-.812-1.828-2.03-1.828-3.375 0-2.718 2.28-5.5 6.75-5.5 3.594 0 6.25 2.53 6.25 5.75 0 3.5-2.187 6.25-5.25 6.25-1.015 0-1.968-.515-2.296-1.125l-.704 2.625c-.234.875-.86 1.953-1.547 2.594.094.015.188.03.28.03 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
  </svg>
);

// --- Data untuk Link Footer ---
const footerData = {
  tokopedia: [
    { name: "Tentang PE Skinpro", href: "#" },
    { name: "Hak Kekayaan Intelektual", href: "#" },
    { name: "Karir", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Affiliate Program", href: "#" },
    { name: "B2B Digital", href: "#" },
    { name: "Marketing Solutions", href: "#" },
    { name: "Kalkulator Indeks Masa Tubuh", href: "#" },
    { name: "PE Skinpro Farma", href: "#" },
    { name: "Promo Hari Ini", href: "#" },
    { name: "Beli Lokal", href: "#" },
    { name: "Promo Guncang", href: "#" },
  ],
  beli: [
    { name: "Tagihan & Top Up", href: "#" },
    { name: "PE Skinpro COD", href: "#" },
    { name: "Bebas Ongkir", href: "#" },
  ],
  jual: [
    { name: "Pusat Edukasi Seller", href: "#" },
    { name: "Daftar Mitra", href: "#" },
  ],
  bantuan: [
    { name: "PE Skinpro Care", href: "#" },
    { name: "Syarat dan Ketentuan", href: "#" },
    { name: "Kebijakan Privasi", href: "#" },
  ],
};

const AccordionItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border-color">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <span className="font-bold text-base-text">{title}</span>
        <ChevronDownIcon className={isOpen ? "rotate-180" : ""} />
      </button>
      {isOpen && (
        <div className="pb-4 pr-6 text-subtle-text space-y-3">{children}</div>
      )}
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-border-color mt-10">
      {/* --- Tampilan Desktop --- */}
      <div className="hidden md:block">
        <div className="max-w-screen-xl mx-auto px-8 py-10">
          <div className="grid grid-cols-12 gap-8">
            {/* Kolom 1: PE Skinpro */}
            <div className="col-span-3">
              <h3 className="font-bold mb-4">PE Skinpro</h3>
              <div className="space-y-3 text-subtle-text text-sm">
                {footerData.tokopedia.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Kolom 2: Beli, Jual, Bantuan */}
            <div className="col-span-3">
              <h3 className="font-bold mb-4">Beli</h3>
              <div className="space-y-3 text-subtle-text text-sm mb-6">
                {footerData.beli.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <h3 className="font-bold mb-4">Jual</h3>
              <div className="space-y-3 text-subtle-text text-sm mb-6">
                {footerData.jual.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <h3 className="font-bold mb-4">Bantuan dan Panduan</h3>
              <div className="space-y-3 text-subtle-text text-sm">
                {footerData.bantuan.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Kolom 3: Keamanan & Ikuti Kami */}
            <div className="col-span-2">
              <h3 className="font-bold mb-4">Keamanan & Privasi</h3>
              <div className="flex gap-4 mb-6">
                <Image
                  src="https://placehold.co/100x40/E8F5FA/1D9AD2?text=Sertifikasi"
                  alt="Sertifikasi 1"
                  width={100}
                  height={40}
                />
              </div>
              <h3 className="font-bold mb-4">Ikuti Kami</h3>
              <div className="flex gap-4 text-subtle-text">
                <a href="#" className="hover:text-primary">
                  <FacebookIcon />
                </a>
                <a href="#" className="hover:text-primary">
                  <TwitterIcon />
                </a>
                <a href="#" className="hover:text-primary">
                  <PinterestIcon />
                </a>
              </div>
            </div>

            {/* Kolom 4: Aplikasi */}
            <div className="col-span-4">
              <h3 className="font-bold mb-4">
                Nikmati keuntungan spesial di aplikasi:
              </h3>
              <ul className="space-y-2 text-sm text-subtle-text mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✔</span> Diskon 70% di
                  aplikasi
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✔</span> Promo khusus
                  aplikasi
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✔</span> Gratis Ongkir tiap
                  hari
                </li>
              </ul>
              <p className="text-sm text-subtle-text mb-2">
                Buka aplikasi dengan scan QR atau Klik tombol:
              </p>
              <div className="flex gap-4 items-center">
                <Image
                  src="https://placehold.co/120x120/000000/FFFFFF?text=QR"
                  alt="QR Code"
                  width={120}
                  height={120}
                />
                <div className="space-y-2">
                  <a href="#">
                    <Image
                      src="https://placehold.co/150x50/000000/FFFFFF?text=Google+Play"
                      alt="Google Play"
                      width={150}
                      height={50}
                    />
                  </a>
                  <a href="#">
                    <Image
                      src="https://placehold.co/150x50/000000/FFFFFF?text=App+Store"
                      alt="App Store"
                      width={150}
                      height={50}
                    />
                  </a>
                  <a href="#">
                    <Image
                      src="https://placehold.co/150x50/000000/FFFFFF?text=AppGallery"
                      alt="AppGallery"
                      width={150}
                      height={50}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border-color">
          <div className="max-w-screen-xl mx-auto px-8 py-4 flex justify-between items-center text-sm text-subtle-text">
            <p>©{new Date().getFullYear()}, PT Kilau Berlian Nusantara.</p>
            <div className="flex items-center gap-2">
              <button className="bg-primary text-white font-semibold px-4 py-1 rounded-full">
                Indonesia
              </button>
              <button className="font-semibold px-4 py-1 rounded-full hover:bg-tertiary">
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Tampilan Mobile --- */}
      <div className="md:hidden px-4">
        {Object.entries({
          "PE Skinpro": footerData.tokopedia,
          Beli: footerData.beli,
          Jual: footerData.jual,
          "Bantuan dan Panduan": footerData.bantuan,
        }).map(([title, links]) => (
          <AccordionItem key={title} title={title}>
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </AccordionItem>
        ))}
        <div className="py-6 text-center">
          <p className="text-sm text-subtle-text">
            ©{new Date().getFullYear()}, PT Kilau Berlian Nusantara
          </p>
        </div>
      </div>
    </footer>
  );
};
