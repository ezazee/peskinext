
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "../types";

export function BlogHero({ posts }: { posts: BlogPost[] }) {
    if (!posts || posts.length === 0) return null;

    const mainPost = posts[0];
    const subPosts = posts.slice(1, 3);

    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[500px] mb-12">
            {/* Main Hero Post - Left (2/3 width on LG) */}
            <Link
                href={`/blog/${mainPost.slug}`}
                className="lg:col-span-2 relative h-full rounded-2xl overflow-hidden group"
            >
                <Image
                    src={mainPost.image}
                    alt={mainPost.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                    <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-3">
                        {mainPost.category}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
                        {mainPost.title}
                    </h2>
                    <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl hidden md:block">
                        {mainPost.excerpt}
                    </p>
                    <div className="mt-4 text-xs text-gray-400 font-medium">
                        {mainPost.date}
                    </div>
                </div>
            </Link>

            {/* Sub Hero Posts - Right (Stacked) */}
            <div className="hidden lg:flex flex-col gap-4 h-full">
                {subPosts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="relative flex-1 rounded-2xl overflow-hidden group"
                    >
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-5 w-full">
                            <h3 className="text-lg font-bold text-white mb-1 leading-snug">
                                {post.title}
                            </h3>
                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                                {post.category}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
