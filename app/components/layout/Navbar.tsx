import { Link } from "react-router";
import { Card, CardContent } from "../ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
    <Card className="min-h-16 w-full justify-center p-2">
      <CardContent className="flex flex-row flex-wrap items-center justify-between">
        <h1>
          <Logo />
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
      </CardContent>
    </Card>
  );
};

export default Navbar;
