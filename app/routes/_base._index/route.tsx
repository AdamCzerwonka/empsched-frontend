import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Users, CalendarOff, Bot, Wrench } from "lucide-react";
import { Link } from "react-router";
import { navigation } from "~/constants";

export default function Home() {
  const { t } = useTranslation("routes/home");

  const features = [
    {
      icon: <Users className="text-primary h-10 w-10" />,
      title: t("features.workforceManagement.title"),
      description: t("features.workforceManagement.description"),
    },
    {
      icon: <CalendarOff className="text-primary h-10 w-10" />,
      title: t("features.absenceTracking.title"),
      description: t("features.absenceTracking.description"),
    },
    {
      icon: <Bot className="text-primary h-10 w-10" />,
      title: t("features.automatedScheduling.title"),
      description: t("features.automatedScheduling.description"),
    },
    {
      icon: <Wrench className="text-primary h-10 w-10" />,
      title: t("features.manualFlexibility.title"),
      description: t("features.manualFlexibility.description"),
    },
  ];

  const steps = [
    {
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
    },
    {
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
    },
    {
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
    },
  ];

  return (
    <main className="container mx-auto px-4 py-12 md:px-6 md:py-24 lg:py-32">
      <div className="grid gap-12">
        <section className="text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
            {t("hero.headline")}
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            {t("hero.subheadline")}
          </p>
          <Link to={navigation.signUp}>
            <Button size="lg">{t("hero.cta")}</Button>
          </Link>
        </section>

        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center">
          <h2 className="mb-8 text-3xl font-bold md:text-4xl">
            {t("howItWorks.title")}
          </h2>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex flex-col items-center gap-4"
              >
                <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-secondary rounded-lg p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t("finalCta.title")}
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
            {t("finalCta.description")}
          </p>
          <Link to={navigation.signUp}>
            <Button size="lg">{t("finalCta.cta")}</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
