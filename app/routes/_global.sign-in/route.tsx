import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from "~/components/ui";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { navigation } from "~/constants";
import { SignInForm } from "~/components/form";

export const SignInPage = () => {
  const { t } = useTranslation("routes/sign-in");
  const navigate = useNavigate();

  return (
    <Card variant={"soft"} className="w-full md:w-1/2 lg:w-1/3">
      <CardHeader>
        <CardTitle>{t("form.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <SignInForm onSuccess={() => navigate(navigation.home)} />
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
