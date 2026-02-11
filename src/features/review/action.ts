"use server";

import { cookies } from "next/headers";

const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawUrl.endsWith("/api/v1") ? rawUrl.slice(0, -"/api/v1".length) : rawUrl;

async function getToken() {
    const store = await cookies();
    const sessionToken = store.get("session_token")?.value;
    if (!sessionToken) return null;

    // Format is userId:timestamp:accessToken
    const parts = sessionToken.split(":");
    if (parts.length < 3) return null;
    return parts.slice(2).join(":"); // Access Token
}

export type UploadMultipleResult = {
    success: boolean;
    urls?: string[];
    error?: string;
};

export async function uploadReviewImages(formData: FormData): Promise<UploadMultipleResult> {
    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Unauthorized" };

        const res = await fetch(`${API_URL}/api/v1/upload/multiple`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return { success: false, error: err.error || "Gagal upload foto" };
        }

        const data = await res.json();
        return { success: true, urls: data.urls || [] };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "Terjadi kesalahan saat upload" };
    }
}

export type SubmitReviewResult = {
    success: boolean;
    error?: string;
};

export async function submitReview(reviewData: {
    orderId: string;
    productSlug: string;
    variantName?: string;
    variant_id?: number;
    rating: number;
    comment: string;
    images: string[];
}): Promise<SubmitReviewResult> {
    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Unauthorized" };

        const res = await fetch(`${API_URL}/api/v1/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                order_id: reviewData.orderId,
                productSlug: reviewData.productSlug,
                variantName: reviewData.variantName,
                variant_id: reviewData.variant_id,
                rating: reviewData.rating,
                comment: reviewData.comment,
                images: reviewData.images,
            }),
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return { success: false, error: err.error || err.message || "Gagal kirim ulasan" };
        }

        // Revalidate order pages to show updated review status
        const { revalidatePath } = await import("next/cache");
        revalidatePath(`/account/transaction/${reviewData.orderId}`);
        revalidatePath("/account/transaction");

        return { success: true };
    } catch (error) {
        console.error("Submit review error:", error);
        return { success: false, error: "Terjadi kesalahan saat mengirim ulasan" };
    }
}
