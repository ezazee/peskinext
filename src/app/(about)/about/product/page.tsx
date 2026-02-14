
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Droplets, ShieldCheck, Star } from "lucide-react";

export const metadata: Metadata = {
    title: "Produk Kami | PE Skin Professional",
    description: "Jelajahi rangkaian produk skincare alami dari PE Skin Professional. Diformulasikan dengan teknologi Jerman.",
};

export default function AboutProductPage() {
    return (
        <div className="bg-white pb-20">
            {/* 1. HERO SECTION - Premium Split */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center bg-[#FDFBF7] overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 rounded-l-[100px] hidden md:block" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-4">Our Collections</h2>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Solusi Kulit Sehat <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
                                    Untuk Setiap Kebutuhan
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                                Temukan rangkaian produk yang diformulasikan khusus dengan teknologi Jerman dan bahan natural untuk mengatasi berbagai masalah kulit Anda.
                            </p>
                        </div>
                        <div className="relative h-[400px] hidden md:block">
                            {/* Abstract Composition */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white rounded-full shadow-2xl p-4 animate-spin-slow-reverse">
                                <div className="w-full h-full rounded-full border border-dashed border-primary/30 relative">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-8 h-8 bg-primary rounded-full blur-md" />
                                </div>
                            </div>
                            <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[300px] h-[400px] rounded-[40px] overflow-hidden shadow-2xl rotate-3">
                                <Image
                                    src="https://picsum.photos/600/800?random=50"
                                    alt="Product Collection"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CATEGORIES GRID - Premium Cards */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Category 1: Face */}
                    <Link href="/all-product?category=face" className="group cursor-pointer">
                        <div className="relative h-[500px] rounded-[32px] overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                            <Image
                                src="https://picsum.photos/600/800?random=51"
                                alt="Face Care"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/30">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Face Care</h3>
                                <p className="text-gray-200 mb-6 line-clamp-2">
                                    Serum, Toner, dan Cream untuk wajah cerah bercahaya dan bebas masalah.
                                </p>
                                <div className="flex items-center gap-2 text-white font-bold tracking-wide uppercase text-sm group-hover:gap-4 transition-all">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Category 2: Body */}
                    <Link href="/all-product?category=body" className="group cursor-pointer lg:mt-16">
                        <div className="relative h-[500px] rounded-[32px] overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                            <Image
                                src="https://picsum.photos/600/800?random=52"
                                alt="Body Care"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/30">
                                    <Droplets className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Body Care</h3>
                                <p className="text-gray-200 mb-6 line-clamp-2">
                                    Lotion dan perawatan tubuh untuk kulit lembut, lembab, dan sehat.
                                </p>
                                <div className="flex items-center gap-2 text-white font-bold tracking-wide uppercase text-sm group-hover:gap-4 transition-all">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Category 3: Special */}
                    <Link href="/all-product" className="group cursor-pointer">
                        <div className="relative h-[500px] rounded-[32px] overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                            <Image
                                src="https://picsum.photos/600/800?random=53"
                                alt="Special Packages"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/30">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Special Bundles</h3>
                                <p className="text-gray-200 mb-6 line-clamp-2">
                                    Paket hemat kurasi ahli untuk hasil perawatan yang lebih optimal.
                                </p>
                                <div className="flex items-center gap-2 text-white font-bold tracking-wide uppercase text-sm group-hover:gap-4 transition-all">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* 3. PROMISE SECTION */}
            <section className="bg-primary/5 py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-8 border border-gray-100">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-gray-800 tracking-wide uppercase">Best Quality</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Jaminan Kualitas Kami</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "Original 100%", sub: "Garansi Uang Kembali" },
                            { label: "BPOM Resmi", sub: "Aman & Terdaftar" },
                            { label: "Halal Certified", sub: "Bebas Alkohol" },
                            { label: "Secure Payment", sub: "Transaksi Aman" },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{item.label}</h3>
                                <p className="text-sm text-gray-500">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-24 bg-gray-900 overflow-hidden text-center text-white">
                <div className="absolute inset-0 opacity-20">
                    <Image src="https://picsum.photos/1200/600?random=60" alt="Bg" fill className="object-cover grayscale" />
                </div>
                <div className="max-w-3xl mx-auto px-4 relative z-10">
                    <h2 className="text-4xl font-bold mb-6">Mulai Perjalan Kulit Sehatmu Hari Ini</h2>
                    <p className="mb-10 text-gray-300 text-lg">Konsultasikan kebutuhan kulitmu atau langsung belanja produk favorit.</p>
                    <Link
                        href="/all-product"
                        className="inline-block px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-white hover:text-primary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Belanja Sekarang
                    </Link>
                </div>
            </section>
        </div>
    );
}
