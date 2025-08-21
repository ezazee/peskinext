import type { NavItem } from "@data/types";
import MobileAppOffer from "./MobileAppOffer";

export const MobileFooter = ({ navItems }: { navItems: NavItem[] }) => (
  <>
    {/* <MobileAppOffer /> */}
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-1">
      {navItems.map((item) => (
        <a
          key={item.name}
          href="#"
          className="flex flex-col items-center p-2 rounded-lg hover:bg-tertiary"
        >
          <item.icon active={item.active} />
          <span
            className={`text-xs mt-1 ${
              item.active ? "text-primary font-semibold" : "text-secondary"
            }`}
          >
            {item.name}
          </span>
        </a>
      ))}
    </footer>
    <div className="h-36 md:hidden"></div>
  </>
);
