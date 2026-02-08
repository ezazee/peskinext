"use client";

import React from "react";
import type { AccountProfile } from "@shared/types/types";
import { useRouter } from "next/navigation";
import { Avatar } from "@shared/components/ui/Avatar";

type Props = { initial: AccountProfile };

import { updateProfile } from "../../action";
import { useToast } from "@shared/components/ui/Toaster";
// import { Camera } from "lucide-react";

export default function ProfileEditMobile({ initial }: Props) {
  const router = useRouter();
  const toast = useToast();
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

    // Limit to 2MB for Base64 storage performance
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange("avatarUrl", base64String);
      setUploading(false);
      toast.success("Foto berhasil dipilih. Klik Simpan untuk menerapkan.");
    };
    reader.onerror = () => {
      toast.error("Gagal membaca file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await updateProfile(form);

    setSaving(false);

    if (res.success) {
      toast.success("Profil tersimpan");
      // Notify other components (Header) to refresh user data
      window.dispatchEvent(new Event("profileUpdated"));
      router.push("/account");
      router.refresh();
    } else {
      toast.error(res.error || "Gagal menyimpan");
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar
            key={form.avatarUrl} // Force re-render when URL changes
            name={form.name}
            avatarUrl={form.avatarUrl || "/images/avatar/default-avatar.jpg"}
            size="lg"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-md hover:bg-primary/90"
          >
            {/* If Lucide not available, use simple icon or text */}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
          />
        </div>

        <div className="text-sm text-gray-600">
          <div className="font-semibold text-gray-900">{form.name}</div>
          <div>{form.email}</div>
          <div className="text-xs text-primary mt-1">{uploading ? "Mengupload..." : "Ganti Foto"}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
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

      <div className="mt-5 grid gap-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="h-11 rounded-lg bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-11 rounded-lg border font-semibold"
        >
          Batal
        </button>
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
    <label className="grid gap-1">
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