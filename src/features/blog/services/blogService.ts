import type { BlogPost, BlogCategory } from "@features/blog/types";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface BackendPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    category_id: number;
    user_id: string;
    created_at: string;
    Category?: {
        name: string;
        slug: string;
    };
    author?: {
        name: string;
    };
    images?: {
        image_url: string;
        alt_text: string;
    }[];
}

export const getPosts = async (page = 1, limit = 10, categorySlug?: string, offset?: number): Promise<{ posts: BlogPost[], total: number }> => {
    try {
        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (categorySlug) query.append("category", categorySlug);
        if (offset !== undefined) query.append("offset", offset.toString());

        // Note: Backend might need adjustment to support filtering by category slug if not already supported
        const res = await fetch(`${API_URL}/posts?${query.toString()}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        const posts: BackendPost[] = data.rows || data; // Handle pagination structure

        return {
            posts: posts.map(transformPost),
            total: data.count || posts.length
        };
    } catch (error) {
        console.error("Error fetching posts:", error);
        return { posts: [], total: 0 };
    }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
        const res = await fetch(`${API_URL}/posts?slug=${slug}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return null;

        const data = await res.json();

        // Handle pagination response (rows) or direct array
        const postsList = data.rows || (Array.isArray(data) ? data : []);
        const post = postsList[0];

        if (!post) return null;

        // STRICT CHECK: Ensure the returned post actually matches the requested slug
        // This handles cases where the backend ignores the filter and returns all posts
        if (post.slug !== slug) {
            console.warn(`Mismatch: Requested slug ${slug}, got ${post.slug}`);
            return null;
        }

        return transformPost(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
};

export const getCategories = async (): Promise<BlogCategory[]> => {
    try {
        const res = await fetch(`${API_URL}/categories`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) return [];

        const data = await res.json();
        return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const getCategoryBySlug = async (slug: string): Promise<BlogCategory | null> => {
    const categories = await getCategories();
    return categories.find((c) => c.slug === slug) || null;
};

const transformPost = (bp: BackendPost): BlogPost => ({
    id: bp.id.toString(),
    title: bp.title,
    slug: bp.slug,
    excerpt: bp.content.replace(/<[^>]*>?/gm, "").substring(0, 150) + "...",
    content: bp.content,
    image: normalizeImageUrl(bp.images?.[0]?.image_url),
    author: bp.author?.name || "Admin",
    date: new Date(bp.created_at).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
    }),
    category: bp.Category?.name || "Uncategorized",
    tags: [] // Backend tags if available
});
