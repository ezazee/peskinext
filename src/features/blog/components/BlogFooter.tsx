"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { settingsService, type GeneralSettings } from "@features/settings/settingsService";
import { Instagram, Facebook, Share2 } from "lucide-react";

export const BlogFooter = () => {
    const [settings, setSettings] = useState<GeneralSettings | null>(null);

    useEffect(() => {
        async function fetchSettings() {
            const data = await settingsService.getSettings();
            setSettings(data);
        }
        fetchSettings();
    }, []);

    const socialLinks = [
        { href: settings?.social_instagram, icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
        { href: settings?.social_tiktok, icon: <Share2 className="w-4 h-4" />, label: "TikTok" },
        { href: settings?.social_shopee, icon: <Share2 className="w-4 h-4" />, label: "Shopee" },
    ].filter(link => link.href);

    return (
        <footer className="bg-white border-t border-gray-100 py-12 font-sans mt-auto">
            <div className="max-w-screen-xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-primary font-bold text-xl mb-4 italic uppercase tracking-wider">{settings?.store_name || "PE Skinpro"} BLOG</h3>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                            {settings?.brand_description || "Inspirasi harian untuk perjalanan kulit sehatmu. Temukan tips, review produk, dan panduan lengkap seputar skincare alami."}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Kategori</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/blog?category=tips-skincare" className="hover:text-primary transition-colors">Tips Skincare</Link></li>
                            <li><Link href="/blog?category=daily-routine" className="hover:text-primary transition-colors">Daily Routine</Link></li>
                            <li><Link href="/blog?category=ingredients" className="hover:text-primary transition-colors">Ingredients</Link></li>
                            <li><Link href="/blog?category=tools-review" className="hover:text-primary transition-colors">Review Produk</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Tentang</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/about" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Kontak</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                    <p>{settings?.copyright_text || `© ${new Date().getFullYear()} ${settings?.store_name || 'PE Skinpro'}. All rights reserved.`}</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        {socialLinks.map((social, idx) => (
                            <a 
                                key={idx} 
                                href={social.href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-primary transition-colors flex items-center gap-1"
                            >
                                {social.icon} {social.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
