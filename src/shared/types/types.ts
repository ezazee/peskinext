// File: src/data/types.ts

import type { ComponentType } from "react";

export interface Category {
  name: string;
  img: string;
}

export interface Variant {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
}

export interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<{ active?: boolean }>;
  active?: boolean;
}

export interface Banner {
  src: string;
  mobileSrc?: string;
  alt: string;
  href?: string;
}

export interface PromoShowcaseProps {
  title?: string;
  carousel: Banner[];
  tiles: Banner[];
  autoPlayMs?: number;
}

export type EventPromoProps = {
  voucherCode?: string;
  headline?: string;
  subhead?: string;
};

export type Review = {
  id: number;
  user: string;
  variant: string;
  comment: string;
  images: string[];
  rating: number;
  date: string;
  productSlug: string;
};

export type DesktopDetailProps = {
  product: Product;
  isLoading: boolean;
  hasDiscount: boolean;
  priceNumber: number;
  oldPriceNumber: number;
};

export interface MobileDetailProps {
  product: Product;
  hasDiscount: boolean;
  priceNumber: number;
  oldPriceNumber: number;
  isLoading: boolean;
}

/* ================= Shiping ================= */
export type ShippingOption = {
  id: string;
  courier: string;
  service: string;
  eta: string;
  price: number;
  badges?: string[];
};

export type ShippingGroup = {
  label: string;
  items: ShippingOption[];
};

export type ShippingDetailData = {
  origin: string;
  destination: string;
  weightGr: number;
  note?: string;
  groups: ShippingGroup[];
};

/* ================= CART ================= */
export type CartItem = {
  id: string;
  product: Product;
  variantId: Variant["id"];
  qty: number;
  selected: boolean;
};

/** Payload cart yang dikirim ke komponen */
export type CartData = {
  items: CartItem[];
};

/* ================= VOUCHER ================= */

export type VoucherType = "shipping" | "promo";

export type VoucherConditions = {
  minSubtotal?: number;
  minSelectedItems?: number;
  regions?: string[];
  requirePackage?: boolean;
  validFrom?: string;
};

export type Voucher = {
  id: string;
  title: string;
  subtitle?: string;
  type: VoucherType;
  enabled: boolean;
  savingLabel?: string;
  code?: string;
  validTo?: string;
  conditions?: VoucherConditions;
};

export type VoucherSelection = {
  code?: string;
  shippingId?: string | null;
  promoId?: string | null;
};

export type RedeemResult =
  | { ok: true; voucher: Voucher }
  | { ok: false; reason: string };

/* ================= Checkout ================= */

export type CheckoutSource = "cart" | "buy_now";

export interface CheckoutLine {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  qty: number;
  price: number; // snapshot per unit
  weight?: number; // gram
}

export interface CheckoutSession {
  id: string;
  source: CheckoutSource;
  userId?: string | null;
  anonId?: string | null;
  currency: "IDR";
  lines: CheckoutLine[];
  vouchers: string[];
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  createdAt: string;
  expiresAt: string;
}

/* ================= Address ================= */

// src/types/address.ts
export type AddressItem = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  city: string;
  province: string;
  postalCode: string;
  isPrimary: boolean;
};

export type AddressListEntry = {
  id: string;
  label: string;
  address: string; // single-line untuk list di modal/header
  isPrimary: boolean;
};

/* ================= PRODUCT ================= */

export type PriceString = string;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string[];
  howToUse: string[];
  category: string;
  sku: string;
  price: string;
  oldPrice?: string;
  img: string;
  imgHover: string;
  galleryImages: string[];
  isFlashSale: boolean;
  isEvent: boolean;
  type: "single" | "bundle";
  variants: Variant[];
  weightGr: number;
  soldCount?: number;
}

export type BundleVariant = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  stock: number;
};

export type BundleProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  img: string;
  imgHover?: string;
  price: PriceString;
  oldPrice?: PriceString;
  isFlashSale?: boolean;
  isEvent?: boolean;
  type: "bundle";
  weightGr?: number;
  variants?: BundleVariant[];
  galleryImages?: string[];
  sku?: string;
  category?: string;
  ingredients?: string[];
  howToUse?: string[];
};

/* ================= Account ================= */
export type IconName =
  | "address"
  | "orderHistory"
  | "logout"
  | "user";

export interface AccountProfile {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  phone: string;
  birthDate?: string;
}

export interface AccountData {
  profile: AccountProfile;
}


/* ================= Transaction ================= */
export type TransactionStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderProductSnapshot = Pick<
  Product,
  "id" | "name" | "slug" | "img" | "type" | "weightGr"
>;

export interface OrderItem {
  product: OrderProductSnapshot;
  variantId?: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface UserTransaction {
  id: string;
  dateISO: string;
  status: TransactionStatus;
  items: OrderItem[];
  total: number;
  addressId?: string;
}

export type ShippingOrder = {
  courier?: string;
  service?: string;
  trackingNumber?: string;
  eta?: string;
  shippedAt?: string;
  deliveredAt?: string;
};

/* ================= Notification ================= */
export type NotifKind = "transaksi" | "update" | "promo" | "info" | "feed";

export type NotifStatus =
  | "ongoing"
  | "pending_payment"
  | "delivered"
  | "completed";

export type NotificationItem = {
  id: string;
  kind: NotifKind;
  status?: NotifStatus;
  title: string;
  message: string;
  date: string;
  badge?: string;
  action?: { label: string; href: string };
};