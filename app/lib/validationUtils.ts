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

export const stringMaxValidation = (t: TFunction, maxLength: number) => [
  z.maxLength(maxLength, t("maxLength", { val: maxLength }).toString()),
];

export const dateStringValidation = (t: TFunction) => [
  z.refine(
    (val) => {
      // Check for format YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(val as string)) {
        return false;
      }
      const date = new Date(val as string);
      return (
        !isNaN(date.getTime()) && date.toISOString().startsWith(val as string)
      );
    },
    {
      message: t("invalidDateFormat", { format: "YYYY-MM-DD" }),
    }
  ),
];
