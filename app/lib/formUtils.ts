import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export const baseFormSuccessHandler = (
  form: UseFormReturn<any>,
  resetForm: boolean,
  showToast: boolean,
  toastMessage: string | null,
  onSuccess?: () => void
) => {
  if (resetForm) {
    form.reset();
  }
  if (showToast && toastMessage) {
    toast.success(toastMessage);
  }
  onSuccess?.();
};
