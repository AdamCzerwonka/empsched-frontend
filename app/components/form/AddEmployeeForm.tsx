import { useForm } from "react-hook-form";
import { Form, LoadingButton } from "../ui";
import {
  defaultEmployeeCreateSchemaValues,
  employeeCreateSchema,
  type employeeCreateSchemaType,
} from "~/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useCreateEmployee } from "~/api/hooks";
import { CustomFormField } from "./CustomFormField";
import type { CustomFormProps } from "~/types/general";
import { baseFormSuccessHandler } from "~/lib";

export const AddEmployeeForm = ({
  resetForm = true,
  showToast = true,
  onSuccess,
}: CustomFormProps) => {
  const { t } = useTranslation("components/form");
  const { t: tVal } = useTranslation("validation");
  const { t: tCommon } = useTranslation("common");
  const { t: tInfo } = useTranslation("information");
  const { createEmployeeAsync, isPending } = useCreateEmployee();

  const form = useForm<employeeCreateSchemaType>({
    resolver: zodResolver(employeeCreateSchema(tVal)),
    defaultValues: defaultEmployeeCreateSchemaValues,
  });

  const handleSubmit = async (values: employeeCreateSchemaType) => {
    await createEmployeeAsync(values, {
      onSuccess: () => {
        baseFormSuccessHandler(
          form,
          resetForm,
          showToast,
          tInfo("employees.employeeCreated"),
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
        <CustomFormField
          name="firstName"
          label={t("firstName.label")}
          placeholder={t("firstName.placeholder")}
          type="text"
        />
        <CustomFormField
          name="lastName"
          label={t("lastName.label")}
          placeholder={t("lastName.placeholder")}
          type="text"
        />
        <CustomFormField
          name="email"
          label={t("email.label")}
          placeholder={t("email.placeholder")}
          type="email"
        />
        <CustomFormField
          name="phoneNumber"
          label={t("phoneNumber.label")}
          placeholder={t("phoneNumber.placeholder")}
          type="text"
        />
        <CustomFormField
          name="password"
          label={t("password.label")}
          placeholder={t("password.placeholder")}
          type="password"
        />
        <CustomFormField
          name="confirmPassword"
          label={t("confirmPassword.label")}
          placeholder={t("confirmPassword.placeholder")}
          type="password"
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
