// src/app/(site)/(protected)/account/transaction/[id]/page.tsx
import TransactionDetailClient from "@features/transaction/TransactionDetailClient";
import React from "react";


export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  return <TransactionDetailClient id={id} />;
}
