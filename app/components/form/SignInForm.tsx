import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSignIn } from "~/api/hooks";
import type { CustomFormProps } from "~/types/general";
import {
  defaultSignInSchemaValues,
  signInSchema,
  type signInSchemaType,
} from "~/types/schemas";
import { Form, LoadingButton } from "../ui";
import { BaseFormField } from "./BaseFormField";
import { baseFormSuccessHandler } from "~/lib";

export const SignInForm = ({
  resetForm = true,
  showToast = true,
  onSuccess,
}: CustomFormProps) => {
  const { t } = useTranslation("components/form");
  const { t: tVal } = useTranslation("validation");
  const { t: tInfo } = useTranslation("information");
  const { signInAsync, isPending } = useSignIn();

  const form = useForm({
    resolver: zodResolver(signInSchema(tVal)),
    defaultValues: defaultSignInSchemaValues,
  });

  const handleSubmit = async (values: signInSchemaType) => {
    await signInAsync(values, {
      onSuccess: () => {
        baseFormSuccessHandler(
          form,
          resetForm,
          showToast,
          tInfo("auth.signedIn"),
          onSuccess
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-3"
      >
        <BaseFormField
          name="email"
          label={t("email.label")}
          placeholder={t("email.placeholder")}
          type="email"
        />
        <BaseFormField
          name="password"
          label={t("password.label")}
          placeholder={t("password.placeholder")}
          type="password"
        />
        <LoadingButton
          className="mt-2 cursor-pointer"
          type="submit"
          isLoading={isPending}
        >
          {t("signInButton")}
        </LoadingButton>
      </form>
    </Form>
  );
};
