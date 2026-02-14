
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostBySlug, getPosts, getCategoryBySlug } from "@features/blog/services/blogService";
import { getRecommendations } from "@features/product/services/productService";
import { ProductCard } from "@shared/components/layout/header/mobile/product/ProductCard";
import { BlogContent } from "../page";
import { BlogListSkeleton } from "@features/blog/components/skeletons/BlogListSkeleton";

// ... existing code ...



interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    // Check if it's a post
    const post = await getPostBySlug(slug);
    if (post) {
        return {
            title: `${post.title} | Blog PE Skin Pro`,
            description: post.excerpt,
            openGraph: {
                title: post.title,
                description: post.excerpt,
                images: [post.image],
                type: "article",
                authors: [post.author],
                publishedTime: post.date,
            },
        };
    }

    // Check if it's a category
    const categoryQuery = await getCategoryBySlug(slug);
    if (categoryQuery) {
        return {
            title: `${categoryQuery.name} | Blog PE Skin Pro`,
            description: `Kumpulan artikel seputar ${categoryQuery.name} dari PE Skin Pro.`,
        };
    }

    return {
        title: "Halaman Tidak Ditemukan | PE Skin Pro",
    };
}

export default async function BlogDynamicPage({ params, searchParams }: PageProps) {
    const { slug } = await params;

    // 1. Try to find a POST
    const post = await getPostBySlug(slug);

    if (post) {
        // --- RENDER POST PAGE ---
        const recent = await getPosts(1, 6);
        const products = await getRecommendations(5);

        // Filter out current post from sidebar list
        const sidebarPosts = recent.posts.filter(p => p.id !== post.id).slice(0, 5);

        return (
            <article className="min-h-screen bg-white pb-20 pt-8 font-sans">
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <main className="lg:col-span-8">
                        {/* Article Header */}
                        <div className="mb-6">
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded mb-3">
                                {post.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-gray-900">
                                {post.title}
                            </h1>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="font-semibold text-gray-900">{post.author || "Admin"}</span>
                                    <span>•</span>
                                    <span>{post.date}</span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-gray-100">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 800px"
                            />
                        </div>

                        {/* Article Body */}
                        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>

                        {/* Tags Footer */}
                        {post.tags.length > 0 && (
                            <div className="mt-12 pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 mb-3">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-sm font-medium hover:bg-gray-100 cursor-pointer transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* RECOMMENDATION SECTION (Ecommerce Style) */}
                        <div className="mt-16 pt-8 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Rekomendasi untukmu</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {products.map((product) => (
                                    <div key={product.id} className="h-full">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>

                    {/* Sidebar (Cols 9-12) */}
                    <aside className="lg:col-span-4 pl-0 lg:pl-8 lg:border-l border-gray-100">
                        <div className="sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Artikel Terbaru</h3>
                            <div className="space-y-6">
                                {sidebarPosts.map((p) => (
                                    <Link
                                        href={`/blog/${p.slug}`}
                                        key={p.id}
                                        className="group grid grid-cols-[80px_1fr] gap-4 items-center"
                                    >
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={p.image}
                                                alt={p.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                                {p.title}
                                            </h4>
                                            <div className="text-xs text-gray-400 font-medium">
                                                {p.date}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            "headline": post.title,
                            "image": [post.image],
                            "datePublished": new Date(post.date).toISOString().split('T')[0], // Assuming date format is compatible or simple Text
                            "dateModified": new Date(post.date).toISOString().split('T')[0], // simplified
                            "author": {
                                "@type": "Person",
                                "name": post.author || "Admin",
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "PE Skin Professional",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://peskinpro.id/Logo.png"
                                }
                            },
                            "description": post.excerpt,
                            "articleBody": post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." // Simplified plain text body
                        })
                    }}
                />

            </article >
        );
    }

    // 2. Try to find a CATEGORY
    const categoryQuery = await getCategoryBySlug(slug);

    if (categoryQuery) {
        // --- RENDER CATEGORY PAGE ---
        const resolvedParams = await searchParams;
        const page = Number(resolvedParams?.page) || 1;

        return (
            <main className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                    <Suspense fallback={<BlogListSkeleton />}>
                        <BlogContent category={categoryQuery.slug} page={page} />
                    </Suspense>
                </div>
            </main>
        );
    }

    // 3. Not Found
    notFound();
}
