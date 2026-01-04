import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { NavbarLink } from "~/types/general";

interface Props {
  item: NavbarLink;
  customIconElement?: ReactNode;
}

export const LinkItem = ({ item, customIconElement }: Props) => {
  const { t } = useTranslation("layout/navbar");
  return (
    <>
      <div>
        <span className="flex min-w-max items-center gap-2 text-sm leading-none font-normal">
          {customIconElement
            ? customIconElement
            : item.icon && (
                <item.icon className="text-foreground h-[1.2rem] w-[1.2rem]" />
              )}
          {t(item.i18nTextKey)}
        </span>
        {item.i18nDescriptionKey && (
          <span className="text-muted-foreground text-xs leading-snug">
            {t(item.i18nDescriptionKey)}
          </span>
        )}
      </div>
    </>
  );
};
