"use client";

type Props = { selectable: boolean };

export default function VoucherCard({ selectable }: Props) {
  const disabled = !selectable;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold mb-2">Voucher &amp; promo</h3>
      <button
        type="button"
        aria-disabled={disabled}
        disabled={disabled}
        className={`w-full h-11 rounded-lg border transition
          ${
            disabled
              ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-50 cursor-pointer"
          }`}
      >
        {disabled ? "Pilih produk sebelum pakai promo" : "Pilih voucher"}
      </button>
    </div>
  );
}
