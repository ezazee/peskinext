import React, { type JSX } from "react";
import type { AddressItem } from "@shared/types/types";

type Props = {
  form: AddressItem;
  saving: boolean;
  onChange: <K extends keyof AddressItem>(k: K, v: AddressItem[K]) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function AddressCreateDesktop({
  form,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: Props): JSX.Element {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <h1 className="text-base md:text-lg font-semibold">Tambah Alamat</h1>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Label">
          <Input
            value={form.label}
            onChange={(v) => onChange("label", v)}
            placeholder="Rumah / Kantor / Gudang"
          />
        </Field>
        <Field label="Penerima">
          <Input
            value={form.recipient}
            onChange={(v) => onChange("recipient", v)}
          />
        </Field>

        <Field label="No. HP">
          <Input value={form.phone} onChange={(v) => onChange("phone", v)} />
        </Field>
        <Field label="Alamat (Jalan/Detail)">
          <Input value={form.line1} onChange={(v) => onChange("line1", v)} />
        </Field>

        <Field label="Kota/Kabupaten">
          <Input value={form.city} onChange={(v) => onChange("city", v)} />
        </Field>
        <Field label="Provinsi">
          <Input
            value={form.province}
            onChange={(v) => onChange("province", v)}
          />
        </Field>

        <Field label="Kode Pos">
          <Input
            value={form.postalCode}
            onChange={(v) => onChange("postalCode", v)}
          />
        </Field>

        <div className="flex items-center gap-3 md:justify-start">
          <span className="text-sm text-gray-600">Jadikan alamat utama</span>
          <Toggle
            checked={form.isPrimary}
            onChange={(v) => onChange("isPrimary", v)}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center justify-center px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-11 items-center justify-center px-5 rounded-lg border text-sm font-semibold hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

/* UI kecil */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): JSX.Element {
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
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}): JSX.Element {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}): JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "w-12 h-7 rounded-full transition-colors",
        checked ? "bg-black" : "bg-gray-300",
      ].join(" ")}
    >
      <span
        className={[
          "block h-6 w-6 bg-white rounded-full translate-x-1 transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}
