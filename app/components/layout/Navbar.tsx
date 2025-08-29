import {
  Card,
  CardContent,
  SidebarTrigger,
  NavigationMenu,
  NavigationMenuList,
} from "../ui";
import { Logo } from "./Logo";
import { ModeToggle } from "../mode-toggle";
import { AccountSection } from "./AccountSection";
import { useIsMobile } from "~/hooks/use-mobile";
import { NavbarLinksSection } from "./NavbarLinksSection";

export const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <Card
      id="navbar"
      className="relative z-10 min-h-16 w-full justify-center p-2"
    >
      <CardContent className="flex flex-row items-center justify-between gap-2">
        <h1>
          <Logo />
        </h1>
        <div className="flex h-full flex-wrap items-center gap-2">
          <NavigationMenu viewport={isMobile}>
            <NavigationMenuList>
              {!isMobile && (
                <span className="flex flex-1 flex-wrap items-center gap-2 lg:gap-0">
                  <NavbarLinksSection isSidebar={false} />
                </span>
              )}
              <ModeToggle />
              {!isMobile && <AccountSection />}
            </NavigationMenuList>
          </NavigationMenu>
          {isMobile && <SidebarTrigger />}
        </div>
      </CardContent>
    </Card>
  );
};

export default Navbar;
