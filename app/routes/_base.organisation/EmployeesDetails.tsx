import { useTranslation } from "react-i18next";
import { useEmployees } from "~/api/hooks";
import {
  BaseEmpty,
  BasePagination,
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
import { EmployeeActionsDropdown } from "~/components/dropdown";
import { useState } from "react";

export const EmployeesDetails = () => {
  const pageSize = 10;
  const [page, setPage] = useState<number>(0);
  const { employees, isPending } = useEmployees({
    pageNumber: page,
    pageSize: pageSize,
  });
  const { t } = useTranslation("routes/organisation");

  const emptyContent = (
    <BaseEmpty
      icon={<IdCardLanyard />}
      title={t("tabs.employees.empty.title")}
      description={t("tabs.employees.empty.description")}
    />
  );

  const dataContent = (data: typeof employees) => (
    <>
      <span className="text-muted-foreground mb-2 w-full text-start text-sm">
        {t("tabs.employees.totalEmployees")}: {data?.totalElements}
      </span>
      <Table className="w-full flex-grow">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("tabs.employees.table.header.name")}</TableHead>
            <TableHead>{t("tabs.employees.table.header.email")}</TableHead>
            <TableHead className="text-center">
              {t("tabs.employees.table.header.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.content.map((employee, index) => (
            <TableRow key={employee.id}>
              <TableCell>{page * pageSize + index + 1}</TableCell>
              <TableCell>
                {employee.firstName} {employee.lastName}
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell className="w-min text-center">
                <EmployeeActionsDropdown employeeId={employee.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <BasePagination
        page={page}
        setPage={setPage}
        totalPages={data?.totalPages || 0}
        className="mt-auto"
      />
    </>
  );

  return (
    <div className="flex h-full flex-col">
      <section className="mb-4 flex flex-wrap items-center justify-between gap-2 align-middle">
        <h1 className="text-2xl font-bold">{t("tabs.employees.title")}</h1>
        <AddEmployeeDrawer />
      </section>
      <section className="flex h-full w-full flex-col items-center justify-center">
        <DisplayData
          isLoading={isPending}
          data={employees}
          emptyContent={emptyContent}
          dataContent={dataContent}
        />
      </section>
    </div>
  );
};
