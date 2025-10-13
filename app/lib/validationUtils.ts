import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";

export const stringMinMaxValidation = (
  t: TFunction,
  minLength: number,
  maxLength: number
) => [
  z.minLength(minLength, t("minLength", { val: minLength }).toString()),
  z.maxLength(maxLength, t("maxLength", { val: maxLength }).toString()),
];
