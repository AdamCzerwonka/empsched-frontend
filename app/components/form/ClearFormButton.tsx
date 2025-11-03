import { BrushCleaning } from "lucide-react";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "../ui";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";

type Props = {
  form?: UseFormReturn<any>;
  clearCallback?: () => void;
} & React.ComponentProps<typeof Button>;

export const ClearFormButton = ({ form, clearCallback, ...props }: Props) => {
  const { t } = useTranslation("components/form");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={"destructive"}
          size={"icon"}
          onClick={() => {
            form?.reset();
            clearCallback?.();
          }}
          {...props}
        >
          <BrushCleaning />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{t("clearFormTooltip")}</TooltipContent>
    </Tooltip>
  );
};
