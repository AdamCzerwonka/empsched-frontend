import { useTranslation } from "react-i18next";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "..";
import { Globe } from "lucide-react";

export const LanguageSelector = () => {
  const { t } = useTranslation("components/ui/languageSelector");
  const { i18n } = useTranslation();

  const current = i18n.language === "pl" ? t("lang.polish") : t("lang.english");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center justify-start gap-3 font-normal"
        >
          <Globe />
          {current}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
          {t("lang.english")} (English)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("pl")}>
          {t("lang.polish")} (Polish)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
