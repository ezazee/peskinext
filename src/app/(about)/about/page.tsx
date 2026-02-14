
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Star, Instagram, Play, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Tentang Kami | PE Skin Professional",
    description: "Pelajari lebih lanjut tentang PE Skin Professional, brand skincare yang menggunakan teknologi Jerman dan bahan natural vegan.",
    robots: {
        index: false,
        follow: false,
    }
};

export default function AboutPage() {
    return (
        <div className="bg-white pb-0 font-sans">
            {/* 1. HERO SECTION - Clean & Centered (High-End Feel) */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-gray-900">
                {/* Minimalist Gradient Accent */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
                    <p className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-6">Established 2014</p>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                        Science Meets <br />
                        <span className="text-primary italic font-serif">Nature's Best.</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Satu dekade dedikasi menghadirkan inovasi skincare dengan teknologi Jerman dan kebaikan bahan natural vegan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="#story" className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors">
                            Cerita Kami
                        </Link>
                        <Link href="/all-product" className="px-8 py-3 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm">
                            Lihat Produk
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. TENTANG (Story) - Minimal Sidebar Layout */}
            <section id="story" className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
                        <div className="md:sticky md:top-32">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Dedikasi untuk <br />
                                <span className="text-primary">Kecantikan Alami.</span>
                            </h2>
                            <div className="relative aspect-[4/5] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl mt-8">
                                <Image
                                    src="https://picsum.photos/600/800?random=101"
                                    alt="Founder or Lab"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-[200px]">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Our Mission</p>
                                    <p className="text-sm font-semibold text-gray-900">Skincare berkualitas yang terjangkau untuk semua.</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-lg text-gray-600 leading-loose">
                            <p className="text-xl text-gray-900 font-medium mb-8">
                                PE Skin Professional didirikan pada satu dekade yang lalu dengan visi sederhana namun kuat: bahwa kecantikan berkualitas tinggi harus dapat diakses oleh semua orang.
                            </p>
                            <p className="mb-6">
                                Kami menolak kompromi antara harga dan kualitas. Dengan mengadopsi teknologi Jerman yang presisi, kami menciptakan formulasi yang tidak hanya efektif tetapi juga aman jangka panjang. Setiap produk kami adalah sinergi antara sains modern dan kemurnian alam.
                            </p>
                            <p className="mb-6">
                                Fokus kami bukan hanya pada hasil instan, tetapi pada kesehatan kulit yang berkelanjutan. Kami percaya pada:
                            </p>
                            <ul className="space-y-4 list-none pl-0 my-8">
                                {[
                                    "Bahan Natural Vegan yang ramah lingkungan.",
                                    "Proses produksi higienis dengan standar GMP.",
                                    "Pengujian ketat tanpa melibatkan hewan (Cruelty Free).",
                                    "Transparansi kandungan tanpa bahan tersembunyi."
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-medium text-gray-800">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p>
                                Hari ini, kami terus berinovasi untuk menjawab kebutuhan kulit Anda yang terus berkembang, karena Anda berhak mendapatkan yang terbaik.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. MANFAAT (Benefits) - Horizontal Scroll / Clean Grid */}
            <section className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Manfaat Nyata</h2>
                            <p className="text-gray-500">Hasil teruji untuk kulit sehat Anda.</p>
                        </div>
                        <Link href="/all-product" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                            Coba Sekarang <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {[
                            { title: "Mencerahkan", sub: "Brightening", img: "https://picsum.photos/400/400?random=110" },
                            { title: "Menghaluskan", sub: "Smoothing", img: "https://picsum.photos/400/400?random=111" },
                            { title: "Melembabkan", sub: "Hydrating", img: "https://picsum.photos/400/400?random=112" },
                            { title: "Anti-Aging", sub: "Firming", img: "https://picsum.photos/400/400?random=113" },
                            { title: "Skin Barrier", sub: "Protecting", img: "https://picsum.photos/400/400?random=114" },
                        ].map((item, idx) => (
                            <div key={idx} className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-default shadow-sm hover:shadow-xl transition-all">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-4">
                                    <p className="text-gray-300 text-xs uppercase tracking-wider mb-1">{item.sub}</p>
                                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. KEUNGGULAN (Advantages) - Dark Minimal */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16">Standar Kualitas Tertinggi</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { value: "German", label: "Technology" },
                            { value: "100%", label: "Natural Vegan" },
                            { value: "GMP", label: "Certified" },
                            { value: "0%", label: "Harmful Chemicals" },
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50 mb-2 font-serif">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 font-medium tracking-wide text-sm uppercase">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. SOCIAL MEDIA (Feed) */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <Instagram className="w-8 h-8 mx-auto text-gray-900 mb-4" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">@peskinpro</h2>
                        <a href="https://instagram.com/peskinpro" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                            Follow Us on Instagram
                        </a>
                    </div>

                    <div className="flex gap-4 animate-scroll-sm md:animate-scroll hover:pause">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex-shrink-0 w-[200px] md:w-[280px] aspect-square relative rounded-xl overflow-hidden group">
                                <Image
                                    src={`https://picsum.photos/400/400?random=${200 + i}`}
                                    alt="Social"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Instagram className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        ))}
                        {/* Duplicate for infinite scroll effect (simplified here just by static list for now) */}
                    </div>
                </div>
            </section>
        </div>
    );
}
