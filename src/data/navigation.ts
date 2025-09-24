"use client";

import {
  HomeIcon,
  PromoIcon,
  TransactionIcon,
  AccountIcon,
} from "@shared/components/icons";
import type { NavItem } from "@shared/types/types";

export const bottomNavItemsData: NavItem[] = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Bundle Produk", href: "/bundle", icon: PromoIcon },
  { name: "Transaksi", href: "/transaksi", icon: TransactionIcon },
  { name: "Akun", href: "/akun", icon: AccountIcon },
];
