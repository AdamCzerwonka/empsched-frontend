import { useTranslation } from "react-i18next";
import {
  Button,
  CalendarPopover,
  Checkbox,
  Command,
  CommandGroup,
  CommandItem,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Label,
  LoadingButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui";
import type { CustomFormProps } from "~/types/general";
import { useForm } from "react-hook-form";
import {
  absenceCreateSchema,
  type absenceCreateSchemaType,
  defaultAbsenceCreateSchemaValues,
} from "~/types/schemas/absence/absenceCreateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAbsence } from "~/api/hooks";
import {
  baseFormSuccessHandler,
  parseFromIsoToDate,
  parseFromIsoToDisplayDate,
  parseToIsoDate,
} from "~/lib";
import { BaseFormTextarea } from "./BaseFormTextarea";
import { ChevronsUpDown } from "lucide-react";
import { AbsenceReasonEnum } from "~/types/general/enums/AbsenceReasonEnum";
import { useState } from "react";

export const AddAbsenceForm = ({
  resetForm = true,
  showToast = true,
  onSuccess,
  employeeId,
}: CustomFormProps & { employeeId?: string }) => {
  const { t } = useTranslation("components/form");
  const { t: tVal } = useTranslation("validation");
  const { t: tCommon } = useTranslation("common");
  const { t: tInfo } = useTranslation("information");
  const { createAbsenceAsync, isPending } = useCreateAbsence(employeeId);

  const form = useForm<absenceCreateSchemaType>({
    resolver: zodResolver(absenceCreateSchema(tVal)),
    defaultValues: defaultAbsenceCreateSchemaValues,
  });

  const [openReasonPopover, setOpenReasonPopover] = useState(false);
  const [openStartDatePopover, setOpenStartDatePopover] = useState(false);
  const [openEndDatePopover, setOpenEndDatePopover] = useState(false);
  const [oneDayAbsence, setOneDayAbsence] = useState(false);

  const handleSubmit = async (values: absenceCreateSchemaType) => {
    await createAbsenceAsync(values, {
      onSuccess: () => {
        baseFormSuccessHandler(
          form,
          resetForm,
          showToast,
          tInfo("absences.absenceCreated"),
          onSuccess
        );
      },
    });
  };

  const handleOneDayAbsenceCheck = (checked: boolean) => {
    setOneDayAbsence(checked);
    if (checked) {
      form.setValue("endDate", form.getValues("startDate"));
    }
  };

  const absenceReasonsPopover = (
    <FormField
      name={"reason"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("reason.label")}</FormLabel>
          <FormControl>
            <Popover
              open={openReasonPopover}
              onOpenChange={setOpenReasonPopover}
            >
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-between">
                  {tCommon(
                    `absenceReasons.${form.getValues("reason").toLowerCase()}`
                  )}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command {...field}>
                  <CommandGroup>
                    {Object.values(AbsenceReasonEnum).map((reason) => (
                      <CommandItem
                        key={reason}
                        value={reason}
                        onSelect={() => {
                          form.setValue("reason", reason);
                          setOpenReasonPopover(false);
                        }}
                      >
                        {tCommon(`absenceReasons.${reason.toLowerCase()}`)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const startDateCalendar = (
    <FormField
      name={"startDate"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("startDate.label")}</FormLabel>
          <FormControl>
            <CalendarPopover
              triggerClassName="min-w-36"
              triggerContent={
                form.getValues("startDate") ? (
                  parseFromIsoToDisplayDate(form.getValues("startDate"))
                ) : (
                  <span className="text-muted-foreground">
                    {t("startDate.placeholder")}
                  </span>
                )
              }
              selected={
                form.getValues("startDate")
                  ? parseFromIsoToDate(form.getValues("startDate"))
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  form.setValue("startDate", parseToIsoDate(date));

                  if (oneDayAbsence) {
                    form.setValue("endDate", parseToIsoDate(date));
                  }

                  setOpenStartDatePopover(false);
                }
              }}
              open={openStartDatePopover}
              setOpen={setOpenStartDatePopover}
              disabledDates={(date) => {
                if (!form.getValues("endDate")) {
                  return false;
                }
                return parseFromIsoToDate(form.getValues("endDate")) < date;
              }}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const endDateCalendar = (
    <FormField
      name={"endDate"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("endDate.label")}</FormLabel>
          <CalendarPopover
            triggerClassName="min-w-36"
            triggerContent={
              form.getValues("endDate") ? (
                parseFromIsoToDisplayDate(form.getValues("endDate"))
              ) : (
                <span className="text-muted-foreground">
                  {t("endDate.placeholder")}
                </span>
              )
            }
            selected={
              form.getValues("endDate")
                ? parseFromIsoToDate(form.getValues("endDate"))
                : undefined
            }
            onSelect={(date) => {
              if (date) {
                form.setValue("endDate", parseToIsoDate(date));
                setOpenEndDatePopover(false);
              }
            }}
            disabledTrigger={oneDayAbsence}
            open={openEndDatePopover}
            setOpen={setOpenEndDatePopover}
            disabledDates={(date) => {
              if (!form.getValues("startDate")) {
                return false;
              }
              return parseFromIsoToDate(form.getValues("startDate")) > date;
            }}
            {...field}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto my-8 flex w-full max-w-sm flex-col gap-4"
      >
        <BaseFormTextarea
          name="description"
          label={t("description.label")}
          placeholder={t("description.placeholder")}
        />
        {absenceReasonsPopover}
        {startDateCalendar}
        <span className="flex flex-wrap gap-2">
          <Checkbox
            id="one-day-absence"
            checked={oneDayAbsence}
            onCheckedChange={(val) => handleOneDayAbsenceCheck(!!val)}
          />
          <Label htmlFor="one-day-absence">{t("oneDayAbsence")}</Label>
        </span>
        {endDateCalendar}
        <LoadingButton
          className="mt-4 w-full"
          type="submit"
          isLoading={isPending}
        >
          {tCommon("submit")}
        </LoadingButton>
      </form>
    </Form>
  );
};
