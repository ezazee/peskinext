// src/app/(site)/(protected)/account/transaction/[id]/page.tsx
import TransactionDetailClient from "@features/transaction/TransactionDetailClient";
import React from "react";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export default function TransactionDetailPage({
  params,
  profile,
}: {
  params: Promise<{ id: string }>;
  profile: ProfileData;
}) {
  const { id } = React.use(params);
  return <TransactionDetailClient id={id} profile={profile} />;
}
