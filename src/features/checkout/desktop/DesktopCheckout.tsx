// src/features/checkout/desktop/DesktopCheckout.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  CartData,
  Voucher,
  VoucherSelection,
  VoucherConditions,
  CheckoutSession,
} from "@shared/types/types";

import AddressCard from "./AddressCard";
import SellerCartCard from "../components/SellerCartCard";
import PaymentMethodsDesktop from "./PaymentMethodsDesktop";
import OrderSummaryDesktop from "./OrderSummaryDesktop";

import VoucherCard from "@features/checkout/desktop/VoucherCard";
import VoucherModal from "@features/checkout/desktop/VoucherModal";
import { evaluateVoucher } from "@features/cart/lib/voucher";
import { getVouchers, checkVoucherCode } from "@features/voucher/action";
import {
  type CartCtx,
} from "@features/cart/utils/redeemWithFallback";

import ShippingModal from "./ShippingModal";
import type {
  ShippingOption,
} from "@shared/types/types";
import { useAddressBook } from "@features/address/useAddressBook";
import { useShippingQuotes } from "@features/shiping/hooks/useShippingQuotes";
import { getCurrentUser } from "@features/auth/action";
import type { ShippingQueryParams } from "@features/shiping/hooks/useShippingParamsForProduct";

/* ---------------- helpers voucher ---------------- */
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
    if (["rb", "ribu", "k"].includes(suf)) return base * 1_000;
    if (["jt", "juta"].includes(suf)) return base * 1_000_000;
    return base;
  }
  m = s.match(/(\d+)\s*(rb|ribu|k|jt|juta)/i);
  if (m && m[1] && m[2]) {
    const n = parseInt(m[1], 10) || 0;
    const suf = m[2].toLowerCase();
    return ["rb", "ribu", "k"].includes(suf) ? n * 1_000 : n * 1_000_000;
  }
  return 0;
}
function parsePercent(text?: string): number | null {
  if (!text) return null;
  const m = text.match(/(\d{1,3})\s*%/);
  return m && m[1] ? Math.min(100, Math.max(0, parseInt(m[1], 10))) : null;
}
const looksLikeDisc = (t?: string) =>
  !!t && /(hemat|potong|s\/d|sd|gratis|ongkir|diskon)/i.test(t);

function computeShippingDiscountFrom(v?: Voucher | null): number {
  if (!v) return 0;
  const tryTexts: (string | undefined)[] = [
    v.savingLabel,
    v.title,
    looksLikeDisc(v.subtitle) ? v.subtitle : undefined,
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
  if (pct <= 0) return 0;
  const raw = Math.floor((subtotal * pct) / 100);
  return Math.max(0, Math.min(raw, cap, subtotal));
}

/* ---------------- component ---------------- */
export default function DesktopCheckout({
  initialCart = { items: [] },
  checkoutSession,
}: {
  initialCart?: CartData;
  checkoutSession?: CheckoutSession | null;
}) {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setUserId(u.id);
    });
  }, []);

  // Convert checkoutSession.lines to cart items format if session exists
  const selectedItems = useMemo(() => {
    if (checkoutSession?.lines) {
      // Convert CheckoutLine[] to CartItem[] format
      return checkoutSession.lines.map((line) => ({
        id: `checkout-${line.productId}-${line.variantId}`,
        product: {
          id: line.productId,
          name: line.name.split(' - ')[0] || line.name,
          slug: line.productId,
          img: line.image,
          price: `Rp${line.price.toLocaleString('id-ID')}`,
          variants: [{
            id: Number(line.variantId),
            name: line.name.split(' - ')[1] || 'Default',
            price: line.price,
            stock: 999
          }],
          // Dummy fields required by Product type
          description: '',
          ingredients: [],
          howToUse: [],
          category: '',
          sku: '',
          imgHover: line.image,
          galleryImages: [line.image],
          isFlashSale: false,
          isEvent: false,
          type: 'single' as const,
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
    return chosen.length > 0 ? chosen : safeItems;
  }, [checkoutSession, initialCart]);

  const itemsCount = selectedItems.length;

  // subtotal
  const subtotal = useMemo(() => {
    let sum = 0;
    for (const line of selectedItems) {
      const v = line.product.variants.find((x) => x.id === line.variantId);
      const unit =
        typeof v?.price === "number"
          ? v.price
          : Number((line.product.price || "0").replace(/[^\d]/g, "")) || 0;
      sum += unit * line.qty;
    }
    return sum;
  }, [selectedItems]);

  // alamat untuk tujuan shipping
  // alamat untuk tujuan shipping
  const { primary } = useAddressBook();

  const totalWeightGr = useMemo(() => {
    return selectedItems.reduce((acc, item) => {
      const w = item.product.weightGr || 1000;
      return acc + (w * item.qty);
    }, 0);
  }, [selectedItems]);

  // data shipping + pilihan + modal
  const [openShip, setOpenShip] = useState(false);
  const [shipSelected, setShipSelected] = useState<ShippingOption | null>(null);

  // Prepare shipping params
  const shippingParams: ShippingQueryParams | null = useMemo(() => {
    if (!primary || !userId || selectedItems.length === 0) return null;
    return {
      origin: "Jakarta", // This should ideally be dynamic or from store config
      destination: primary.city, // Simplification, hook handles resolving
      destinationType: "city",
      weightGr: totalWeightGr,
      items: selectedItems.map(i => ({
        name: i.product.name,
        variant_name: i.product.variants[0]?.name,
        price: parseInt(i.product.price.replace(/[^\d]/g, "") || "0"),
        weight: i.product.weightGr || 1000,
        quantity: i.qty
      }))
    };
  }, [primary, userId, selectedItems, totalWeightGr]);

  // Items for API matching request body structure in useShippingQuotes
  const shippingItems = useMemo(() => {
    return selectedItems.map(i => ({
      name: i.product.name,
      variant: { name: i.product.variants[0]?.name },
      price: parseInt(i.product.price.replace(/[^\d]/g, "") || "0"),
      weight: i.product.weightGr || 1000,
      quantity: i.qty
    }));
  }, [selectedItems]);

  const { data: shipData, loading: shipLoading } = useShippingQuotes(
    !!shippingParams,
    shippingParams,
    userId,
    shippingItems
  );

  // Auto-select cheapest if nothing selected
  useEffect(() => {
    if (shipData && !shipSelected) {
      const all = shipData.groups.flatMap((g) => g.items);
      const cheapest = all.reduce<ShippingOption | null>(
        (best, cur) => (!best || cur.price < best.price ? cur : best),
        null
      );
      if (cheapest) setShipSelected(cheapest);
    }
  }, [shipData, shipSelected]);

  const openShipping = () => setOpenShip(true);

  // voucher
  const regionTag = "Jabodetabek";
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
        setPromoVouchers(res.data.filter(v => v.type === 'promo'));
        setShippingVouchers(res.data.filter(v => v.type === 'shipping'));
      }
    });
  }, []);

  const ctx = useMemo<CartCtx>(
    () => ({ subtotal, selectedCount: itemsCount, regionTag, hasPackage }),
    [subtotal, itemsCount, regionTag, hasPackage]
  );

  const availableShipping = useMemo(
    () => decorateVouchers(shippingVouchers, ctx),
    [shippingVouchers, ctx]
  );
  const availablePromos = useMemo(
    () => decorateVouchers(promoVouchers, ctx),
    [promoVouchers, ctx]
  );

  const appliedCount =
    (selectedVoucher.shippingId ? 1 : 0) +
    (selectedVoucher.promoId ? 1 : 0) +
    (selectedVoucher.code?.trim() ? 1 : 0);

  const savingText = useMemo(() => {
    const labels: string[] = [];
    if (selectedVoucher.shippingId) {
      const s = availableShipping.find(
        (v) => v.id === selectedVoucher.shippingId
      );
      if (s?.savingLabel) labels.push(s.savingLabel);
    }
    if (selectedVoucher.promoId) {
      const p = availablePromos.find((v) => v.id === selectedVoucher.promoId);
      if (p?.savingLabel) labels.push(p.savingLabel);
    }
    if (selectedVoucher.code && codeVoucher?.savingLabel)
      labels.push(codeVoucher.savingLabel);
    return labels.length ? labels.join(" + ") : undefined;
  }, [selectedVoucher, availableShipping, availablePromos, codeVoucher]);

  async function onRedeemCode(codeUpper: string) {
    const res = await checkVoucherCode(codeUpper, subtotal, selectedItems);
    if (res.success && res.voucher) {
      setCodeVoucher(res.voucher);
      return { ok: true as const, voucher: res.voucher };
    }
    return { ok: false as const, reason: res.message || "Kode tidak valid" };
  }

  // ---- summary (fee + discounts + total) ----
  const shippingFee = shipSelected?.price ?? 0;

  const {
    shippingDiscount,
    promoDiscountList,
    promoDiscountCode,
    grandTotal,
  } = useMemo(() => {
    // SHIPPING DISCOUNT
    let shipVoucher: Voucher | null = null;
    if (selectedVoucher.shippingId) {
      shipVoucher =
        availableShipping.find((x) => x.id === selectedVoucher.shippingId) ??
        (codeVoucher?.type === "shipping" &&
          codeVoucher.id === selectedVoucher.shippingId
          ? codeVoucher
          : null);
    }
    if (!shipVoucher && selectedVoucher.code && codeVoucher?.type === "shipping") {
      shipVoucher = codeVoucher;
    }
    const shippingDiscountRaw = computeShippingDiscountFrom(shipVoucher);

    // cap diskon ongkir agar tidak melebihi harga ongkir
    const shippingDiscCapped = Math.min(
      shipSelected?.price ?? 0,
      Math.max(0, shippingDiscountRaw)
    );

    // PROMO DISCOUNTS
    const promoFromList = selectedVoucher.promoId
      ? availablePromos.find((x) => x.id === selectedVoucher.promoId) ?? null
      : null;
    const promoDiscountList = computePromoDiscountFrom(promoFromList, subtotal);

    const codeIsPromoNotInList =
      !!selectedVoucher.code &&
      codeVoucher?.type === "promo" &&
      (!selectedVoucher.promoId || selectedVoucher.promoId !== codeVoucher.id);
    const promoDiscountCode = codeIsPromoNotInList
      ? computePromoDiscountFrom(codeVoucher, subtotal)
      : 0;

    // GRAND TOTAL: subtotal + ongkir - (semua diskon)
    const totalDisc =
      shippingDiscCapped +
      Math.max(0, promoDiscountList) +
      Math.max(0, promoDiscountCode);

    const grandTotal = Math.max(
      0,
      subtotal + (shipSelected?.price ?? 0) - totalDisc
    );

    return {
      shippingDiscount: shippingDiscCapped,
      promoDiscountList,
      promoDiscountCode,
      grandTotal,
    };
  }, [
    subtotal,
    selectedVoucher,
    availableShipping,
    availablePromos,
    codeVoucher,
    shipSelected?.price,
  ]);

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-0 my-6 grid grid-cols-12 gap-6">
        {/* LEFT */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-gray-200/70 bg-white"><AddressCard /></div>
          <div className="rounded-2xl border border-gray-200/70 bg-white">
            <SellerCartCard
              items={selectedItems}
              current={shipSelected}
              loading={shipLoading}
              openShipping={openShipping}
              variant="desktop"
            />
          </div>
        </section>

        {/* RIGHT */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
              <VoucherCard
                selectable={itemsCount > 0}
                onOpen={() => setOpenVoucher(true)}
                loading={voucherLoading}
                appliedCount={appliedCount}
                savingText={savingText}
              />
            </div>

            <div className="rounded-2xl border border-gray-200/70 bg-white">
              <PaymentMethodsDesktop />
            </div>

            <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
              <OrderSummaryDesktop
                itemsCount={itemsCount}
                subtotal={subtotal}
                shippingFee={shippingFee}
                shippingDiscount={shippingDiscount}
                promoDiscountList={promoDiscountList}
                promoDiscountCode={promoDiscountCode}
                grandTotal={grandTotal}
                hasShippingSelected={!!shipSelected}
                onCheckout={async () => {
                  try {
                    if (!userId || !shipSelected || !primary) {
                      alert("Mohon lengkapi alamat dan pengiriman");
                      return;
                    }

                    // 1. Get existing order ID from URL params (support both oid and tx)
                    const orderId = searchParams.get('oid') || searchParams.get('tx');
                    if (!orderId) {
                      alert("Order tidak ditemukan. Silakan checkout ulang dari cart.");
                      return;
                    }

                    console.log("✅ Using existing order:", orderId);

                    // 2. Update order with complete address and shipping info
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

                    // Calculate net shipping cost (after discount)
                    const shippingDiscountCapped = Math.min(Math.max(0, shippingDiscount), shippingFee);
                    const netShippingCost = Math.max(0, shippingFee - shippingDiscountCapped);

                    const updatePayload = {
                      address_id: primary.id,
                      courier: shipSelected.courier,
                      shipping_service: shipSelected.service,
                      shipping_cost: netShippingCost, // Net cost after discount
                      original_shipping_cost: shipSelected.price, // Base price before discount
                      discount: promoDiscountList + promoDiscountCode, // Total promo discount
                      total_amount: grandTotal
                    };

                    const updateRes = await fetch(`${API_URL}/orders/${orderId}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(updatePayload)
                    });

                    if (!updateRes.ok) throw new Error("Gagal update order");
                    console.log("✅ Order updated with shipping info");

                    // 3. Create Payment
                    const { createPayment } = await import("@features/payment/services/paymentService");
                    const paymentRes = await createPayment(orderId);

                    // 4. Redirect to DOKU
                    if (paymentRes.payment_url) {
                      // Clear order ID from sessionStorage after successful payment creation
                      sessionStorage.removeItem('pending_order_id');
                      window.location.href = paymentRes.payment_url;
                    } else {
                      alert("Gagal mendapatkan link pembayaran");
                    }

                  } catch (e: unknown) {
                    if (e instanceof Error) {
                      alert(e.message);
                    } else {
                      alert("Terjadi kesalahan tidak diketahui");
                    }
                  }
                }}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* MODALS */}
      <VoucherModal
        open={openVoucher}
        onClose={() => setOpenVoucher(false)}
        loading={voucherLoading}
        shipping={availableShipping}
        promos={availablePromos}
        initialSelected={selectedVoucher}
        onRedeemCode={onRedeemCode}
        onApply={(payload) => {
          const shipOk =
            !payload.shippingId ||
            availableShipping.some(
              (v) => v.id === payload.shippingId && v.enabled
            );
          const promoOk =
            !payload.promoId ||
            availablePromos.some((v) => v.id === payload.promoId && v.enabled);
          if (!shipOk || !promoOk) return;

          setVoucherLoading(true);
          setTimeout(() => {
            setSelectedVoucher(payload);
            setVoucherLoading(false);
            setOpenVoucher(false);
          }, 220);
        }}
      />

      {shipData && (
        <ShippingModal
          open={openShip}
          onClose={() => setOpenShip(false)}
          data={shipData}
          selectedId={shipSelected?.id ?? null}
          onConfirm={(opt) => {
            setShipSelected(opt);
            setOpenShip(false);
          }}
        />
      )}
    </>
  );
}

// Helper to create order (mock for now if not exists, or verify if existing action exists)


