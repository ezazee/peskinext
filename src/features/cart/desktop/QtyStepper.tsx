"use client";
import { IconMinus, IconPlus } from "@shared/components/icons";

type Props = {
  value: number;
  max: number;
  onChange: (n: number) => void;
};

export default function QtyStepper({ value, max, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded border border-gray-300 overflow-hidden">
      <button
        type="button"
        className="h-9 w-9 grid place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Kurangi"
      >
        <IconMinus />
      </button>
      <input
        type="number"
        className="h-9 w-12 text-center outline-none"
        value={value}
        min={1}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button
        type="button"
        className="h-9 w-9 grid place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tambah"
      >
        <IconPlus />
      </button>
    </div>
  );
}
