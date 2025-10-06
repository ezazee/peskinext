"use client";

import React from "react";
import type { AccountProfile } from "@shared/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = { initial: AccountProfile };

export default function ProfileEditMobile({ initial }: Props) {
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
    // simulasi save (local only)
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    router.push("/account"); // kembali
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-3">
        <Image
          src={form.avatarUrl}
          alt={form.name}
          width={56}
          height={56}
          className="rounded-full object-cover w-14 h-14"
        />
        <div className="text-sm text-gray-600">
          <div className="font-semibold text-gray-900">{form.name}</div>
          <div>{form.email}</div>
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
            value={form.birthDate ?? ""}
            onChange={(v) => onChange("birthDate", v)}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-2">
        <button
          type="submit"
          disabled={saving}
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