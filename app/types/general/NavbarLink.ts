export interface NavbarLink {
  i18nTextKey: string;
  i18nDescriptionKey?: string | null;
  link?: string | null;
  icon?: React.ElementType | null;
  access?: string[];
  child?: NavbarLink[] | null;
}
