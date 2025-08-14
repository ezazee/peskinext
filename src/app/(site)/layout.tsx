import { DesktopHeader } from "@shared/components/layout/header/DekstopHeader";
import { MobileHeader } from "@shared/components/layout/header/MobileHeader";

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
