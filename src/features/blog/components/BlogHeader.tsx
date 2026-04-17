"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { settingsService, type GeneralSettings } from "@features/settings/settingsService";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

const NAV_ITEMS = [
    { label: "HOME", href: "/blog" },
    { label: "ABOUT", href: "/about" },
    { label: "TIPS SKINCARE", href: "/blog/tips-skincare" },
    { label: "DAILY ROUTINE", href: "/blog/daily-routine" },
    { label: "EDUKASI AFFILIATOR", href: "/blog/edukasi-affiliator" },
];

export const BlogHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const [settings, setSettings] = useState<GeneralSettings | null>(null);

    useEffect(() => {
        async function fetchSettings() {
            const data = await settingsService.getSettings();
            setSettings(data);
        }
        fetchSettings();
    }, []);

    const logoUrl = normalizeImageUrl(settings?.logo_url);

    const isActive = (path: string) => {
        if (path === "/blog" && pathname === "/blog") return true;
        if (path !== "/blog" && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="font-sans shadow-sm sticky top-0 z-50 bg-white">
            {/* Main Bar - White */}
            <div className="h-16 md:h-20 border-b border-gray-100 bg-white relative z-50">
                <div className="max-w-screen-xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:gap-10">


                        <Link href="/blog" className="flex items-center">
                            <div className="relative h-8 w-28 md:h-10 md:w-40 transition-all">
                                <Image 
                                    src={logoUrl} 
                                    alt={settings?.store_name || "Logo"} 
                                    fill 
                                    className="object-contain object-left" 
                                    priority
                                    sizes="(max-width: 768px) 112px, 160px"
                                />
                            </div>
                        </Link>

                        {/* Navigation - Desktop (Large Screens) */}
                        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`text-sm font-bold transition-colors tracking-wide uppercase ${isActive(item.href)
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-primary"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <Link
                            href="/"
                            className="hidden sm:block px-4 py-2 md:px-5 md:py-2.5 bg-primary text-white text-xs md:text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
                        >
                            Ke Toko Utama
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-16 md:top-20left-0 w-full bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden border-b border-gray-100 shadow-lg ${isMenuOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
                style={{ top: "64px" }} // Explicit top offset matches header height
            >
                <nav className="flex flex-col py-4 px-4 max-h-[calc(100vh-64px)] overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`py-3 px-4 text-sm font-bold tracking-wide uppercase rounded-lg transition-colors ${isActive(item.href)
                                ? "bg-primary/10 text-primary"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-100 sm:hidden">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full py-3 px-4 bg-primary text-white text-center text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Ke Toko Utama
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};
