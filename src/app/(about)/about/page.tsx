"use client";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, Star, Instagram, Play, ArrowRight, Beaker, Leaf, ShieldCheck, Zap } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { settingsService, type GeneralSettings } from "@features/settings/settingsService";
import { normalizeImageUrl } from "@shared/utils/imageUrl";
import { InstagramFeed } from "@features/about/components/InstagramFeed";

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [settings, setSettings] = useState<GeneralSettings | null>(null);
    const [galleryBanners, setGalleryBanners] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [settingsData, bannersData] = await Promise.all([
                    settingsService.getSettings(),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`).then(res => res.json())
                ]);
                setSettings(settingsData);
                setGalleryBanners(bannersData.gallery_carousel || []);
            } catch (error) {
                console.error("About Page Data Fetch Error:", error);
            }
        }
        fetchData();
    }, []);

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    } as const;

    return (
        <div ref={containerRef} className="bg-white pb-0 font-sans selection:bg-primary/20 overflow-hidden min-h-screen">
            {!settings ? (
                <div className="h-screen flex items-center justify-center bg-secondary">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/60 font-serif italic">Preparing Excellence...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* 1. IMMERSIVE HERO - Full Viewport Luxury */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div 
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="absolute inset-0"
                >
                    {normalizeImageUrl(settings.about_hero_image_url) ? (
                        <Image
                            src={normalizeImageUrl(settings.about_hero_image_url)!}
                            alt={settings.store_name}
                            fill
                            priority
                            className="object-cover brightness-[0.7]"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                             <span className="text-white/20 font-serif italic text-4xl">PE Skinpro Excellence</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
                </motion.div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <p className="text-white/80 font-medium tracking-[0.4em] uppercase text-xs mb-8 drop-shadow-md">{settings.about_hero_subtitle}</p>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-10 leading-none tracking-tight">
                            {settings.about_hero_title?.split('.')[0]} <br />
                            <span className="text-white italic font-serif">{settings.about_hero_title?.split('.')[1] || ""}</span>
                        </h1>
                        <p className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-light leading-relaxed drop-shadow-sm">
                            {settings.about_hero_description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="#vision" className="group px-10 py-4 bg-white text-secondary font-bold rounded-full hover:bg-tertiary transition-all shadow-xl hover:shadow-2xl flex items-center gap-2">
                                Jelajahi Visi <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/all-product" className="px-10 py-4 border border-white/40 text-white font-bold rounded-full hover:bg-white/20 transition-all backdrop-blur-md">
                                Lihat Produk
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-50">
                    <div className="w-[1px] h-16 bg-white" />
                </div>
            </section>

            {/* 2. THE VISION - Asymmetrical & Airy */}
            <section id="vision" className="py-32 md:py-48 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div {...fadeInUp} className="relative">
                        <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-6">{settings.about_vision_small_title}</h2>
                        <h3 className="text-5xl md:text-6xl font-bold text-secondary mb-8 leading-[1.1]">
                            {settings.about_vision_heading?.split(' ').slice(0, -2).join(' ')} <br />
                            <span className="text-primary italic font-serif">{settings.about_vision_heading?.split(' ').slice(-2).join(' ')}</span>
                        </h3>
                        <p className="text-subtle-text text-xl leading-relaxed mb-10 font-light">
                            {settings.about_vision_description}
                        </p>
                        <div className="space-y-6">
                            {[
                                { title: "Presisi Jerman", icon: <Zap className="w-5 h-5" /> },
                                { title: "Etika Vegan", icon: <Leaf className="w-5 h-5" /> },
                                { title: "Integritas Produk", icon: <ShieldCheck className="w-5 h-5" /> }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 group cursor-default">
                                    <div className="w-12 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <span className="text-lg font-semibold text-base-text">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-700 bg-gray-50"
                    >
                        {normalizeImageUrl(settings.about_vision_image_url) ? (
                            <Image
                                src={normalizeImageUrl(settings.about_vision_image_url)!}
                                alt="Natural Philosophy"
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-1000"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/20 italic">Visionary Care</div>
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20">
                            <p className="text-secondary font-serif italic text-xl">"{settings.about_vision_quote}"</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. SCIENTIFIC PRECISION - High-Tech Dark Section */}
            <section className="py-32 bg-secondary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full" />
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <motion.div 
                             initial={{ opacity: 0, scale: 0.9 }}
                             whileInView={{ opacity: 1, scale: 1 }}
                             transition={{ duration: 0.8 }}
                             className="order-2 lg:order-1 relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gray-50 flex items-center justify-center"
                        >
                            {normalizeImageUrl(settings.about_science_image_url) ? (
                                <>
                                    <Image
                                        src={normalizeImageUrl(settings.about_science_image_url)!}
                                        alt="High-Tech Laboratory"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                                </>
                            ) : (
                                <span className="text-primary/20 italic">Scientific Integrity</span>
                            )}
                        </motion.div>

                        <div className="order-1 lg:order-2 text-white">
                            <motion.div {...fadeInUp}>
                                <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-6">{settings.about_science_small_title}</h2>
                                <h3 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                                    {settings.about_science_heading?.split(' ').slice(0, -2).join(' ')} <br />
                                    <span className="text-primary italic font-serif">{settings.about_science_heading?.split(' ').slice(-2).join(' ')}</span>
                                </h3>
                                <p className="text-white/60 text-lg leading-relaxed mb-12 font-light">
                                    {settings.about_science_description}
                                </p>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-4xl font-bold text-white mb-2 font-serif">{settings.about_science_stat1_value}</p>
                                        <p className="text-white/40 text-xs uppercase tracking-widest font-bold">{settings.about_science_stat1_label}</p>
                                    </div>
                                    <div>
                                        <p className="text-4xl font-bold text-white mb-2 font-serif">{settings.about_science_stat2_value}</p>
                                        <p className="text-white/40 text-xs uppercase tracking-widest font-bold">{settings.about_science_stat2_label}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CORE COMMITMENT - Iconography & Values */}
            <section className="py-32 md:py-48 bg-tertiary">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-bold text-secondary mb-6 font-serif italic">{settings.about_commitment_title}</motion.h2>
                        <motion.p {...fadeInUp} className="text-subtle-text text-lg">{settings.about_commitment_subtitle}</motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: settings.about_commitment_card1_title, desc: settings.about_commitment_card1_desc, icon: <ShieldCheck className="w-8 h-8" /> },
                            { title: settings.about_commitment_card2_title, desc: settings.about_commitment_card2_desc, icon: <Leaf className="w-8 h-8" /> },
                            { title: settings.about_commitment_card3_title, desc: settings.about_commitment_card3_desc, icon: <Zap className="w-8 h-8" /> },
                            { title: settings.about_commitment_card4_title, desc: settings.about_commitment_card4_desc, icon: <Star className="w-8 h-8" /> }
                        ].map((card, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-10 bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="w-16 h-16 bg-tertiary rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-primary/20">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-4">{card.title}</h3>
                                <p className="text-subtle-text leading-relaxed font-light">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. INSTAGRAM FEED & CTA */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-secondary mb-2 font-serif italic tracking-wide">{settings.about_community_title}</h2>
                            <p className="text-subtle-text">{settings.about_community_subtitle}</p>
                        </div>
                        <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-secondary text-white rounded-full font-bold flex items-center gap-3 hover:opacity-90 transition-all shadow-xl">
                            <Instagram className="w-5 h-5" /> @{settings.social_instagram?.split('/').filter(Boolean).pop() || "peskinpro"}
                        </a>
                    </div>

                    <InstagramFeed 
                        feedUrl={settings.about_instagram_feed_url} 
                        fallbackBanners={galleryBanners}
                    />

                    <div className="mt-32 p-12 lg:p-24 rounded-[3rem] bg-secondary relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-default" />
                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 leading-tight">{settings.about_cta_title} <br /><span className="text-primary italic font-serif">{settings.about_cta_highlight}</span></h2>
                            <Link href="/all-product" className="inline-flex px-12 py-5 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95">
                                Mulai Perjalanan Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )}
</div>
);
}
