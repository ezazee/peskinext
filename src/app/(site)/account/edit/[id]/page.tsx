// src/app/(site)/account/edit/[id]/page.tsx
import { accountData } from "@data/account";
import EditAccountClient from "./client";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditAccountPage({ params }: PageProps) {
  const { id } = await params;

  // valid jika cocok dengan salah satu dari id yang kita pakai
  const validIds: string[] = [
    accountData.profile.id,
    // @ts-expect-error: publicId opsional di mock (hapus baris ini kalau kamu tidak pakai publicId)
    accountData.publicId,
  ].filter(Boolean);

  const exists = validIds.includes(id);

  return <EditAccountClient exists={exists} profile={accountData.profile} />;
}
