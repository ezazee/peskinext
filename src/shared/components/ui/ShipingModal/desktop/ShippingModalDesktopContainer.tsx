"use client";
import type { ShippingDetailData, ShippingOption } from "@shared/types/types";
import type { ShippingQueryParams } from "@features/shiping/api/fetchQuotes";
import { useShippingQuotes } from "@features/shiping/hooks/useShippingQuotes";
import ShippingModalDesktopSkeleton from "../skeleton/ShippingModalDesktopSkeleton";
import ShippingModalDesktop from "./ShippingModalDesktop";

type Props = {
  open: boolean;
  params?: ShippingQueryParams | null;
  initialData?: ShippingDetailData;
  selectedId?: string;
  onSelect?: (opt: ShippingOption) => void;
  onClose: () => void;
};

export default function ShippingModalDesktopContainer({
  open,
  params,
  initialData,
  selectedId,
  onSelect,
  onClose,
}: Props) {
  const { data, loading, error, refetch } = useShippingQuotes(
    open,
    params ?? null,
    initialData
  );

  if (!open) return null;
  if (loading)
    return <ShippingModalDesktopSkeleton open={open} onClose={onClose} />;

  if (error || !data) {
    return (
      <>
        <div
          onClick={onClose}
          className="fixed inset-0 z-[89] hidden md:block bg-black/40"
          aria-hidden
        />
        <div
          role="dialog"
          aria-modal="true"
          className="fixed left-1/2 top-1/2 z-[90] hidden md:block w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl"
        >
          <div className="px-6 py-5">
            <p className="text-red-600 mb-3">Gagal memuat ongkir.</p>
            <div className="flex items-center gap-2">
              <button
                onClick={refetch}
                className="px-3 py-2 rounded bg-primary text-white"
              >
                Coba lagi
              </button>
              <button onClick={onClose} className="px-3 py-2 rounded border">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <ShippingModalDesktop
      open={open}
      data={data}
      selectedId={selectedId}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}
