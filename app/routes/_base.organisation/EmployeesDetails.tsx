import { useTranslation } from "react-i18next";
import { useEmployees } from "~/api/hooks";
import {
  BaseEmpty,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";
import { AddEmployeeDrawer } from "~/components/drawer";
import { DisplayData } from "~/components/system";
import { IdCardLanyard } from "lucide-react";

export const EmployeesDetails = () => {
  const { employees, isPending } = useEmployees();
  const { t } = useTranslation("routes/organisation");

  const emptyContent = (
    <BaseEmpty
      icon={<IdCardLanyard />}
      title={t("tabs.employees.empty.title")}
      description={t("tabs.employees.empty.description")}
    />
  );

  const dataContent = (data: typeof employees) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>{t("tabs.employees.table.header.name")}</TableHead>
          <TableHead>{t("tabs.employees.table.header.email")}</TableHead>
          <TableHead>{t("tabs.employees.table.header.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((employee, index) => (
          <TableRow key={employee.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              {employee.firstName} {employee.lastName}
            </TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      <section className="mb-4 flex flex-wrap items-center justify-between gap-2 align-middle">
        <h1 className="text-2xl font-bold">{t("tabs.employees.title")}</h1>
        <AddEmployeeDrawer />
      </section>
      <section className="flex h-full w-full justify-center">
        <DisplayData
          isLoading={isPending}
          data={employees}
          emptyContent={emptyContent}
          dataContent={dataContent}
        />
      </section>
    </>
  );
};
