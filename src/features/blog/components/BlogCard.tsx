import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "../types";

export function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100"
        >
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                    {post.category}
                </div>
            </div>

            <div className="flex flex-col flex-grow p-4">
                <div className="flex items-center gap-2 text-xs text-secondary/60 mb-2">
                    <span className="font-medium">{post.author}</span>
                    <span>•</span>
                    <time>{post.date}</time>
                </div>

                <h3 className="font-bold text-base-text text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                </h3>

                <p className="text-secondary text-sm line-clamp-3 mb-4 flex-grow">
                    {post.excerpt}
                </p>

                <div className="mt-auto text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Baca Selengkapnya
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
