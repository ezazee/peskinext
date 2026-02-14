// src/shared/components/ui/ShipingModal/ShippingModal.tsx
"use client";

import type { ShippingDetailData, ShippingOption } from "@shared/types/types";
import { useShippingQuotes } from "@features/shipping/hooks/useShippingQuotes";
import type { ShippingQueryParams } from "@features/shipping/hooks/useShippingParamsForProduct";

import ShippingModalDesktop from "./desktop/ShippingModalDesktop";
import ShippingModalMobile from "./mobile/ShippingModalMobile";

import {
  ShippingModalSkeletonDesktop,
  ShippingModalSkeletonMobile,
} from "./skeleton/ShippingModal";

type Props = {
  open: boolean;
  params: ShippingQueryParams | null;
  initialData?: ShippingDetailData;
  selectedId?: string;
  onSelect?: (opt: ShippingOption) => void;
  onClose: () => void;
};

export default function ShippingModal({
  open,
  params,
  initialData,
  selectedId,
  onSelect,
  onClose,
}: Props) {
  const { data, loading } = useShippingQuotes(Boolean(params), params);
  const payload = data ?? initialData;

  if (!open) return null;

  if (loading && !payload) {
    return (
      <>
        <ShippingModalSkeletonDesktop open={open} onClose={onClose} />
        <ShippingModalSkeletonMobile open={open} onClose={onClose} />
      </>
    );
  }

  const emptyFallback: ShippingDetailData = {
    origin: params?.origin ?? "",
    destination: params?.destination ?? "",
    weightGr: params?.weightGr ?? 0,
    note: "Tidak ada data ongkir.",
    groups: [],
  };

  const dataToShow = payload ?? emptyFallback;

  // Render keduanya; visibilitas diatur class di dalam komponen
  return (
    <>
      <ShippingModalDesktop
        open={open}
        data={dataToShow}
        selectedId={selectedId}
        onSelect={onSelect}
        onClose={onClose}
      />
      <ShippingModalMobile
        open={open}
        data={dataToShow}
        selectedId={selectedId}
        onSelect={onSelect}
        onClose={onClose}
      />
    </>
  );
}
