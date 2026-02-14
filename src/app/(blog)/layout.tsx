
import { BlogHeader } from "@features/blog/components/BlogHeader";
import { BlogFooter } from "@features/blog/components/BlogFooter";

export const metadata = {
    title: "PESkinPro Blog - Tips Skincare & Kecantikan",
    description: "Temukan tips skincare terbaru, review produk, dan panduan daily routine di PESkinPro Blog.",
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PE Skin Professional",
        "url": "https://peskinpro.id",
        "logo": "https://peskinpro.id/Logo.png",
        "sameAs": [
            "https://www.instagram.com/peskinpro_official",
            "https://www.facebook.com/peskinpro"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-812-3456-7890",
            "contactType": "Customer Service"
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-base-text">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogHeader />
            <main className="flex-grow">
                {children}
            </main>
            <BlogFooter />
        </div>
    );
}
