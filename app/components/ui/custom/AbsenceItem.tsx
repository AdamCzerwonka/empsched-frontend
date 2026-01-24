import { Calendar } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "~/components/ui";
import { parseFromIsoToDisplayDate } from "~/lib";
import type { Absence } from "~/types/general";

interface Props {
  absence: Absence;
  actionSection?: ReactNode;
  showEmployeeData?: boolean;
}

export const AbsenceItem = ({
  absence,
  actionSection,
  showEmployeeData = false,
}: Props) => {
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
        {showEmployeeData && (
          <p className="text-muted-foreground mb-2 flex flex-wrap gap-2 text-xs">
            <span className="font-bold">
              {absence.employee.firstName} {absence.employee.lastName}
            </span>
            <span className="tracking-wider">{absence.employee.email}</span>
          </p>
        )}
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
      {actionSection && <ItemActions>{actionSection}</ItemActions>}
      <ItemFooter>
        <Badge variant={absence.approved ? "default" : "secondary"}>
          {absence.approved ? tCommon("approved") : tCommon("notApproved")}
        </Badge>
      </ItemFooter>
    </Item>
  );
};
