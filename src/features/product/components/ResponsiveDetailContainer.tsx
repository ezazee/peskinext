"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Render hanya salah satu komponen, bukan keduanya
const DesktopDetailContainer = dynamic(
  () => import("./desktop/DesktopDetailContainer"),
  { ssr: false }
);
const MobileDetailContainer = dynamic(
  () => import("./mobile/MobileDetailContainer"),
  { ssr: false }
);

/** Hook media query yang ketat tipenya & tanpa ts-ignore */
function useMediaQuery(query: string) {
  const getMatch = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);

    // set value awal (antisipasi SSR/hydration)
    setMatches(mql.matches);

    // handler bertipe jelas
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // addEventListener tersedia di browser modern; fallback ke addListener untuk Safari lama
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } else {
      // fallback legacy
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, [query]);

  return matches;
}

export default function ResponsiveDetailContainer({ slug }: { slug: string }) {
  // sesuaikan breakpoint dengan desainmu (Tailwind lg = 1024px)
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? (
    <DesktopDetailContainer slug={slug} />
  ) : (
    <MobileDetailContainer slug={slug} />
  );
}
