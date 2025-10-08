import type { ExtendedRoleType } from "../enums/RoleEnum";

export interface NavbarLink {
  i18nTextKey: string;
  i18nDescriptionKey?: string | null;
  link?: string | null;
  icon?: React.ElementType | null;
  access?: ExtendedRoleType[];
  child?: NavbarLink[] | null;
}
