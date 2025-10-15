import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCreatePosition } from "~/api/hooks";
import type { CustomFormProps } from "~/types/general";
import {
  defaultPositionCreateSchemaValues,
  positionCreateSchema,
  type positionCreateSchemaType,
} from "~/types/schemas";
import { BaseFormField } from "./BaseFormField";
import { BaseFormTextarea } from "./BaseFormTextarea";
import { Form, LoadingButton } from "../ui";
import { baseFormSuccessHandler } from "~/lib";

export const AddPositionForm = ({
  resetForm = true,
  showToast = true,
  onSuccess,
}: CustomFormProps) => {
  const { t } = useTranslation("components/form");
  const { t: tVal } = useTranslation("validation");
  const { t: tCommon } = useTranslation("common");
  const { t: tInfo } = useTranslation("information");
  const { createPositionAsync, isPending } = useCreatePosition();

  const form = useForm<positionCreateSchemaType>({
    resolver: zodResolver(positionCreateSchema(tVal)),
    defaultValues: defaultPositionCreateSchemaValues,
  });

  const handleSubmit = async (values: positionCreateSchemaType) => {
    await createPositionAsync(values, {
      onSuccess: () => {
        baseFormSuccessHandler(
          form,
          resetForm,
          showToast,
          tInfo("positions.positionCreated"),
          onSuccess
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto my-8 flex w-full max-w-sm flex-col gap-4"
      >
        <BaseFormField
          name="name"
          label={t("name.label")}
          placeholder={t("name.placeholder")}
          type="text"
        />
        <BaseFormTextarea
          name="description"
          label={t("description.label")}
          placeholder={t("description.placeholder")}
          type="text"
        />
        <LoadingButton
          className="mt-4 w-full"
          type="submit"
          isLoading={isPending}
        >
          {tCommon("submit")}
        </LoadingButton>
      </form>
    </Form>
  );
};
