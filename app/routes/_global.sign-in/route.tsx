import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Separator,
} from "~/components/ui";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { navigation } from "~/constants";
import { SignInForm } from "~/components/form";
import { ArrowRight, Home } from "lucide-react";

export const SignInPage = () => {
  const { t } = useTranslation("routes/sign-in");
  const navigate = useNavigate();

  return (
    <Card variant={"soft"} className="container w-full">
      <CardHeader>
        <CardTitle>{t("form.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <SignInForm onSuccess={() => navigate(navigation.home)} />
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Separator />
        <div className="flex w-full flex-row flex-wrap justify-center gap-2 md:justify-between">
          <Button variant="ghost" asChild>
            <Link to={navigation.signUp}>
              <ArrowRight className="h-4 w-4" />
              {t("signUpQuestion")}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={navigation.home}>
              <Home className="h-4 w-4" />
              {t("navigateHomepage")}
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignInPage;
