import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { organisationValidation } from "~/constants";

export const organisationSchema = (t: TFunction) =>
  z.object({
    name: z.string().check(
      z.minLength(
        organisationValidation.name.minLength,
        t("minLength", {
          val: organisationValidation.name.minLength,
        }).toString()
      ),
      z.maxLength(
        organisationValidation.name.maxLength,
        t("maxLength", {
          val: organisationValidation.name.maxLength,
        }).toString()
      )
    ),
    maxEmployees: z.number().check(
      z.minimum(
        organisationValidation.maxEmployees.min,
        t("minValue", {
          val: organisationValidation.maxEmployees.min,
        }).toString()
      ),
      z.maximum(
        organisationValidation.maxEmployees.max,
        t("maxValue", {
          val: organisationValidation.maxEmployees.max,
        }).toString()
      )
    ),
  });

export type organisationSchemaType = z.infer<
  ReturnType<typeof organisationSchema>
>;
