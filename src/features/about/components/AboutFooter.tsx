"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from "react";
import { settingsService, type GeneralSettings } from "@features/settings/settingsService";
import { Instagram, Facebook, Globe, Shield } from "lucide-react";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

export const AboutFooter = () => {
    const [settings, setSettings] = useState<GeneralSettings | null>(null);

    useEffect(() => {
        async function fetchSettings() {
            const data = await settingsService.getSettings();
            setSettings(data);
        }
        fetchSettings();
    }, []);

    const logoUrl = normalizeImageUrl(settings?.logo_url);

    const socialLinks = [
        { 
            href: settings?.social_instagram, 
            icon: <Instagram className="w-5 h-5" />, 
            label: "Instagram" 
        },
        { 
            href: settings?.social_tiktok, 
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.33 1.47-1.3 2.46.02.79.39 1.56 1.03 2.02.61.47 1.38.64 2.14.6.86-.03 1.66-.46 2.18-1.15.27-.37.45-.79.52-1.24.11-1.25.07-2.51.09-3.76V.02z"/>
                </svg>
            ), 
            label: "TikTok" 
        },
        { 
            href: settings?.social_shopee, 
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.463 3.486c-.161-.223-.42-.352-.693-.352h-5.54c-.273 0-.532.129-.693.352L6.152 6.702H17.848l-2.385-3.216zm2.704 4.187H5.833l-.707 9.897c-.035.485.127.962.454 1.338.307.354.743.557 1.21.557h10.42c.467 0 .903-.203 1.21-.557.327-.376.489-.853.454-1.338l-.707-9.897zm-6.167 6.376c0 .546-.443.989-.989.989-.546 0-.989-.443-.989-.989s.443-.989.989-.989c.546 0 .989.443.989.989zm.989-1.978c.546 0 .989.443.989.989s-.443.989-.989.989-.989-.443-.989-.989.443-.989.989-.989z"/>
                </svg>
            ), 
            label: "Shopee" 
        },
    ].filter(item => item.href);

    return (
        <footer className="bg-gray-950 text-white border-t border-white/5 py-16 font-sans mt-auto relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="lg:col-span-1">
                        {/* Dynamic Logo */}
                        <Link href="/" className="inline-block mb-8 group">
                            <div className="relative h-12 w-40 transition-transform group-hover:scale-105 active:scale-95">
                                <Image
                                    src={logoUrl}
                                    alt={settings?.store_name || "PE Skin Professional"}
                                    fill
                                    className="object-contain object-left"
                                    sizes="160px"
                                />
                            </div>
                        </Link>
                        
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                            {settings?.brand_description || "Brand skincare modern dengan teknologi Jerman dan bahan natural vegan. Aman, efektif, dan terpercaya."}
                        </p>
                        
                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => (
                                <a 
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl hover:bg-primary hover:border-primary transition-all flex items-center justify-center cursor-pointer group shadow-lg"
                                    title={social.label}
                                >
                                    <div className="text-white group-hover:scale-110 transition-transform">{social.icon}</div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:gap-12 lg:col-span-3 lg:justify-items-end">
                        <div className="lg:min-w-[140px]">
                            <h4 className="font-bold mb-8 text-xs uppercase tracking-[0.2em] text-gray-500">Explore</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 group"><Globe className="w-3 h-3 transition-transform group-hover:rotate-12" /> Home</Link></li>
                                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog & Artikel</Link></li>
                                <li><Link href="/all-product" className="hover:text-primary transition-colors">Toko Produk</Link></li>
                                <li><Link href="/about" className="hover:text-primary transition-colors font-bold text-gray-200">Tentang Kami</Link></li>
                            </ul>
                        </div>
                        <div className="lg:min-w-[140px]">
                            <h4 className="font-bold mb-8 text-xs uppercase tracking-[0.2em] text-gray-500">Bantuan</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors flex items-center gap-2">Kebijakan Privasi</Link></li>
                                <li><Link href="/terms-and-conditions" className="hover:text-primary transition-colors flex items-center gap-2">Syarat & Ketentuan</Link></li>
                                <li><Link href="/faq" className="hover:text-primary transition-colors">Pusat Bantuan</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-primary" />
                        <p>{settings?.copyright_text || `© ${new Date().getFullYear()} PE Skin Professional. All rights reserved.`}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <p className="font-medium tracking-[0.2em] uppercase opacity-30">Quality First</p>
                        <p className="font-medium tracking-[0.2em] uppercase opacity-30">Science Backed</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
