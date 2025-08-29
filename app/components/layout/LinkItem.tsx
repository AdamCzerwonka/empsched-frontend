import { useTranslation } from "react-i18next";
import type { NavbarLink } from "~/types/general/NavbarLink";

export const LinkItem = ({ item }: { item: NavbarLink }) => {
  const { t } = useTranslation("layout/navbar");
  return (
    <>
      <div>
        <span className="flex min-w-max items-center gap-2 text-sm leading-none">
          {item.icon && <item.icon size={"1.3rem"} />}
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
