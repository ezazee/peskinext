// data/reviews.ts
import type { Review } from "../shared/types/types";

export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Rani Putri",
    variant: "100ml",
    comment:
      "Paketan sampai aman. Tonernya ringan dan cepat menyerap, enak dipakai pagi-sore.",
    images: [
      "https://placehold.co/640x640/eeeeee/777?text=Foto+1",
      "https://placehold.co/640x640/dddddd/666?text=Foto+2",
    ],
    rating: 5,
    date: "2025-05-02",
    productSlug: "cica-b5-refreshing-toner",
  },
  {
    id: 2,
    user: "Zulkarnaen Yusuf",
    variant: "50ml",
    comment:
      "Tekstur gel lembut, busanya pas dan nggak bikin kering. Wanginya mild.",
    images: ["https://placehold.co/640x640/efefef/888?text=Foto"],
    rating: 5,
    date: "2022-05-03",
    productSlug: "honey-cleansing-gel",
  },
  {
    id: 3,
    user: "Sinta Lestari",
    variant: "60 pads",
    comment:
      "Pads-nya tebal, essence cukup banyak. Pori-pori lebih kalem setelah seminggu.",
    images: [],
    rating: 4,
    date: "2025-05-04",
    productSlug: "pe-prebiotic-pore-ex-facial-pad",
  },
  {
    id: 4,
    user: "Mahendra Aditya",
    variant: "60g",
    comment:
      "Creamnya rich tapi cepat meresap. Cocok buat kulit kering aku.",
    images: [
      "https://placehold.co/640x640/f2f2f2/444?text=Before",
      "https://placehold.co/640x640/f6f6f6/222?text=After",
    ],
    rating: 5,
    date: "2025-05-05",
    productSlug: "hydro-restorative-cream",
  },
  {
    id: 5,
    user: "Nadia Azzahra",
    variant: "30ml",
    comment:
      "Serumnya ringan, bikin glow tapi nggak lengket. Packaging aman.",
    images: ["https://placehold.co/640x640/e9e9e9/555?text=Foto"],
    rating: 4,
    date: "2025-05-06",
    productSlug: "skin-awakening-glow-serum",
  },
  {
    id: 6,
    user: "Fajar Hidayat",
    variant: "Bundle: Cleanser + Toner",
    comment:
      "Paket basic ini pas buat pemula. Kulit terasa bersih tapi tetap lembap.",
    images: [],
    rating: 4,
    date: "2025-05-07",
    productSlug: "paket-basic-glow-honey-cleanser-toner",
  },
  {
    id: 7,
    user: "Bella Oktaviani",
    variant: "Small Set",
    comment:
      "Bright set-nya bantu meratakan warna kulit. Hasil kelihatan di minggu ke-2.",
    images: [
      "https://placehold.co/640x640/eeeeee/666?text=Unboxing",
      "https://placehold.co/640x640/f0f0f0/333?text=Texture",
    ],
    rating: 5,
    date: "2025-05-09",
    productSlug: "paket-bright-glow-serum-daycream",
  },
  {
    id: 8,
    user: "Fikri Ramadhan",
    variant: "Medium Set",
    comment:
      "Hydration set-nya mantap. Kulit jadi nggak gampang ketarik setelah cuci muka.",
    images: [],
    rating: 4,
    date: "2025-05-10",
    productSlug: "paket-hydration-shield-cream-toner",
  },
  {
    id: 9,
    user: "Bima Satria",
    variant: "Large Set",
    comment:
      "Komplit untuk perawatan pori. Setelah 10 hari keliatan lebih halus.",
    images: ["https://placehold.co/640x640/f7f7f7/222?text=Foto"],
    rating: 5,
    date: "2025-05-11",
    productSlug: "paket-pore-care-pad-cleanser",
  },
  {
    id: 10,
    user: "Yuliana Sari",
    variant: "50ml",
    comment:
      "Cleanser intimate ini lembut, nggak iritasi. Botolnya praktis.",
    images: [],
    rating: 5,
    date: "2025-05-12",
    productSlug: "intimate-feminine-mousse-cleanser",
  },
  // ——— cica-b5-refreshing-toner (4 lagi) ———
  {
    id: 11,
    user: "Dian Paramita",
    variant: "100ml",
    comment:
      "Cooling dan menenangkan kemerahan. Cocok buat kulit sensitif.",
    images: ["https://placehold.co/640x640/ededed/333?text=Foto"],
    rating: 5,
    date: "2025-05-13",
    productSlug: "cica-b5-refreshing-toner",
  },
  {
    id: 12,
    user: "Andika Saputra",
    variant: "100ml",
    comment:
      "Sedikit lama di kurir, tapi produk aman. Toner oke untuk layering.",
    images: [],
    rating: 4,
    date: "2025-05-14",
    productSlug: "cica-b5-refreshing-toner",
  },
  {
    id: 13,
    user: "Rizky Amelia",
    variant: "100ml",
    comment:
      "Repurchase! Bantu calm ketika breakout.",
    images: [
      "https://placehold.co/640x640/ededed/666?text=Stash",
      "https://placehold.co/640x640/fafafa/111?text=Texture",
    ],
    rating: 5,
    date: "2025-05-17",
    productSlug: "cica-b5-refreshing-toner",
  },
  {
    id: 14,
    user: "Gilang Pratama",
    variant: "100ml",
    comment: "Ringan dan cepat meresap. Worth it.",
    images: [],
    rating: 4,
    date: "2025-05-18",
    productSlug: "cica-b5-refreshing-toner",
  },
  // ——— honey-cleansing-gel (4 lagi) ———
  {
    id: 15,
    user: "Larasati Dewi",
    variant: "50ml",
    comment:
      "Kulit tetap lembap setelah dibilas. Nggak bikin ketarik.",
    images: ["https://placehold.co/640x640/eeeeee/777?text=Foto"],
    rating: 5,
    date: "2025-05-19",
    productSlug: "honey-cleansing-gel",
  },
  {
    id: 16,
    user: "Teddy Gunawan",
    variant: "50ml",
    comment: "Aman buat kulit kombinasi. Sedikit wangi madu.",
    images: [],
    rating: 4,
    date: "2025-05-20",
    productSlug: "honey-cleansing-gel",
  },
  {
    id: 17,
    user: "Maya Rahmawati",
    variant: "100ml",
    comment: "Paling suka dipakai pagi. Teksturnya nyaman.",
    images: [
      "https://placehold.co/640x640/ededed/333?text=Unboxing",
      "https://placehold.co/640x640/f2f2f2/444?text=Pump",
    ],
    rating: 5,
    date: "2025-05-22",
    productSlug: "honey-cleansing-gel",
  },
  {
    id: 18,
    user: "Yusuf Maulana",
    variant: "50ml",
    comment: "Cukup bersihin sunscreen. Good.",
    images: [],
    rating: 4,
    date: "2025-05-23",
    productSlug: "honey-cleansing-gel",
  },
  // ——— pe-prebiotic-pore-ex-facial-pad (3 lagi) ———
  {
    id: 19,
    user: "Farah Nuraini",
    variant: "60 pads",
    comment:
      "Bantalannya lembut. Dipakai sebagai toner pad juga enak.",
    images: ["https://placehold.co/640x640/efefef/555?text=Foto"],
    rating: 4,
    date: "2025-05-24",
    productSlug: "pe-prebiotic-pore-ex-facial-pad",
  },
  {
    id: 20,
    user: "Kevin Hartanto",
    variant: "90 pads",
    comment: "Untuk kulit berminyak cocok. Tidak perih.",
    images: [],
    rating: 5,
    date: "2025-05-25",
    productSlug: "pe-prebiotic-pore-ex-facial-pad",
  },
  {
    id: 21,
    user: "Novi Handayani",
    variant: "60 pads",
    comment: "Essence-nya cukup, tidak kering.",
    images: ["https://placehold.co/640x640/f7f7f7/111?text=Foto"],
    rating: 4,
    date: "2025-05-26",
    productSlug: "pe-prebiotic-pore-ex-facial-pad",
  },
  // ——— hydro-restorative-cream (3 lagi) ———
  {
    id: 22,
    user: "Bagas Wibowo",
    variant: "60g",
    comment:
      "Dipakai malam bangun-bangun kulit plumpy. Recommended.",
    images: [],
    rating: 5,
    date: "2025-05-27",
    productSlug: "hydro-restorative-cream",
  },
  {
    id: 23,
    user: "Karin Aurelia",
    variant: "30g",
    comment: "Tidak membuat pilling di bawah sunscreen.",
    images: ["https://placehold.co/640x640/ededed/333?text=Foto"],
    rating: 5,
    date: "2025-05-28",
    productSlug: "hydro-restorative-cream",
  },
  {
    id: 24,
    user: "Dwiki Ardiansyah",
    variant: "60g",
    comment: "Wadahnya kokoh. Isi sesuai deskripsi.",
    images: [],
    rating: 4,
    date: "2025-05-29",
    productSlug: "hydro-restorative-cream",
  },
  // ——— skin-awakening-glow-serum (3 lagi) ———
  {
    id: 25,
    user: "Priska Natalia",
    variant: "30ml",
    comment:
      "Glow sehat tanpa lengket. Cocok di layer dengan moisturizer.",
    images: ["https://placehold.co/640x640/f0f0f0/222?text=Foto"],
    rating: 5,
    date: "2025-06-01",
    productSlug: "skin-awakening-glow-serum",
  },
  {
    id: 26,
    user: "Rendy Kurnia",
    variant: "30ml",
    comment: "Tidak ada reaksi negatif. Good untuk daily.",
    images: [],
    rating: 4,
    date: "2025-06-02",
    productSlug: "skin-awakening-glow-serum",
  },
  {
    id: 27,
    user: "Indah Permatasari",
    variant: "30ml",
    comment: "Packaging rapi. Efek mencerahkan perlahan.",
    images: [
      "https://placehold.co/640x640/eeeeee/666?text=Dropper",
      "https://placehold.co/640x640/ffffff/000?text=Swatch",
    ],
    rating: 4,
    date: "2025-06-03",
    productSlug: "skin-awakening-glow-serum",
  },
  // ——— paket-basic-glow-honey-cleanser-toner (2 lagi) ———
  {
    id: 28,
    user: "Yoga Prabowo",
    variant: "Small Set",
    comment:
      "Value set yang oke. Cocok untuk hadiah juga.",
    images: [],
    rating: 5,
    date: "2025-06-04",
    productSlug: "paket-basic-glow-honey-cleanser-toner",
  },
  {
    id: 29,
    user: "Eka Marlina",
    variant: "Small Set",
    comment: "Kombinasi cleanser & toner pas untuk kulit normal.",
    images: ["https://placehold.co/640x640/f5f5f5/333?text=Foto"],
    rating: 4,
    date: "2025-06-05",
    productSlug: "paket-basic-glow-honey-cleanser-toner",
  },
  // ——— paket-bright-glow-serum-daycream (2 lagi) ———
  {
    id: 30,
    user: "Chandra Wijaya",
    variant: "Small Set",
    comment:
      "Day cream mudah diratakan. Tidak white cast.",
    images: [],
    rating: 5,
    date: "2025-06-06",
    productSlug: "paket-bright-glow-serum-daycream",
  },
  {
    id: 31,
    user: "Mega Pratiwi",
    variant: "Small Set",
    comment:
      "Serum cepat meresap, day cream melembapkan seharian.",
    images: ["https://placehold.co/640x640/ededed/333?text=Foto"],
    rating: 5,
    date: "2025-06-07",
    productSlug: "paket-bright-glow-serum-daycream",
  },
  // ——— paket-hydration-shield-cream-toner (2 lagi) ———
  {
    id: 32,
    user: "Galih Satya",
    variant: "Medium Set",
    comment:
      "Toner + cream bikin barrier lebih tenang. Mantap.",
    images: [],
    rating: 5,
    date: "2025-06-08",
    productSlug: "paket-hydration-shield-cream-toner",
  },
  {
    id: 33,
    user: "Putri Ayuningtyas",
    variant: "Medium Set",
    comment:
      "Kulit terasa kenyal, cocok untuk ruangan AC.",
    images: ["https://placehold.co/640x640/ffffff/111?text=Foto"],
    rating: 5,
    date: "2025-06-09",
    productSlug: "paket-hydration-shield-cream-toner",
  },
  // ——— paket-pore-care-pad-cleanser (2 lagi) ———
  {
    id: 34,
    user: "Hendra Kurniawan",
    variant: "Large Set",
    comment:
      "Cleanser lembut + pads efektif. Paketnya hemat.",
    images: [],
    rating: 4,
    date: "2025-06-10",
    productSlug: "paket-pore-care-pad-cleanser",
  },
  {
    id: 35,
    user: "Selvi Anggraini",
    variant: "Large Set",
    comment:
      "Suka banget sama pads-nya. Kulit lebih halus.",
    images: ["https://placehold.co/640x640/f3f3f3/555?text=Foto"],
    rating: 5,
    date: "2025-06-11",
    productSlug: "paket-pore-care-pad-cleanser",
  },
  // ——— intimate-feminine-mousse-cleanser (1 lagi) ———
  {
    id: 36,
    user: "Dewi Kartika",
    variant: "50ml",
    comment:
      "Lembut dan nyaman dipakai harian. Botol pump-nya solid.",
    images: [
      "https://placehold.co/640x640/eeeeee/666?text=Foto+1",
      "https://placehold.co/640x640/f0f0f0/333?text=Foto+2",
    ],
    rating: 5,
    date: "2025-06-12",
    productSlug: "intimate-feminine-mousse-cleanser",
  },
  // NOTE: Tidak ada review untuk:
  // - vit-c-tone-up-daycream-spf-50
  // - paket-intimate-care-mousse-cream
];
