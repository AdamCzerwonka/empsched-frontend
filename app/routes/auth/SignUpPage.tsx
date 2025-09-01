import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  Button,
  LoadingButton,
} from "~/components/ui";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { navigation, organisationValidation } from "~/constants";
import { useCreateOrganisation } from "~/api/hooks";
import {
  defaultOrganisationCreateSchemaValues,
  organisationCreateSchema,
  type organisationCreateSchemaType,
} from "~/types/schemas";
import { CustomFormField } from "~/components/form";

export const SignUpPage = () => {
  const { t: tVal } = useTranslation("validation");
  const { t } = useTranslation("routes/auth/signUpPage");
  const { createOrganisationAsync, isPending } = useCreateOrganisation();

  const form = useForm<organisationCreateSchemaType>({
    resolver: zodResolver(organisationCreateSchema(tVal)),
    defaultValues: defaultOrganisationCreateSchemaValues,
  });

  const handleSubmit = async (values: organisationCreateSchemaType) => {
    const response = await createOrganisationAsync(values);
    console.log("Sign Up Response:", response);
  };

  return (
    <Card className="w-full md:w-1/2 lg:w-1/3">
      <CardHeader>
        <CardTitle>{t("form.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-2"
          >
            <CustomFormField
              name="email"
              label={t("form.email.label")}
              placeholder={t("form.email.placeholder")}
              type="email"
            />
            <CustomFormField
              name="password"
              label={t("form.password.label")}
              placeholder={t("form.password.placeholder")}
              type="password"
            />
            <CustomFormField
              name="confirmPassword"
              label={t("form.confirmPassword.label")}
              placeholder={t("form.confirmPassword.placeholder")}
              type="password"
            />
            <CustomFormField
              name="name"
              label={t("form.name.label")}
              placeholder={t("form.name.placeholder")}
              type="text"
            />
            <CustomFormField
              name="maxEmployees"
              label={t("form.maxEmployees.label")}
              placeholder={t("form.maxEmployees.placeholder")}
              type="number"
              min={organisationValidation.maxEmployees.min}
              max={organisationValidation.maxEmployees.max}
            />
            <LoadingButton
              className="mt-2 cursor-pointer"
              type="submit"
              isLoading={isPending}
            >
              {t("form.submit")}
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant={"secondary"} className="w-full" asChild>
          <Link to={navigation.signIn}>{t("signInQuestion")}</Link>
        </Button>
        <Button variant={"link"} className="w-full" asChild>
          <Link to={navigation.home}>{t("navigateHomepage")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUpPage;
