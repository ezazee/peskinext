"use client";

import {
  HomeIcon,
  AllProduct,
  TransactionIcon,
  AccountIcon,
} from "@shared/components/icons";
import type { NavItem } from "@shared/types/types";

export const bottomNavItemsData: NavItem[] = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Produk", href: "/all-product", icon: AllProduct },
  { name: "Transaksi", href: "/transaksi", icon: TransactionIcon },
  { name: "Akun", href: "/akun", icon: AccountIcon },
];
