import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useUpdateProfilePicture } from "~/api/hooks";
import { Form, LoadingButton } from "../ui";
import {
  defaultUploadPictureSchemaValues,
  uploadPictureSchema,
  type uploadPictureSchemaType,
} from "~/types/schemas";
import type { CustomFormProps } from "~/types/general";
import { BaseFormField } from "./BaseFormField";
import { baseFormSuccessHandler } from "~/lib";

export const UpdateProfilePictureForm = ({
  showToast = true,
  resetForm = true,
  onSuccess,
}: CustomFormProps) => {
  const { t } = useTranslation("components/form");
  const { t: tVal } = useTranslation("validation");
  const { t: tInfo } = useTranslation("information");
  const { updateProfilePictureAsync, isPending } = useUpdateProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<uploadPictureSchemaType>({
    resolver: zodResolver(uploadPictureSchema(tVal)),
    defaultValues: defaultUploadPictureSchemaValues,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file, { shouldValidate: true });
    }
  };

  const handleSubmit = async (data: uploadPictureSchemaType) => {
    await updateProfilePictureAsync(data.file, {
      onSuccess: () => {
        baseFormSuccessHandler(
          form,
          resetForm,
          showToast,
          tInfo("profilePicture.changeSuccess"),
          () => {
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            onSuccess?.();
          }
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-wrap items-center gap-4"
      >
        <BaseFormField
          name="file"
          accept="image/*"
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <LoadingButton
          isLoading={isPending}
          type="submit"
          className="self-start"
          variant={"secondary"}
        >
          {t("uploadButton")}
        </LoadingButton>
      </form>
    </Form>
  );
};
