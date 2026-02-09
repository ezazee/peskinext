"use client";

import React, { type JSX } from "react";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function AccountDesktopSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Skeleton.Circle size={80} />
          <div>
            <Skeleton.Text lines={1} widths={["200px"]} lineHeight={28} className="mb-2" />
            <Skeleton.Text lines={1} widths={["150px"]} lineHeight={20} />
          </div>
        </div>
        <Skeleton width={100} height={40} radius={12} />
      </div>

      {/* 2. Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Widget */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between mb-6">
            <Skeleton width={120} height={24} radius={6} />
            <Skeleton width={80} height={20} radius={4} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Skeleton.Circle size={48} />
                <Skeleton width={60} height={12} radius={4} />
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-center gap-4">
          <Skeleton width={150} height={24} radius={6} className="mb-2" />
          <Skeleton width="100%" height={60} radius={12} />
          <Skeleton width="100%" height={60} radius={12} />
        </div>
      </div>
    </div>
  );
}

