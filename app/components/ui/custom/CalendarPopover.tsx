import { ChevronDown } from "lucide-react";
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "..";
import { useMemo, type ReactNode } from "react";
import { DateTime } from "luxon";
import { cn } from "~/lib";

interface Props {
  triggerContent: ReactNode;
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabledDates?: (date: Date) => boolean;
  disabledTrigger?: boolean;
  calendarDateRange?: { startMonth: Date; endMonth: Date };
  triggerClassName?: string;
  calendarClassName?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const CalendarPopover = ({
  triggerContent,
  selected,
  onSelect,
  disabledDates,
  disabledTrigger = false,
  calendarDateRange,
  triggerClassName,
  calendarClassName,
  open,
  setOpen,
}: Props) => {
  const defaultCalendarDateRange = useMemo(
    () => ({
      startMonth: DateTime.now().minus({ years: 10 }).toJSDate(),
      endMonth: DateTime.now().plus({ years: 10 }).toJSDate(),
    }),
    []
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex flex-row flex-wrap items-center justify-between gap-2",
            triggerClassName
          )}
          disabled={disabledTrigger}
        >
          {triggerContent}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          className={cn("h-full w-full", calendarClassName)}
          mode="single"
          captionLayout="dropdown"
          selected={selected}
          onSelect={onSelect}
          disabled={disabledDates}
          startMonth={
            calendarDateRange
              ? calendarDateRange.startMonth
              : defaultCalendarDateRange.startMonth
          }
          endMonth={
            calendarDateRange
              ? calendarDateRange.endMonth
              : defaultCalendarDateRange.endMonth
          }
        />
      </PopoverContent>
    </Popover>
  );
};
