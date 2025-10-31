import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "~/components/ui";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { defineStepper } from "~/components/ui";
import {
  SignUpForm,
  SignUpFormOrganisationInfoStep,
  SignUpFormOwnerInfoStep,
  SignUpFormPlanStep,
  SignUpFormSubmit,
  useSignUpForm,
} from "~/components/form";
import { navigation } from "~/constants";
import { ArrowLeft, Building2, Home, Notebook, User } from "lucide-react";

const { useStepper, utils, Stepper } = defineStepper(
  { id: "step1", titleKey: "plan", icon: Notebook, fields: ["plan"] },
  {
    id: "step2",
    titleKey: "organisationInfo",
    icon: Building2,
    fields: ["name"],
  },
  { id: "step3", titleKey: "ownerInfo", icon: User, fields: [] }
);

const StepNavigation = () => {
  const { t: tCommon } = useTranslation("common");
  const { form } = useSignUpForm();
  const stepper = useStepper();
  const currentIndex = utils.getIndex(stepper.current.id);

  const validateStep = async (stepIndex: number): Promise<boolean> => {
    const step = utils.getByIndex(stepIndex);
    if (!step.fields.length) return true;

    return await form.trigger(step.fields);
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentIndex);
    if (isValid) {
      stepper.next();
    }
  };

  return (
    <Stepper.Controls>
      {!stepper.isFirst && (
        <Button type="button" variant="outline" onClick={stepper.prev}>
          {tCommon("previous")}
        </Button>
      )}
      <div className="flex-1" />
      {stepper.isLast ? (
        <SignUpFormSubmit />
      ) : (
        <Button type="button" variant="outline" onClick={handleNext}>
          {tCommon("next")}
        </Button>
      )}
    </Stepper.Controls>
  );
};

export const SignUpPage = () => {
  const { t } = useTranslation("routes/sign-up");
  const navigate = useNavigate();

  return (
    <Card variant="soft" className="container w-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stepper.Provider labelOrientation="vertical" tracking={false}>
          {({ methods: stepper }) => (
            <SignUpForm onSuccess={() => navigate(navigation.signIn)}>
              <Stepper.Navigation>
                {stepper.all.map((step) => (
                  <Stepper.Step key={step.id} of={step.id} icon={<step.icon />}>
                    <Stepper.Title className="hidden sm:inline">
                      {t(`steps.${step.titleKey}`)}
                    </Stepper.Title>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>

              {stepper.switch({
                step1: () => <SignUpFormPlanStep />,
                step2: () => <SignUpFormOrganisationInfoStep />,
                step3: () => <SignUpFormOwnerInfoStep />,
              })}

              <StepNavigation />
            </SignUpForm>
          )}
        </Stepper.Provider>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Separator />
        <div className="flex w-full flex-row flex-wrap justify-center gap-2 md:justify-between">
          <Button variant="ghost" asChild>
            <Link to={navigation.signIn}>
              <ArrowLeft className="h-4 w-4" />
              {t("signInQuestion")}
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

export default SignUpPage;
