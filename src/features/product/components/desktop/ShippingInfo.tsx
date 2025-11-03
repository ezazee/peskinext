"use client";
import { BusIcon, LocationIcon } from "@shared/components/icons";
import { formatRupiah } from "@shared/helpers/pricing";

export function ShippingInfo({
  origin,
  cheapest,
  onOpenModal,
}: {
  origin: string;
  cheapest: { price: number; eta: string; group: string } | null;
  onOpenModal: () => void;
}) {
  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="font-bold text-lg mb-3">Pengiriman</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LocationIcon className="w-4 h-4" />
            <span>
              Dikirim dari <span className="font-semibold">{origin}</span>
            </span>
          </div>
          <button
            onClick={onOpenModal}
            className="text-primary cursor-pointer font-semibold text-sm hover:underline"
          >
            Lihat Kurir Lainnya
          </button>
        </div>

        {cheapest && (
          <div className="flex items-center gap-2">
            <BusIcon className="w-4 h-4" />
            <div>
              <p className="font-semibold">
                Ongkir mulai {formatRupiah(cheapest.price)}
              </p>
              <p className="text-xs text-gray-600">
                {cheapest.group} • Estimasi tiba {cheapest.eta}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
