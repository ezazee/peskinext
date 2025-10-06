"use client";

import React from "react";
import type { AccountProfile } from "@shared/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = { initial: AccountProfile };

export default function ProfileEditDesktop({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = React.useState<AccountProfile>(initial);
  const [saving, setSaving] = React.useState<boolean>(false);

  function onChange<K extends keyof AccountProfile>(
    key: K,
    value: AccountProfile[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700)); // simulasi save
    setSaving(false);
    router.push("/account");
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-[280px_1fr] gap-6">
      <aside className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex flex-col items-center">
          <Image
            src={form.avatarUrl}
            alt={form.name}
            width={160}
            height={160}
            className="rounded-full object-cover w-40 h-40"
          />
          <button
            type="button"
            className="mt-3 h-10 w-full rounded-lg border font-semibold"
          >
            Ubah Foto
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Maks 10MB · JPG/PNG
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
              value={form.birthDate ?? ""}
              onChange={(v) => onChange("birthDate", v)}
            />
          </Field>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-6 rounded-lg bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="h-11 px-6 rounded-lg border font-semibold"
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
