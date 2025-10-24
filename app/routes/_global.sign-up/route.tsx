import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
} from "~/components/ui";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { PlanStep } from "./PlanStep";
import { DetailsStep } from "./DetailsStep";
import { useState } from "react";
import { useNavigate } from "react-router";
import { navigation } from "~/constants";
import { SignUpForm } from "~/components/form";

export const SignUpPage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const { t } = useTranslation("routes/sign-up");
  const navigate = useNavigate();

  return (
    <Card variant={"soft"} className="w-full md:w-1/2 lg:min-w-2/3">
      <CardHeader>
        <CardTitle>{t("form.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUpForm onSuccess={() => navigate(navigation.signIn)}>
          <Carousel setApi={setApi} opts={{ watchDrag: false }}>
            <CarouselContent>
              <CarouselItem>
                <PlanStep carouselApi={api} />
              </CarouselItem>
              <CarouselItem>
                <DetailsStep carouselApi={api} />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </SignUpForm>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;
