"use client";

import React from "react";
import type { AccountProfile } from "@shared/types/types";
import { Skeleton } from "@shared/components/ui/SkeletonLoading";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import ProfileEditMobile from "@features/account/mobile/edit/ProfileEditMobile";
import ProfileEditDesktop from "@features/account/desktop/edit/ProfileEditDesktop";

type Props = {
  exists: boolean;
  profile: AccountProfile;
};

export default function EditAccountClient({ exists, profile }: Props) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (!exists) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-white p-6 text-center">
          <p className="text-sm text-gray-600">
            Data tidak ditemukan atau ID tidak valid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-6 py-4">
      {loading ? (
        isMobile ? (
          <MobileSkeleton />
        ) : (
          <DesktopSkeleton />
        )
      ) : isMobile ? (
        <ProfileEditMobile initial={profile} />
      ) : (
        <ProfileEditDesktop initial={profile} />
      )}
    </div>
  );
}

/* ------------ Skeletons ------------ */
function MobileSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-3">
        <Skeleton.Circle size={56} />
        <div className="flex-1">
          <Skeleton width="60%" height={14} radius={6} />
          <Skeleton className="mt-2" width="40%" height={12} radius={6} />
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid gap-2">
            <Skeleton width="30%" height={12} radius={6} />
            <Skeleton width="100%" height={40} radius={8} />
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <Skeleton width="100%" height={44} radius={10} />
        </div>
      </div>
    </div>
  );
}

function DesktopSkeleton() {
  return (
    <div className="grid grid-cols-[280px_1fr] gap-6">
      <aside className="bg-white rounded-xl border p-4 shadow-sm">
        <Skeleton.Circle size={64} />
        <Skeleton className="mt-3" width="70%" height={12} radius={6} />
        <Skeleton className="mt-2" width="50%" height={12} radius={6} />
      </aside>
      <main className="bg-white rounded-xl border p-6 shadow-sm">
        <Skeleton width="25%" height={18} radius={6} />
        <div className="mt-4 grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid gap-2">
              <Skeleton width="40%" height={12} radius={6} />
              <Skeleton width="100%" height={42} radius={8} />
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Skeleton width={120} height={44} radius={10} />
          <Skeleton width={120} height={44} radius={10} />
        </div>
      </main>
    </div>
  );
}
