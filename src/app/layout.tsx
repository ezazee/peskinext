import type { Metadata } from "next";
import { cache } from "react";
export const dynamic = "force-dynamic";
import { Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@app/providers/QueryProvider";
import { ToastProvider } from "@shared/components/ui/Toaster";
import { ErrorBoundary } from "@shared/components/ErrorBoundary";
import { MaintenanceOverlay } from "@shared/components/layout/MaintenanceOverlay";
import { settingsService, SETTINGS_FALLBACKS } from "@features/settings/settingsService";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

// React.cache deduplikasi: meski dipanggil 2x (generateMetadata + RootLayout),
// server hanya akan fetch ke backend SEKALI per request.
const getCachedSettings = cache(() => settingsService.getSettings());

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSettings();

  const faviconUrl = normalizeImageUrl(settings.favicon_url) || "/favicon/favicon.ico";
  
  return {
    metadataBase: new URL("https://peskinpro.id"),
    title: settings.seo_title || settings.store_name || "PE Skin Pro - Skincare Alami Terbaik",
    description: settings.seo_description || SETTINGS_FALLBACKS.seo_description,
    keywords: settings.seo_keywords?.split(",") || SETTINGS_FALLBACKS.seo_keywords.split(","),
    
    icons: {
      icon: [
        { url: faviconUrl },
      ],
      apple: "/favicon/apple-touch-icon.png",
    },
    openGraph: {
      title: settings.store_name,
      description: settings.seo_description,
      url: "https://peskinpro.id",
      siteName: settings.store_name,
      images: [
        {
          url: "/web-app.png",
          width: 1200,
          height: 630,
          alt: "Banner Promosi PE Skin Pro",
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getCachedSettings(); // Shared cache — tidak ada double fetch
  const logoUrl = normalizeImageUrl(settings.logo_url) || "https://peskinpro.id/logo.png";

  // Organization Schema for SEO (Google Knowledge Graph)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.store_name || "PE Skin Pro",
    "url": "https://peskinpro.id",
    "logo": logoUrl,
    "description": settings.brand_description || "Platform e-commerce skincare alami berkualitas tinggi untuk semua jenis kulit",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ID",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "ID",
      "availableLanguage": ["Indonesian"],
    },
    "sameAs": [
      settings.social_instagram,
      settings.social_tiktok,
    ].filter(Boolean),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": settings.store_name || "PE Skin Pro",
    "url": "https://peskinpro.id",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://peskinpro.id/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="id">
      <body className={`${poppins.variable} font-sans bg-white`}>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Dynamic Theme Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${settings.marketplace_primary_color || '#1D9AD2'};
            --secondary: ${settings.marketplace_secondary_color || '#045880'};
            --tertiary: ${settings.marketplace_tertiary_color || '#E8F5FA'};
          }
        `}} />

        <ErrorBoundary>
          <QueryProvider>
            <MaintenanceOverlay />
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
