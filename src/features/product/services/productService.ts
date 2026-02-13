import type { Product } from "@shared/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function calculatePrice(data: { productId: string; variantId: number; qty: number; channel?: string }) {
    const res = await fetch(`${API_URL}/products/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(err.message || "Gagal menghitung harga");
    }

    return res.json();
}

// Matches Backend's formatProductToFrontend
interface FormattedBackendProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    ingredients: string[];
    howToUse: string[];
    category: string;
    sku: string;
    price: string; // "Rp100.000"
    oldPrice?: string;
    img: string;
    imgHover: string;
    galleryImages: string[];
    isFlashSale: boolean;
    isEvent: boolean;
    type: "single" | "bundle";
    variants: {
        id: number;
        name: string;
        price: number;
        oldPrice?: number;
        stock: number;
        // other backend fields if needed
    }[];
    weightGr: number;
    soldCount?: number;
}

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products from backend");
    }

    // Backend returns already formatted data
    const backendProducts: FormattedBackendProduct[] = await res.json();

    return backendProducts.map((bp) => {
        // Map Backend Formatted Variants to Frontend Variants
        const variants = (bp.variants || []).map((v) => ({
            id: v.id,
            name: v.name,
            price: v.price,
            oldPrice: v.oldPrice || 0,
            stock: v.stock,
        }));

        // Use backend's pre-formatted price string
        const priceStr = bp.price;

        return {
            id: bp.id,
            name: bp.name,
            slug: bp.slug,
            description: bp.description,
            ingredients: bp.ingredients,
            howToUse: bp.howToUse,
            category: bp.category,
            sku: bp.sku,
            price: priceStr,
            oldPrice: bp.oldPrice || "",
            img: bp.img || "https://placehold.co/300x300", // Fallback if empty
            imgHover: bp.imgHover,
            galleryImages: bp.galleryImages,
            isFlashSale: bp.isFlashSale,
            isEvent: bp.isEvent,
            type: bp.type,
            variants,
            weightGr: bp.weightGr,
            soldCount: bp.soldCount || 0,
        };
    });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const all = await getProducts(); // Reuse getProducts for consistency
    return all.find((p) => p.slug === slug) || null;
}
export async function getRecommendations(limit: number = 6): Promise<Product[]> {
    const all = await getProducts();
    // Simple randomization for now
    const shuffled = all.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
}
