import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { organisationValidation } from "~/constants";
import { OrganisationPlanEnum } from "~/types/general";

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
    plan: z.enum(OrganisationPlanEnum),
  });

export type organisationSchemaType = z.infer<
  ReturnType<typeof organisationSchema>
>;
