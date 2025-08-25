import { Card, CardContent } from "../ui/card";
import { Logo } from "./Logo";
import { ModeToggle } from "../mode-toggle";
import { AccountSection } from "./AccountSection";
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu";
import { useIsMobile } from "~/hooks/use-mobile";
import { SidebarTrigger } from "../ui/sidebar";

export const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <Card
      id="navbar"
      className="relative z-10 min-h-16 w-full justify-center p-2"
    >
      <CardContent className="flex flex-row flex-wrap items-center justify-between">
        <h1>
          <Logo />
        </h1>
        <div className="flex h-full items-center gap-2">
          <NavigationMenu viewport={isMobile}>
            <NavigationMenuList>
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
