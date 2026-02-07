import React, { type JSX } from "react";
import type { AddressItem } from "@shared/types/types";

type Props = {
  form: AddressItem;
  saving: boolean;
  onChange: <K extends keyof AddressItem>(k: K, v: AddressItem[K]) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function AddressCreateMobile({
  form,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: Props): JSX.Element {
  /* --- LOCATION STATES --- */
  const [provinces, setProvinces] = React.useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = React.useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = React.useState<{ id: string; name: string }[]>([]);

  // Selected IDs (internal state to drive dropdowns)
  const [selectedProvId, setSelectedProvId] = React.useState<string>("");
  const [selectedCityId, setSelectedCityId] = React.useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = React.useState<string>("");

  /* --- LOAD PROVINCES ON MOUNT --- */
  React.useEffect(() => {
    import("@features/location/services/locationService").then(({ getProvinces }) => {
      getProvinces().then(setProvinces);
    });
  }, []);

  /* --- LOAD CITIES WHEN PROVINCE SELECTED --- */
  React.useEffect(() => {
    if (!selectedProvId) {
      setCities([]);
      return;
    }
    // Fetch cities
    import("@features/location/services/locationService").then(({ getRegencies }) => {
      getRegencies(selectedProvId).then(setCities);
    });
  }, [selectedProvId]);

  /* --- LOAD DISTRICTS WHEN CITY SELECTED --- */
  React.useEffect(() => {
    if (!selectedCityId) {
      setDistricts([]);
      return;
    }
    // Fetch districts
    import("@features/location/services/locationService").then(({ getDistricts }) => {
      getDistricts(selectedCityId).then(setDistricts);
    });
  }, [selectedCityId]);

  /* --- HANDLERS --- */
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provId = e.target.value;
    const provName = provinces.find((p) => p.id === provId)?.name || "";

    setSelectedProvId(provId);
    setSelectedCityId(""); // Reset city
    setSelectedDistrictId(""); // Reset district

    onChange("province", provName);
    onChange("city", "");
    onChange("district", "");
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    const cityName = cities.find((c) => c.id === cityId)?.name || "";

    setSelectedCityId(cityId);
    setSelectedDistrictId("");

    onChange("city", cityName);
    onChange("district", "");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distId = e.target.value;
    const distName = districts.find((d) => d.id === distId)?.name || "";

    setSelectedDistrictId(distId);
    onChange("district", distName);
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <h1 className="text-base font-semibold">Tambah Alamat</h1>

      <div className="mt-4 grid grid-cols-1 gap-3">
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

        <Field label="Provinsi">
          <div className="relative">
            <select
              value={selectedProvId}
              onChange={handleProvinceChange}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="" disabled>Pilih Provinsi</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
              </svg>
            </div>
          </div>
        </Field>

        <Field label="Kota/Kabupaten">
          <div className="relative">
            <select
              value={selectedCityId}
              onChange={handleCityChange}
              disabled={!selectedProvId}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            >
              <option value="" disabled>Pilih Kota/Kabupaten</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
              </svg>
            </div>
          </div>
        </Field>

        <Field label="Kecamatan">
          <div className="relative">
            <select
              value={selectedDistrictId}
              onChange={handleDistrictChange}
              disabled={!selectedCityId}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            >
              <option value="" disabled>Pilih Kecamatan</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
              </svg>
            </div>
          </div>
        </Field>

        <Field label="Kode Pos">
          <Input
            value={form.postalCode}
            onChange={(v) => onChange("postalCode", v)}
          />
        </Field>

        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-gray-600">Jadikan alamat utama</span>
          <Toggle
            checked={form.isPrimary}
            onChange={(v) => onChange("isPrimary", v)}
          />
        </div>
      </div>

      <div className="sticky bottom-0 mt-5 flex gap-2 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md py-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 h-11 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-11 px-4 rounded-lg border text-sm font-semibold hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

/* UI kecil (mobile) */
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
