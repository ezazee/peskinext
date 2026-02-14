import type { BlogPost } from "../types";
import { BlogCard } from "./BlogCard";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
    if (!posts?.length) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
            ))}
        </div>
    );
}
