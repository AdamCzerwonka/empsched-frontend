import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { absenceValidation } from "~/constants";
import {
  dateStringValidation,
  parseFromIsoToDate,
  stringMaxValidation,
} from "~/lib";
import { AbsenceReasonEnum } from "~/types/general/enums/AbsenceReasonEnum";
import { accountSchema } from "../account/accountSchema";

export const absenceSchema = (t: TFunction) =>
  z
    .object({
      description: z
        .string()
        .check(
          ...stringMaxValidation(t, absenceValidation.description.maxLength)
        ),
      reason: z.enum(AbsenceReasonEnum),
      employee: accountSchema(t),
      approved: z.boolean(),
      startDate: z.string().check(...dateStringValidation(t)),
      endDate: z.string().check(...dateStringValidation(t)),
    })
    .check(
      z.refine(
        (val) => {
          const start = parseFromIsoToDate(val.startDate);
          const end = parseFromIsoToDate(val.endDate);
          return start <= end;
        },
        {
          message: t("endDateMustBeAfterStartDate"),
          path: ["endDate"],
        }
      )
    );

export type absenceSchemaType = z.infer<ReturnType<typeof absenceSchema>>;
