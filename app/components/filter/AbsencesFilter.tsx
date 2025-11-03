import {
  defaultAbsenceFilterParams,
  type AbsenceFilterParams,
} from "~/types/api";
import { CalendarPopover, Checkbox, Label } from "../ui";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  parseFromIsoToDate,
  parseFromIsoToDisplayDate,
  parseToIsoDate,
} from "~/lib";
import { ClearFormButton } from "../form";
import { DateTime } from "luxon";

interface Props {
  params: AbsenceFilterParams;
  changeParams: (newParams: AbsenceFilterParams) => void;
  disabled?: boolean;
}

export const AbsencesFilter = ({
  params,
  changeParams,
  disabled = false,
}: Props) => {
  const { t } = useTranslation("components/filter/absencesFilter");
  const [openFromCalendar, setOpenFromCalendar] = useState(false);
  const [openToCalendar, setOpenToCalendar] = useState(false);

  const updateParams = (date: Date | undefined, which: "from" | "to") => {
    if (!date) {
      return;
    }

    if (which === "from") {
      setOpenFromCalendar(false);
    } else {
      setOpenToCalendar(false);
    }

    const newFrom = which === "from" ? parseToIsoDate(date) : params.startFrom;
    const newTo = which === "to" ? parseToIsoDate(date) : params.startTo;
    changeParams({ ...params, startFrom: newFrom, startTo: newTo });
  };

  return (
    <div className="flex flex-row flex-wrap items-end gap-3">
      <span className="grid gap-2">
        <Label htmlFor="start-from">{t("dateRange")}</Label>
        <CalendarPopover
          triggerId="start-from"
          triggerClassName="min-w-36"
          triggerContent={
            params.startFrom ? (
              parseFromIsoToDisplayDate(params.startFrom)
            ) : (
              <span className="text-muted-foreground">{t("from")}</span>
            )
          }
          selected={
            params.startFrom ? parseFromIsoToDate(params.startFrom) : undefined
          }
          onSelect={(date) => updateParams(date, "from")}
          disabledDates={(date) => {
            if (!params.startTo) {
              return false;
            }
            return parseFromIsoToDate(params.startTo) < date;
          }}
          open={openFromCalendar}
          setOpen={setOpenFromCalendar}
          disabled={disabled}
        />
      </span>
      <CalendarPopover
        triggerClassName="min-w-36"
        triggerContent={
          params.startTo ? (
            parseFromIsoToDisplayDate(params.startTo)
          ) : (
            <span className="text-muted-foreground">{t("to")}</span>
          )
        }
        selected={
          params.startTo ? parseFromIsoToDate(params.startTo) : undefined
        }
        onSelect={(date) => updateParams(date, "to")}
        disabledDates={(date) => {
          if (!params.startFrom) {
            return false;
          }
          return parseFromIsoToDate(params.startFrom) > date;
        }}
        open={openToCalendar}
        setOpen={setOpenToCalendar}
        disabled={disabled}
      />
      <span className="flex h-10 items-center gap-2">
        <Checkbox
          id="upcoming"
          checked={params.startFrom === DateTime.now().toISODate()}
          onCheckedChange={(val) => {
            if (!!val) {
              changeParams({
                ...params,
                startFrom: DateTime.now().toISODate(),
              });
            } else {
              changeParams({
                ...params,
                startFrom: "",
              });
            }
          }}
        />
        <Label htmlFor="upcoming" className="font-normal">
          {t("upcoming")}
        </Label>
      </span>
      <ClearFormButton
        clearCallback={() => {
          changeParams(defaultAbsenceFilterParams);
        }}
        className="ml-2"
      />
    </div>
  );
};
