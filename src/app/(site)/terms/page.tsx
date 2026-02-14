
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Syarat & Ketentuan | PE Skin Professional",
    description: "Syarat dan Ketentuan penggunaan layanan dan pembelian produk di PE Skin Professional.",
};

export default function TermsPage() {
    return (
        <div className="bg-white py-12 md:py-20">
            <div className="max-w-3xl mx-auto px-4 prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 border-b pb-8">Syarat & Ketentuan</h1>

                <p className="lead text-lg text-gray-500 font-medium">
                    Selamat datang di PE Skin Professional. Harap membaca syarat dan ketentuan berikut dengan seksama sebelum menggunakan layanan kami.
                </p>

                <h3>1. Persetujuan Syarat</h3>
                <p>
                    Dengan mengakses atau menggunakan situs web ini, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini serta Kebijakan Privasi kami. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
                </p>

                <h3>2. Akun Pengguna</h3>
                <p>
                    Untuk melakukan pembelian, Anda mungkin perlu mendaftar akun. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun dan password Anda. Kami berhak menangguhkan akun yang melanggar ketentuan.
                </p>

                <h3>3. Produk dan Harga</h3>
                <p>
                    Kami berupaya menampilkan produk dan harga seakurat mungkin. Namun, kesalahan dapat terjadi. Kami berhak untuk mengubah harga atau menghentikan produk kapan saja tanpa pemberitahuan sebelumnya. Harga yang tercantum sudah termasuk pajak jika berlaku.
                </p>

                <h3>4. Pemesanan dan Pembayaran</h3>
                <p>
                    Pemesanan dianggap sah setelah Anda menyelesaikan proses checkout dan pembayaran dikonfirmasi. Kami menerima berbagai metode pembayaran yang aman. Kami berhak membatalkan pesanan jika terjadi kesalahan harga atau stok kosong.
                </p>

                <h3>5. Pengiriman dan Pengembalian</h3>
                <p>
                    Informasi mengenai pengiriman dan kebijakan pengembalian barang dapat dilihat secara rinci di halaman <Link href="/help">Pusat Bantuan</Link>. Risiko kehilangan barang beralih kepada Anda setelah barang diserahkan ke jasa pengiriman.
                </p>

                <h3>6. Hak Kekayaan Intelektual</h3>
                <p>
                    Seluruh konten di situs ini, termasuk teks, grafik, logo, dan gambar, adalah milik PE Skin Professional atau pemberi lisensinya dan dilindungi oleh undang-undang hak cipta. Dilarang menggunakan konten tersebut tanpa izin tertulis dari kami.
                </p>

                <h3>7. Batasan Tanggung Jawab</h3>
                <p>
                    PE Skin Professional tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan situs atau produk kami, sejauh diizinkan oleh hukum yang berlaku.
                </p>

                <h3>8. Hukum yang Berlaku</h3>
                <p>
                    Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan di pengadilan yang berwenang di Indonesia.
                </p>

                <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="mt-0">Perubahan Ketentuan</h4>
                    <p className="mb-0 text-sm">
                        Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Disarankan untuk memeriksa halaman ini secara berkala.
                    </p>
                </div>
            </div>
        </div>
    );
}
