import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export const baseFormSuccessHandler = (
  form: UseFormReturn<any> | null,
  resetForm: boolean,
  showToast: boolean,
  toastMessage: string | null,
  onSuccess?: () => void
) => {
  if (form && resetForm) {
    form.reset();
  }
  if (showToast && toastMessage) {
    toast.success(toastMessage);
  }
  onSuccess?.();
};
