import BottomNavController from "@shared/components/layout/footer/BottomNavController";
import { Footer } from "@shared/components/layout/footer/DekstopFooter";
import HeaderSwitcher from "@shared/components/layout/header/HeaderSwitcher";
import RouteTransition from "@shared/components/transition/RouteTransition";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RouteTransition>
        <HeaderSwitcher />
        <main>{children}</main>
        <Footer />
        <BottomNavController />
      </RouteTransition>
    </>
  );
}
