import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { accountSchema, organisationSchema } from "..";
import { OrganisationPlanEnum } from "~/types/general";

export const organisationCreateSchema = (t: TFunction) => {
  const pickedAccount = z.pick(accountSchema(t), {
    email: true,
    password: true,
  });
  const pickedOrganisation = z.pick(organisationSchema(t), {
    name: true,
    plan: true,
  });

  return z
    .object({
      ...pickedAccount.def.shape,
      ...pickedOrganisation.def.shape,
      confirmPassword: pickedAccount.def.shape.password,
    })
    .check(
      z.refine((val) => val.confirmPassword === val.password, {
        message: t("passwordsDoNotMatch"),
        path: ["confirmPassword"],
      })
    );
};

export type organisationCreateSchemaType = z.infer<
  ReturnType<typeof organisationCreateSchema>
>;

export const defaultOrganisationCreateSchemaValues: organisationCreateSchemaType =
  {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    plan: OrganisationPlanEnum.UNIT,
  };
