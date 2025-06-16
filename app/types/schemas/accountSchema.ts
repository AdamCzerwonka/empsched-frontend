import type { TFunction } from "i18next";
import { accountValidation } from "~/constants";
import { z } from "zod/v4-mini";

export const accountSchema = (t: TFunction) =>
  z.object({
    email: z.string().check(
      z.email(t("email")),
      z.minLength(
        accountValidation.mail.minLength,
        t("minLength", {
          val: accountValidation.mail.minLength,
        }).toString()
      ),
      z.maxLength(
        accountValidation.mail.maxLength,
        t("maxLength", {
          val: accountValidation.mail.maxLength,
        }).toString()
      )
    ),
    password: z.string().check(
      z.minLength(
        accountValidation.password.minLength,
        t("minLength", {
          val: accountValidation.password.minLength,
        }).toString()
      ),
      z.maxLength(
        accountValidation.password.maxLength,
        t("maxLength", {
          val: accountValidation.password.maxLength,
        }).toString()
      )
    ),
  });

export type accountSchemaType = z.infer<ReturnType<typeof accountSchema>>;
