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
export async function checkVoucherCode(code: string, total: number, items: unknown[], regionTag?: string, isManual: boolean = false): Promise<CheckCouponResult> {
    try {
        const res = await fetch(`${API_URL}/api/v1/vouchers/check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, total, items, regionTag, isManual }),
            cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || "Invalid coupon" };
        }

        // Return the confirmed voucher details if valid
        if (data.valid) {
            if (data.voucher) {
                return {
                    success: true,
                    valid: true,
                    discount: data.discount,
                    voucher: {
                        ...data.voucher,
                        enabled: true
                    }
                };
            }

            const voucher: Voucher = {
                id: code.toUpperCase(),
                title: `Kode: ${code.toUpperCase()}`,
                subtitle: `Hemat Rp${(data.discount || 0).toLocaleString('id-ID')}`,
                type: "promo",
                savingLabel: `Rp${(data.discount || 0).toLocaleString('id-ID')}`,
                validTo: new Date(Date.now() + 86400000).toISOString(),
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
