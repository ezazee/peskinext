// @features/cart/lib/voucher.ts
import type { Voucher } from "@shared/types/types";

export type CartContext = {
  subtotal: number; // subtotal produk yang dipilih (Rp)
  selectedCount: number; // jumlah item terpilih
  regionTag?: string; // contoh: "Jabodetabek"
  hasPackage?: boolean; // ada item paket?
  now?: Date; // untuk cek tanggal berlaku
};

export type EvalResult = { enabled: boolean; reason?: string };

export function evaluateVoucher(v: Voucher, ctx: CartContext): EvalResult {
  const c = v.conditions ?? {};
  const now = (ctx.now ?? new Date()).getTime();

  // tanggal
  if (v.validTo) {
    const end = new Date(v.validTo).getTime();
    if (isFinite(end) && now > end)
      return { enabled: false, reason: "Voucher sudah tidak berlaku" };
  }
  if (c.validFrom) {
    const start = new Date(c.validFrom).getTime();
    if (isFinite(start) && now < start)
      return { enabled: false, reason: "Voucher belum aktif" };
  }

  // minimum subtotal
  if (typeof c.minSubtotal === "number" && ctx.subtotal < c.minSubtotal) {
    return {
      enabled: false,
      reason: `Min. belanja Rp${formatIDR(c.minSubtotal)}`,
    };
  }

  // min jumlah item terpilih
  if (
    typeof c.minSelectedItems === "number" &&
    ctx.selectedCount < c.minSelectedItems
  ) {
    return {
      enabled: false,
      reason: `Pilih minimal ${c.minSelectedItems} produk`,
    };
  }

  // region
  if (c.regions && c.regions.length > 0) {
    if (!ctx.regionTag) {
      return { enabled: false, reason: `Hanya untuk ${c.regions.join(", ")}` };
    }
    const ok = c.regions.includes(ctx.regionTag);
    if (!ok) {
      return { enabled: false, reason: `Hanya untuk ${c.regions.join(", ")}` };
    }
  }

  // wajib paket
  if (c.requirePackage && !ctx.hasPackage) {
    return { enabled: false, reason: "Hanya berlaku untuk pembelian paket" };
  }

  return { enabled: true };
}

export function getRegionTag(address?: { city: string; province: string } | null): string | undefined {
  if (!address) return undefined;

  const city = address.city.toLowerCase();
  const province = address.province.toLowerCase();

  // Jabodetabek logic
  const isJakarta = province.includes("jakarta");
  const isBogor = city.includes("bogor");
  const isDepok = city.includes("depok");
  const isTangerang = city.includes("tangerang");
  const isBekasi = city.includes("bekasi");

  if (isJakarta || isBogor || isDepok || isTangerang || isBekasi) {
    return "Jabodetabek";
  }

  return undefined;
}

function formatIDR(n: number) {
  return n.toLocaleString("id-ID");
}
