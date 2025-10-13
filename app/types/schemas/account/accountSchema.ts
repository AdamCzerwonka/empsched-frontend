import type { TFunction } from "i18next";
import { accountValidation } from "~/constants";
import { z } from "zod/v4-mini";
import { stringMinMaxValidation } from "~/lib";

export const accountSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .check(
        ...stringMinMaxValidation(
          t,
          accountValidation.firstName.minLength,
          accountValidation.firstName.maxLength
        )
      ),
    lastName: z
      .string()
      .check(
        ...stringMinMaxValidation(
          t,
          accountValidation.lastName.minLength,
          accountValidation.lastName.maxLength
        )
      ),
    phoneNumber: z.optional(
      z
        .string()
        .check(
          ...stringMinMaxValidation(
            t,
            accountValidation.phoneNumber.minLength,
            accountValidation.phoneNumber.maxLength
          )
        )
    ),
    email: z
      .string()
      .check(
        z.email(t("email")),
        ...stringMinMaxValidation(
          t,
          accountValidation.mail.minLength,
          accountValidation.mail.maxLength
        )
      ),
    password: z
      .string()
      .check(
        ...stringMinMaxValidation(
          t,
          accountValidation.password.minLength,
          accountValidation.password.maxLength
        )
      ),
  });

export type accountSchemaType = z.infer<ReturnType<typeof accountSchema>>;
