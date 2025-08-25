import { useAuthStore } from "~/store";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Link } from "react-router";
import { accountActions, navigation } from "~/constants";
import { useTranslation } from "react-i18next";
import { User } from "lucide-react";

export const AccountSection = () => {
  const { t } = useTranslation("layout/navbar");
  const { isAuthenticated } = useAuthStore();

  const authenticatedSection = (
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        <span className="flex items-center gap-2">
          <User size={"1.3rem"} />
          {t("myAccount")}
        </span>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-max">
        <ul>
          {accountActions.map((item) => (
            <li key={item.i18nKey}>
              <NavigationMenuLink asChild>
                <Link to={item.link}>
                  <span className="flex min-w-max items-center gap-2">
                    {<item.icon />}
                    {t(item.i18nKey)}
                  </span>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );

  const unauthenticatedSection = (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
          <Link to={navigation.signIn}>{t("signIn")}</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
          <Link to={navigation.signUp}>{t("signUp")}</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  );

  return isAuthenticated() ? authenticatedSection : unauthenticatedSection;
};
