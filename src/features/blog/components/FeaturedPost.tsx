
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "../types";

export function FeaturedPost({ post }: { post: BlogPost }) {
    if (!post) return null;

    return (
        <section className="relative w-full rounded-2xl overflow-hidden bg-tertiary/30 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
            <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row group">

                {/* Text Content - Left Side */}
                <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Featured
                        </span>
                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            {post.category}
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                    </h2>

                    <p className="text-gray-500 text-base md:text-lg mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-gray-400 text-xs md:text-sm font-medium mt-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
                                {/* Fallback avatar or user icon */}
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                                    {post.author.charAt(0)}
                                </div>
                            </div>
                            <span className="text-gray-700">{post.author}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <time>{post.date}</time>
                    </div>
                </div>

                {/* Image - Right Side */}
                <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto min-h-[300px] md:min-h-[450px] order-1 md:order-2 overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

            </Link>
        </section>
    );
}
