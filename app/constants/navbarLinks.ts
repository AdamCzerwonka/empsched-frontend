import { ExtendedRoleEnum, RoleEnum, type NavbarLink } from "../types/general";
import { navigation } from "./navigation";
import {
  BetweenHorizontalStart,
  Building2,
  CalendarX,
  IdCardLanyard,
  NotebookText,
} from "lucide-react";

export const navbarLinks: NavbarLink[] = [
  {
    i18nTextKey: "organisation.name",
    i18nDescriptionKey: undefined,
    link: navigation.organisation,
    icon: Building2,
    access: [ExtendedRoleEnum.AUTHENTICATED],
    child: [
      {
        i18nTextKey: "organisation.child.details.name",
        i18nDescriptionKey: undefined,
        link: navigation.organisation + "?tab=details",
        icon: NotebookText,
        access: [ExtendedRoleEnum.AUTHENTICATED],
        child: null,
      },
      {
        i18nTextKey: "organisation.child.employees.name",
        i18nDescriptionKey: undefined,
        link: navigation.organisation + "?tab=employees",
        icon: IdCardLanyard,
        access: [RoleEnum.ORGANISATION_ADMIN],
        child: null,
      },
      {
        i18nTextKey: "organisation.child.positions.name",
        i18nDescriptionKey: undefined,
        link: navigation.organisation + "?tab=positions",
        icon: BetweenHorizontalStart,
        access: [RoleEnum.ORGANISATION_ADMIN],
        child: null,
      },
    ],
  },
  {
    i18nTextKey: "absences.name",
    i18nDescriptionKey: undefined,
    link: navigation.absences,
    icon: CalendarX,
    access: [ExtendedRoleEnum.AUTHENTICATED],
    child: null,
  },
];
