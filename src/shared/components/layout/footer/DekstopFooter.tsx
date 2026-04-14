
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  ChevronDown,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { type GeneralSettings, SETTINGS_FALLBACKS } from "@features/settings/settingsService";
import { useSettings } from "@features/settings/useSettings";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

// --- Custom Icons for Missing Lucide Icons ---
const TiktokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
  </svg>
);

// --- Data ---
const FOOTER_LINKS = {
  about: [
    { name: "Tentang PE Skinpro", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Affiliate Program", href: "https://affiliate.peskinpro.id/" },
  ],
  support: [
    { name: "Pusat Bantuan", href: "/help" },
    { name: "Tanya Jawab (FAQ)", href: "/faq" },
  ],
  legal: [
    { name: "Syarat & Ketentuan", href: "/terms-and-conditions" },
    { name: "Kebijakan Privasi", href: "/privacy-policy" },
  ],
  shop: [
    { name: "Semua Produk", href: "/all-product" },
    { name: "Face Care", href: "/all-product?category=face" },
    { name: "Body Care", href: "/all-product?category=body" },
    { name: "Special Bundles", href: "/all-product?category=bundle" },
  ]
};

const PAYMENT_LOGOS = [
  "/images/paymentlogo/bca.svg",
  "/images/paymentlogo/mandiri.png",
  "/images/paymentlogo/bni.png",
  "/images/paymentlogo/bri.svg",
  "/images/paymentlogo/qris.png"
];

const SHIPMENT_LOGOS = [
  "/images/kurir/New_Logo_JNE.png",
  "/images/kurir/J&T_Express_logo.svg.png",
  "/images/kurir/logo-sicepat.png",
  "/images/kurir/GoSend.png",
  "/images/kurir/Grab_Logo.svg.png",
  "/images/kurir/Lion-Parcel.png"
];

const AccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0 md:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-left md:hidden"
      >
        <span className="font-bold text-gray-900">{title}</span>
        <ChevronDown size={16} className={`transition-transform duration-300 text-gray-500 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {/* Desktop always visible, Mobile toggle */}
      <div className={`${isOpen ? "block" : "hidden"} md:block pb-4 md:pb-0 space-y-3`}>
        <h3 className="font-bold text-gray-900 mb-6 hidden md:block uppercase tracking-wider text-sm">{title}</h3>
        {children}
      </div>
    </div>
  );
};

// ... inside Footer component
export const Footer = () => {
  const { data: settings = SETTINGS_FALLBACKS } = useSettings();

  return (
    <footer className="bg-white text-gray-600 font-sans border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6 relative h-10 w-40">
              <Image 
                src={normalizeImageUrl(settings.logo_footer_url) || "/Logo.png"} 
                alt={settings.store_name} 
                fill 
                className="object-contain object-left" 
              />
            </div>
            <p className="mb-6 text-sm leading-relaxed max-w-sm text-gray-500">
              {settings.brand_description}
            </p>
            <div className="flex items-center gap-4 mb-8">
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors border border-gray-100">
                <Instagram size={20} />
              </a>
              <a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors border border-gray-100">
                <TiktokIcon size={20} />
              </a>
              <a href={settings.social_shopee} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors border border-gray-100 overflow-hidden relative">
                <div className="relative w-5 h-5">
                  <Image src="/images/icon/shopee.png" alt="Shopee" fill className="object-contain" />
                </div>
              </a>
              {settings.contact_whatsapp && (
                <a href={`https://wa.me/${settings.contact_whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors border border-gray-100">
                  <Phone size={20} className="text-green-600" />
                </a>
              )}
            </div>

            {/* Badges */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl max-w-fit border border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-600" size={20} />
                <span className="text-xs font-bold text-gray-700">BPOM<br />Certified</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-blue-600" size={20} />
                <span className="text-xs font-bold text-gray-700">Halal<br />MUI</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <AccordionItem title="Tentang Kami">
              <ul className="flex flex-col gap-3">
                {FOOTER_LINKS.about.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-primary transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </div>

          <div>
            <AccordionItem title="Layanan Pelanggan">
              <ul className="flex flex-col gap-3">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-primary transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </div>

          <div>
            <AccordionItem title="Legal & Policy">
              <ul className="flex flex-col gap-3">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-primary transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </div>
        </div>

        {/* Payments & Shipping */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Metode Pembayaran</h4>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_LOGOS.map((url, idx) => (
                  <div key={idx} className="relative w-14 h-8 bg-white border border-gray-200 rounded overflow-hidden p-1">
                    <Image src={url} alt="Payment" fill className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Jasa Pengiriman</h4>
              <div className="flex flex-wrap gap-2">
                {SHIPMENT_LOGOS.map((url, idx) => (
                  <div key={idx} className="relative w-14 h-8 bg-white border border-gray-200 rounded overflow-hidden p-1">
                    <Image src={url} alt="Shipment" fill className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{settings.copyright_text}</p>
          <div className="flex gap-6">
            <span>Indonesia (ID)</span>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors cursor-pointer">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-primary transition-colors cursor-pointer">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
