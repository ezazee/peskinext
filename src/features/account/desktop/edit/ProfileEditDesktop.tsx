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
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ubah Profil</h1>
          <p className="text-sm text-gray-500 mt-1">Perbarui informasi pribadi Anda</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-10 px-5 rounded-xl border border-gray-200 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 min-w-[200px]">
          <div className="relative group">
            <Image
              key={form.avatarUrl}
              src={form.avatarUrl || "/images/avatar/default-avatar.jpg"}
              alt={form.name || "User Avatar"}
              width={160}
              height={160}
              className="rounded-full object-cover w-40 h-40 border-4 border-white shadow-md group-hover:shadow-lg transition-shadow"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              <span className="text-white font-semibold text-sm">Ubah</span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm font-semibold text-primary hover:underline hover:text-primary/80"
            >
              {uploading ? "Mengupload..." : "Pilih Foto Baru"}
            </button>
            <p className="text-xs text-gray-400 mt-1">
              Maks. 10MB (JPG/PNG)
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
          />
        </div>

        {/* Form Fields - using grid for layout */}
        <div className="flex-1 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Nama Lengkap">
              <Input value={form.name} onChange={(v) => onChange("name", v)} placeholder="Nama Anda" />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(v) => onChange("email", v)}
                disabled // Email biasanya read-only atau butuh flow khusus
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Nomor Handphone">
              <Input value={form.phone} onChange={(v) => onChange("phone", v)} placeholder="08..." />
            </Field>
            <Field label="Tanggal Lahir">
              <Input
                type="date"
                value={form.birthDate ? new Date(form.birthDate).toISOString().split('T')[0] : ""}
                onChange={(v) => onChange("birthDate", v)}
              />
            </Field>
          </div>
        </div>
      </div>
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
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "date";
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed"
    />
  );
}
