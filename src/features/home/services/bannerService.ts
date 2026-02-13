import type { BannersResponse } from "@shared/types/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

export async function getBanners(): Promise<BannersResponse> {

    const res = await fetch(`${BACKEND_URL}/banners`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch banners");
    }

    return res.json();
}
