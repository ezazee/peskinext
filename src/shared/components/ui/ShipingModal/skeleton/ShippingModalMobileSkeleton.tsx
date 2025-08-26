"use client";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function ShippingModalMobileSkeleton({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[89] bg-black/30 md:hidden" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-[90] md:hidden
                   mx-auto w-full max-w-md rounded-t-2xl bg-white shadow-2xl
                   flex max-h-[85vh] flex-col"
      >
        <div className="pt-2">
          <div className="mx-auto mb-1 h-1.5 w-10 rounded-full bg-gray-300/80" />
        </div>

        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 pb-2">
          <div className="flex items-center gap-3 py-2">
            <button
              aria-label="Tutup"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100"
            >
              <span className="sr-only">Tutup</span>
              {/* icon placeholder */}
              <div className="h-5 w-5 rounded bg-gray-300" />
            </button>
            <Skeleton.Block width={160} height={18} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <Skeleton.Block width="40%" height={12} />
              <div className="mt-1"><Skeleton.Block width="70%" height={14} /></div>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <Skeleton.Block width="40%" height={12} />
              <div className="mt-1"><Skeleton.Block width="70%" height={14} /></div>
            </div>
          </div>
          <div className="mb-3 mt-3">
            <Skeleton.Block width="55%" height={12} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl p-3">
              <div className="flex items-center justify-between">
                <Skeleton.Block width="48%" height={14} />
                <Skeleton.Block width="22%" height={14} />
              </div>
              <Skeleton.Block width="35%" height={12} className="mt-2" />
            </div>
          ))}
          <div className="h-2" />
        </div>
      </div>
    </>
  );
}
