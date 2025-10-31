import type { Voucher } from "@shared/types/types";

export type CartCtxDTO = {
  subtotal: number;
  selectedCount: number;
  regionTag?: string;
  hasPackage?: boolean;
  now?: string;
};

export type RedeemResponseDTO = {
  found: boolean;
  eligible?: boolean;
  reason?: string;
  voucher?: Voucher;
};

export async function redeemVoucher(
  codeUpper: string,
  ctx: CartCtxDTO
): Promise<RedeemResponseDTO> {
  try {
    const res = await fetch("/api/vouchers/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: codeUpper, ctx }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(`Redeem request failed (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    return data as RedeemResponseDTO;
  } catch (_error) {
    if (_error instanceof Error) {
      throw _error;
    }
    throw new Error("Failed to redeem voucher due to network error");
  }
}
