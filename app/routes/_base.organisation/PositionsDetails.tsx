import { useTranslation } from "react-i18next";
import { Accordion, BaseEmpty, Skeleton } from "~/components/ui";
import { AddPositionDrawer } from "~/components/drawer";
import { usePositions } from "~/api/hooks";
import { PositionElement } from "./PositionElement";
import { BetweenHorizontalStart } from "lucide-react";
import { DisplayData } from "~/components/system";

export const PositionsDetails = () => {
  const { t } = useTranslation("routes/organisation");
  const { positions, isPending } = usePositions();

  const emptyContent = (
    <BaseEmpty
      icon={<BetweenHorizontalStart />}
      title={t("tabs.positions.empty.title")}
      description={t("tabs.positions.empty.description")}
    />
  );

  const dataContent = (data: typeof positions) => (
    <Accordion className="w-full" type="single" collapsible>
      {data?.map((position) => (
        <PositionElement key={position.id} position={position} />
      ))}
    </Accordion>
  );

  return (
    <>
      <section className="mb-4 flex flex-wrap items-center justify-between gap-2 align-middle">
        <h1 className="text-2xl font-bold">{t("tabs.positions.title")}</h1>
        <AddPositionDrawer />
      </section>
      <section className="flex h-full w-full justify-center">
        <DisplayData
          isLoading={isPending}
          data={positions}
          emptyContent={emptyContent}
          dataContent={dataContent}
        />
      </section>
    </>
  );
};
