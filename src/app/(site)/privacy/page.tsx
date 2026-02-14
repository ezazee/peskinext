
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kebijakan Privasi | PE Skin Professional",
    description: "Kebijakan Privasi PE Skin Professional mengenai pengumpulan, penggunaan, dan perlindungan data pribadi Anda.",
};

export default function PrivacyPage() {
    return (
        <div className="bg-white py-12 md:py-20">
            <div className="max-w-3xl mx-auto px-4 prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 border-b pb-8">Kebijakan Privasi</h1>

                <p className="lead text-lg text-gray-500 font-medium">
                    Diprogram terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <p>
                    PE Skin Professional ("kami") menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda bagikan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan situs web kami.
                </p>

                <h3>1. Informasi yang Kami Kumpulkan</h3>
                <p>
                    Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat Anda membuat akun, melakukan pembelian, mendaftar newlsetter, atau menghubungi layanan pelanggan. Informasi ini dapat mencakup:
                </p>
                <ul>
                    <li>Nama lengkap</li>
                    <li>Alamat email</li>
                    <li>Nomor telepon</li>
                    <li>Alamat pengiriman dan penagihan</li>
                    <li>Informasi pembayaran (diproses secara aman oleh pihak ketiga)</li>
                </ul>

                <h3>2. Penggunaan Informasi</h3>
                <p>
                    Kami menggunakan informasi yang kami kumpulkan untuk:
                </p>
                <ul>
                    <li>Memproses dan mengirimkan pesanan Anda.</li>
                    <li>Mengelola akun Anda dan memberikan layanan pelanggan.</li>
                    <li>Mengirimkan informasi promosi, jika Anda memilih untuk menerimanya.</li>
                    <li>Meningkatkan dan mempersonalisasi pengalaman belanja Anda.</li>
                    <li>Mendeteksi dan mencegah penipuan.</li>
                </ul>

                <h3>3. Keamanan Data</h3>
                <p>
                    Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Transaksi pembayaran dilindungi menggunakan teknologi enkripsi SSL.
                </p>

                <h3>4. Berbagi Informasi dengan Pihak Ketiga</h3>
                <p>
                    Kami tidak menjual data pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi dengan penyedia layanan yang membantu operasional bisnis kami (seperti jasa pengiriman dan gateway pembayaran) yang terikat kewajiban kerahasiaan.
                </p>

                <h3>5. Cookies</h3>
                <p>
                    Situs kami menggunakan cookies untuk meningkatkan fungsionalitas dan menganalisis lalu lintas. Anda dapat mengatur browser Anda untuk menolak cookies, namun beberapa fitur situs mungkin tidak berfungsi optimal.
                </p>

                <h3>6. Hak Anda</h3>
                <p>
                    Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus data pribadi Anda yang kami simpan. Hubungi kami melalui <a href="/help">Pusat Bantuan</a> jika ingin mengajukan permintaan terkait data Anda.
                </p>

                <h3>7. Perubahan Kebijakan</h3>
                <p>
                    Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal pembaruan yang baru.
                </p>

                <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="mt-0">Hubungi Kami</h4>
                    <p className="mb-0 text-sm">
                        Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan hubungi tim kami di <a href="mailto:privacy@peskinpro.id">privacy@peskinpro.id</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
