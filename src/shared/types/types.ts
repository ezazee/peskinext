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

export interface Product {
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
}

export interface NavItem {
  name: string;
  icon: ComponentType<{ active?: boolean }>;
  active?: boolean;
}

export interface Banner {
  src: string;
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

/* ===== Shipping Types ===== */
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



// CART 
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