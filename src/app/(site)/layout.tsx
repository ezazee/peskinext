// app/(site)/layout.tsx (atau file layout yang sama)
import BottomNavController from "@shared/components/layout/footer/BottomNavController";
import { Footer } from "@shared/components/layout/footer/DekstopFooter";
import HeaderSwitcher from "@shared/components/layout/header/HeaderSwitcher";
import RouteTransition from "@shared/components/transition/RouteTransition";
import { SessionTimeoutProvider } from "@shared/components/SessionTimeoutProvider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionTimeoutProvider />
      <HeaderSwitcher />

      <RouteTransition>
        <main className="pt-8 md:pt-[30px]">{children}</main>
        <Footer />
        <BottomNavController />
      </RouteTransition>
    </>
  );
}
