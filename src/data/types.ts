// File: src/data/types.ts

import type { ComponentType } from "react";

export interface Category {
  name: string;
  img: string;
}

export interface Product {
  name: string;
  slug: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  img: string;
  imgHover: string;
  isFlashSale: boolean;
  type: "single" | "bundle";
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