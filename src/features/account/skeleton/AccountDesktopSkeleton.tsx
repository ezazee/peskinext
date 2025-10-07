"use client";

import React, { type JSX } from "react";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";

export default function AccountDesktopSkeleton(): JSX.Element {
  return (
    <div className="grid grid-cols-[260px_1fr] gap-6 items-stretch">
      {/* === Sidebar kiri === */}
      <aside className="bg-white border rounded-xl p-4">
        {/* Header user */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton.Circle size={48} />
          <div className="min-w-0 flex-1">
            <Skeleton.Text lines={1} widths={["60%"]} lineHeight={14} />
            <Skeleton.Text
              className="mt-2"
              lines={1}
              widths={["80%"]}
              lineHeight={12}
            />
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          <MenuItemSkeleton active />
          <MenuItemSkeleton />
          <MenuItemSkeleton />
          <MenuItemSkeleton danger />
        </nav>
      </aside>

      {/* === Panel kanan === */}
      <main className="bg-white border rounded-xl p-6">
        {/* Judul */}
        <Skeleton width="20%" height={18} radius={6} />

        <div className="grid grid-cols-[220px_1fr] gap-6 mt-4">
          {/* Foto + aksi */}
          <div>
            <Skeleton.Block width={220} height={220} radius={12} />
            <Skeleton.Block
              className="mt-3"
              width={220}
              height={44}
              radius={10}
            />
            <Skeleton.Text
              className="mt-2"
              lines={2}
              lineHeight={12}
              widths={["90%", "70%"]}
            />
          </div>

          {/* Fields + tombol edit */}
          <div className="space-y-3">
            <FieldRowSkeleton />
            <FieldRowSkeleton />
            <FieldRowSkeleton />

            <Skeleton.Block
              className="mt-2"
              width="60%"
              height={44}
              radius={10}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= helpers ================= */

function MenuItemSkeleton({
  active = false,
  danger = false,
}: {
  active?: boolean;
  danger?: boolean;
}): JSX.Element {
  const base = "flex items-center gap-2 px-3 py-2.5 rounded-md";
  const state = danger
    ? "border text-red-600/70"
    : active
    ? "bg-primary/10 border border-primary/30"
    : "border";

  return (
    <div className={`${base} ${state}`}>
      <Skeleton width={18} height={18} radius={4} />
      <Skeleton width="50%" height={12} radius={6} />
    </div>
  );
}

function FieldRowSkeleton(): JSX.Element {
  return (
    <div className="grid grid-cols-[180px_1fr] items-center gap-3 py-2 border-b">
      <Skeleton width="40%" height={12} radius={6} />
      <Skeleton width="60%" height={12} radius={6} />
    </div>
  );
}
