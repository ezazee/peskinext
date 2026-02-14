"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  CartData,
  CartItem,
  Voucher,
  VoucherSelection,
  VoucherConditions,
  CheckoutSession,
} from "@shared/types/types";
import { PaymentTimer } from "@features/transaction/components/PaymentTimer";


import { AddressModal } from "@shared/components/ui/AddressModal";
import { useAddressBook } from "@features/address/useAddressBook";

import AddressCardMobile from "./AddressCardMobile";
import SellerCartCard from "../components/SellerCartCard";
import OrderSummaryMobile from "./OrderSummaryMobile";

import ShippingModal from "@features/checkout/desktop/ShippingModal";
import type { ShippingOption } from "@shared/types/types";
import { useShippingQuotes } from "@features/shipping/hooks/useShippingQuotes";
import { getCurrentUser } from "@features/auth/action";
import type { ShippingQueryParams } from "@features/shipping/hooks/useShippingParamsForProduct";

import VoucherModal from "@features/checkout/desktop/VoucherModal";
import { evaluateVoucher, getRegionTag } from "@features/cart/lib/voucher";
import { useAddressSwitching, startAddressSwitch } from "@features/address/addressSwitchBus";
import { getVouchers, checkVoucherCode } from "@features/voucher/action";
import {
  type CartCtx,
} from "@features/cart/utils/redeemWithFallback";

import { getProductPrice } from "@shared/helpers/product";

/* ---- voucher helpers (sama seperti desktop) ---- */
type VoucherWithConditions = Voucher & { conditions?: VoucherConditions };
type DecoratedVoucher = Voucher & { _reason?: string };
function decorateVouchers(src: Voucher[], ctx: CartCtx): DecoratedVoucher[] {
  return src.map((v) => {
    const res = evaluateVoucher(v as VoucherWithConditions, ctx);
    return {
      ...v,
      enabled: res.enabled,
      _reason: res.reason,
      subtitle: !res.enabled && res.reason ? res.reason : v.subtitle,
    };
  });
}
function parseRupiahFlexible(text?: string): number {
  if (!text) return 0;
  const s = text.replace(/\s+/g, " ").trim().toLowerCase();
  let m = s.match(/(?:rp)?\s*([\d.]+)\s*(rb|ribu|k|jt|juta)?/i);
  if (m && m[1]) {
    const base = parseInt(m[1].replace(/\./g, ""), 10) || 0;
    const suf = (m[2] || "").toLowerCase();
    if (suf === "rb" || suf === "ribu" || suf === "k") return base * 1_000;
    if (suf === "jt" || suf === "juta") return base * 1_000_000;
    return base;
  }
  m = s.match(/(\d+)\s*(rb|ribu|k|jt|juta)/i);
  if (m && m[1] && m[2]) {
    const n = parseInt(m[1], 10) || 0;
    const suf = m[2].toLowerCase();
    return suf === "rb" || suf === "ribu" || suf === "k"
      ? n * 1_000
      : n * 1_000_000;
  }
  return 0;
}
function parsePercent(text?: string): number | null {
  if (!text) return null;
  const m = text.match(/(\d{1,3})\s*%/);
  return m && m[1] ? Math.min(100, Math.max(0, parseInt(m[1], 10))) : null;
}
const looksLikeDiscount = (t?: string) =>
  !!t && /(hemat|potong|s\/d|sd|gratis|ongkir|diskon)/i.test(t);

function computeShippingDiscountFrom(v?: Voucher | null): number {
  if (!v) return 0;
  const tryTexts: (string | undefined)[] = [
    v.savingLabel,
    v.title,
    looksLikeDiscount(v.subtitle) ? v.subtitle : undefined,
  ];
  for (const t of tryTexts) {
    const n = parseRupiahFlexible(t);
    if (n > 0) return n;
  }
  return 0;
}
function computePromoDiscountFrom(
  v: Voucher | null | undefined,
  subtotal: number
): number {
  if (!v) return 0;
  const pct =
    parsePercent(v.title) ??
    parsePercent(v.subtitle) ??
    parsePercent(v.savingLabel) ??
    0;
  const cap =
    parseRupiahFlexible(v.subtitle) ||
    parseRupiahFlexible(v.savingLabel) ||
    Number.POSITIVE_INFINITY;
  if (pct > 0) {
    const raw = Math.floor((subtotal * pct) / 100);
    return Math.max(0, Math.min(raw, cap, subtotal));
  }
  // If no percentage, try parsing as a fixed amount
  const fixed =
    parseRupiahFlexible(v.subtitle) ||
    parseRupiahFlexible(v.savingLabel) ||
    parseRupiahFlexible(v.title);

  return Math.max(0, Math.min(fixed, subtotal));
}

import { useToast } from "@shared/components/ui/Toaster";

/* =================================================== */
export default function MobileCheckout({
  initialCart = { items: [] },
  checkoutSession,
}: {
  initialCart?: CartData;
  checkoutSession?: CheckoutSession | null;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setUserId(u.id);
    });
  }, []);

  /* Convert checkoutSession.lines to cart items format if session exists */
  const items: CartItem[] = useMemo(() => {
    if (checkoutSession?.lines) {
      // Convert CheckoutLine[] to CartItem[] format
      return checkoutSession.lines.map((line) => ({
        id: `checkout-${line.productId}-${line.variantId}`,
        product: {
          id: line.productId,
          name: line.name.split(" - ")[0] || line.name,
          slug: line.productId,
          img: line.image,
          price: `Rp${line.price.toLocaleString("id-ID")}`,
          variants: [
            {
              id: Number(line.variantId),
              name: line.name.split(" - ")[1] || "Default",
              price: line.price,
              stock: 999,
            },
          ],
          // Dummy fields required by Product type
          description: "",
          ingredients: [],
          howToUse: [],
          category: "",
          sku: "",
          imgHover: line.image,
          galleryImages: [line.image],
          isFlashSale: false,
          isEvent: false,
          type: "single" as const,
          weightGr: line.weight || 100,
        },
        variantId: Number(line.variantId),
        qty: line.qty,
        selected: true,
      }));
    }

    // Fallback to cart items
    const safeItems = (initialCart?.items ?? []).filter((i) => i.qty > 0);
    const chosen = safeItems.filter((i) => i.selected);
    return chosen.length ? chosen : safeItems;
  }, [checkoutSession, initialCart]);

  const itemsCount = items.length;
  const subtotal = useMemo(() => {
    let sum = 0;
    for (const line of items) {
      const v = line.product.variants.find((x) => x.id === line.variantId);
      sum += getProductPrice(line.product, v) * line.qty;
    }
    return sum;
  }, [items]);

  /* alamat */
  const { primary, listEntries, selectPrimary, loading: addressLoading } = useAddressBook();
  const switching = useAddressSwitching();

  const [openAddress, setOpenAddress] = useState(false);
  const addressLabel = useMemo(() => {
    if (addressLoading) return "Memuat alamat...";
    const addr = primary;
    if (!addr) return "Pilih alamat pengiriman";
    return `${addr.label} - ${addr.recipient} (${addr.city})`;
  }, [primary, addressLoading]);

  /* shipping */
  const [openShipping, setOpenShipping] = useState(false);
  const [shippingCurrent, setShippingCurrent] = useState<ShippingOption | null>(null);

  const totalWeightGr = useMemo(() => {
    return items.reduce((acc, item) => {
      // Check if weight is number or comes from backend handling
      const w = item.product.weightGr || 1000;
      return acc + w * item.qty;
    }, 0);
  }, [items]);

  // Prepare shipping params
  const shippingParams: ShippingQueryParams | null = useMemo(() => {
    const addr = primary;
    if (!addr || !userId || items.length === 0) return null;
    return {
      origin: "Jakarta",
      destination: addr.city,
      destinationType: "city",
      weightGr: totalWeightGr,
      items: items.map((i) => {
        const selectedVariant = i.product.variants.find((v) => v.id === i.variantId);
        return {
          name: i.product.name,
          variant_name: selectedVariant?.name || "Default",
          price:
            typeof i.product.price === "string" ? parseInt(i.product.price.replace(/[^\d]/g, "") || "0") : i.product.price || 0,
          weight: i.product.weightGr || 1000,
          quantity: i.qty,
        };
      }),
    };
  }, [primary, userId, items, totalWeightGr]);

  // Items for API (match structure)
  const shippingItems = useMemo(() => {
    return items.map((i) => {
      const selectedVariant = i.product.variants.find((v) => v.id === i.variantId);
      return {
        name: i.product.name,
        variant: { name: selectedVariant?.name || "Default" },
        price:
          typeof i.product.price === "string" ? parseInt(i.product.price.replace(/[^\d]/g, "") || "0") : i.product.price || 0,
        weight: i.product.weightGr || 1000,
        quantity: i.qty,
      };
    });
  }, [items]);

  const { data: shippingData, loading: shippingLoading } = useShippingQuotes(
    !!shippingParams,
    shippingParams,
    userId,
    shippingItems
  );

  useEffect(() => {
    if (shippingData && !shippingCurrent) {
      const flat = shippingData.groups.flatMap((g) => g.items);
      const cheapest = flat.length ? [...flat].sort((a, b) => a.price - b.price)[0] : null;
      if (cheapest) setShippingCurrent(cheapest);
    }
  }, [shippingData, shippingCurrent]);

  // voucher
  const selectedCount = itemsCount;
  const hasPackage = false;

  const [promoVouchers, setPromoVouchers] = useState<Voucher[]>([]);
  const [shippingVouchers, setShippingVouchers] = useState<Voucher[]>([]);

  const [openVoucher, setOpenVoucher] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherSelection>({
    shippingId: null,
    promoId: null,
    code: undefined,
  });
  const [codeVoucher, setCodeVoucher] = useState<Voucher | null>(null);

  // Load vouchers on mount
  useEffect(() => {
    getVouchers().then((res) => {
      if (res.success && res.data) {
        setPromoVouchers(res.data.filter((v) => v.type === "promo"));
        setShippingVouchers(res.data.filter((v) => v.type === "shipping"));
      }
    });
  }, []);

  const ctx = useMemo<CartCtx>(
    () => ({
      subtotal,
      selectedCount,
      regionTag: getRegionTag(primary),
      hasPackage,
    }),
    [subtotal, selectedCount, primary, hasPackage]
  );
  const availableShipping = useMemo(() => decorateVouchers(shippingVouchers, ctx), [shippingVouchers, ctx]);
  const availablePromos = useMemo(() => decorateVouchers(promoVouchers, ctx), [promoVouchers, ctx]);

  async function onRedeemCode(codeUpper: string) {
    const res = await checkVoucherCode(codeUpper, subtotal, items, ctx.regionTag);
    if (res.success && res.voucher) {
      setCodeVoucher(res.voucher);
      return { ok: true as const, voucher: res.voucher };
    }
    return { ok: false as const, reason: res.message || "Kode tidak valid" };
  }

  /* totals */
  const shippingDiscount = useMemo(() => {
    let ship: Voucher | null = null;
    if (selectedVoucher.shippingId) {
      ship =
        availableShipping.find((x) => x.id === selectedVoucher.shippingId) ??
        (codeVoucher?.type === "shipping" && codeVoucher.id === selectedVoucher.shippingId ? codeVoucher : null);
    }
    if (!ship && selectedVoucher.code && codeVoucher?.type === "shipping") {
      ship = codeVoucher;
    }
    return computeShippingDiscountFrom(ship);
  }, [selectedVoucher, availableShipping, codeVoucher]);

  const promoDiscountList = useMemo(() => {
    const promoFromList = selectedVoucher.promoId
      ? availablePromos.find((x) => x.id === selectedVoucher.promoId) ?? null
      : null;
    return computePromoDiscountFrom(promoFromList, subtotal);
  }, [selectedVoucher.promoId, availablePromos, subtotal]);

  const promoDiscountCode = useMemo(() => {
    const codeIsPromoNotInList =
      !!selectedVoucher.code &&
      codeVoucher?.type === "promo" &&
      (!selectedVoucher.promoId || selectedVoucher.promoId !== codeVoucher.id);

    return codeIsPromoNotInList ? computePromoDiscountFrom(codeVoucher, subtotal) : 0;
  }, [selectedVoucher.code, selectedVoucher.promoId, codeVoucher, subtotal]);

  // >>> Shipping fee & grand total (CAP diskon ongkir)
  const shippingFee = shippingCurrent?.price ?? 0;

  // diskon ongkir yang dihitung dari voucher (bisa > fee)
  // -- cap agar tidak melebihi ongkir yang dibayar
  const shippingDiscountCapped = Math.min(Math.max(0, shippingDiscount), shippingFee);

  const shippingAfter = Math.max(0, shippingFee - shippingDiscountCapped);

  const grandTotal = Math.max(0, subtotal + shippingAfter - promoDiscountList - promoDiscountCode);



  /* UI compose */
  return (
    <>
      {/* Address Section */}
      <AddressCardMobile
        label={addressLabel}
        onOpen={() => setOpenAddress(true)}
        loading={switching || addressLoading}
      />

      <main className="px-5 py-4 space-y-6">

        {checkoutSession?.orderExpiresAt && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 opacity-70">Waktu Terbatas</span>
              <span className="text-sm text-amber-900 font-bold">Batas Waktu:</span>
            </div>
            <PaymentTimer expiresAt={checkoutSession.orderExpiresAt} />
          </div>
        )}

        <div className="space-y-6">
          <SellerCartCard
            items={items}
            current={shippingCurrent}
            loading={shippingLoading}
            openShipping={() => setOpenShipping(true)}
            variant="mobile"
          />

          <section className="bg-transparent">
            <button
              onClick={() => setOpenVoucher(true)}
              className="w-full px-5 py-4 text-left flex items-center justify-between active:bg-gray-50 transition-colors rounded-2xl"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1">Loyalty & Reward</span>
                <span className="text-sm font-bold text-gray-900">Voucher & Promo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  {(selectedVoucher.shippingId ? 1 : 0) +
                    (selectedVoucher.promoId ? 1 : 0) +
                    (selectedVoucher.code?.trim() ? 1 : 0)}{" "}
                  Terpakai
                </span>
              </div>
            </button>
          </section>

          <OrderSummaryMobile
            itemsCount={itemsCount}
            subtotal={subtotal}
            shippingFee={shippingFee}
            shippingLoading={shippingLoading}
            shippingDiscount={shippingDiscountCapped}
            promoDiscountList={promoDiscountList}
            promoDiscountCode={promoDiscountCode}
            grandTotal={grandTotal}
            onCheckout={async () => {
              try {
                if (!userId || !shippingCurrent || !primary) {
                  toast.error("Mohon lengkapi alamat dan pengiriman");
                  return;
                }

                // 1. Get existing order ID from URL params (support both oid and tx)
                const orderId = searchParams.get("oid") || searchParams.get("tx");
                if (!orderId) {
                  toast.error("Order tidak ditemukan. Silakan checkout ulang dari cart.");
                  return;
                }

                // 2. Update order with complete address and shipping info
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

                const addr = primary;
                if (!addr) throw new Error("Alamat belum dipilih");

                const updatePayload = {
                  address_id: addr.id,
                  courier: shippingCurrent.courier,
                  shipping_service: shippingCurrent.service,
                  shipping_cost: shippingAfter, // Net cost after discount
                  original_shipping_cost: shippingCurrent.price, // Base price before discount
                  discount: promoDiscountList + promoDiscountCode, // Total promo discount
                  total_amount: grandTotal,
                };

                const updateRes = await fetch(`${API_URL}/orders/${orderId}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updatePayload),
                });

                if (!updateRes.ok) throw new Error("Gagal mengupdate pesanan");

                // 3. Create Payment
                const { createPayment } = await import("@features/payment/services/paymentService");
                const paymentRes = await createPayment(orderId);

                // 4. Redirect to DOKU
                if (paymentRes.payment_url) {
                  sessionStorage.removeItem("pending_order_id");
                  window.location.href = paymentRes.payment_url;
                } else {
                  toast.error("Gagal mendapatkan link pembayaran");
                }
              } catch (e: unknown) {
                toast.error(e instanceof Error ? e.message : "Terjadi kesalahan tidak diketahui");
              }
            }}
          />
        </div>

        <div className="h-24" />
      </main>

      {/* Modals: Address / Shipping / Voucher (tanpa perubahan) */}
      <AddressModal
        isOpen={openAddress}
        onClose={() => setOpenAddress(false)}
        options={listEntries}
        selectedId={primary?.id ?? null}
        onConfirm={(id) => {
          startAddressSwitch(700);
          selectPrimary(id);
          setOpenAddress(false);
          toast.success("Alamat pengiriman terpilih");
        }}
        onAddNew={() => {
          const url = window.location.pathname + window.location.search;
          router.push(`/account/address/new?redirect=${encodeURIComponent(url)}`);
        }}
        onEdit={(id) => {
          const url = window.location.pathname + window.location.search;
          router.push(`/account/address/edit/${id}?redirect=${encodeURIComponent(url)}`);
        }}
      />

      {shippingData && (
        <ShippingModal
          open={openShipping}
          onClose={() => setOpenShipping(false)}
          data={shippingData}
          selectedId={shippingCurrent?.id ?? null}
          onConfirm={(opt) => {
            setShippingCurrent(opt);
            setOpenShipping(false);
            toast.success("Layanan pengiriman terpilih");
          }}
        />
      )}

      <VoucherModal
        open={openVoucher}
        onClose={() => setOpenVoucher(false)}
        loading={voucherLoading}
        shipping={availableShipping}
        promos={availablePromos}
        initialSelected={selectedVoucher}
        onRedeemCode={onRedeemCode}
        onApply={(payload) => {
          const shipOk = !payload.shippingId || availableShipping.some((v) => v.id === payload.shippingId && v.enabled);
          const promoOk = !payload.promoId || availablePromos.some((v) => v.id === payload.promoId && v.enabled);
          if (!shipOk || !promoOk) return;

          setVoucherLoading(true);
          setTimeout(() => {
            setSelectedVoucher(payload);
            setVoucherLoading(false);
            setOpenVoucher(false);
            toast.success("Voucher berhasil diterapkan");
          }, 220);
        }}
      />
    </>
  );
}


