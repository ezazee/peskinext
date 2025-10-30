// src/features/transaction/data.ts
"use client";

import type {
  OrderItem,
  UserTransaction,
  TransactionStatus,
} from "@shared/types/types";
import { productsData } from "./products";

// "Rp144.000" -> 144000
function parseIDR(idr: string): number {
  return Number(idr.replace(/[^\d]/g, "")) || 0;
}

function item(
  productIndex: number,
  qty: number,
  variantId?: number
): OrderItem {
  const p = productsData[productIndex];
  if (!p) throw new Error(`Product with index ${productIndex} not found`);
  const unit = parseIDR(p.price);
  return {
    product: {
      id: p.id,
      name: p.name,
      slug: p.slug,
      img: p.img,
      type: p.type,
      weightGr: p.weightGr,
    },
    variantId,
    quantity: qty,
    unitPrice: unit,
    subtotal: unit * qty,
  };
}

// BASE tanpa "total", SEKARANG menyertakan addressId
const base: Array<Omit<UserTransaction, "total">> = [
  {
    id: "INV-001",
    dateISO: "2025-10-05T09:00:00.000Z",
    status: "pending" as TransactionStatus,
    addressId: "addr_home", // ← tambahkan
    items: [item(0, 1, 1), item(1, 1, 5)],
  },
  {
    id: "INV-002",
    dateISO: "2025-10-02T10:30:00.000Z",
    status: "paid" as TransactionStatus,
    addressId: "addr_bekasi", // ← tambahkan
    items: [item(2, 2, 9)],
  },
  {
    id: "INV-003",
    dateISO: "2025-09-29T14:20:00.000Z",
    status: "shipped" as TransactionStatus,
    addressId: "addr_office", // ← tambahkan
    items: [item(3, 1, 13), item(4, 1, 17)],
  },
  {
    id: "INV-004",
    dateISO: "2025-09-25T16:00:00.000Z",
    status: "delivered" as TransactionStatus,
    addressId: "addr_home", // ← tambahkan
    items: [item(5, 1, 21)],
  },
  {
    id: "INV-005",
    dateISO: "2025-09-21T11:00:00.000Z",
    status: "cancelled" as TransactionStatus,
    addressId: "addr_warehouse_garut", // ← tambahkan
    items: [item(6, 1, 25)],
  },
];

// hitung total
export const transactionsMock: UserTransaction[] = base.map((t) => ({
  ...t,
  total: t.items.reduce((s, i) => s + i.subtotal, 0),
}));
