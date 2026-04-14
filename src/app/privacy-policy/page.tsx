"use client";

import React, { useState, useEffect } from "react";
import { settingsService, type GeneralSettings, SETTINGS_FALLBACKS } from "@features/settings/settingsService";
import { Footer } from "@shared/components/layout/footer/DekstopFooter";
import HeaderSwitcher from "@shared/components/layout/header/HeaderSwitcher";
import { ShieldCheck, Eye, Lock, Database, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
    const [settings, setSettings] = useState<GeneralSettings>(SETTINGS_FALLBACKS);

    useEffect(() => {
        async function load() {
            const data = await settingsService.getSettings();
            setSettings(data);
        }
        load();
    }, []);

    const storeName = settings.store_name || "PE Skin Professional";

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HeaderSwitcher />

            <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12 md:py-20">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-primary/5 p-8 border-b border-gray-100">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <Lock size={24} />
                            <span className="text-sm font-bold uppercase tracking-widest">Privacy Document</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                            Kebijakan Privasi
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-10 text-gray-600 leading-relaxed">
                        <p>
                            Di {storeName}, kami sangat menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda mengunjungi situs web kami atau melakukan pembelian.
                        </p>

                        {/* Section 1 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Database className="text-primary" size={20} />
                                1. Informasi yang Kami Kumpulkan
                            </h2>
                            <p>
                                Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat Anda membuat akun, melakukan pembelian, atau berinteraksi dengan layanan kami:
                            </p>
                            <ul className="list-disc ml-6 mt-4 space-y-2">
                                <li>Informasi Identitas: Nama lengkap, alamat email, dan nomor telepon.</li>
                                <li>Informasi Transaksi: Alamat pengiriman, detail pesanan, dan riwayat pembelian.</li>
                                <li>Informasi Teknis: Alamat IP, jenis perangkat, dan data penggunaan situs melalui cookies.</li>
                            </ul>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Eye className="text-primary" size={20} />
                                2. Penggunaan Informasi
                            </h2>
                            <p>
                                Kami menggunakan informasi pribadi Anda untuk tujuan berikut:
                            </p>
                            <ul className="list-disc ml-6 mt-4 space-y-2">
                                <li>Memproses dan mengirimkan pesanan Anda.</li>
                                <li>Memberikan layanan pelanggan dan bantuan teknis.</li>
                                <li>Mengirimkan informasi promosi dan update (hanya dengan persetujuan Anda).</li>
                                <li>Meningkatkan pengalaman pengguna dan keamanan situs web kami.</li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ShieldCheck className="text-primary" size={20} />
                                3. Keamanan Data
                            </h2>
                            <p>
                                Kami menerapkan langkah-langkah keamanan fisik, teknis, dan administratif yang wajar untuk melindungi informasi Anda dari akses yang tidak sah, kehilangan, atau penyalahgunaan. Meskipun demikian, perlu diingat bahwa tidak ada metode transmisi data melalui internet yang 100% aman.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <UserCheck className="text-primary" size={20} />
                                4. Hak Pengguna
                            </h2>
                            <p>
                                Anda memiliki hak untuk mengakses, memperbarui, atau meminta penghapusan informasi pribadi Anda yang kami simpan. Anda dapat mengelola pengaturan profil Anda melalui halaman Akun Saya atau menghubungi tim bantuan kami.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-400">
                                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi kami, silakan hubungi kami melalui kanal bantuan yang tersedia.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
