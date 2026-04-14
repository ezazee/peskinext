import { apiClient, type ApiResponse } from "@shared/libs/apiClient";

export interface GeneralSettings {
  brand_description: string;
  copyright_text: string;
  store_name: string;
  social_instagram: string;
  social_tiktok: string;
  social_shopee: string;
  contact_whatsapp: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  maintenance_mode: string;
  announcement_active: string;
  announcement_text: string;
  logo_url: string;
  logo_footer_url: string;
  favicon_url: string;
  maintenance_icon_url: string;
  auth_bg_url: string;
  // Appearance
  admin_primary_color?: string;
  admin_secondary_color?: string;
  admin_logo_url?: string;
  marketplace_primary_color?: string;
  marketplace_secondary_color?: string;
  marketplace_tertiary_color?: string;
  // About Page
  about_hero_title?: string;
  about_hero_subtitle?: string;
  about_hero_description?: string;
  about_hero_image_url?: string;
  about_vision_small_title?: string;
  about_vision_heading?: string;
  about_vision_description?: string;
  about_vision_image_url?: string;
  about_vision_quote?: string;
  about_science_small_title?: string;
  about_science_heading?: string;
  about_science_description?: string;
  about_science_image_url?: string;
  about_science_stat1_value?: string;
  about_science_stat1_label?: string;
  about_science_stat2_value?: string;
  about_science_stat2_label?: string;
  about_commitment_title?: string;
  about_commitment_subtitle?: string;
  about_commitment_card1_title?: string;
  about_commitment_card1_desc?: string;
  about_commitment_card2_title?: string;
  about_commitment_card2_desc?: string;
  about_commitment_card3_title?: string;
  about_commitment_card3_desc?: string;
  about_commitment_card4_title?: string;
  about_commitment_card4_desc?: string;
  about_cta_title?: string;
  about_cta_highlight?: string;
  about_community_title?: string;
  about_community_subtitle?: string;
  about_instagram_feed_url?: string;
  contact_email?: string;
}

/**
 * Fallback values in case the API is down or database is empty.
 * This ensures the website always has content.
 */
export const SETTINGS_FALLBACKS: GeneralSettings = {
  brand_description: "Brand skincare lokal dengan standar internasional. Menggabungkan teknologi Jerman dan kekayaan alam untuk solusi kulit sehat, aman, dan terjangkau.",
  copyright_text: `© ${new Date().getFullYear()} PT Kilau Berlian Nusantara. All rights reserved.`,
  store_name: "PE Skin Pro",
  social_instagram: "https://instagram.com",
  social_tiktok: "https://tiktok.com",
  social_shopee: "https://shopee.co.id",
  contact_whatsapp: "628123456789",
  seo_title: "PE Skin Professional | Skincare Premium Lokal",
  seo_description: "PE Skin Professional - Skin care lokal premium dengan standar internasional.",
  seo_keywords: "skincare, pe skin pro, kecantikan, wajah sehat",
  maintenance_mode: "false",
  announcement_active: "false",
  announcement_text: "Promo Special! Dapatkan diskon menarik hari ini.",
  logo_url: "/Logo.png",
  logo_footer_url: "/Logo.png",
  favicon_url: "/favicon.ico",
  maintenance_icon_url: "",
  auth_bg_url: "",
  // Theme Fallbacks
  marketplace_primary_color: "#1D9AD2",
  marketplace_secondary_color: "#045880",
  marketplace_tertiary_color: "#E8F5FA",
  // About Page Fallbacks
  about_hero_title: "Aura of Confidence.",
  about_hero_subtitle: "Since 2014 — A Decade of Excellence",
  about_hero_description: "Menghadirkan harmoni sempurna antara presisi teknologi Jerman dan kemurnian bahan natural vegan.",
  about_hero_image_url: "/images/about/hero.png",
  about_vision_small_title: "Chapter I: The Vision",
  about_vision_heading: "Standar Baru Kecantikan Modern.",
  about_vision_description: "PE Skin Professional lahir dari kegelisahan akan sulitnya mendapatkan skincare berkualitas tinggi dengan harga yang jujur. Kami percaya bahwa setiap inci kulit Anda berhak mendapatkan perawatan terbaik tanpa kompromi.",
  about_vision_image_url: "/images/about/botanical.png",
  about_vision_quote: "Alam memberikan segalanya, sains menjadikannya sempurna.",
  about_science_small_title: "Chapter II: Science",
  about_science_heading: "Teknologi yang Teruji Klinis.",
  about_science_description: "Setiap tetes produk PE Skin mengandung formula yang telah melalui riset mendalam. Kami mengadopsi standar laboratorium Jerman untuk memastikan setiap bahan aktif bekerja optimal pada lapisan kulit terdalam tanpa efek samping berbahaya.",
  about_science_image_url: "/images/about/lab.png",
  about_science_stat1_value: "100%",
  about_science_stat1_label: "Dermatologically Tested",
  about_science_stat2_value: "GMP",
  about_science_stat2_label: "Standard Certification",
  about_commitment_title: "Janji Kami Kepada Anda",
  about_commitment_subtitle: "Lebih dari sekadar produk, ini adalah komitmen jangka panjang untuk kesehatan kulit Anda.",
  about_commitment_card1_title: "Clean Beauty",
  about_commitment_card1_desc: "Bebas dari merkuri, paraben, dan bahan kimia berbahaya lainnya.",
  about_commitment_card2_title: "Vegan Formula",
  about_commitment_card2_desc: "100% bahan nabati tanpa keterlibatan hewan dalam seluruh proses.",
  about_commitment_card3_title: "Innovation",
  about_commitment_card3_desc: "Update berkelanjutan mengikuti inovasi terbaru industri kecantikan.",
  about_commitment_card4_title: "Result Driven",
  about_commitment_card4_desc: "Fokus pada hasil nyata yang mencerahkan dan memperbaiki tekstur kulit.",
  about_cta_title: "Siap Untuk Kulit",
  about_cta_highlight: "Impian Anda?",
  about_community_title: "Jadi Bagian dari Komunitas",
  about_community_subtitle: "Temukan ribuan testimoni dan tips kecantikan setiap harinya.",
  about_instagram_feed_url: "https://feeds.behold.so/CRtkv2DzcmJZJMacOnWP",
  contact_email: "support@peskinpro.id",
};

export const settingsService = {
  /**
   * Fetch all settings from the backend
   */
  getSettings: async (): Promise<GeneralSettings> => {
    try {
      const response = await apiClient.get<ApiResponse<Record<string, string>>>("/settings");
      if (response.success && response.data) {
        // Merge with fallbacks to ensure all keys exist
        return {
          ...SETTINGS_FALLBACKS,
          ...response.data
        } as GeneralSettings;
      }
      return SETTINGS_FALLBACKS;
    } catch (error) {
      console.error("Failed to fetch settings, using fallbacks:", error);
      return SETTINGS_FALLBACKS;
    }
  }
};
