import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { AbsenceReasonEnum } from "~/types/general/enums/AbsenceReasonEnum";
import { absenceSchema } from "./absenceSchema";

export const absenceCreateSchema = (t: TFunction) => {
  return z.pick(absenceSchema(t), {
    description: true,
    reason: true,
    startDate: true,
    endDate: true,
  });
};

export type absenceCreateSchemaType = z.infer<
  ReturnType<typeof absenceCreateSchema>
>;

export const defaultAbsenceCreateSchemaValues: absenceCreateSchemaType = {
  description: "",
  reason: AbsenceReasonEnum.SICK_LEAVE,
  startDate: "",
  endDate: "",
};
