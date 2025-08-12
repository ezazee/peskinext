import {
  HomeIcon,
  PromoIcon,
  TransactionIcon,
  AccountIcon,
} from "@/components/icons";
import type { NavItem } from "./types";

export const bottomNavItemsData: NavItem[] = [
  { name: "Home", icon: HomeIcon, active: true },
  { name: "Promo", icon: PromoIcon },
  { name: "Transaksi", icon: TransactionIcon },
  { name: "Akun", icon: AccountIcon },
];
