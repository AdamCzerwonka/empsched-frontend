import { MonitorCog, Moon, Sun } from "lucide-react";

import { useTheme } from "~/components/theme-provider";
import { useTranslation } from "react-i18next";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "./navigation-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { t } = useTranslation("components/ui/theme");

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger showChevron={false} className="items-center gap-2">
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">{t("srInformation")}</span>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul>
          <li className="w-full">
            <NavigationMenuLink
              className="wrap flex cursor-pointer flex-row items-center gap-2"
              onClick={() => setTheme("light")}
            >
              <Sun />
              {t("light")}
            </NavigationMenuLink>
          </li>
          <li className="w-full">
            <NavigationMenuLink
              className="wrap flex cursor-pointer flex-row items-center gap-2"
              onClick={() => setTheme("dark")}
            >
              <Moon />
              {t("dark")}
            </NavigationMenuLink>
          </li>
          <li className="w-full">
            <NavigationMenuLink
              className="wrap flex cursor-pointer flex-row items-center gap-2"
              onClick={() => setTheme("system")}
            >
              <MonitorCog />
              {t("system")}
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
