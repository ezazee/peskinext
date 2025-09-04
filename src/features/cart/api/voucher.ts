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
  const res = await fetch("/api/vouchers/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: codeUpper, ctx }),
  });
  if (!res.ok) throw new Error("Redeem request failed");
  return res.json() as Promise<RedeemResponseDTO>;
}
