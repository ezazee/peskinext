"use client";

import React from "react";
import type { AccountProfile } from "@shared/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = { initial: AccountProfile };

import { uploadAvatar, updateProfile } from "../../action";
import { useToast } from "@shared/components/ui/Toaster";

export default function ProfileEditDesktop({ initial }: Props) {
  const router = useRouter();
  const toast = useToast();
  // Ensure we map backend 'images' to 'avatarUrl' if coming initially, but 'initial' should already be mapped by parent used by page props
  const [form, setForm] = React.useState<AccountProfile>(initial);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function onChange<K extends keyof AccountProfile>(
    key: K,
    value: AccountProfile[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadAvatar(formData);
    setUploading(false);

    if (res.success && res.imageUrl) {
      onChange("avatarUrl", res.imageUrl);
      toast.success("Foto profil berhasil diupload");
    } else {
      toast.error(res.error || "Gagal upload foto");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await updateProfile(form);

    setSaving(false);

    if (res.success) {
      toast.success("Profil berhasil diperbarui");
      // Notify other components (Header) to refresh user data
      window.dispatchEvent(new Event("profileUpdated"));
      router.push("/account");
      router.refresh(); // Refresh to ensure data is consistent
    } else {
      toast.error(res.error || "Gagal menyimpan profil");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-[280px_1fr] gap-6">
      <aside className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex flex-col items-center">
          <Image
            key={form.avatarUrl} // Force re-render
            src={form.avatarUrl || "/images/avatar/default-avatar.jpg"}
            alt={form.name || "User Avatar"}
            width={160}
            height={160}
            className="rounded-full object-cover w-40 h-40 border"
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-3 h-10 w-full rounded-lg border font-semibold hover:bg-gray-50 flex items-center justify-center"
          >
            {uploading ? "Mengupload..." : "Ubah Foto"}
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Maks 10MB · JPG/PNG/WEBP
          </p>
        </div>
      </aside>

      <main className="bg-white rounded-xl border p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Ubah Biodata</h1>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Nama">
            <Input value={form.name} onChange={(v) => onChange("name", v)} />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(v) => onChange("email", v)}
            />
          </Field>
          <Field label="Nomor HP">
            <Input value={form.phone} onChange={(v) => onChange("phone", v)} />
          </Field>
          <Field label="Tanggal Lahir">
            <Input
              type="date"
              value={form.birthDate ? new Date(form.birthDate).toISOString().split('T')[0] : ""}
              onChange={(v) => onChange("birthDate", v)}
            />
          </Field>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="h-11 px-6 rounded-lg bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="h-11 px-6 rounded-lg border font-semibold hover:bg-gray-50"
          >
            Batal
          </button>
        </div>
      </main>
    </form>
  );
}

/* ---------- UI kecil ---------- */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "date";
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
    />
  );
}
