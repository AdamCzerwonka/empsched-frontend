import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { accountSchema } from "..";

export const signInSchema = (t: TFunction) =>
  z.pick(accountSchema(t), { email: true, password: true });

export type signInSchemaType = z.infer<ReturnType<typeof signInSchema>>;

export const defaultSignInSchemaValues: signInSchemaType = {
  email: "",
  password: "",
};
