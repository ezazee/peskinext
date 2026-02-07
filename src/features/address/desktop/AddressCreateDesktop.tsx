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
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tambah Alamat Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Lengkapi detail alamat pengiriman Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Informasi Penerima
          </h3>
        </div>

        <Field label="Label Alamat">
          <Input
            value={form.label}
            onChange={(v) => onChange("label", v)}
            placeholder="Contoh: Rumah, Kantor, Kost"
          />
        </Field>

        <div className="hidden md:block"></div> {/* Spacer */}

        <Field label="Nama Penerima">
          <Input
            value={form.recipient}
            onChange={(v) => onChange("recipient", v)}
            placeholder="Nama lengkap penerima"
          />
        </Field>

        <Field label="Nomor Handphone">
          <Input
            value={form.phone}
            onChange={(v) => onChange("phone", v)}
            placeholder="Contoh: 08123456789"
          />
        </Field>

        <div className="col-span-1 md:col-span-2 mt-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Detail Lokasi
          </h3>
        </div>

        <div className="col-span-1 md:col-span-2">
          <Field label="Alamat Lengkap">
            <textarea
              value={form.line1}
              onChange={(e) => onChange("line1", e.target.value)}
              placeholder="Nama jalan, nomor rumah, RT/RW, patokan..."
              className="w-full h-24 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 data-[focus]:bg-white outline-none resize-none"
            />
          </Field>
        </div>

        <Field label="Provinsi">
          <div className="relative">
            <select
              value={selectedProvId}
              onChange={handleProvinceChange}
              className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 pr-8 text-sm font-medium transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer"
            >
              <option value="" disabled>Pilih Provinsi</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
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
              className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 pr-8 text-sm font-medium transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>Pilih Kota/Kabupaten</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
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
              className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 pr-8 text-sm font-medium transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>Pilih Kecamatan</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
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
            placeholder="5 digit kode pos"
          />
        </Field>

        <div className="flex items-end h-full pb-1">
          <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50 w-full hover:border-gray-200 transition-colors cursor-pointer" onClick={() => onChange("isPrimary", !form.isPrimary)}>
            <Toggle
              checked={form.isPrimary}
              onChange={(v) => onChange("isPrimary", v)}
            />
            <span className="text-sm font-medium text-gray-700 select-none">Jadikan Alamat Utama</span>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 px-6 rounded-xl border border-gray-200 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-11 px-8 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {saving ? "Menyimpan..." : "Simpan Alamat"}
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
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">{label}</span>
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
      className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none w-full"
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
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={[
        "w-11 h-6 rounded-full transition-colors relative",
        checked ? "bg-primary" : "bg-gray-300",
      ].join(" ")}
    >
      <span
        className={[
          "block h-4 w-4 bg-white rounded-full absolute top-1 left-1 transition-transform shadow-sm",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
