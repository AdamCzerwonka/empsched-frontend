import { Calendar, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui";
import { parseFromIsoToDisplayDate } from "~/lib";
import type { Absence } from "~/types/general";

interface Props {
  absence: Absence;
}

export const AbsenceItem = ({ absence }: Props) => {
  const { t } = useTranslation("routes/absences");
  const { t: tCommon } = useTranslation("common");
  const isEndingSameDay = absence.startDate === absence.endDate;

  const formattedDate = isEndingSameDay
    ? parseFromIsoToDisplayDate(absence.startDate)
    : `${parseFromIsoToDisplayDate(absence.startDate)} - ${parseFromIsoToDisplayDate(
        absence.endDate
      )}`;

  return (
    <Item className="h-min w-full">
      <ItemMedia variant={"icon"} className="bg-primary/10 text-primary">
        <Calendar />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {formattedDate}
          <Badge variant={"outline"} className="text-foreground/80">
            {tCommon(`absenceReasons.${absence.reason.toLowerCase()}`)}
          </Badge>
        </ItemTitle>
        <ItemDescription className="line-clamp-none">
          {absence.description}
        </ItemDescription>
      </ItemContent>
      {!absence.approved && (
        <ItemActions>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"outline"}>
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-destructive text-destructive-foreground"
              arrowClassName="bg-destructive fill-destructive"
            >
              {t("deleteAbsenceTooltip")}
            </TooltipContent>
          </Tooltip>
        </ItemActions>
      )}
      <ItemFooter>
        <Badge variant={absence.approved ? "default" : "secondary"}>
          {absence.approved ? t("approved") : t("notApproved")}
        </Badge>
      </ItemFooter>
    </Item>
  );
};
