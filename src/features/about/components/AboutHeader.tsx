"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const AboutHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const NAV_ITEMS = [
        { label: "Home", href: "/" },
        { label: "Affiliate Program", href: "https://affiliate.peskinpro.id/", external: true },
        { label: "Blog", href: "/blog" },
    ];

    return (
        <header className="font-sans shadow-sm sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="h-16 md:h-20 bg-white relative z-50">
                <div className="max-w-screen-xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">

                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center">
                        <div className="relative h-8 w-28 md:h-10 md:w-36 transition-all">
                            <Image
                                src="/Logo.png"
                                alt="PE Skinpro"
                                fill
                                className="object-contain object-left"
                                sizes="(max-width: 768px) 120px, 144px"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <nav className="hidden md:flex items-center gap-6 mr-4">
                            {NAV_ITEMS.map((item) => (
                                item.external ? (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-wide"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="text-sm font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-wide"
                                    >
                                        {item.label}
                                    </Link>
                                )
                            ))}
                        </nav>

                        <Link
                            href="/all-product"
                            className="hidden sm:block px-4 py-2 md:px-5 md:py-2.5 bg-primary text-white text-xs md:text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
                        >
                            Belanja Sekarang
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
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
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-16 left-0 w-full bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden border-b border-gray-100 shadow-lg ${isMenuOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
                style={{ top: "64px" }}
            >
                <nav className="flex flex-col py-4 px-4">
                    {NAV_ITEMS.map((item) => (
                        item.external ? (
                            <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsMenuOpen(false)}
                                className="py-3 px-4 text-sm font-bold tracking-wide uppercase text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="py-3 px-4 text-sm font-bold tracking-wide uppercase text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                {item.label}
                            </Link>
                        )
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                            href="/all-product"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full py-3 px-4 bg-primary text-white text-center text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Belanja Sekarang
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};
