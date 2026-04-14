"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  ChevronDown,
  ExternalLink,
  Loader2,
  ArrowRight,
  HeadphonesIcon,
  Sparkles
} from "lucide-react";
import { useSettings } from "@/features/settings/useSettings";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export default function HelpPage() {
  const { data: settings } = useSettings();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const supportChannels = [
    {
      title: "WhatsApp Chat",
      description: "Respon cepat setiap hari",
      hours: "Senin - Minggu, 08:00 - 21:00",
      action: "Chat Sekarang",
      href: `https://wa.me/${settings?.contact_whatsapp?.replace(/\D/g, "") || "6281313171118"}`,
      icon: MessageCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      title: "Email Support",
      description: "Untuk pertanyaan mendalam",
      hours: "Dibalas dalam 24 jam kerja",
      action: "Kirim Email",
      href: `mailto:${settings?.contact_email || "support@peskinpro.id"}`,
      icon: Mail,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100"
    }
  ];

  return (
    <div className="bg-[#FAFAFB] min-h-screen pb-32">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-blue-400/5 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-primary">Support Center</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                    Ada yang Bisa Kami <span className="text-primary">Bantu?</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Kami hadir untuk memastikan setiap langkah perawatan kulit Anda berjalan sempurna. 
                    Hubungi tim ahli kami atau temukan jawaban instan di bawah ini.
                </p>
            </motion.div>
        </div>
      </section>

      {/* --- SUPPORT CHANNELS --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-4xl mx-auto">
            {supportChannels.map((channel, idx) => (
                <motion.a
                    key={idx}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className={`group bg-white p-8 rounded-[2.5rem] border ${channel.border} shadow-2xl shadow-gray-200/50 hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500`}
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${channel.bg} ${channel.color} group-hover:scale-110 transition-transform`}>
                        <channel.icon size={26} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{channel.title}</h3>
                    <p className="text-sm text-gray-400 font-medium mb-6 leading-relaxed">
                        {channel.description}
                        <br />
                        <span className="text-[11px] text-gray-300 italic">{channel.hours}</span>
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                        {channel.action}
                        <ArrowRight size={16} />
                    </div>
                </motion.a>
            ))}
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                        <HelpCircle size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Informasi Populer</h2>
                </div>
                <Link href="/faq" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
                    Buka Semua FAQ <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Memproses Informasi...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {faqs.slice(0, 8).map((item, idx) => {
                        const isOpen = activeId === `faq-${idx}`;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className={`rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                                    isOpen ? "bg-white border-primary/20 shadow-xl shadow-primary/5" : "bg-white/50 border-gray-100 hover:border-gray-200 hover:bg-white"
                                }`}
                            >
                                <button
                                    onClick={() => toggleAccordion(`faq-${idx}`)}
                                    className="w-full flex items-center justify-between p-7 text-left outline-none"
                                >
                                    <span className={`font-bold text-[15px] md:text-base transition-colors ${isOpen ? "text-primary" : "text-gray-700"}`}>
                                        {item.question}
                                    </span>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        isOpen ? "bg-primary text-white rotate-180" : "bg-gray-100 text-gray-400"
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
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* --- CONCIERGE FOOTER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 md:p-24 rounded-[4rem] bg-secondary relative overflow-hidden group border border-primary/10 shadow-2xl shadow-primary/5 text-center"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity cursor-default" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
             <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <HeadphonesIcon size={32} className="text-primary" />
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Butuh Konsultasi Personal?</h2>
             <p className="text-lg text-gray-500 mb-10 leading-relaxed">
               Jangan ragu untuk menghubungi admin kencantikan kami jika Anda memerlukan saran 
               produk yang spesifik untuk jenis kulit Anda.
             </p>
             <a 
               href={`https://wa.me/${settings?.contact_whatsapp?.replace(/\D/g, "") || "6281313171118"}`}
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-3 px-12 py-5 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
             >
               Mulai Konsultasi WhatsApp
             </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
