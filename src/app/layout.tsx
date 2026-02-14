import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@app/providers/QueryProvider";
import { ToastProvider } from "@shared/components/ui/Toaster";
import { ErrorBoundary } from "@shared/components/ErrorBoundary";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://peskinpro.id"),

  title: "PE Skin Pro - Skincare Alami Terbaik",
  description:
    "PE Skin Pro adalah platform e-commerce yang menyediakan produk skincare alami berkualitas tinggi. Temukan berbagai produk perawatan kulit yang aman dan efektif untuk semua jenis kulit.",

  manifest: "/favicon/site.webmanifest",

  keywords: [
    "skincare alami",
    "perawatan kulit",
    "produk kecantikan",
    "PE Skin Pro",
    "e-commerce skincare",
  ],

  authors: [{ name: "PE Skin Pro", url: "https://peskinpro.id" }],
  creator: "PE Skin Pro Team",

  openGraph: {
    title: "PE Skin Pro - Skincare Alami Berkualitas Tinggi",
    description: "Temukan produk perawatan kulit alami yang aman dan efektif.",
    url: "https://peskinpro.id",
    siteName: "PE Skin Pro",
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

  twitter: {
    card: "summary_large_image",
    title: "PE Skin Pro - Skincare Alami Terbaik",
    description:
      "Jelajahi koleksi skincare alami kami yang dirancang untuk semua jenis kulit.",
    images: ["/web-app.png"],
  },

  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization Schema for SEO (Google Knowledge Graph)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PE Skin Pro",
    "url": "https://peskinpro.id",
    "logo": "https://peskinpro.id/logo.png",
    "description": "Platform e-commerce skincare alami berkualitas tinggi untuk semua jenis kulit",
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
      "https://www.facebook.com/peskinpro",
      "https://www.instagram.com/peskinpro",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PE Skin Pro",
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

        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
