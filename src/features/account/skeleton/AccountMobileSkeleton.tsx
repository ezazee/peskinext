"use client";

import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function AccountMobileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Skeleton */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-sm flex flex-col items-center">
        <Skeleton.Circle size={100} className="mb-4" />
        <Skeleton width="120px" height={24} radius={8} />
        <Skeleton width="180px" height={16} radius={6} className="mt-2" />
      </div>

      {/* Quick Stats Skeleton */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-3xl shadow-md p-5 flex justify-between items-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <Skeleton.Circle size={24} />
              <Skeleton width="30px" height={10} radius={4} />
            </div>
          ))}
        </div>
      </div>

      {/* Menu Section Skeletons */}
      <div className="px-6 mt-8 space-y-6">
        {[1, 2].map((section) => (
          <div key={section}>
            <Skeleton width="100px" height={12} radius={4} className="ml-4 mb-3" />
            <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100/50">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center gap-4 px-4 py-4 border-b border-gray-50 last:border-0">
                  <Skeleton width={40} height={40} radius={12} />
                  <Skeleton width="60%" height={16} radius={6} />
                  <div className="ml-auto">
                    <Skeleton width={18} height={18} radius={4} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
