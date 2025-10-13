import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { accountSchema } from "../account/accountSchema";

export const employeeCreateSchema = (t: TFunction) => {
  const pickedAccount = z.pick(accountSchema(t), {
    email: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
    password: true,
  });

  return z
    .object({
      ...pickedAccount.def.shape,
      confirmPassword: pickedAccount.def.shape.password,
    })
    .check(
      z.refine((val) => val.confirmPassword === val.password, {
        message: t("passwordsDoNotMatch"),
        path: ["confirmPassword"],
      })
    );
};

export type employeeCreateSchemaType = z.infer<
  ReturnType<typeof employeeCreateSchema>
>;

export const defaultEmployeeCreateSchemaValues: employeeCreateSchemaType = {
  email: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};
