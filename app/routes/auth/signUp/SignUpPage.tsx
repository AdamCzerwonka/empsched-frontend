import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
} from "~/components/ui";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateOrganisation } from "~/api/hooks";
import {
  defaultOrganisationCreateSchemaValues,
  organisationCreateSchema,
  type organisationCreateSchemaType,
} from "~/types/schemas";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { PlanStep } from "./PlanStep";
import { DetailsStep } from "./DetailsStep";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { navigation } from "~/constants";

export const SignUpPage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const { t: tVal } = useTranslation("validation");
  const { t } = useTranslation("routes/auth/signUpPage");
  const { createOrganisationAsync, isPending } = useCreateOrganisation();
  const navigate = useNavigate();

  const form = useForm<organisationCreateSchemaType>({
    resolver: zodResolver(organisationCreateSchema(tVal)),
    defaultValues: defaultOrganisationCreateSchemaValues,
  });

  const handleSubmit = async (values: organisationCreateSchemaType) => {
    const response = await createOrganisationAsync(values);
    toast.success(t("toast.success"));
    navigate(navigation.signIn);
  };

  return (
    <Card className="w-full md:w-1/2 lg:min-w-2/3">
      <CardHeader>
        <CardTitle>{t("form.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-2"
          >
            <Carousel setApi={setApi} opts={{ watchDrag: false }}>
              <CarouselContent>
                <CarouselItem>
                  <PlanStep form={form} carouselApi={api} />
                </CarouselItem>
                <CarouselItem>
                  <DetailsStep isPending={isPending} carouselApi={api} />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;
