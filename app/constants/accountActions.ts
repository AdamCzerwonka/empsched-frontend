import type { AccountActions } from "~/types/general";
import { navigation } from "./navigation";
import { LogOut } from "lucide-react";

export const accountActions: AccountActions[] = [
  {
    icon: LogOut,
    link: navigation.logout,
    i18nKey: "logout",
  },
];
