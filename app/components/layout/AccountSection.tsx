import { useAuthStore } from "~/store";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui";
import { Link } from "react-router";
import { accountActions, navigation } from "~/constants";
import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import { LinkItem } from "./LinkItem";
import { cn } from "~/lib/utils";

export const AccountSection = () => {
  const { t } = useTranslation("layout/navbar");
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return (
      <>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link to={navigation.signIn}>{t("signIn")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            )}
            asChild
          >
            <Link to={navigation.signUp}>{t("signUp")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        <LinkItem
          item={{
            i18nTextKey: "myAccount",
            icon: User,
          }}
        />
      </NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-max">
        <ul>
          {accountActions.map((item) => (
            <li key={item.i18nKey}>
              <NavigationMenuLink asChild>
                <Link to={item.link}>
                  <LinkItem
                    item={{
                      i18nTextKey: item.i18nKey,
                      icon: item.icon,
                    }}
                  />
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
