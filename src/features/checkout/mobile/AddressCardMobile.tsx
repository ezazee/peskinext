"use client";

type Props = {
  label: string;        // ex: "Rumah Garut Garut"
  onOpen: () => void;   // buka AddressModal
};

export default function AddressCardMobile({ label, onOpen }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b px-4 py-3">
      <div className="text-[11px] text-gray-500">Dikirim ke</div>
      <button
        onClick={onOpen}
        className="w-full text-left flex items-center justify-between cursor-pointer gap-2"
      >
        <div className="font-semibold text-gray-900 line-clamp-1">{label}</div>
        <span className="text-primary text-xs font-medium">Ubah</span>
      </button>
    </header>
  );
}
