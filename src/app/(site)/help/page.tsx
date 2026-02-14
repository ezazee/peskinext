
import type { Metadata } from "next";
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: "Pusat Bantuan | PE Skin Professional",
    description: "Temukan jawaban atas pertanyaan Anda seputar produk, pemesanan, dan pengiriman PE Skin Professional.",
};

export default function HelpPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Pusat Bantuan</h1>
                    <p className="text-gray-600 text-lg">Bagaimana kami dapat membantu Anda hari ini?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100">
                        <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-500 mb-4">Senin - Jumat, 09:00 - 17:00</p>
                        <button className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-full text-sm hover:bg-primary/20 transition-colors">Chat Sekarang</button>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100">
                        <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
                        <p className="text-sm text-gray-500 mb-4">Kami akan membalas dalam 24 jam</p>
                        <a href="mailto:support@peskinpro.id" className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-full text-sm hover:bg-primary/20 transition-colors">Kirim Email</a>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100">
                        <Phone className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="font-bold text-gray-900 mb-2">Call Center</h3>
                        <p className="text-sm text-gray-500 mb-4">Hanya untuk keadaan darurat</p>
                        <a href="tel:+6281234567890" className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-full text-sm hover:bg-primary/20 transition-colors">Hubungi Kami</a>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">Pertanyaan Populer (FAQ)</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {[
                            { q: "Bagaimana cara melakukan pemesanan?", a: "Pilih produk yang diinginkan, tambahkan ke keranjang, lalu ikuti proses checkout. Anda akan menerima konfirmasi via email." },
                            { q: "Apakah produk PE Skinpro aman untuk ibu hamil?", a: "Sebagian besar produk kami aman karena menggunakan bahan natural. Namun, konsultasikan dengan dokter Anda untuk kepastian." },
                            { q: "Berapa lama pengiriman barang?", a: "Estimasi pengiriman reguler adalah 2-4 hari kerja untuk Pulau Jawa, dan 4-7 hari kerja untuk luar Pulau Jawa." },
                            { q: "Bagaimana cara mengecek status pesanan?", a: "Anda dapat melihat status pesanan di menu 'Pesanan Saya' pada dashboard akun Anda atau melalui email konfirmasi pengiriman." },
                        ].map((item, idx) => (
                            <details key={idx} className="group p-6 cursor-pointer">
                                <summary className="flex justify-between items-center font-bold text-gray-900 list-none">
                                    {item.q}
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed group-open:animate-fadeIn">
                                    {item.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
