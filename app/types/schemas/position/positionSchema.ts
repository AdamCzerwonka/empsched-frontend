import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { positionValidation } from "~/constants";

export const positionSchema = (t: TFunction) =>
  z.object({
    name: z.string().check(
      z.minLength(
        positionValidation.name.minLength,
        t("minLength", {
          val: positionValidation.name.minLength,
        }).toString()
      ),
      z.maxLength(
        positionValidation.name.maxLength,
        t("maxLength", {
          val: positionValidation.name.maxLength,
        }).toString()
      )
    ),
    description: z.string().check(
      z.maxLength(
        positionValidation.description.maxLength,
        t("maxLength", {
          val: positionValidation.description.maxLength,
        }).toString()
      )
    ),
  });

export type positionSchemaType = z.infer<ReturnType<typeof positionSchema>>;
