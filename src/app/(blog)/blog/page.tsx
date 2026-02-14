import { Suspense } from "react";
import type { Metadata } from "next";
import { getPosts } from "@features/blog/services/blogService";
import { BlogHero } from "@features/blog/components/BlogHero";
import { BlogGrid } from "@features/blog/components/BlogGrid";
import { BlogPagination } from "@features/blog/components/BlogPagination";
import { BlogListSkeleton } from "@features/blog/components/skeletons/BlogListSkeleton";
import { notFound } from "next/navigation";

// ... existing code ...

export default async function BlogPage(props: BlogPageProps) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams?.page) || 1;

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Suspense fallback={<BlogListSkeleton />}>
                    <BlogContent category={searchParams?.category} page={page} />
                </Suspense>
            </div>
        </main>
    );
}

export const metadata: Metadata = {
    title: "Blog Skincare | PE Skin Pro",
    description: "Tips skincare, panduan routine harian, dan penjelasan ingredients dari ahli dermatologi PE Skin Pro.",
    openGraph: {
        title: "Blog Skincare | PE Skin Pro",
        description: "Temukan rahasia kulit glowing dan sehat dengan tips dari ahli kami.",
        type: "website",
    },
};

export const revalidate = 60; // ISR 60 seconds

interface BlogContentProps {
    category?: string;
    page: number;
}

export async function BlogContent({ category, page }: BlogContentProps) {
    const GRID_LIMIT = 6;

    // 1. Fetch Posts based on pagination strategy
    // STRATEGY: 
    // - Page 1: Hero (Top 3) + Grid (Next 6). Total 9 items potentially needed.
    // - Page > 1: Grid only (6 items).

    // We make 2 parallel requests to ensure clean data separation
    // Request A: Hero (Always Top 3, but only shown on Page 1)
    // Request B: Grid (Page X of 'Rest')

    const heroPromise = page === 1 ? getPosts(1, 3, category) : Promise.resolve({ posts: [], total: 0 });

    // Grid Offset Calculation:
    // We want to skip the "Hero" posts (Top 3) always.
    // Grid Page 1: Skip 3, Take 6.
    // Grid Page 2: Skip 3 + 6, Take 6.
    // Formula: 3 + (page - 1) * 6
    const gridOffset = 3 + (page - 1) * GRID_LIMIT;
    const gridPromise = getPosts(1, GRID_LIMIT, category, gridOffset); // We use page=1 but custom offset

    const [heroData, gridData] = await Promise.all([heroPromise, gridPromise]);

    const heroPosts = heroData.posts;
    const gridPosts = gridData.posts;
    const totalPosts = gridData.total; // Total in DB (e.g. 50)

    // Calculate Total Pages for the GRID (excluding Hero items count effectively)
    // Total Available for Grid = TotalDB - 3 (Hero)
    // Pages = Ceil( (TotalDB - 3) / 6 )
    const totalGridItems = Math.max(0, totalPosts - 3);
    const totalPages = Math.ceil(totalGridItems / GRID_LIMIT);

    // Handle empty state
    if (page === 1 && heroPosts.length === 0 && gridPosts.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <h2 className="text-xl font-bold text-gray-400">Belum ada artikel {category ? `di kategori ${category}` : ""}</h2>
                <p className="text-gray-400 mt-2">Nantikan tips skincare menarik dari kami!</p>
            </div>
        );
    }

    // Determine Base URL for pagination
    const baseUrl = category ? `/blog/${category}` : "/blog";

    return (
        <div className="space-y-12">
            {/* Show Hero only on Page 1 and if we have posts */}
            {page === 1 && heroPosts.length > 0 && <BlogHero posts={heroPosts} />}

            <section>
                <div className="flex items-center justify-between mb-8">
                    {!category && (
                        <h2 className="text-2xl font-bold text-base-text relative pl-4 after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-primary after:rounded-full">
                            Artikel Terbaru
                        </h2>
                    )}
                </div>

                {gridPosts.length > 0 ? (
                    <>
                        <BlogGrid posts={gridPosts} />
                        <BlogPagination
                            currentPage={page}
                            totalPages={totalPages}
                            baseUrl={baseUrl}
                        />
                    </>
                ) : (
                    page > 1 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500">Halaman tidak ditemukan.</p>
                        </div>
                    )
                )}
            </section>
        </div>
    );
}

interface BlogPageProps {
    searchParams: Promise<{ category?: string; page?: string }>;
}


