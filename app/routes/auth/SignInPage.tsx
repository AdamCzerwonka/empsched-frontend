import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  defaultSignInSchemaValues,
  signInSchema,
  type signInSchemaType,
} from "~/types/schemas";
import { useTranslation } from "react-i18next";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { navigation } from "~/constants";
import { useSignIn } from "~/api/hooks";
import { LoadingButton } from "~/components/LoadingButton";

export const SignInPage = () => {
  const { t: tVal } = useTranslation("validation");
  const { t } = useTranslation("routes/auth/signInPage");
  const { signInAsync, isPending } = useSignIn();

  const form = useForm({
    resolver: zodResolver(signInSchema(tVal)),
    defaultValues: defaultSignInSchemaValues,
  });

  const handleSubmit = async (values: signInSchemaType) => {
    const response = await signInAsync(values);
    console.log("Sign In Response:", response);
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
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.email.placeholder")}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.password.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.password.placeholder")}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
      <CardFooter className="flex-col">
        <Button variant={"link"} className="w-full" asChild>
          <Link to={navigation.home}>{t("navigateHomepage")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignInPage;
