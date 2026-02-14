
import Link from "next/link";
import { BlogHeader } from "@features/blog/components/BlogHeader";
import { BlogFooter } from "@features/blog/components/BlogFooter";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col font-sans text-base-text">
            {/* 
              We import header/footer directly here because not-found 
              might sometimes render outside the layout context depending on 
              where it's caught, but in (blog) group it usually inherits.
              However, to be safe and ensure consistent styling if it replaces the layout,
              we can wrap it or rely on the layout. 
              
              Next.js 13+ inside route groups usually keeps layout if not-found is inside grouping.
              But standard practice for a custom 404 page is to have a clean slate or 
              inherit if possible. 
              
              Let's assume it renders inside layout.tsx of (blog) group.
              If it doesn't, we might lack header/footer.
              But typically not-found.tsx in app dir replaces the page content.
            */}

            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        😕
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
                    <p className="text-gray-500 mb-8">
                        Maaf, artikel atau halaman yang Anda cari tidak dapat ditemukan di Blog PE Skin Pro.
                    </p>
                    <Link
                        href="/blog"
                        className="inline-block w-full py-3 px-6 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Kembali ke Blog
                    </Link>
                </div>
            </div>
        </div>
    );
}
