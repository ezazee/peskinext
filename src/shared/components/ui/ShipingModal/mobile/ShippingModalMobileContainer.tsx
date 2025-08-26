"use client";

import type { ShippingDetailData, ShippingOption } from "@shared/types/types";
import ShippingModalMobile from "./ShippingModalMobile"; // UI asli (TIDAK diubah)
import { useShippingQuotes } from "@features/shiping/hooks/useShippingQuotes";
import type { ShippingQueryParams } from "@features/shiping/api/fetchQuotes";
import ShippingModalMobileSkeleton from "../skeleton/ShippingModalMobileSkeleton";

type Props = {
  open: boolean;
  params?: ShippingQueryParams | null;
  initialData?: ShippingDetailData;
  selectedId?: string;
  onSelect?: (opt: ShippingOption) => void;
  onClose: () => void;
};

export default function ShippingModalMobileContainer({
  open,
  params,
  initialData,
  selectedId,
  onSelect,
  onClose,
}: Props) {
  const { data, loading, error, refetch } = useShippingQuotes(open, params ?? null, initialData);

  if (!open) return null;
  if (loading) return <ShippingModalMobileSkeleton open={open} onClose={onClose} />;

  if (error || !data) {
    return (
      <div className="fixed inset-0 z-[89] bg-black/30 md:hidden">
        <div className="absolute inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md rounded-t-2xl bg-white shadow-2xl">
          <div className="px-4 py-5">
            <p className="text-red-600 mb-3">Gagal memuat ongkir.</p>
            <div className="flex items-center gap-2">
              <button onClick={refetch} className="px-3 py-2 rounded bg-primary text-white">
                Coba lagi
              </button>
              <button onClick={onClose} className="px-3 py-2 rounded border">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // UI asli — tidak diubah
  return (
    <ShippingModalMobile
      open={open}
      data={data}
      selectedId={selectedId}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}
