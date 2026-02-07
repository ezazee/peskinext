"use server";

// import { cookies } from "next/headers";
import type { Voucher } from "@shared/types/types";

// Handle potential /api/v1 suffix in env var
const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawUrl.endsWith("/api/v1") ? rawUrl.slice(0, -"/api/v1".length) : rawUrl;

type VoucherResponse = {
    success: boolean;
    message?: string;
    data?: Voucher[];
};

type CheckCouponResult = {
    success: boolean;
    message?: string;
    valid?: boolean;
    discount?: number;
    voucher?: Voucher;
};

// Fetch all active vouchers
export async function getVouchers(): Promise<VoucherResponse> {
    try {
        const res = await fetch(`${API_URL}/api/v1/vouchers`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch vouchers");
        }

        const data = await res.json();
        // Assuming backend returns array of coupons directly or wrapped in data
        const coupons = Array.isArray(data) ? data : data.data || [];

        return { success: true, data: coupons };
    } catch (error) {
        console.error("Get vouchers error:", error);
        const msg = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: msg };
    }
}

// Check specific coupon code validity
export async function checkVoucherCode(code: string, total: number, items: unknown[]): Promise<CheckCouponResult> {
    try {
        const res = await fetch(`${API_URL}/api/v1/vouchers/check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, total, items }),
            cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || "Invalid coupon" };
        }

        // Return the confirmed voucher details if valid
        if (data.valid) {
            // Construct a voucher object from the response if backend returns it, 
            // or just confirmation. For now assuming we might get details back.
            // If the backend only returns valid/discount, we might need to fetch details or construct a dummy one.
            // Based on CouponRoute swagger, it returns valid: boolean, discount: number.
            // So we might need to rely on the code entered or fetch details separately if not provided.
            // Let's assume we use the code provided as the basic voucher data.
            const voucher: Voucher = {
                id: code.toUpperCase(), // temporary ID
                title: `Kode: ${code.toUpperCase()}`,
                subtitle: `Hemat Rp${(data.discount || 0).toLocaleString('id-ID')}`,
                type: "promo", // default to promo/general if unknown
                savingLabel: `Rp${(data.discount || 0).toLocaleString('id-ID')}`,
                // We authorize it immediately since backend checked it
                validTo: new Date(Date.now() + 86400000).toISOString(), // valid for 24h mock
                enabled: true,
            };
            return { success: true, valid: true, discount: data.discount, voucher };
        }

        return { success: true, valid: false, message: "Coupon invalid" };

    } catch (error) {
        console.error("Check voucher error:", error);
        const msg = error instanceof Error ? error.message : "Unknown error";
        return { success: false, message: msg };
    }
}
