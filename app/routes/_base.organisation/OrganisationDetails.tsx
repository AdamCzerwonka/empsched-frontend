import { useTranslation } from "react-i18next";
import { useOrganisation } from "~/api/hooks";
import { Button, Skeleton } from "~/components/ui";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui";

export const OrganisationDetails = () => {
  const { organisation } = useOrganisation();
  const { t } = useTranslation("routes/organisation");
  const { t: tCommon } = useTranslation("common");

  return (
    <>
      <section className="mb-4 flex flex-wrap items-center justify-between gap-2 align-middle">
        <h1 className="text-2xl font-bold">{t("tabs.details.title")}</h1>
        <Button className="invisible" />
      </section>
      <section>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{t("tabs.details.fields.name.value")}</TableCell>
              <TableCell className="w-full">
                {organisation ? (
                  organisation.name
                ) : (
                  <Skeleton className="h-5 w-full" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("tabs.details.fields.owner.value")}</TableCell>
              <TableCell className="w-full">
                {organisation ? (
                  organisation.ownerId
                ) : (
                  <Skeleton className="h-5 w-full" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("tabs.details.fields.plan.value")}</TableCell>
              <TableCell className="w-full">
                {organisation && organisation.plan ? (
                  tCommon(`plans.${organisation.plan.toLowerCase()}.name`)
                ) : (
                  <Skeleton className="h-5 w-full" />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </>
  );
};
