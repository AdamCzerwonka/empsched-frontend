import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { accountSchema } from "../accountSchema";
import { organisationSchema } from "../organisationSchema";
import { accountValidation, organisationValidation } from "~/constants";

export const organisationCreateSchema = (t: TFunction) =>
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

export type organisationCreateSchemaType = z.infer<
  ReturnType<typeof organisationCreateSchema>
>;

export const defaultOrganisationCreateSchemaValues: organisationCreateSchemaType =
  {
    email: "",
    password: "",
    name: "",
    maxEmployees: 3,
  };
