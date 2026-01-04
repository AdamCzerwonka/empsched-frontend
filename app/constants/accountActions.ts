import type { AccountActions } from "~/types/general";
import { navigation } from "./navigation";
import { LogOut, UserCog } from "lucide-react";

export const accountActions: AccountActions[] = [
  {
    icon: UserCog,
    link: navigation.myAccountSettings,
    i18nKey: "myAccountSettings",
  },
  {
    icon: LogOut,
    link: navigation.logout,
    i18nKey: "logout",
  },
];
