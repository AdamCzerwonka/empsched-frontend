import { MonitorCog, Moon, Sun } from "lucide-react";

import { useTheme } from "~/components/theme-provider";
import { useTranslation } from "react-i18next";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from ".";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { t } = useTranslation("components/ui/theme");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-3 font-normal"
          aria-label={t("theme")}
        >
          <span className="relative">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute top-0 h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </span>
          {t("theme")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="wrap flex cursor-pointer flex-row items-center gap-2"
          onClick={() => setTheme("light")}
        >
          <Sun />
          {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="wrap flex cursor-pointer flex-row items-center gap-2"
          onClick={() => setTheme("dark")}
        >
          <Moon />
          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="wrap flex cursor-pointer flex-row items-center gap-2"
          onClick={() => setTheme("system")}
        >
          <MonitorCog />
          {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
