"use client";

import React, { useState, useEffect } from "react";
import { settingsService, type GeneralSettings, SETTINGS_FALLBACKS } from "@features/settings/settingsService";
import HeaderSwitcher from "@shared/components/layout/header/HeaderSwitcher";
import { Footer } from "@shared/components/layout/footer/DekstopFooter";
import { FileText, ShieldAlert, Truck, RefreshCcw, ShieldCheck } from "lucide-react";

export default function TermsAndConditionsPage() {
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
                            <FileText size={24} />
                            <span className="text-sm font-bold uppercase tracking-widest">Legal Document</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                            Syarat & Ketentuan
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-10 text-gray-600 leading-relaxed">
                        {/* Section 1 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ShieldCheck className="text-primary" size={20} />
                                1. Penggunaan Situs
                            </h2>
                            <p>
                                Dengan mengakses dan menggunakan situs {storeName}, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui bagian apa pun dari ketentuan ini, Anda tidak diperkenankan untuk menggunakan layanan kami.
                            </p>
                            <ul className="list-disc ml-6 mt-4 space-y-2">
                                <li>Layanan ini hanya ditujukan untuk individu yang berusia minimal 18 tahun atau di bawah pengawasan orang tua.</li>
                                <li>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda.</li>
                                <li>Kami berhak menolak layanan atau membatalkan pesanan secara sepihak jika ditemukan indikasi pelanggaran.</li>
                            </ul>
                        </section>

                        {/* Section 2 - TRANSASCTION */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Truck className="text-primary" size={20} />
                                2. Pemesanan dan Pembayaran
                            </h2>
                            <p>
                                Semua pesanan yang dilakukan melalui situs kami dianggap sebagai penawaran untuk membeli produk. Kami berhak menerima atau menolak pesanan tersebut.
                            </p>
                            <ul className="list-disc ml-6 mt-4 space-y-2">
                                <li>Harga yang tertera adalah dalam Rupiah (IDR) dan dapat berubah sewaktu-waktu tanpa pemberitahuan.</li>
                                <li>Pembayaran harus dilakukan melalui kanal pembayaran resmi yang telah disediakan.</li>
                                <li>Pesanan akan diproses setelah pembayaran dikonfirmasi oleh sistem kami.</li>
                            </ul>
                        </section>

                        {/* Section 3 - CRITICAL POLICY */}
                        <section className="bg-red-50 p-6 rounded-xl border border-red-100">
                            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                                <RefreshCcw className="text-red-600" size={20} />
                                3. Kebijakan Pengembalian (No Return & No Refund)
                            </h2>
                            <div className="space-y-4">
                                <p className="font-semibold text-red-800">
                                    PENTING: Mohon baca bagian ini dengan saksama.
                                </p>
                                <p className="text-red-900/80">
                                    Mengingat sifat produk kami adalah produk perawatan kulit (skincare) yang berhubungan langsung dengan kesehatan dan higienitas pengguna, kami menerapkan kebijakan ketat:
                                </p>
                                <div className="bg-white/80 p-4 rounded-lg border border-red-200 text-red-900 font-bold text-center">
                                    "BARANG YANG SUDAH DIBELI TIDAK DAPAT DIKEMBALIKAN ATAU DITUKAR (NO RETURN & NO REFUND) DENGAN ALASAN APAPUN."
                                </div>
                                <p className="text-sm italic text-red-700">
                                    Pengecualian hanya diberikan jika terjadi kesalahan pengiriman jenis produk dari pihak {storeName} atau produk diterima dalam keadaan rusak/cacat produksi yang dibuktikan dengan VIDEO UNBOXING tanpa terputus saat paket pertama kali dibuka.
                                </p>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ShieldAlert className="text-primary" size={20} />
                                4. Batasan Tanggung Jawab
                            </h2>
                            <p>
                                {storeName} tidak bertanggung jawab atas reaksi alergi atau efek samping yang mungkin timbul akibat penggunaan produk yang tidak sesuai dengan instruksi atau kondisi kulit pengguna. Kami sangat menyarankan Anda untuk berkonsultasi dengan ahli medis atau melakukan patch test sebelum menggunakan produk baru.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-400">
                                Syarat dan Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap perselisihan akan diselesaikan melalui musyawarah untuk mencapai mufakat.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
