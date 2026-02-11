// src/app/(site)/(protected)/account/transaction/[id]/page.tsx
import TransactionDetailClient from "@features/transaction/TransactionDetailClient";
import React from "react";

// Force dynamic rendering to prevent caching of review data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  return <TransactionDetailClient id={id} />;
}
