import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCreateOrganisation } from "~/api/hooks";
import { baseFormSuccessHandler } from "~/lib";
import type { CustomFormProps, OrganisationPlanEnum } from "~/types/general";
import {
  defaultOrganisationCreateSchemaValues,
  organisationCreateSchema,
  type organisationCreateSchemaType,
} from "~/types/schemas";
import { Form, LoadingButton, PlanCard } from "../ui";
import React from "react";
import { OrganisationPlans } from "~/constants";
import { CustomFormField } from ".";

type SignUpFormContextValue = {
  form: ReturnType<typeof useForm<organisationCreateSchemaType>>;
  isPending: boolean;
};

const SignUpContext = React.createContext<SignUpFormContextValue>(
  {} as SignUpFormContextValue
);

const useSignUpForm = () => {
  const formContext = React.useContext(SignUpContext);

  if (!formContext) {
    throw new Error("useSignUpForm should be used within <SignUpForm>");
  }

  return {
    ...formContext,
  };
};

const SignUpForm = ({
  resetForm = true,
  showToast = true,
  onSuccess,
  children,
}: CustomFormProps & { children: React.ReactNode }) => {
  const { t: tVal } = useTranslation("validation");
  const { t: tInfo } = useTranslation("information");
  const { createOrganisationAsync, isPending } = useCreateOrganisation();

  const form = useForm<organisationCreateSchemaType>({
    resolver: zodResolver(organisationCreateSchema(tVal)),
    defaultValues: defaultOrganisationCreateSchemaValues,
  });

  const handleSubmit = async (values: organisationCreateSchemaType) => {
    await createOrganisationAsync(values, {
      onSuccess: () => {
        baseFormSuccessHandler(
          form,
          resetForm,
          showToast,
          tInfo("organisations.organisationCreated"),
          onSuccess
        );
      },
    });
  };

  return (
    <SignUpContext.Provider value={{ form, isPending }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>{children}</form>
      </Form>
    </SignUpContext.Provider>
  );
};

const SignUpFormPlanStep = () => {
  const { form } = useSignUpForm();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {OrganisationPlans.map((planData) => (
        <PlanCard
          key={planData.type}
          plan={planData}
          showSelectButton={true}
          onSelect={(value: OrganisationPlanEnum) => {
            form.setValue("plan", value);
          }}
          isSelected={form.watch("plan") === planData.type}
        />
      ))}
    </div>
  );
};

const SignUpFormDataStep = () => {
  const { isPending } = useSignUpForm();
  const { t } = useTranslation("components/form");

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <CustomFormField
          name="email"
          label={t("email.label")}
          placeholder={t("email.placeholder")}
          type="email"
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
        <CustomFormField
          name="name"
          label={t("name.label")}
          placeholder={t("name.placeholder")}
          type="text"
        />
      </div>
      <LoadingButton
        className="mt-4 min-w-1/2 cursor-pointer"
        type="submit"
        isLoading={isPending}
      >
        {t("signUpButton")}
      </LoadingButton>
    </>
  );
};

export { useSignUpForm, SignUpForm, SignUpFormPlanStep, SignUpFormDataStep };
