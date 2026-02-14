import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://peskinpro.id';

    try {
        // Fetch products from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        let products = [];
        if (response.ok) {
            products = await response.json();
        }

        // Fetch blog posts
        let blogPosts = [];
        try {
            const blogResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?limit=100`, {
                next: { revalidate: 3600 },
            });
            if (blogResponse.ok) {
                const blogData = await blogResponse.json();
                blogPosts = blogData.posts || []; // Adjust based on API structure
            }
        } catch (e) {
            console.error('Error fetching blog posts for sitemap:', e);
        }

        // Dynamic blog pages
        const blogPages = blogPosts.map((post: any) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.created_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        const staticPages = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 1.0,
            },
            {
                url: `${baseUrl}/all-product`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.9,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.9,
            },
        ];

        // Dynamic product pages
        const productPages = products.map((product: any) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...staticPages, ...productPages, ...blogPages];
    } catch (error) {
        console.error('Error generating sitemap:', error);

        // Return minimal sitemap on error
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
        ];
    }
}
