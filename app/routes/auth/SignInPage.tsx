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
import {
  defaultSignInSchemaValues,
  signInSchema,
  type signInSchemaType,
} from "~/types/schemas";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { navigation } from "~/constants";
import { useSignIn } from "~/api/hooks";
import { CustomFormField } from "~/components/form";
import { useAuthStore } from "~/store";

export const SignInPage = () => {
  const { t: tVal } = useTranslation("validation");
  const { t } = useTranslation("routes/auth/signInPage");
  const { signInAsync, isPending } = useSignIn();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const form = useForm({
    resolver: zodResolver(signInSchema(tVal)),
    defaultValues: defaultSignInSchemaValues,
  });

  const handleSubmit = async (values: signInSchemaType) => {
    try {
      const response = await signInAsync(values);

      if (isAuthenticated()) {
        navigate(navigation.home);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    }
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
          <Link to={navigation.signUp}>{t("signUpQuestion")}</Link>
        </Button>
        <Button variant={"link"} className="w-full" asChild>
          <Link to={navigation.home}>{t("navigateHomepage")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignInPage;
