import { useTranslation } from "react-i18next";
import { Accordion, Skeleton } from "~/components/ui";
import { AddPositionDrawer } from "./AddPositionDrawer";
import { usePositions } from "~/api/hooks";
import { PositionElement } from "./PositionElement";

export const PositionsDetails = () => {
  const { t } = useTranslation("routes/organisation");
  const { positions } = usePositions();

  return (
    <div>
      <section className="mb-4 flex flex-wrap items-center justify-between gap-2 align-middle">
        <h1 className="text-2xl font-bold">{t("tabs.positions.title")}</h1>
        <AddPositionDrawer />
      </section>
      <section>
        <Accordion type="single" collapsible>
          {positions ? (
            positions?.map((position) => (
              <PositionElement key={position.id} position={position} />
            ))
          ) : (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </>
          )}
        </Accordion>
      </section>
    </div>
  );
};
