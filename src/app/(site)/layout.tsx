// File: src/app/(site)/layout.tsx

import { DesktopHeader } from "@/components/Header/DekstopHeader";
import { MobileHeader } from "@/components/Header/MobileHeader";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <main>{children}</main>
    </>
  );
}
