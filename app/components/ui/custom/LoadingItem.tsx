import { useTranslation } from "react-i18next";
import { Item, ItemContent, ItemMedia, Spinner } from "..";

export type LoadingItemSize = "sm" | "md" | "lg" | "xl";

interface Props {
  size?: LoadingItemSize;
}

export const LoadingItem = ({ size = "md" }: Props) => {
  const { t } = useTranslation("common");

  const spinnerClasses = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
    xl: "size-10",
  };

  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <Item>
      <ItemMedia>
        <Spinner className={spinnerClasses[size]} />
      </ItemMedia>
      <ItemContent className={`text-muted-foreground ${textClasses[size]}`}>
        {t("loading")}...
      </ItemContent>
    </Item>
  );
};
