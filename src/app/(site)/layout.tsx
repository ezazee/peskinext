import { bottomNavItemsData } from "@data/navigation";
import { Footer } from "@shared/components/layout/footer/DekstopFooter";
import { MobileFooter } from "@shared/components/layout/footer/MobileFooter";
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
        <MobileFooter navItems={bottomNavItemsData} />
      </RouteTransition>
    </>
  );
}
