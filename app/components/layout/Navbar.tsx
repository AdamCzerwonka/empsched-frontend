import { Link } from "react-router";
import { Card } from "../ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Logo } from "./Logo";
import { useTranslation } from "react-i18next";
import { Separator } from "../ui/separator";
import { ModeToggle } from "../mode-toggle";
import { navigation } from "~/constants";

export const Navbar = () => {
  const { t } = useTranslation("layout/navbar");
  return (
    <Card className="flex min-h-16 w-full flex-row flex-wrap items-center justify-between rounded-none px-2">
      <h1>
        <Logo className="mx-2" />
      </h1>
      <div className="flex h-full items-center gap-2">
        <ModeToggle />
        <Separator orientation="vertical" />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to={navigation.signIn}>{t("signIn")}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to={navigation.signUp}>{t("signUp")}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </Card>
  );
};

export default Navbar;
