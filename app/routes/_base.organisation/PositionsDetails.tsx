import { useTranslation } from "react-i18next";
import { Accordion, BaseEmpty, BasePagination } from "~/components/ui";
import { AddPositionDrawer } from "~/components/drawer";
import { usePositions } from "~/api/hooks";
import { PositionElement } from "./PositionElement";
import { BetweenHorizontalStart } from "lucide-react";
import { DisplayData } from "~/components/system";
import { useState } from "react";

export const PositionsDetails = () => {
  const [page, setPage] = useState<number>(0);
  const { t } = useTranslation("routes/organisation");
  const { positions, isPending } = usePositions({
    pageNumber: page,
    pageSize: 10,
  });

  const emptyContent = (
    <BaseEmpty
      icon={<BetweenHorizontalStart />}
      title={t("tabs.positions.empty.title")}
      description={t("tabs.positions.empty.description")}
    />
  );

  const dataContent = (data: typeof positions) => (
    <>
      <span className="text-muted-foreground mb-2 w-full text-start text-sm">
        {t("tabs.positions.totalPositions")}: {data?.totalElements}
      </span>
      <Accordion className="w-full flex-grow" type="single" collapsible>
        {data?.content.map((position) => (
          <PositionElement key={position.id} position={position} />
        ))}
      </Accordion>
      <BasePagination
        page={page}
        setPage={setPage}
        totalPages={data?.totalPages || 0}
      />
    </>
  );

  return (
    <div className="flex h-full flex-col">
      <section className="mb-4 flex flex-wrap items-center justify-between gap-2 align-middle">
        <h1 className="text-2xl font-bold">{t("tabs.positions.title")}</h1>
        <AddPositionDrawer />
      </section>
      <section className="flex h-full w-full flex-col items-center justify-center">
        <DisplayData
          isLoading={isPending}
          data={positions}
          emptyContent={emptyContent}
          dataContent={dataContent}
        />
      </section>
    </div>
  );
};
