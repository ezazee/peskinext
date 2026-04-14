"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  HelpCircle, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  MessageCircle,
  Search,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Package,
  HeadphonesIcon,
  Sparkles
} from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

const CATEGORY_METADATA: Record<string, { icon: any; color: string; bg: string; description: string }> = {
  "Produk & Keamanan": { 
    icon: ShieldCheck, 
    color: "text-blue-600", 
    bg: "bg-blue-50",
    description: "Kandungan, BPOM, & Keamanan"
  },
  "Pengiriman & Kurir": { 
    icon: Truck, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50",
    description: "Lacak & Estimasi Paket"
  },
  "Pembayaran": { 
    icon: CreditCard, 
    color: "text-violet-600", 
    bg: "bg-violet-50",
    description: "Metode & Konfirmasi"
  },
  "Pengembalian & Retur": { 
    icon: RotateCcw, 
    color: "text-orange-600", 
    bg: "bg-orange-50",
    description: "Kebijakan Garansi"
  },
  "Akun & Pesanan": {
    icon: Package,
    color: "text-rose-600",
    bg: "bg-rose-50",
    description: "Status & Riwayat"
  }
};

export default function FAQPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/faqs`);
        const result = await response.json();
        if (result.success) {
          setFaqs(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  const faqCategories = useMemo(() => {
    const categories: Record<string, { id: string; title: string; icon: any; color: string; bg: string; description: string; questions: { q: string; a: string }[] }> = {};

    faqs.forEach(faq => {
      if (!categories[faq.category]) {
        const meta = CATEGORY_METADATA[faq.category] || { 
          icon: HelpCircle, 
          color: "text-slate-600", 
          bg: "bg-slate-50",
          description: "Informasi Umum"
        };
        
        categories[faq.category] = {
          id: faq.category.toLowerCase().replace(/\s+/g, '-'),
          title: faq.category,
          icon: meta.icon,
          color: meta.color,
          bg: meta.bg,
          description: meta.description,
          questions: []
        };
      }
      categories[faq.category].questions.push({ q: faq.question, a: faq.answer });
    });

    return Object.values(categories).filter(cat => cat.questions.length > 0);
  }, [faqs]);

  // Filter based on search and selected category
  const filteredCategories = useMemo(() => {
    return faqCategories
      .map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          q => (selectedCategory === null || cat.title === selectedCategory) &&
               (q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                q.a.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }))
      .filter(cat => cat.questions.length > 0);
  }, [faqCategories, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-20 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-44 overflow-hidden">
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-60 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-40 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/5">
              <Sparkles size={14} className="text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Customer Support Portal</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Pusat <span className="text-primary">Bantuan</span> PE SkinPro
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12">
              Segala hal yang Anda butuhkan untuk merawat kulit dengan tenang. 
              Temukan jawaban cepat atau hubungi tim bantuan kami.
            </p>

            {/* Premium Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-[2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white border border-gray-100 rounded-[1.8rem] shadow-2xl shadow-primary/5 p-1 px-5 h-16 md:h-20 scale-100 group-focus-within:scale-[1.02] transition-all">
                <Search className="w-6 h-6 text-gray-400 mr-4" />
                <input 
                  type="text" 
                  placeholder="Cari kendala atau pertanyaan Anda..."
                  className="w-full bg-transparent outline-none text-[15px] md:text-base font-medium placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                   <button 
                    onClick={() => setSearchQuery("")}
                    className="p-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                   >
                     Clear
                   </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        
        {/* Category Cards */}
        {!searchQuery && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-20">
            {faqCategories.map((cat, idx) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onClick={() => setSelectedCategory(selectedCategory === cat.title ? null : cat.title)}
                className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-500 group ${
                  selectedCategory === cat.title 
                  ? "bg-primary border-primary shadow-xl shadow-primary/20" 
                  : "bg-white border-white shadow-xl shadow-gray-200/50 hover:-translate-y-2"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  selectedCategory === cat.title ? "bg-white/20 text-white" : `${cat.bg} ${cat.color}`
                }`}>
                  <cat.icon size={26} />
                </div>
                <h3 className={`text-sm font-bold mb-1 ${selectedCategory === cat.title ? "text-white" : "text-gray-900"}`}>
                  {cat.title}
                </h3>
                <p className={`text-[10px] font-medium leading-tight text-center ${selectedCategory === cat.title ? "text-white/70" : "text-gray-400"}`}>
                  {cat.description}
                </p>
              </motion.button>
            ))}
          </div>
        )}

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary/30" />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Memuat Informasi...</p>
            </div>
          ) : (
            <div className="space-y-12 mb-32">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, catIdx) => (
                  <motion.div 
                    key={category.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.bg} ${category.color}`}>
                            <category.icon size={20} />
                         </div>
                         <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{category.title}</h2>
                         <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>

                    <div className="space-y-3">
                      {category.questions.map((item, idx) => {
                        const itemId = `${category.id}-${idx}`;
                        const isOpen = activeId === itemId;

                        return (
                          <div 
                            key={itemId}
                            className={`group rounded-[1.8rem] transition-all duration-500 border overflow-hidden ${
                              isOpen 
                              ? "bg-white border-primary/20 shadow-2xl shadow-primary/5" 
                              : "bg-white/40 border-gray-100 hover:bg-white hover:border-gray-200"
                            }`}
                          >
                            <button
                              onClick={() => toggleAccordion(itemId)}
                              className="w-full flex items-center justify-between p-7 text-left outline-none"
                            >
                              <span className={`font-bold text-[15px] md:text-base transition-colors duration-300 ${
                                isOpen ? "text-primary" : "text-gray-700 group-hover:text-gray-900"
                              }`}>
                                {item.q}
                              </span>
                              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isOpen ? "bg-primary text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                              }`}>
                                <ChevronDown size={18} />
                              </div>
                            </button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                  <div className="px-7 pb-8 pt-0 text-[14px] md:text-base text-gray-500 leading-relaxed font-medium">
                                    {item.a}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pencarian Tidak Ditemukan</h3>
                  <p className="text-gray-500">Mohon maaf, kami tidak menemukan jawaban untuk kata kunci tersebut.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Premium CTA / Concierge Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] bg-gray-950 p-12 md:p-20 text-center overflow-hidden shadow-2xl shadow-gray-950/20"
        >
          {/* Back glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md">
                <HeadphonesIcon className="w-8 h-8 text-primary" />
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Layanan Concierge <br className="hidden md:block" /> PE SkinPro</h2>
             <p className="text-gray-400 text-lg mb-10 leading-relaxed">
               Butuh bantuan khusus atau konsultasi produk yang lebih mendalam? 
               Admin ahli kami siap melayani Anda melalui WhatsApp.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://wa.me/6281313171118" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 hover:scale-[1.05] transition-all shadow-xl shadow-primary/20"
                >
                  <MessageCircle className="w-6 h-6 fill-current" />
                  Hubungi WhatsApp Kami
                </a>
                <Link 
                    href="/about" 
                    className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                    Tentang PE SkinPro
                </Link>
             </div>

             <div className="mt-8 flex items-center justify-center gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Respons Cepat</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Konsultasi Gratis</span>
             </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
