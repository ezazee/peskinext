"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { settingsService, type GeneralSettings } from "@features/settings/settingsService";
import { normalizeImageUrl } from "@shared/utils/imageUrl";
import { Menu, X } from 'lucide-react';

export const AboutHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [settings, setSettings] = useState<GeneralSettings | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        async function fetchSettings() {
            const data = await settingsService.getSettings();
            setSettings(data);
        }
        fetchSettings();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoUrl = normalizeImageUrl(settings?.logo_url);

    const navLinks = [
        { name: 'Home', href: '/about' },
        { name: 'Artikel', href: '/blog' },
    ];

    return (
        <>
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 !bg-white !opacity-100 z-[99999] p-8 flex flex-col overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <div className="relative h-10 w-40">
                                <Image src={logoUrl} alt="Logo" fill className="object-contain object-left" />
                            </div>
                            <button 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="p-2 text-secondary hover:bg-gray-100 rounded-xl transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-secondary hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/all-product"
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-8 px-8 py-5 bg-primary text-white text-center font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Belanja Sekarang
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            <header
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-lg py-4 shadow-sm border-b border-gray-100'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    {/* Logo Section */}
                    <Link href="/" className="relative h-12 w-48 group">
                        <Image
                            src={logoUrl}
                            alt={settings?.store_name || "PE Skin Pro"}
                            fill
                            className="object-contain object-left transition-transform group-hover:scale-105"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-semibold tracking-wide uppercase transition-colors hover:text-primary ${isScrolled ? 'text-secondary' : 'text-white drop-shadow-sm'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/all-product"
                            className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            Belanja Sekarang
                        </Link>
                    </nav>

                    {/* Mobile Trigger */}
                    <button
                        className={`md:hidden p-2 rounded-xl transition-all duration-300 ${isScrolled
                                ? 'text-secondary hover:bg-gray-100'
                                : 'text-white bg-black/20 backdrop-blur-md hover:bg-black/30'
                            }`}
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="w-7 h-7" />
                    </button>
                </div>
            </header>
        </>
    );
};
