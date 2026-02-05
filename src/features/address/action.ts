"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { AddressItem } from "@shared/types/types";

// Handle potential /api/v1 suffix in env var to prevent double path
const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawUrl.endsWith("/api/v1") ? rawUrl.slice(0, -"/api/v1".length) : rawUrl;

async function getToken() {
    const store = await cookies();
    const sessionToken = store.get("session_token")?.value;
    if (!sessionToken) return null;

    const parts = sessionToken.split(":");
    if (parts.length >= 3) {
        return parts.slice(2).join(":");
    }
    return null;
}

async function getUserId() {
    const store = await cookies();
    const sessionToken = store.get("session_token")?.value;
    if (!sessionToken) return null;

    const parts = sessionToken.split(":");
    return parts[0] || null;
}

type ActionResult<T = void> = {
    success: boolean;
    error?: string;
    data?: T;
};

// Get all addresses for current user
export async function getAddresses(): Promise<ActionResult<AddressItem[]>> {
    try {
        const token = await getToken();
        const userId = await getUserId();

        if (!token || !userId) {
            return { success: false, error: "Unauthorized" };
        }

        const res = await fetch(`${API_URL}/api/v1/addresses/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.message || "Failed to fetch addresses" };
        }

        const addresses = await res.json();

        // Map backend fields to frontend AddressItem type
        const mapped: AddressItem[] = addresses.map((addr: Record<string, unknown>) => ({
            id: addr.id as string,
            label: addr.label as string,
            recipient: (addr.recipient as string) || "",
            phone: (addr.phone as string) || "",
            line1: addr.address as string,
            province: (addr.province as string) || "",
            district: (addr.districts as string) || "",
            city: (addr.regencies as string) || "",
            postalCode: (addr.postal_code as string) || "",
            isPrimary: (addr.is_default as boolean) || false,
        }));

        return { success: true, data: mapped };
    } catch (error) {
        console.error("Get addresses error:", error);
        return { success: false, error: "Failed to fetch addresses" };
    }
}

// Create new address
export async function createAddress(data: Omit<AddressItem, "id">): Promise<ActionResult<AddressItem>> {
    try {
        const token = await getToken();
        const userId = await getUserId();

        if (!token || !userId) {
            return { success: false, error: "Unauthorized" };
        }

        const payload: Record<string, unknown> = {
            user_id: userId,
            label: data.label,
            recipient: data.recipient,
            phone: data.phone,
            address: data.line1,
            province: data.province,
            districts: data.district,
            regencies: data.city,
            postal_code: data.postalCode,
            is_default: data.isPrimary,
        };

        const res = await fetch(`${API_URL}/api/v1/address`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.message || "Failed to create address" };
        }

        const result = await res.json();

        revalidatePath("/account/address");

        return { success: true, data: result.data };
    } catch (error) {
        console.error("Create address error:", error);
        return { success: false, error: "Failed to create address" };
    }
}

// Update existing address
export async function updateAddress(id: string, data: Partial<AddressItem>): Promise<ActionResult> {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "Unauthorized" };
        }

        const payload: Record<string, unknown> = {};
        if (data.label) payload.label = data.label;
        if (data.recipient) payload.recipient = data.recipient;
        if (data.phone) payload.phone = data.phone;
        if (data.line1) payload.address = data.line1;
        if (data.province) payload.province = data.province;
        if (data.district) payload.districts = data.district;
        if (data.city) payload.regencies = data.city;
        if (data.postalCode) payload.postal_code = data.postalCode;
        if (data.isPrimary !== undefined) payload.is_default = data.isPrimary;

        const res = await fetch(`${API_URL}/api/v1/address/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.message || "Failed to update address" };
        }

        revalidatePath("/account/address");

        return { success: true };
    } catch (error) {
        console.error("Update address error:", error);
        return { success: false, error: "Failed to update address" };
    }
}

// Delete address
export async function deleteAddress(id: string): Promise<ActionResult> {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "Unauthorized" };
        }

        const res = await fetch(`${API_URL}/api/v1/address/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.message || "Failed to delete address" };
        }

        revalidatePath("/account/address");

        return { success: true };
    } catch (error) {
        console.error("Delete address error:", error);
        return { success: false, error: "Failed to delete address" };
    }
}

// Set address as default
export async function setDefaultAddress(id: string): Promise<ActionResult> {
    try {
        const token = await getToken();

        if (!token) {
            return { success: false, error: "Unauthorized" };
        }

        const res = await fetch(`${API_URL}/api/v1/address/${id}/default`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json();
            return { success: false, error: err.message || "Failed to set default address" };
        }

        revalidatePath("/account/address");

        return { success: true };
    } catch (error) {
        console.error("Set default address error:", error);
        return { success: false, error: "Failed to set default address" };
    }
}
