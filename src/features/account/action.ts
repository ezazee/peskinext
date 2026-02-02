"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

async function getToken() {
    const store = await cookies();
    const sessionToken = store.get("session_token")?.value;
    if (!sessionToken) return null;

    // Format is userId:timestamp:accessToken
    const parts = sessionToken.split(":");
    if (parts.length < 3) return null;
    return parts.slice(2).join(":"); // Access Token
}

export type UploadResult = {
    success: boolean;
    imageUrl?: string;
    error?: string;
};

export async function uploadAvatar(formData: FormData): Promise<UploadResult> {
    try {
        const file = formData.get("file");
        if (!file) return { success: false, error: "File tidak ditemukan" };

        const token = await getToken();
        if (!token) return { success: false, error: "Unauthorized" };

        // Create new FormData to ensure order: type FIRST, then file
        const outgoingData = new FormData();
        outgoingData.append("type", "user");
        outgoingData.append("file", file as Blob);

        const res = await fetch(`${API_URL}/api/v1/single`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: outgoingData,
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.error || "Gagal upload gambar" };
        }

        const data = await res.json();
        return { success: true, imageUrl: data.imageUrl };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "Terjadi kesalahan saat upload" };
    }
}

export type UpdateProfileResult = {
    success: boolean;
    user?: any;
    error?: string;
};

export async function updateProfile(data: any): Promise<UpdateProfileResult> {
    try {
        const token = await getToken();
        if (!token) return { success: false, error: "Unauthorized" };

        const res = await fetch(`${API_URL}/api/v1/user/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.message || "Gagal update profile" };
        }

        const result = await res.json();

        // Revalidate paths to refresh data
        revalidatePath("/account");
        revalidatePath("/account/edit");

        return { success: true, user: result.user };
    } catch (error) {
        console.error("Update profile error:", error);
        return { success: false, error: "Terjadi kesalahan saat update profile" };
    }
}
