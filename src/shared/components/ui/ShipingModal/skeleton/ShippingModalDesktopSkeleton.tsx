"use client";
import { XMarkIcon } from "@shared/components/icons";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function ShippingModalDesktopSkeleton({
  open, onClose,
}: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[89] hidden md:block bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={[
          "fixed left-1/2 top-1/2 z-[90] hidden md:block",
          "w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl",
          "transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Skeleton.Block width={180} height={20} />
          <button aria-label="Tutup" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-gray-100">
            <XMarkIcon />
          </button>
        </div>
        <div className="px-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <Skeleton.Block width="60%" height={14} />
            <div className="mt-1"><Skeleton.Block width="80%" height={16} /></div>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <Skeleton.Block width="60%" height={14} />
            <div className="mt-1"><Skeleton.Block width="80%" height={16} /></div>
          </div>
          <div className="col-span-2"><Skeleton.Block width="50%" height={12} /></div>
        </div>
        <div className="mt-4 h-px w-full bg-gray-100" />
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-5">
          {Array.from({ length: 3 }).map((_, gi) => (
            <section key={gi}>
              <Skeleton.Block width="30%" height={14} className="mb-2" />
              <ul className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 divide-y divide-gray-300">
                {Array.from({ length: 3 }).map((__, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="flex flex-1 items-start gap-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-gray-200 self-center shrink-0" />
                      <div className="flex-1">
                        <Skeleton.Block width="40%" height={14} />
                        <div className="mt-1"><Skeleton.Block width="30%" height={12} /></div>
                      </div>
                    </div>
                    <Skeleton.Block width={80} height={16} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
