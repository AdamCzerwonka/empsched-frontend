import type { AxiosError } from "axios";
import type { TFunction } from "i18next";
import { toast } from "sonner";
import type { ErrorResponse } from "~/types/api";

export const showApiErrorToast = (
  error: AxiosError<ErrorResponse>,
  t: TFunction
) => {
  const messageKey =
    "message." + (error.response?.data?.messageKey ?? "default");
  toast.error(t(messageKey, { ns: "errors" }));
};
