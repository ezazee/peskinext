import type { Voucher, VoucherConditions } from "@shared/types/types";
import { NextResponse } from "next/server";

export type CartCtxDTO = {
  subtotal: number;
  selectedCount: number;
  regionTag?: string;
  hasPackage?: boolean;
  now?: string; // ISO
};

export type RedeemRequestDTO = { code: string; ctx: CartCtxDTO };
export type RedeemResponseDTO = {
  found: boolean;
  eligible?: boolean;
  reason?: string;
  voucher?: Voucher; // enabled sudah disesuaikan
};

// Mock DB contoh (boleh tambah kode lain di sini)
// Mock DB removed. Using Backend API.

function evaluateVoucher(v: Omit<Voucher, "enabled">, ctx: CartCtxDTO) {
  const c: VoucherConditions = v.conditions ?? {};
  const nowMs = (ctx.now ? new Date(ctx.now) : new Date()).getTime();

  if (v.validTo) {
    const end = new Date(v.validTo).getTime();
    if (Number.isFinite(end) && nowMs > end)
      return { eligible: false, reason: "Voucher sudah tidak berlaku" };
  }
  if (c.validFrom) {
    const start = new Date(c.validFrom).getTime();
    if (Number.isFinite(start) && nowMs < start)
      return { eligible: false, reason: "Voucher belum aktif" };
  }
  if (typeof c.minSubtotal === "number" && ctx.subtotal < c.minSubtotal)
    return {
      eligible: false,
      reason: `Min. belanja Rp${c.minSubtotal.toLocaleString("id-ID")}`,
    };

  if (
    typeof c.minSelectedItems === "number" &&
    ctx.selectedCount < c.minSelectedItems
  )
    return {
      eligible: false,
      reason: `Pilih minimal ${c.minSelectedItems} produk`,
    };

  if (c.regions?.length && ctx.regionTag && !c.regions.includes(ctx.regionTag))
    return { eligible: false, reason: `Hanya untuk ${c.regions.join(", ")}` };

  if (c.requirePackage && !ctx.hasPackage)
    return { eligible: false, reason: "Hanya berlaku untuk pembelian paket" };

  return { eligible: true };
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RedeemRequestDTO;
    const code = body.code?.trim().toUpperCase();
    if (!code) {
      return NextResponse.json<RedeemResponseDTO>({
        found: false,
        reason: "Kode tidak valid.",
      });
    }

    // Call Backend to check if coupon exists
    let base: Voucher | null = null;
    try {
      const res = await fetch(`${BACKEND_URL}/vouchers/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        cache: "no-store"
      });

      if (res.ok) {
        const backendCoupon = await res.json();
        // Map Backend Response to Frontend Voucher Type
        // Backend: discount_type, discount_value. Frontend expects savingLabel (optional but good UI)
        const isPercent = backendCoupon.discount_type === "percent";
        const val = Number(backendCoupon.discount_value);
        const savingLabel = isPercent ? `Hemat ${val}%` : `Hemat Rp${val.toLocaleString("id-ID")}`;

        base = {
          id: backendCoupon.id,
          code: backendCoupon.id, // ID is used as code
          title: backendCoupon.title,
          subtitle: backendCoupon.subtitle,
          type: backendCoupon.type,
          enabled: backendCoupon.is_enabled,
          savingLabel: savingLabel,
          validTo: backendCoupon.expired_at,
          conditions: backendCoupon.conditions
        };
      }
    } catch (e) {
      console.error("Backend voucher check failed", e);
    }

    if (!base) {
      return NextResponse.json<RedeemResponseDTO>({
        found: false,
        reason: "Kode tidak ditemukan atau sudah kadaluarsa." // Generic message for 404
      });
    }

    // Validasi logic rules (Min belanja, region, dll) tetap di frontend (Next.js server)
    // karena Backend saat ini hanya validasi existency.
    // Jika backend nanti support validasi cart, logika ini bisa dipindah.
    const { eligible, reason } = evaluateVoucher(base, body.ctx);
    const voucher: Voucher = { ...base, enabled: eligible };

    return NextResponse.json<RedeemResponseDTO>({
      found: true,
      eligible,
      reason,
      voucher,
    });
  } catch {
    return NextResponse.json<RedeemResponseDTO>(
      { found: false, reason: "Server error" },
      { status: 200 }
    );
  }
}
